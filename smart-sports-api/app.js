// 导入 express 模块
const express = require('express')
// 创建 express 的服务器实例
const app = express()
// 将 .env 文件中配置的环境变量加载到 process.env 中
require('dotenv').config()

// 导解决跨域资源共享（Cross Origin Resource Sharing，简称 cors）的中间件
const cors = require('cors')
// 将 cors 注册为全局中间件
app.use(cors())

app.use((req, resp, next)=>{
	console.log(req.method, req.path);
	next()
})

// 导入session中间件
const session = require('express-session')
app.use(session({
  secret: process.env.SECRET_KEY, // 用于加密 session 的密钥，可以是任意字符串
  resave: false, // 强制保存 session 即使它并没有变化
  saveUninitialized: true, // 强制将未初始化的 session 存储
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // session 过期时间，单位毫秒
  }
}))

// 使用express.urlencoded() 中间件，处理 application/json 格式的请求体。使用该中间件后，解析后的数据会被放置在 req.body 对象中。
app.use(express.urlencoded({ extended: false }))
// 使用express.json() 中间件处理 application/x-www-form-urlencoded 格式的请求体。使用该中间件后，解析后的数据会被放置在 req.body 对象中。
app.use(express.json());

// 使用 express.static() 向外开放uploads/avatars文件下的头像图片
app.use('/account/avatars',express.static('uploads/avatars'))




// 导入自定义的身份验证中间件
const {auth} = require('./utils/auth')
// 将自定义的身份验证中间件注册为全局中间件
app.use(auth(['/account/login', '/account/reg', '/account/send-verification-code', '/account/verify-code']))


// 导入并注册用户路由模块
app.use('/account', require('./router/userRouter'))

// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(3000, function () {
  console.log(`smart-sports-api server running at http://127.0.0.1:${3000}`)
})