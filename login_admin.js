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
