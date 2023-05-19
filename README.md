# 介绍

本项目是我的本科毕业设计，毕设课题名字是《基于 Android 的智慧体育平台家长模块设计与实现》。由于我不怎么熟悉原生开发（安卓使用 Java语言 或 Kotlin 语言，iOS 使用 Objective-C 语言或 Swift 语言），对 Web 开发的技术熟练一点，所以在这个项目中，我使用了混合开发技术来开发一个 Android App。

当然了，用原生语言开发的 App叫原生 App（native App），用混合技术开发的 App叫混合 App（hybrid App），用网页技术做的、并且必须在浏览器中使用的 APP 叫 Web App，还有一种本质和混合 App 差不多（都套了一层浏览器的外壳）的小程序（Mini Program），详细参见阮一峰的这篇博客：[H5 手机 App 开发入门：概念篇](https://www.ruanyifeng.com/blog/2019/12/hybrid-app-concepts.html)

混合开发技术有很多种，熟悉 React 的可以使用 React Native，熟悉 Vue 和小程序的可以使用 uni-app，对 App 性能有一定要求的可以使用 Flutter，不过它需要学习一门新的语言 Dart，还有Taro......

本项目采用的混合开发技术是 [uni-app](https://uniapp.dcloud.net.cn/)，uni-app 是一个基于 Vue.js 的跨平台前端应用框架，开发者编写一套代码，可发布到移动应用程序（iOS或Android）、Web应用程序以及各种小程序（微信/支付宝/百度/头条/飞书/QQ/快手/钉钉/淘宝)、快应用等多个平台。

本项目的采用了前后端分离的模式，前端使用了 uniapp 这个跨平台框架来开发用户界面，后端使用 express 框架来构建 web 服务器处理 http 请求和响应，数据库使用mysql来存储用户数据。当然本项目还使用到了很多其他的技术比如 uView、echarts等等。



# 如何上手



## 1. 下载源代码

将项目克隆或者下载到你的电脑中



## 2. 创建数据库

使用 CLI 或者 Navicat 这样的数据库可视化管理工具执行 sql 文件



## 3. 启动服务器

1. 在 `smart-sports-api` 目录下打开终端，执行 `npm i` ，安装依赖
2. 依赖下载完成后，执行 `node app.js` 或者 `nodemon app.js` 启动服务器
3. 修改 `smart-sports-api` 目录下的 `.env` 配置文件中的配置信息
4. 打开 QQ邮箱中的POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务，具体步骤：打开QQ邮箱->设置->账户->POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务，开启服务。服务开启成功后会生成一个授权码，将 `.env`中的 `QQ_PASS`的值替换成你自己的授权码



## 4. 启动前端

1. 下载 HBuilderX（推荐）
2. 用 HBuilderX 打开 `smart-sports`文件夹
3. 在HBuilderX中配置 node 和 npm
4. 点击顶部工具栏的运行，然后运行到你想要的平台就可以了
