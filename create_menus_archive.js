let allMenus = {}

function chooseMenu(info, tab) {
    console.log(allMenus)
    console.log(info)
    console.log(tab)
    let menu = allMenus[info.menuItemId]
    let url = menu.url
    let username = menu.username
    console.log(menu)
}

let users = [
    {username: 'dtyy123', company_name: '耀企体验平台'},
    {username: 'txtyy123', company_name: '同兴泰'},
    {username: 'blyy123', company_name: '宝灵医药'},
    {username: 'tjyy123', company_name: '天健'},
    {username: 'hzyy123', company_name: '宏州'},
    {username: 'zxyy123', company_name: '展兴'},
    {username: 'zxceshi', company_name: '展兴'},
    {username: 'zxceshi011', company_name: '展兴'},
]
let envs = [
    "test", "qa1", "qa2", "qa3", "demo", ""
]
let entries = [
    '商城', '管理后台'
]

function createMenus() {
    let contexts = ["page", "selection", "link", "editable", "image"];
    let id = chrome.contextMenus.create({
        "title": "login",
        "contexts": contexts
    });

    entries.forEach(entry => {
        let menuId = chrome.contextMenus.create({
            "title": entry,
            "contexts": contexts,
            "parentId": id
        })

        envs.forEach(env => {
            let subMenuId = chrome.contextMenus.create({
                "title": env || '正式',
                "contexts": contexts,
                "parentId": menuId
            })

            users.forEach(user => {
                let childId = chrome.contextMenus.create({
                    "title": `${user.username} (${user.company_name})`,
                    "contexts": contexts,
                    "onclick": chooseMenu,
                    "parentId": subMenuId
                }, () => {
                    let shopUrl = env !== '' ? `http://shop.${env}.86yqy.com` : 'http://shop.86yqy.com'
                    let adminUrl = env !== '' ? `https://${env}.86yqy.com` : 'https://86yqy.com'
                    let url = entry === '商城' ? shopUrl : adminUrl

                    allMenus[childId] = {
                        shopUrl,
                        adminUrl,
                        url,
                        username: user.username
                    }
                })
            });
        })
    });
}

chrome.contextMenus.removeAll()
createMenus()

