let allMenus = {}
let currentInfo, currnetTab

/**
 * login script
 * 
 * @param {string} username 
 * @param {string} password 
 */
function getLoginScript(username, password) {
    let loginScript = `
    function input(el, value) {
        el.value = value
        el.dispatchEvent(new Event('input'))
        el.dispatchEvent(new Event('change'))
        el.dispatchEvent(new Event('blur'))
    }
    
    obj = {}
    if (location.href.indexOf('shop') === -1) {
        dropdown = document.querySelectorAll('.user-dropdown li')
        if (dropdown.length > 0) {
            // 管理后台(已经登录)
            logout = dropdown[dropdown.length - 1].children[0]
            obj['refreshed'] = true
            logout.click()
        } else {
            let user = {
                username: '${username}',
                password: '${password}'
            };
    
            let times = 0
            let id = setInterval(() => {
                if (times++ == 120) {
                    clearInterval(id)
                }
    
                let username = document.querySelector('input[name="username"]')
                if (username) {
                    input(username, user.username)
                    let password = document.querySelector('input[name="password"]')
                    input(password, user.password)
    
                    let submit = document.querySelector('.login-submit span')
                    submit.click();

                    clearInterval(id)
                }
            }, 1000)
        }
    } else {
        // 商城
        document.querySelector('.header-top .left li i').addEventListener('click', evt => {
            let user = {
                username: '${username}',
                password: '${password}'
            };
    
            let times = 0
            let id = setInterval(() => {
                if (times++ == 120) {
                    clearInterval(id)
                }
    
                let username = document.querySelector('input[placeholder="用户名/手机号码"]');
                if (username) {
                    input(username, user.username)
                    let password = document.querySelector('input[placeholder="登录密码"]');
                    input(password, user.password)
    
                    let submit = document.querySelector('.remember button');
                    submit.click();

                    clearInterval(id)
                }
            }, 1000)
        })
    
        // 退出按钮
        logout = document.querySelector('.header-top .left li:last-child')
        if (JSON.parse(localStorage.getItem('userLoginState')) === true) {
            obj['refreshed'] = true
            logout.click()
        } else {
            // 登录弹窗
            document.querySelector('.header-top .left li i').click()
        }
    }
    
    obj
    `

    return loginScript
}

function chooseMenu(info, tab) {
    currentInfo = info
    currnetTab = tab

    let menu = allMenus[info.menuItemId]
    let username = menu.user.username
    let password = menu.user.password || '123456'

    let loginScript = getLoginScript(username, password)
    chrome.tabs.executeScript(tab.id, {
        code: loginScript
    }, items => {
        // 页面刷新过
        if (items[0] && items[0].refreshed) {
            chrome.tabs.onUpdated.addListener(function (tabId, info) {
                if (tabId === tab.id && info.status === 'complete') {
                    chrome.tabs.executeScript(tab.id, {
                        code: loginScript
                    }, items => {
                        // 重新加载 background page
                        window.location.reload()
                    }); 
                }
            });
        }
    });
}

let users = [
    { username: 'dtyy123', company_name: '耀企体验平台' },
    { username: 'txtyy123', company_name: '同兴泰' },
    { username: 'blyy123', company_name: '宝灵医药' },
    { username: 'tjyy123', company_name: '天健' },
    { username: 'hzyy123', company_name: '宏州' },
    { username: 'zxyy123', company_name: '展兴' },
    { username: 'zxceshi', company_name: '展兴' },
    { username: 'zxceshi011', company_name: '展兴' },
]

function createMenus() {
    let contexts = ["page", "selection", "link", "editable", "image"];
    let id = chrome.contextMenus.create({
        "title": "登录商城",
        "contexts": contexts
    });

    users.forEach(user => {
        let childId = chrome.contextMenus.create({
            "title": `${user.username} (${user.company_name})`,
            "contexts": contexts,
            "onclick": chooseMenu,
            "parentId": id
        }, () => {
            allMenus[childId] = {
                user
            }
        })
    });
}

chrome.contextMenus.removeAll()
createMenus()

