// 导入 express 模块
const express = require('express')
// 创建 express 的服务器实例
const app = express()
// 指定服务启动的端口号
const port = 3000

// // 导入和使用全局生效的自定义权限验证中间件
// const {auth} = require('./utils/auth')
// app.use(auth(['/account/login', '/account/reg']))

app.use((req, resp, next)=>{
	console.log(req.method, req.path);
	next()
})

app.use(require('./utils/custom-body-parser'))

// 导入并注册用户路由模块
app.use('/account', require('./router/userRouter'))

// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(port, function () {
  console.log(`smart-sports-api server running at http://127.0.0.1:${port}`)
})