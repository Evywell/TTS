chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        id: "read-selection",
        title: "Lire la sélection",
        contexts: ["selection"]
    });
})

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId == "read-selection") {
        responsiveVoice.speak(info.selectionText)
    }
})