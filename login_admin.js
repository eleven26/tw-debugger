// list = document.querySelectorAll('.user-dropdown li')
// logout = list[list.length - 1]

document.querySelector('.header-top .left li i').addEventListener('click', evt => {
    console.log(evt)
    let user = {
        username: 'blyy123',
        password: '123456'
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
let logout = document.querySelector('.header-top .left li:last-child')
if (JSON.parse(localStorage.getItem('userLoginState')) === true) {
    logout.click()
}

// 登录弹窗
document.querySelector('.header-top .left li i').click()

function input(el, value) {
    el.value = value
    el.dispatchEvent(new Event('input'))
    el.dispatchEvent(new Event('change'))
    el.dispatchEvent(new Event('blur'))
}
