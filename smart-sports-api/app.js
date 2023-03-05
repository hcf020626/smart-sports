// 导入 express 模块
const express = require('express')
// 创建 express 的服务器实例
const app = express()
// 指定服务启动的端口号
const port = 3000

// write your code here...
const {userRouter} = require('./router/userRouter')
app.use(userRouter)

// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(port, function () {
  console.log(`smart-sports-api server running at http://127.0.0.1:${port}`)
})