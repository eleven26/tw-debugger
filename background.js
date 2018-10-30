
let status, to_url, from_url;

let default_to_url = "http://0.0.0.0:8001";
let default_from_url = "http://test.api.86yqy.com";

reloadConfig();

function beforeRequest(details) {
    if (status === true && to_url) {
        return {
            redirectUrl: details.url.replace(from_url, to_url)
        }
    }
}

/**
 * 在扩展弹出页面修改了配置之后重新设置 status、to_url
 * background.js 除非 reload 扩展, 否则不会重新运行,
 * 但是可以在 popup 页面使用 chrome.extension.getBackgroundPage() 获取 backgroundPage 的 window 实例
 */
function reloadConfig() {
    chrome.storage.local.get(['to_url', 'status', 'from_url'], result => {
        status = result.status || false;
        to_url = result.to_url || default_to_url;
        from_url = result.from_url || default_from_url;

        try {
            new URL(from_url); // 不是正确的 url 会抛出错误

            chrome.webRequest.onBeforeRequest.removeListener(beforeRequest);
            chrome.webRequest.onBeforeRequest.addListener(
                beforeRequest,
                {
                    urls: [
                        from_url + "/*"
                    ],
                },
                [
                    "blocking"
                ]
            );
        } catch (e) {
            // 用户输入了错误的url, 先不处理
        }
    });
}

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