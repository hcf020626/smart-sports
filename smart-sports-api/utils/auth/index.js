// 导入 jwt 模块
const jwt = require('jwt-simple')

// 将 .env 文件中配置的环境变量加载到 process.env 中
require('dotenv').config()

//自定义一个身份认证的中间件，并将其导出
module.exports = {
	auth(list = []) {
		return function(req, resp, next) {
			var url = req.url.toLowerCase(); //转小写
			if (list.some(item => url.startsWith(item))) {
				next()
			} else {
				try {
					token = req.headers.authorization.split(' ')[1];
					jwt.decode(token, process.env.SECRET_KEY)
					next()
				} catch (error) {
					resp.json({
						msg: "您的token失效,请重新登录",
						status: 401
					})
				}
			}
		}
	}
}
