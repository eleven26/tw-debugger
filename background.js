
let status, to_url, from_url;

let default_to_url = "http://0.0.0.0:8001";
let default_from_url = "http://xx.com";

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