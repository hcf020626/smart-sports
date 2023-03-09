// 导入数据库连接池
const pool = require('../utils/DBHelper')
//导入对用户密码进行 md5 加密的模块
const md5 = require('md5')
// 导入 JWT 模块
const jwt = require('jwt-simple')
//导入时间处理模块
const moment = require('moment')
// 将 .env 文件中配置的环境变量加载到 process.env 中
require('dotenv').config()

// 用户注册的处理函数
userReg = (req, resp, next) => {
	//接收表单数据
	const user = req.body;

	//判断用户手机号码和密码是否为空
	if (user.phone === '' || user.password === '') {
		return resp.json({
			status: 1,
			msg: '手机号码或密码不能为空'
		})
	}

	//检测手机号码是否被占用
	const sql = 'select * from t_parents where phone=?';
	pool.query(sql, [user.phone], (err, results, fields) => {
		//执行 sql 语句失败
		if (err) {
			return resp.json({
				status: 1,
				msg: err.message
			})
		}

		//如果查询记录不止一条，说明手机号码被占用
		if (results.length > 0) {
			return resp.json({
				status: 1,
				msg: '手机号码被占用，请更换其他手机号码！'
			})
		}

		// ? 表示占位符
		const sql = 'insert into t_parents(`phone`, `password`, `reg_time`)values(?, ?, ?)';

		pool.query(
			sql,
			// 使用数组的形式为占位符指定具体的值
			[
				user.phone,
				md5(md5(user.password) + process.env.SECRET_KEY),
				moment().format('YYYY-MM-DD HH:mm:ss')
			],
			function(error, results, fields) {
				//执行 sql 语句失败
				if (error) {
					return resp.json({
						status: 1,
						msg: err.message
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
}

// 用户登录的处理函数
userLogin = (req, resp, next) => {
	// 接收表单数据：
	const user = req.body;

	//判断用户手机号码和密码是否为空
	if (user.phone === '' || user.password === '') {
		return resp.json({
			status: 1,
			msg: '手机号码或密码不能为空'
		})
	}

	const sql = 'select * from t_parents where phone=?'
	pool.query(sql, [user.phone], (err, results, fields) => {
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
				msg: '手机号码或密码错误'
			})
		}

		resp.json({
			status: 0,
			msg: '登录成功!',
			data: results[0],
			// 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
			token: 'Bearer ' + jwt.encode(results[0], process.env.SECRET_KEY)
		})

	})

}

module.exports = {
	userReg,
	userLogin
}

/*
create table `t_parents`(
	`id` int(11) primary key auto_increment comment 'id',
	`username` varchar(255) not null unique comment '用户名',
	`password` varchar(255) not null comment '密码',
	`nickname` varchar(255) default null comment '昵称',
	`realname` varchar(255) default null comment '真实姓名',
	`gender` varchar(10) default null comment '性别',
	`idcard` varchar(20) default null comment '身份证号',
	`phone_number` varchar(20) default null comment '电话号码',
	`email` varchar(255) default null comment '电子邮箱',
	`status` char(1) default '1' comment '状态:1可用,0不可用',
	`reg_time` datetime not null comment '注册时间'
) comment='家长信息表';
*/
