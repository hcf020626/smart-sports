// 在 express 中使用 JWT
const jwt = require('jwt-simple')

// 将 .env 文件中的环境变量加载到 process.env 中
require('dotenv').config()

//自定义一个中间件，用于权限验证
module.exports = {
	auth(list = []) {
		return function(req, resp, next) {
			var url = req.url.toLowerCase(); //转小写
			if (list.some(item => url.startsWith(item))) {
				next()
			} else {
				//不是 /account/login', '/account/reg'
				//就要问 是否带了token
				//向服务器携带数据的方式有几种 ?场景的有5种
				// 1.get query
				// 2.post body
				// 3.cookie
				// 4.headers 请求
				// 5.请求头里  authorization 
				try {
					let token = req.body.token || req.query.token || req.cookies.token || req.headers.token;
					if (token == null) {
						token = req.headers["authorization"].split(/ /)[1]
					}
					// console.log(token);
					jwt.decode(token, process.env.SECRET_KEY)
					next()
				} catch (error) {
					res.json({
						msg: "您的token失效,请重新登录",
						code: 401
					})
				}
			}
		}
	}
}
