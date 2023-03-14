//导入 express模块
const express = require('express')

// 创建路由对象
const userRouter = express.Router()

// 用户注册
userRouter.post('/reg', require('../router_handler/userRouterHandlers').userReg)

// 用户登录
userRouter.post('/login', require('../router_handler/userRouterHandlers').userLogin)

// 发送邮箱验证码
userRouter.post('/send-verification-code', require('../router_handler/userRouterHandlers').sendVerificationCode)

// 发送图形验证码
userRouter.post('/send-captcha', require('../router_handler/userRouterHandlers').sendCaptcha)
userRouter.post('/verify-captcha', require('../router_handler/userRouterHandlers').veryfiCaptcha)

// 保存用户信息
userRouter.post('/saveUserInfo', require('../utils/MulterHelper').single('avatar'), require('../router_handler/userRouterHandlers').saveUserInfo)

//修改用户密码
userRouter.post('/updatePassword', require('../router_handler/userRouterHandlers').updatePassword)

// 向外导出路由对象
module.exports = userRouter

/*
	module.exports 和 exports 的区别和联系
		区别：
			（1）在 module 对象中，包含 exports 属性，而我们就是通过这个属性（module.exports），向外暴露(共享)成员的。
			（2）exports 是 node 为了简化向外共享成员的代码，提供的一个新方式，在默认情况下，exports 和 module.exports指
				向的是同一个对象（为了不混淆，你可以理解为 exports 是 module.exports 对象地址的一个引用，exports 本质是
				一个变量）
		联系：
			两者没有区别，是全等的
		注意点：
			不恰当的使用方法：exports = xxx。exports 在默认情况下是指向 module.exports 对象的引用，如果为 exports 赋值了，
			那么也就是说 exports 不再指向 module.exports 所指的对象的地址，而我们向外共享成员的最终结果是 module.exports 
			所指的对象，如此便会导致错误。
*/