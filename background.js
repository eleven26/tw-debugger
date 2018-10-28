
let api_host = "http://xx.com";

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        chrome.storage.local.get(['status', 'redirect_url'], result => {
            if (result.status === true && result.redirect_url) {
                return {
                    redirectUrl: details.url.replace(api_host, result.redirect_url)
                }
            }
        });
    },
    {
        urls: [
            api_host + "/*"
        ],
    },
    [
        "blocking"
    ]
);


function restoreTab(session)
{
    session = JSON.parse(session);
    let url = new URL(session.url);

    chrome.tabs.create({
        url: session.url,
        active: true
    }, tab => {
        // 设置 storage
        Object.keys(session.storage).forEach(key => {
            chrome.tabs.executeScript(tab.id, {
                code: `localStorage.setItem("${key}", '${session.storage[key]}')`
            });
        });

        // 设置 cookie
        Object.keys(session.cookies).forEach(key => {
            let c = session.cookies[key];
            let cookie = {
                url: url.origin,
                name: c.name,
                value: c.value,
                path: c.path,
                secure: c.secure,
                httpOnly: c.httpOnly,
                expirationDate: c.expirationDate,
            };
            if (Number.isNaN(cookie.expirationDate) || cookie.expirationDate === undefined) {
                cookie.expirationDate = (new Date().getTime() / 1000) + 3600 * 24 * 365;
            }
            chrome.cookies.set(cookie, function (res) { });
        });
    });
}