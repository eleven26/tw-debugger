# tw-debugger

* 主要用途: 减少 debug 时间、重现时间
* 后端开发者: 可选择开启 api 地址重定向，开启之后，会将原来的 api 请求地址重定向到用户定义的地址，主要用以后端开发人员本机调试。配合第二点功能可以快速重现 bug 场景
* 测试、前端人员: 在测试、接口调用的时候发现某个页面的某个请求有 500 或者数据不正确的情况的时候，可以点击 "复制session" 按钮复制当前页面的所有 localStorage、cookie（复制之后的内容会在粘贴板），可以粘贴给后端开发人员

### 使用:
* 开发人员使用: 点击开启重定向之后，填写本机地址，这时候再次打开对应的网站，自定义的请求地址会被替换成填写的地址
* 测试、前端使用: 在发现某个页面的 api 请求有误的时候，可点击 "复制session" 按钮，把当前页面状态复制下来，粘贴给后端；后端拿到之后点击扩展按钮，在弹出窗口按下粘贴快捷键就可以重现该次请求。

### 重定向 api 请求到本地
* `/Applications/Chromium.app/Contents/MacOS/Chromium --disable-web-security --user-data-dir --disable-extensions-http-throttling`