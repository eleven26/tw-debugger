
let cookie_domain = '.xx.com';
let top_domain = 'yy.com';

window.onload = () => {
    chrome.storage.local.get(['status', 'redirect_url'], result => {
        document.getElementById('switch').checked = result.status;
        document.getElementById('url').value = result.redirect_url;
    });

    document.getElementById('switch').addEventListener('click', ev => {
        chrome.storage.local.set({status: ev.target.checked}, () => {});
    });

    document.getElementById('url').addEventListener('keyup', ev => {
        chrome.storage.local.set({redirect_url: ev.target.value}, () => {});
    });
    document.getElementById('url').addEventListener('click', ev => {
        ev.target.select()
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
        chrome.tabs.query({ 'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT }, tabs => {
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
                chrome.cookies.getAll({ domain: cookie_domain }, cookies => {
                    cookies.map( cookie => {
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