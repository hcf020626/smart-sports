// 导入 express 模块
const express = require('express')

// 创建路由对象
const studentRouter = express.Router()

// 根据家长的身份证号拿到学生的信息
studentRouter.post('/get-students-by-idcard', require('../router_handler/studentRouterHandlers').getStudentsByIdcard)

// 根据学生id查询测量日期，学生体重，班级男生平均体重，班级女生平均体重
studentRouter.post('/get-weight-by-id', require('../router_handler/studentRouterHandlers').getWeightById)

// 根据学生id查询测量日期，学生身高，班级男生平均身高，班级女生平均身高
studentRouter.post('/get-height-by-id', require('../router_handler/studentRouterHandlers').getHeightById)

// 向外导入路由对象
module.exports = studentRouter

/*
drop table if exists `t_students`;

create table `t_students`(
	`id` varchar(20) primary key comment '学生id',
	`name` varchar(255) not null comment '学生姓名',
	`gender` varchar(10) not null comment '学生性别',
	`age` int not null comment '学生年龄',
	`school` varchar(255) not null comment '学生学校',
	`class` varchar(255) not null comment '学生班级',
	`p_idCard` varchar(255) not null comment '学生家长身份证号码'
) comment='学生表';
*/
