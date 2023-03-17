// 导入 express 模块
const express = require('express')

// 创建路由对象
const studentRouter = express.Router()

studentRouter.post('/test', (req, resp, next)=>{
	resp.send('studentRouter ok!')
})

// 向外导入路由对象
module.exports = studentRouter

/*
	drop table if exists `t_students`;
	
	create table `t_students(
		`id` int primary key auto_increment comment '学生id',
		`name` varchar(255) not null comment '学生姓名',
		`gender` varchar(10) not null comment '学生性别',
		`age` int not null comment '学生年龄',
		`school` varchar(255) not null comment '学生学校',
		`class` varchar(255) not null comment '学生班级',
		`p_idCard` varchar(255) not null unique comment '学生家长身份证号码'
	) comment='学生表';
*/