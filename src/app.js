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
    getZoom();
    getCurrentTabUrl((url, tab) => {
        // Quand on ouvre l'extension, on regarde sur quel page on est
        responsiveVoice.setDefaultVoice("French Female");
        var selector;
        var website;
        var parser = new DOMParser();
        if (url.match(regex_20minutes)) {
            selector = ".lt-endor-body.content";
            website = "20minutes";
        }
        var playBtn = document.getElementById('playBtn');
        playBtn.addEventListener('click', function () {
            responsiveVoice.setDefaultVoice("French Female");
            chrome.tabs.getSelected(null, function(tab){
                chrome.tabs.executeScript(tab.id, {code: "document.querySelector('" + selector + "').innerHTML;"}, function(response) {
                    var doc = parser.parseFromString(response, "text/html");
                    var result = cleanHTML(doc, website);
                    responsiveVoice.speak(result);
                });
            });
        })
        var fontUp = document.getElementById('font-up');
        var fontDown = document.getElementById('font-down');
        fontUp.addEventListener('click', function (e) {
            e.preventDefault();
            if (zoom >= 1 && zoom < 8) {
                zoom += 0.1
                if (zoom < 1) {
                    zoom = 1;
                }
                chrome.tabs.executeScript({
                    code: "document.body.style.zoom = " + (zoom) + ";document.querySelector('#tellme_overlay').style.zoom = 1;"
                });
            }
        })
        fontDown.addEventListener('click', function (e) {
            e.preventDefault();
            if (zoom >= 1 && zoom < 8) {
                zoom -= 0.1
                if (zoom < 1) {
                    zoom = 1;
                }
                chrome.tabs.executeScript({
                    code: "document.body.style.zoom = " + (zoom) + ";"
                });
            }
        })
        // On récupère le texte de la page
        var page_texte = "";
        chrome.tabs.getSelected(null, function(tab){
            chrome.tabs.executeScript(tab.id, {code: "document.body.innerText;"}, function(response) {
                page_texte = response[0];
            });
        });
        var toggleText = document.getElementById('toggleText');
        var background = true;
        toggleText.addEventListener('click', function (e) {
            var bg = toggleBackground(background, page_texte);
            chrome.tabs.executeScript({
                code: bg
            });
            background = !background;
        });
    });
});

function getZoom() {
    chrome.tabs.getSelected(null, function(tab){
        chrome.tabs.executeScript(tab.id, {code: "document.body.style.zoom;"}, function(response) {
            setZoom(response[0]);
        });
    });
}

function setZoom(value) {
    console.log(value)
    if (value == "") {
        value = 1;
    }
    zoom = parseInt(value);
    console.log(zoom);
}


function getBackground(bg) {
    if (bg) {
        return "document.querySelector('html').style.background = '#000';" +
            "document.querySelector('main').style.background = '#000';" +
            "document.querySelector('body').style.background = '#000';" +
            "document.querySelector('html').style.color= '#FFF';" +
            "document.querySelector('main').style.color = '#FFF';" +
            "document.querySelector('body').style.color = '#FFF';";
    } else {
        return "document.querySelector('html').style.background = null;" +
            "document.querySelector('main').style.background = null;" +
            "document.querySelector('body').style.background = null;" +
            "document.querySelector('html').style.color= null;" +
            "document.querySelector('main').style.color = null;" +
            "document.querySelector('body').style.color = null;";
    }
}

function toggleBackground(status, texte) {
    // Si ya déjà le fond noir
    if (status === false) {
        // On le retire
        return "document.body.removeChild(document.querySelector('#tellme_overlay'));document.body.style.overflow = null;";
    }
    // Sinon, on crée un élément #tellme_overlay
    var element = "document.body.style.overflow = 'hidden';var tellme_overlay = document.createElement('div');";
    // On lui ajoute l'id
    element += "tellme_overlay.setAttribute('id', 'tellme_overlay');";
    // On ajoute le style
    var style = "display: block;position: fixed;top: 0;left: 0;right: 0; bottom: 0; overflow: hidden;background: #000;color: #FFF;z-index: 1000000000000000;";
    element += "tellme_overlay.setAttribute('style', '" + style + "');";
    // On ajoute le container (le truc qui va contenir le texte)
    element += "var tellme_container = document.createElement('div');"
    var style_container = "width: 1200px; height: 100%; margin: 0 auto; overflow-y: scroll; font-size: 25px;";
    element += "tellme_container.setAttribute('style', '" + style_container + "');"
    // On ajoute le texte
    element += "tellme_container.innerText = `" + JSON.stringify(texte) + "`;";
    // On ajoute le container à l'élément principal
    element += "tellme_overlay.appendChild(tellme_container);";
    // On ajoute l'élément dans le body
    element += "document.body.appendChild(tellme_overlay);";
    return element;
}