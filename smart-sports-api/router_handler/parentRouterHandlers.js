// 导入自己封装好的数据库工具
const db = require('../utils/DBHelper')
//导入对家长密码进行 md5 加密的模块
const md5 = require('md5')
// 导入 JWT 模块
const jwt = require('jwt-simple')
//导入时间处理模块
const moment = require('moment')
// 将 .env 文件中配置的环境变量加载到 process.env 中
require('dotenv').config()

// 家长登录的处理函数
exports.parentLogin = async (req, resp, next) => {
	// 接收表单数据：
	const parent = req.body;

	//判断邮箱和密码是否为空
	if (parent.email === '' || parent.password === '') {
		return resp.json({
			status: 1,
			msg: '邮箱或密码不能为空'
		})
	}

	try {
		let parentInfo, studentInfo;
		let sql = 'select * from t_parents where email=?'
		let results = await db.exec(sql, [parent.email]);

		// 判断查询结果，如果查询到的数据不唯一，则表示家长不存在；如果查询到的数据唯一，则继续执行下一步。
		if (results.length !== 1) {
			return resp.json({
				status: 1,
				msg: '家长不存在'
			})
		}

		// 判断家长输入的登录密码是否和数据库中的密码一致
		if (md5(md5(parent.password) + process.env.SECRET_KEY) !== results[0].password) {
			return resp.json({
				status: 1,
				msg: '邮箱或密码错误'
			})
		}

		parentInfo = results[0];

		sql = 'select * from t_students where id=?'
		results = await db.exec(sql, [parentInfo.cur_bonding_id]);

		if (results.length !== 1) {
			studentInfo = {}
		} else {
			studentInfo = results[0];
		}

		console.log("parentInfo, studentInfo: ", parentInfo, studentInfo);

		resp.json({
			status: 0,
			msg: '登录成功!',
			data: {
				parentInfo,
				studentInfo
			},
			// 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
			token: 'Bearer ' + jwt.encode(parentInfo.email, process.env.SECRET_KEY)
		})
	} catch (e) {
		//TODO handle the exception
		console.log("e: ", e);
		resp.json({
			status: 1,
			msg: '服务器出现错误，登录失败'
		})
	}
}

// 家长注册的处理函数
exports.parentReg = async (req, resp, next) => {
	//接收表单数据
	const parent = req.body;

	//判断邮箱和密码是否为空
	if (parent.email === '' || parent.password === '') {
		return resp.json({
			status: 1,
			msg: '邮箱或密码不能为空'
		})
	}
	
	try {
		// 对 token 进行解密，取出其中保存的 email 和 token
		const {
			email,
			code
		} = jwt.decode(req.body.token, process.env.SECRET_KEY);

		if (parent.code === code.toString() && parent.email === email) {
			try {
				//检测邮箱是否被占用
				let sql = 'select * from t_parents where email=?';
				let results = await db.exec(sql, [parent.email], );

				//如果查询记录不止一条，说明邮箱被占用
				if (results.length > 0) {
					return resp.json({
						status: 1,
						msg: '邮箱被占用，请更换其他邮箱！'
					})
				}

				sql = 'insert into t_parents(`email`, `password`, `reg_time`)values(?, ?, ?)';
				results = await db.exec(sql, [
					parent.email,
					md5(md5(parent.password) + process.env.SECRET_KEY),
					moment().format('YYYY-MM-DD HH:mm:ss')
				])

				if (results.affectedRows !== 1) {
					return resp.json({
						status: 1,
						msg: '服务器出现异常，注册失败'
					})
				}

				resp.json({
					status: 0,
					msg: '注册成功！'
				})
			} catch (e) {
				//TODO handle the exception
				resp.json({
					status: 1,
					msg: '服务器出现错误，注册失败'
				})
			}
		} else {
			resp.json({
				status: 1,
				msg: '验证码错误'
			});
		}
	} catch (e) {
		//TODO handle the exception
		return resp.json({
			status: 1,
			msg: '验证码已经过期'
		})
	}
}

// 家长忘记密码的处理函数
exports.parentForget = async (req, resp, next) => {
	//接收表单数据
	const parent = req.body;

	//判断邮箱和密码是否为空
	if (parent.email === '' || parent.password === '') {
		return resp.json({
			status: 1,
			msg: '邮箱或密码不能为空'
		})
	}
	
	
	console.log("req.body.token: ",req.body.token);
	
	if(!req.body.token){
		return resp.json({
			status: 1,
			msg: '请先获取验证码'
		})
	}
	
	try {
		// 对 token 进行解密，取出其中保存的 email 和 token
		const {
			email,
			code
		} = jwt.decode(req.body.token, process.env.SECRET_KEY);

		if (parent.code === code.toString() && parent.email === email) {
			try {
				//检测邮箱是否已注册
				let sql = 'select * from t_parents where email=?';
				let results = await db.exec(sql, [parent.email], );

				//如果查询记录为空，说明邮箱还未注册
				if (results.length === 0) {
					return resp.json({
						status: 1,
						msg: '邮箱还未注册，修改失败'
					})
				} else if(results.length > 1){
					return resp.json({
						status: 1,
						msg: '服务器出现异常，修改密码失败'
					})
				}

				sql = 'update t_parents set password=? where email=?';
				results = await db.exec(sql, [md5(md5(parent.password) + process.env.SECRET_KEY), parent.email])

				if (results.affectedRows !== 1) {
					return resp.json({
						status: 1,
						msg: '服务器出现异常，修改密码失败'
					})
				}

				resp.json({
					status: 0,
					msg: '修改密码成功！'
				})
			} catch (e) {
				//TODO handle the exception
				resp.json({
					status: 1,
					msg: '服务器出现错误，注册失败'
				})
			}
		} else {
			resp.json({
				status: 1,
				msg: '验证码错误'
			});
		}
	} catch (e) {
		//TODO handle the exception
		return resp.json({
			status: 1,
			msg: '验证码已经过期'
		})
	}
}

// 发送邮箱验证码的处理函数
exports.sendCode = (req, resp) => {

	try {
		// 接收表单数据
		const email = req.body.email;

		const {
			transporter,
			generateVerificationCode
		} = require('../utils/MailTransporter')

		// 生成验证码
		const code = generateVerificationCode()

		// 将 email 和 code 进行加密保存到 token 中
		const token = jwt.encode({
			email,
			code,
			exp: Date.now() + 120000
		}, process.env.SECRET_KEY);
		console.log("code: ", code);

		resp.status(200).json({
			status: 0,
			msg: '验证码已发送',
			token
		})
	} catch (e) {
		console.log("e: ", e);
		resp.status(500).json({
			status: 1,
			msg: '服务器出现错误，验证码发送失败'
		})
	}

	// // 填写一封邮件
	// const mailOptions = {
	// 	from: process.env.QQ_EMAIL,
	// 	to: email,
	// 	subject: '智慧体育平台注册验证码',
	// 	text: `你的验证码是 ${code}`
	// }

	// // 发送邮件
	// transporter.sendMail(mailOptions, (error, info) => {
	// 	if (error) {
	// 		console.log(error);
	// 		resp.json({
	// 			status: 1,
	// 			msg: '服务器故障，邮件发送失败：' + error 
	// 		})
	// 	} else {
	// 		console.log('Email sent: ' + info.response);
	// 		// 发送成功，则将验证码保存到 Session 中
	// 		req.session.code = code
	// 		resp.json({
	// 			status: 0,
	// 			msg: '验证码已发送'
	// 		})
	// 	}
	// })
}


exports.saveParentInfo = async (req, resp, next) => {
	try {
		const {
			email,
			realname,
			gender,
			phone,
			idcard,
		} = req.body;

		const cur_bonding_id = req.body.cur_bonding_id === 'null' ? null : req.body.cur_bonding_id;

		const avatar_url = '/parents/avatars/' + req.file.filename;

		const sql =
			"update t_parents set realname=?, gender=?, phone=?, idCard=? , avatar_url=?, cur_bonding_id=? where email=?"

		const results = await db.exec(sql, [realname, gender, phone, idcard, avatar_url, cur_bonding_id,
			email
		]);

		if (results.affectedRows !== 1) {
			return resp.json({
				status: 1,
				msg: '服务器出现异常，保存失败'
			})
		}

		resp.json({
			status: 0,
			msg: '保存成功！',
			updatedParentInfo: {
				email,
				realname,
				gender,
				phone,
				idcard,
				avatar_url,
			}
		})
	} catch (e) {
		//TODO handle the exception
		console.log("e: ", e);
		resp.json({
			status: 1,
			msg: '服务器出现错误，保存失败'
		})
	}
}

// 修改密码的处理函数
exports.updatePassword = async (req, resp, next) => {
	const {
		email,
		oldPassword,
		newPassword,
	} = req.body;

	// 验证旧密码是否与数据库保存的密码一致
	let sql = 'select * from t_parents where email=?';
	let results = await db.exec(sql, [email]);

	if (results.length !== 1) {
		return resp.json({
			status: 1,
			msg: '服务器出现异常，修改密码失败'
		})
	}

	if (results[0].password !== md5(md5(oldPassword) + process.env.SECRET_KEY)) {
		return resp.json({
			status: 1,
			msg: '旧密码填写错误，请重新输入'
		})
	}
	try {
		// 验证通过，将新密码保存到数据库中
		const encryptedPassword = md5(md5(newPassword) + process.env.SECRET_KEY);
		sql = 'update t_parents set password=? where email=?';
		results = await db.exec(sql, [encryptedPassword, email]);

		if (results.affectedRows !== 1) {
			return resp.json({
				status: 1,
				msg: '服务器出现异常，修改密码失败'
			})
		}

		resp.json({
			status: 0,
			msg: '修改成功！请重新登录',
			password: encryptedPassword
		})
	} catch (e) {
		//TODO handle the exception
		console.log("e: ", e);
		resp.status(500).json({
			status: 1,
			msg: '服务器出现错误，修改密码失败'
		})
	}
}

exports.changeBonding = async (req, resp, next) => {
	const {
		email
	} = req.body;
	const id = req.body.id === 'null' ? null : req.body.id;

	try {
		const sql = 'update t_parents set cur_bonding_id=? where email=?';
		const results = await db.exec(sql, [id, email]);

		if (results.affectedRows !== 1) {
			return resp.json({
				status: 1,
				msg: '服务器出现异常，绑定失败'
			})
		}

		if (id) {
			resp.json({
				status: 0,
				msg: '绑定成功！',
			})
		} else {
			resp.json({
				status: 0,
				msg: '已解除绑定！！',
			})
		}
	} catch (e) {
		//TODO handle the exception
		console.log("e: ", e);
		resp.status(500).json({
			status: 1,
			msg: '服务器出现错误，请稍后再试'
		})
	}
}

exports.getTheLatestInfo = async (req, resp, next) => {
	const {
		email
	} = req.body;

	console.log("email: ", email);

	try {
		let parentInfo, studentInfo;
		let sql = 'select * from t_parents where email=?'
		let results = await db.exec(sql, [email]);

		if (results.length !== 1) {
			console.log("results: ", results);
			return resp.json({
				status: 1,
				msg: '服务器出现异常，获取失败'
			})
		}

		parentInfo = results[0];

		sql = 'select * from t_students where id=?'
		results = await db.exec(sql, [parentInfo.cur_bonding_id]);

		if (results.length !== 1) {
			studentInfo = {}
		} else {
			studentInfo = results[0];
		}

		console.log("parentInfo, studentInfo: ", parentInfo, studentInfo);

		resp.json({
			status: 0,
			msg: '获取成功!',
			data: {
				parentInfo,
				studentInfo
			},
		})
	} catch (e) {
		//TODO handle the exception
		console.log("e: ", e);
		resp.json({
			status: 1,
			msg: '服务器出现错误，获取失败'
		})
	}
}

/*
DROP TABLE IF EXISTS `t_parents`;

CREATE TABLE `t_parents` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '家长id',
  `email` varchar(255) DEFAULT NULL COMMENT '电子邮箱',
  `password` varchar(255) NOT NULL COMMENT '密码',
  `realname` varchar(255) DEFAULT NULL COMMENT '真实姓名',
  `gender` varchar(10) DEFAULT NULL COMMENT '性别',
  `idcard` varchar(20) DEFAULT NULL COMMENT '身份证号',
  `phone` varchar(255) DEFAULT NULL COMMENT '手机号码',
  `avatar_url` varchar(255) DEFAULT NULL COMMENT '家长头像地址',
  `status` char(1) DEFAULT '1' COMMENT '状态:1可用,0不可用',
  `reg_time` datetime NOT NULL COMMENT '注册时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='家长信息表'
*/
