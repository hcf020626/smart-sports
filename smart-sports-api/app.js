// 导入 express 模块
const express = require('express')
// 创建 express 的服务器实例
const app = express()
// 指定服务启动的端口号
const port = 3000

// 导入并使用全局生效的自定义权限验证中间件
const {auth} = require('./utils/auth')
app.use(auth(['/account/login', '/account/reg']))

// 导入 cors 中间件
const cors = require('cors')
// 将 cors 注册为全局中间件
app.use(cors())

//导入并使用 express 内置的解析 application/x-www-form-urlencoded 格式的表单数据的中间件
app.use(express.urlencoded({ extended: false }))

app.use((req, resp, next)=>{
	console.log(req.method, req.path);
	next()
})

// 导入并注册用户路由模块
app.use('/account', require('./router/userRouter'))

// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(port, function () {
  console.log(`smart-sports-api server running at http://127.0.0.1:${port}`)
})