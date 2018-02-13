chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        id: "read-selection",
        title: "Lire la sélection",
        contexts: ["selection"]
     });
    chrome.contextMenus.create({
        id: "read-all",
        title: "Lire la page"
    });

})

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
    if (typeof changeInfo.url !== "undefined") {
        responsiveVoice.cancel();
    }
})

chrome.tabs.onRemoved.addListener(function () {
    responsiveVoice.cancel();
})

chrome.commands.onCommand.addListener(function(command) {
    if (command === 'ear_the_page') {
        var queryInfo = {
            active: true,
            currentWindow: true
        };
        chrome.tabs.query(queryInfo, function (tabs) {
            readAll(tabs[0]);
        })
    }
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId == "read-selection") {
        responsiveVoice.setDefaultVoice("French Female");
        responsiveVoice.speak(info.selectionText)
    } else if (info.menuItemId == "read-all") {
       readAll(tab);
    }
})

function readAll(tab) {
    responsiveVoice.setDefaultVoice("French Female");
    var url = tab.url;
    var website, selector = 'article';
    var parser = new DOMParser();
    if (url.match(regex_20minutes)) {
        selector = ".lt-endor-body.content";
        website = "20minutes";
    }
    chrome.tabs.executeScript(tab.id, {code: "document.querySelector('" + selector + "').innerHTML;"}, function(response) {
        var doc = parser.parseFromString(response, "text/html");
        var result = cleanHTML(doc, website);
        if (result === "" || result === null) {
            responsiveVoice.speak("Désolé, je ne peux pas lire cette page. Elle ne suit pas les normes liés aux personnes mal-voyantes");
        } else {
            responsiveVoice.speak(result);
        }
    });
}