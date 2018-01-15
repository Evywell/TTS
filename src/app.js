<<<<<<< HEAD
//responsiveVoice.speak("Voulez vous coucher avec moi ce soir ?", "French Female");
var test =  document.getElementById("article");
var test = test.innerText;
=======
function getCurrentTabUrl(callback) {
    // Query filter to be passed to chrome.tabs.query - see
    // https://developer.chrome.com/extensions/tabs#method-query
    var queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, (tabs) => {
        // chrome.tabs.query invokes the callback with a list of tabs that match the
        // query. When the popup is opened, there is certainly a window and at least
        // one tab, so we can safely assume that |tabs| is a non-empty array.
        // A window can only have one active tab at a time, so the array consists of
        // exactly one tab.
        var tab = tabs[0];

        // A tab is a plain object that provides information about the tab.
        // See https://developer.chrome.com/extensions/tabs#type-Tab
        var url = tab.url;

        // tab.url is only available if the "activeTab" permission is declared.
        // If you want to see the URL of other tabs (e.g. after removing active:true
        // from |queryInfo|), then the "tabs" permission is required to see their
        // "url" properties.
        console.assert(typeof url == 'string', 'tab.url should be a string');
        callback(url, tab);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    getCurrentTabUrl((url, tab) => {
        var playBtn = document.getElementById('playBtn');
        playBtn.addEventListener('click', function () {
            responsiveVoice.setDefaultVoice("French Female");
            chrome.tabs.getSelected(null, function(tab){
                var getText = Array();
                chrome.tabs.executeScript(tab.id, {code: "document.querySelector('article').innerText.split(' ');"}, function(response) {
                    for (var i = 0; i < response[0].length; i++)
                        getText [i] = response[0][i];
                    responsiveVoice.speak(getText.join(' '));
                });
            });
        })
    });
});

>>>>>>> cb36664ed936bc1c649860acd783fc6b5d6de31b
