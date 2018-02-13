var regex_20minutes = /(20minutes\.fr)/i;
function cleanHTML20Minutes(dom) {
    dom.querySelector('twitterwidget').remove();
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
            console.log(dom.querySelector('body').innerText);
            return dom.querySelector('body').innerText;
    }
}