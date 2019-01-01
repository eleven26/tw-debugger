let cookie_domain;
let top_domain;

let default_to_url = "http://0.0.0.0:8001";
let default_from_url = "http://xx.com";

window.onload = () => {
    // 默认值设置
    chrome.storage.local.get(['status', 'to_url', 'from_url'], result => {
        document.getElementById('status').checked = result.status || false;
        document.getElementById('to_url').value = result.to_url || default_to_url;
        document.getElementById('from_url').value = result.from_url || default_from_url;
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
};