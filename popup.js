let cookie_domain;
let top_domain;

let default_to_url = "http://0.0.0.0:8001";
let default_from_url = "http://test.api.86yqy.com";
let default_cookie_domain = ".test.86yqy.com";
let default_site_url = "86yqy.com";

window.onload = () => {
    // 默认值设置
    chrome.storage.local.get(['status', 'to_url', 'from_url', 'cookie_domain', 'site_url'], result => {
        document.getElementById('status').checked = result.status || false;
        document.getElementById('to_url').value = result.to_url || default_to_url;
        document.getElementById('from_url').value = result.from_url || default_from_url;
        cookie_domain = document.getElementById('cookie_domain').value = result.cookie_domain || default_cookie_domain;
        top_domain = document.getElementById('site_url').value = result.site_url || default_site_url;
    });

    document.getElementById('status').addEventListener('click', ev => {
        chrome.storage.local.set({status: ev.target.checked}, () => {
            chrome.extension.getBackgroundPage().reloadConfig();
        });
    });

    [].forEach.call(document.getElementsByClassName('input'), el => {
        el.addEventListener('click', ev => {
            ev.target.select();
        });

        el.addEventListener('keyup', ev => {
            let props = {};
            props[ev.target.name] = ev.target.value;

            chrome.storage.local.set(props, () => {
                chrome.extension.getBackgroundPage().reloadConfig();
            });
        })
    });

    // 复制所有 storage、cookie
    document.getElementById('copy').addEventListener('click', () => {
        generate_session().then(() => {
            document.querySelector('#session').select();
            if (document.execCommand('copy')) {
                document.execCommand('copy');

                success_tip();
            }
        });
    });

    // 粘贴的时候直接根据粘贴板内容新建 tab 还原
    document.addEventListener('paste', function (evt) {
        let clipdata = evt.clipboardData || window.clipboardData;
        chrome.extension.getBackgroundPage().restoreTab(clipdata.getData('text/plain'));
    });
};


function success_tip() {
    document.getElementById('success-tip').style.display = 'inline';
    setTimeout(() => {
        document.getElementById('success-tip').style.display = 'none';
    }, 3000);
}

function error_tip() {
    document.getElementById('error-tip').style.display = 'inline';
    setTimeout(() => {
        document.getElementById('error-tip').style.display = 'none';
    }, 3000);
}

/**
 * 根据当前登录用户获取所有 storage、cookie，并且保存到插件的 storage
 *
 * @returns {Promise}
 */
function generate_session() {
    return new Promise(resolve => {
        chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT}, tabs => {
            let url = tabs[0].url;
            // 域名判断
            if (url.indexOf(top_domain) === -1) {
                error_tip();
                return;
            }

            // 获取所有 localStorage
            let storagePromise = new Promise(resolve => {
                chrome.tabs.executeScript(tabs[0].id, {
                    code: `JSON.parse(JSON.stringify(localStorage))`
                }, items => {
                    resolve(items[0]);
                });
            });

            // 获取当前 tab 的所有 cookie
            let cookiesPromise = new Promise(resolve => {
                chrome.cookies.getAll({domain: cookie_domain}, cookies => {
                    cookies.map(cookie => {
                        return {
                            name: cookie.name,
                            value: cookie.value,
                            path: cookie.path,
                            secure: cookie.secure,
                            httpOnly: cookie.httpOnly,
                            expirationDate: cookie.expirationDate,
                        };
                    });

                    resolve(cookies)
                });
            });

            // 保存获取到的 localStorage、cookie
            Promise.all([storagePromise, cookiesPromise]).then(results => {
                let [storage, cookies] = results;
                let session = {
                    url: url,
                    storage: storage,
                    cookies: cookies
                };

                chrome.storage.local.set(session, () => {
                    document.getElementById('session').value = JSON.stringify(session);

                    resolve(session);
                });
            })
        });
    });
}