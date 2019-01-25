// A generic onclick callback function.
function genericOnClick(info, tab) {
    console.log("item " + info.menuItemId + " was clicked");
    console.log("info: " + JSON.stringify(info));
    console.log("tab: " + JSON.stringify(tab));
}

let subMenus = [
    {
        'env': 'test',
        'users': [
            {
                username: 'blyy123',
            }
        ]
    }
]

function createMenus(subMenus) {
    // Create one test item for each context type.
    let contexts = ["page", "selection", "link", "editable", "image"];
    for (var i = 0; i < contexts.length; i++) {
        let context = contexts[i];
        let id = chrome.contextMenus.create({
            "title": "login",
            "contexts": [context]
        });

        subMenus.forEach(menu => {
            let menuId = chrome.contextMenus.create({
                "title": menu.env,
                "contexts": [context],
                parentId: id
            })

            menu.users.forEach(user => {
                let password = user.password || '123456'
                let subMenuId = chrome.contextMenus.create({
                    "title": `${user.username} / ${password}`,
                    "contexts": [context],
                    "onclick": genericOnClick,
                    parentId: menuId
                })
            });
        });
    }
}

chrome.contextMenus.removeAll()
createMenus(subMenus)

