# tw-debugger

### 主要用途
   * 节省 debug 时间
   * 快速重现时间
   * 更直观的进行调试
   * 免去 postman 的参数组装修改这一系列繁琐的操作
   * 业务流程过长的时候，免去在 postman 里面找接口生成测试数据的操作

### 使用

* 后端
    * 可选择开启 api 地址重定向，开启之后，会将原来的 api 请求地址重定向到用户定义的地址，主要用于后端开发人员本机调试。
    * 点击开启重定向之后，填写本机地址，这时候再次打开对应的网站，自定义的请求地址会被替换成填写的地址

* 其他人员
    * 可以点击 `Api Blame` 打开查询接口信息的页面（包括开发者、所在控制器、所在方法）

### 依赖

* 本插件如果后端需要重定向接口请求到本地，需要下载 `Chromium`，并且需要从命令行按以下命令启动
    - `<这里是 Chromium 路径> --disable-web-security --user-data-dir --disable-extensions-http-throttling`
    - 如，mac 下面是
        - `/Applications/Chromium.app/Contents/MacOS/Chromium --disable-web-security --user-data-dir --disable-extensions-http-throttling`
    - mac 下面可以新建一个 bash 脚本保存这一行，windows 也可以新建一个 bat 脚本，从而可以从脚本快速启动

* Chromium 下载地址
    - [https://download-chromium.appspot.com/](https://download-chromium.appspot.com/)
    - 可以在上面链接打开页面的底部选择不同的操作系统，下载不同系统的版本

### 安装

* 从 Chrome 商店安装
    - 搜索 `tw debugger`，点击 "添加到 Chrome"
* 从 github 下载
    - 下载地址 [https://github.com/eleven26/tw-debugger/releases/latest](https://github.com/eleven26/tw-debugger/releases/latest)
    - 下载 `*.crx` 文件，打开 Chrome/Chromium 插件管理页面，把下载的文件拖进去即可使用

### 使用
 
* 按 `依赖` 一节说的命令启动 `Chromium` 浏览器
* 在 `Chromium` 浏览器中安装 `tw debugger` 插件
* 点击浏览器右上角的扩展图标即可使用
    - 重定向 api 请求到本地
        - 点击 `是否重定向API` 开启 api 重定向，不需要重定向的时候也可以点击关闭
        - 在 `重定向地址` 输入框里面输入本地的接口地址
        - 在 `需要重定向的地址` 的下拉列表选择需要重定向的接口地址（对应不同的测试环境）
    - 查看接口信息
        - 点击 `Api Blame`
