// 导入数据库连接池
const pool = require('../utils/DBHelper')
//导入对用户密码进行 md5 加密的模块
const md5 = require('md5')
// 导入 JWT 模块
const jwt = require('jwt-simple')
//导入时间处理模块
const moment = require('moment')
const {
	fields
} = require('../utils/MulterHelper')
// 将 .env 文件中配置的环境变量加载到 process.env 中
require('dotenv').config()
// 导入生成图形验证码的模块
const svgCaptcha = require('svg-captcha')

// 发送邮箱验证码的处理函数
exports.sendVerificationCode = (req, resp) => {

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
			msg: '服务器发生错误，验证码发送失败'
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

// 用户注册的处理函数
exports.userReg = (req, resp, next) => {
	//接收表单数据
	const user = req.body;

	//判断邮箱和密码是否为空
	if (user.email === '' || user.password === '') {
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

		if (user.code === code.toString() && user.email === email) {
			//检测邮箱是否被占用
			const sql = 'select * from t_parents where email=?';
			pool.query(sql, [user.email], (err, results, fields) => {
				//执行 sql 语句失败
				if (err) {
					return resp.json({
						status: 1,
						msg: err.message
					})
				}

				//如果查询记录不止一条，说明邮箱被占用
				if (results.length > 0) {
					return resp.json({
						status: 1,
						msg: '邮箱被占用，请更换其他邮箱！'
					})
				}

				// ? 表示占位符
				const sql = 'insert into t_parents(`email`, `password`, `reg_time`)values(?, ?, ?)';
				pool.query(
					sql,
					// 使用数组的形式为占位符指定具体的值
					[
						user.email,
						md5(md5(user.password) + process.env.SECRET_KEY),
						moment().format('YYYY-MM-DD HH:mm:ss')
					],
					function(error, results, fields) {
						//执行 sql 语句失败
						if (error) {
							return resp.json({
								status: 1,
								msg: error.message
							})
						}

						if (results.affectedRows !== 1) {
							return resp.json({
								status: 1,
								msg: '用户注册失败，请稍后再试'
							})
						}

						resp.json({
							status: 0,
							msg: '注册成功！'
						})
					});
			})
		} else {
			resp.status(400).json({
				status: 1,
				msg: '验证码错误'
			});
		}
	} catch (e) {
		//TODO handle the exception
		return resp.status(400).json({
			status: 1,
			msg: '验证码已经过期'
		})
	}
}

// 用户登录的处理函数
exports.userLogin = (req, resp, next) => {
	// 接收表单数据：
	const user = req.body;

	//判断邮箱和密码是否为空
	if (user.email === '' || user.password === '') {
		return resp.json({
			status: 1,
			msg: '邮箱或密码不能为空'
		})
	}

	const sql = 'select * from t_parents where email=?'
	pool.query(sql, [user.email], (err, results, fields) => {
		// sql 语句执行出错
		if (err) {
			return resp.json({
				status: 1,
				msg: err.message
			})
		}

		//执行 SQL 语句成功，但是查询到数据条数不等于 1
		if (results.length !== 1) {
			return resp.json({
				status: 1,
				msg: '用户不存在'
			})
		}

		// 判断用户输入的登录密码是否和数据库中的密码一致
		if (md5(md5(user.password) + process.env.SECRET_KEY) !== results[0].password) {
			return resp.json({
				status: 1,
				msg: '邮箱或密码错误'
			})
		}

		resp.json({
			status: 0,
			msg: '登录成功!',
			data: results[0],
			// 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
			token: 'Bearer ' + jwt.encode(results[0].email, process.env.SECRET_KEY)
		})

	})

}

exports.saveUserInfo = (req, resp, next) => {

	const {
		email,
		realname,
		gender,
		phone,
		idCard
	} = req.body;
	const {
		filename
	} = req.file;

	const avatar_url = '/account/avatars/' + filename;

	const sql = "update t_parents set realname=?, gender=?, phone=?, idCard=? , avatar_url=? where email=?"

	console.log("req.body: ", req.body);
	console.log("req.file: ", req.file);

	pool.query(sql, [realname, gender, phone, idCard, avatar_url, email], (err, results, fields) => {
		if (err) {
			return resp.json({
				status: 1,
				msg: err.message
			})
		}

		if (results.affectedRows !== 1) {
			console.log("results: ", results);
			return resp.json({
				status: 1,
				msg: '保存失败，请稍后再试'
			})
		}

		resp.json({
			status: 0,
			msg: '保存成功！',
			data: {
				email,
				realname,
				gender,
				phone,
				idCard,
				avatar_url
			}
		})
	})
}

exports.updatePassword = (req, resp, next) => {
	const {
		email,
		oldPassword,
		newPassword,
		token
	} = req.body;
	console.log("token: ",token);
	
	try{
		const {captcha} = jwt.decode(token, process.env.SECRET_KEY)
		
		console.log("captcha: ",captcha);
		console.log("req.body.captcha: ",req.body.captcha);
		
		if(req.body.captcha.toLocaleUpperCase() !== captcha.toLocaleUpperCase()){
			return resp.json({
				status: 1,
				msg: '验证码错误'
			})
		}
		
		const sql = 'select * from t_parents where email=?';
		
		pool.query(sql, [email], (err, results, fields) => {
			if (err) {
				return resp.json({
					status: 1,
					msg: err.message
				})
			}
		
			if (results.length !== 1) {
				return resp.json({
					status: 1,
					msg: '查询密码失败，请稍后再试'
				})
			}
		
			if (results[0].password !== md5(md5(oldPassword) + process.env.SECRET_KEY)) {
				return resp.json({
					status: 1,
					msg: '旧密码填写错误，请重新输入'
				})
			}
		
			const sql = 'update t_parents set password=? where email=?';
			const encryptedPassword = md5(md5(newPassword) + process.env.SECRET_KEY);
		
			pool.query(sql, [encryptedPassword, email], (err, results, fields) => {
				if (err) {
					return resp.json({
						status: 1,
						msg: err.message
					})
				}
		
				if (results.affectedRows !== 1) {
					return resp.json({
						status: 1,
						msg: '修改失败，请稍后再试'
					})
				}
		
				resp.json({
					status: 0,
					msg: '修改成功！请重新登录',
					password: encryptedPassword
				})
			})
		})
	}catch(e){
		//TODO handle the exception
		console.log("e: ",e);
		resp.status(500).json({
			status: 1,
			msg: '服务器发生错误，请稍后再试'
		})
	}
}

exports.sendCaptcha = (req, resp, next) => {
	const captcha = svgCaptcha.create({
		noise: 3,
		background: '#2b85e4'
	})

	// 将图形验证码的文本值保存在token中
	const token = jwt.encode({
		captcha: captcha.text,
		exp: Date.now() + 120000
	}, process.env.SECRET_KEY);

	resp.type('svg');
	resp.status(200).send({
		status: 0,
		msg: '图形验证码发送成功',
		token,
		data: captcha.data
	});
}

exports.veryfiCaptcha = (req, resp, next) => {
	const {
		captcha
	} = req.body;
	if (captcha.toLocaleUpperCase() !== req.session.captcha) {
		resp.json({
			status: 1,
			msg: '验证码错误'
		})
	} else {
		resp.json({
			status: 0,
			msg: '验证码正确'
		})
	}
}

/*
DROP TABLE IF EXISTS `t_parents`;

CREATE TABLE `t_parents` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `email` varchar(255) DEFAULT NULL COMMENT '电子邮箱',
  `password` varchar(255) NOT NULL COMMENT '密码',
  `realname` varchar(255) DEFAULT NULL COMMENT '真实姓名',
  `gender` varchar(10) DEFAULT NULL COMMENT '性别',
  `idcard` varchar(20) DEFAULT NULL COMMENT '身份证号',
  `phone` varchar(255) DEFAULT NULL COMMENT '手机号码',
  `avatar_url` varchar(255) DEFAULT NULL COMMENT '用户头像地址',
  `status` char(1) DEFAULT '1' COMMENT '状态:1可用,0不可用',
  `reg_time` datetime NOT NULL COMMENT '注册时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='家长信息表'
*/
