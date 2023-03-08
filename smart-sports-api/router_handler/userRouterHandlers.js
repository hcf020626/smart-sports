// 用户注册的处理函数
userReg = (req, resp, next) => {
	resp.send(req.body)
}

// 用户登录的处理函数
userLogin = (req, resp, next) => {
	resp.send(req.body)
}

module.exports = {
	userReg,
	userLogin
}