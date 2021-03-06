var regex_20minutes = /(20minutes\.fr)/i;
function cleanHTML20Minutes(dom) {
    var twitter = dom.querySelector('twitterwidget');
    if (twitter !== null) {
        twitter.remove();
    }
    dom.querySelector('.tags').remove();
    dom.querySelector('.sharebar').remove();
    var scripts = dom.querySelectorAll('script');
    scripts.forEach((s) => s.remove());
    return dom.querySelector('body').innerText;
}

function cleanHTML(dom, website) {
    switch (website) {
        case '20minutes':
            return cleanHTML20Minutes(dom);
            break;
        default:
            // console.log(dom.querySelector('body').innerText);
            var body = dom.querySelector('body');
            var scripts = body.querySelectorAll('script');
            for (var i = 0; i < scripts.length; i++) {
                scripts[i].remove();
            }
            return body.innerText;

    }
}