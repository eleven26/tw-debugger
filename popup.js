let cookie_domain;
let top_domain;

let default_to_url = "http://0.0.0.0:8001";
let default_from_url = "http://test.api.86yqy.com";
let default_cookie_domain = ".test.86yqy.com";
let default_site_url = "86yqy.com";

let default_store_session_url = "http://192.168.2.154:8001/store-session";
let default_restore_session_url =  "http://192.168.2.154:8001/restore-session";

window.onload = () => {
    // 默认值设置
    chrome.storage.local.get(['status', 'to_url', 'from_url', 'cookie_domain', 'site_url', 'last_session_id'], result => {
        document.getElementById('status').checked = result.status || false;
        document.getElementById('to_url').value = result.to_url || default_to_url;
        // 默认选中下拉项
        document.getElementById('select_api').value = result.from_url || default_from_url;
        cookie_domain = document.getElementById('cookie_domain').value = result.cookie_domain || default_cookie_domain;
        top_domain = document.getElementById('site_url').value = result.site_url || default_site_url;

        document.getElementById('last_session_id').innerText = result.last_session_id || '(无)';
    });

    document.getElementById('status').addEventListener('click', ev => {
        update_config({status: ev.target.checked})
    });

    // 复制所有 storage、cookie
    document.getElementById('copy').addEventListener('click', () => {
        generate_session().then(session => {
            storeSession({session: JSON.stringify(session)});
        });
    });

    // 粘贴的时候直接根据粘贴板内容新建 tab 还原
    document.addEventListener('paste', function (evt) {
        let clipdata = evt.clipboardData || window.clipboardData;

        let data = clipdata.getData('text/plain');
        if (data.length === 24) {
            // 使用内网 mongodb 存储, 这是一个 mongo 记录 id
            restoreSession(data);
        } else {
            chrome.extension.getBackgroundPage().restoreTab(data);
        }
    });

    // 根据下拉选择的地址更新 local 缓存
    document.getElementById('select_api').addEventListener('change', evt => {
        update_config({from_url: evt.target.value})
    });
};

function update_config($config)
{
    chrome.storage.local.set($config, () => {
        chrome.extension.getBackgroundPage().reloadConfig();
    });
}

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

// 存储 session 到内网 mongodb
function storeSession(session) {
    xhr(default_store_session_url, session).then(responseText => {
        // responseText => mongodb 记录 id
        chrome.storage.local.set({last_session_id: responseText}, () => {
            document.getElementById('last_session_id').innerText = responseText;

            //
            document.getElementById('copy_session_id').value = responseText;
            document.querySelector('#copy_session_id').select();
            if (document.execCommand('copy')) {
                document.execCommand('copy');

                success_tip();
            }
        })
    });
}

// 根据 mongodb id 还原 session
function restoreSession(mongodb_id) {
    xhr(default_restore_session_url, {id: mongodb_id}).then(responseText => {
        chrome.extension.getBackgroundPage().restoreTab(responseText)
    })
}

// 发送 xhr 请求
function xhr(url, params, method) {
    return new Promise(resolve => {
        let data = new FormData();

        Object.keys(params).forEach(key => {
            data.append(key, params[key]);
        });

        let xhr = new XMLHttpRequest();

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                resolve(this.responseText);
            }
        });

        method = method || "POST";
        xhr.open(method, url);

        xhr.send(data);
    });
}