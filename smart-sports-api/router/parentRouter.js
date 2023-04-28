//导入 express模块
const express = require('express')

// 创建路由对象
const parentRouter = express.Router()

// 用户登录
parentRouter.post('/login', require('../router_handler/parentRouterHandlers').parentLogin)

// 用户注册
parentRouter.post('/reg', require('../router_handler/parentRouterHandlers').parentReg)

// 用户忘记密码
parentRouter.post('/forget', require('../router_handler/parentRouterHandlers').parentForget)

// 发送邮箱验证码
parentRouter.post('/send-code', require('../router_handler/parentRouterHandlers').sendCode)


// 保存用户信息
parentRouter.post('/save-parent-info', require('../utils/MulterHelper').single('avatar'), require('../router_handler/parentRouterHandlers').saveParentInfo)

//修改用户密码
parentRouter.post('/update-password', require('../router_handler/parentRouterHandlers').updatePassword)

// 换绑
parentRouter.post('/change-bonding', require('../router_handler/parentRouterHandlers').changeBonding)

parentRouter.post('/get-userlist-by-keyword', require('../router_handler/parentRouterHandlers').getUserListByKeyword)

parentRouter.post('/create-friendship', require('../router_handler/parentRouterHandlers').createFriendship)

parentRouter.post('/delete-friendship', require('../router_handler/parentRouterHandlers').deleteFriendship)

// 获取最新的用户和对应的学生信息
parentRouter.post('/get-the-latest-info', require('../router_handler/parentRouterHandlers').getTheLatestInfo)

parentRouter.post('/get-friend-list-by-id', require('../router_handler/parentRouterHandlers').getFriendListById)

parentRouter.post('/get-particular-steps-rating', require('../router_handler/parentRouterHandlers').getParticularStepsRating)

parentRouter.post('/get-particular-steps', require('../router_handler/parentRouterHandlers').getParticularSteps)

parentRouter.post('/update-steps', require('../router_handler/parentRouterHandlers').updateSteps)

parentRouter.post('/update-particular-like', require('../router_handler/parentRouterHandlers').updateParticularLike)

// 向外导出路由对象
module.exports = parentRouter

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