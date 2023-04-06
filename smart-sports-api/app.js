// 导入 express 模块
const express = require('express')
// 创建 express 的服务器实例
const app = express()

// 导入解决跨域资源共享（Cross Origin Resource Sharing，简称 cors）的中间件
const cors = require('cors')
// 将 cors 注册为全局中间件
app.use(cors())

// 使用 express.static() 向外开放uploads/avatars文件下的头像图片
app.use('/account/avatars',express.static('uploads/avatars'))
app.use('/student/avatars',express.static('static/student/avatars'))
app.use('/account',express.static('pages'))

// 使用中间件记录请求的方法和路径
app.use((req, resp, next)=>{
	console.log(req.method, req.path);
	next()
})

// 使用express.urlencoded() 中间件，处理 application/json 格式的请求体。使用该中间件后，解析后的数据会被放置在 req.body 对象中。
app.use(express.urlencoded({ extended: false }))
// 使用express.json() 中间件处理 application/x-www-form-urlencoded 格式的请求体。使用该中间件后，解析后的数据会被放置在 req.body 对象中。
app.use(express.json());



// 导入自定义的身份验证中间件
const {auth} = require('./utils/auth')
// 将自定义的身份验证中间件注册为全局中间件
app.use(auth(['/account/login', '/account/reg', '/account/send-code', '/account/verify-code', '/account/forget']))


// 导入并注册用户路由模块
app.use('/account', require('./router/userRouter'))
//导入并注册学生路由模块
app.use('/student', require('./router/studentRouter'))

// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(3000, function () {
  console.log(`smart-sports-api server running at http://127.0.0.1:${3000}`)
})