// 导入 express 模块
const express = require('express')

// 创建路由对象
const studentRouter = express.Router()

// 根据家长的身份证号拿到学生的信息
studentRouter.post('/get-students-by-idcard', require('../router_handler/studentRouterHandlers').getStudentsByIdcard)

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

/*
DROP TABLE IF EXISTS `t_student_physical_test`;

CREATE TABLE `t_student_physical_test` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '测试记录id',
  `student_id` varchar(20) NOT NULL COMMENT '学生id',
  `height` decimal(5,2) DEFAULT NULL COMMENT '身高，单位：厘米（cm）',
  `weight` decimal(5,2) DEFAULT NULL COMMENT '体重，单位：千克（kg）',
  `vision` FLOAT DEFAULT NULL COMMENT '视力，用的是E视力表',
  `blood_pressure` VARCHAR(20) DEFAULT NULL COMMENT '血压，单位：毫米汞柱（mmHg）,例如120/80 mmHg，其中第一个数字表示收缩压，第二个数字表示舒张压',
  `lung_capacity` INT(11) DEFAULT NULL COMMENT '肺活量，单位：升/分（ml）',
  `sit_ups` int(11) DEFAULT NULL COMMENT '仰卧起坐，单位：个数',
  `push_ups` int(11) DEFAULT NULL COMMENT '1分钟俯卧撑，单位：个数',
  `pull_ups` int(11) DEFAULT NULL COMMENT '引体向上，单位：个数',
  `200m_run` decimal(4,1) DEFAULT NULL COMMENT '200米跑，单位：秒（s）',
  `800m_run` decimal(5,2) DEFAULT NULL COMMENT '800米跑，单位：秒（s）',
  `1000m_run` decimal(5,2) DEFAULT NULL COMMENT '1000米跑，单位：秒（s）',
  `100m_swim` decimal(5,2) DEFAULT NULL COMMENT '100米游泳，单位：秒（s）',
  `long_jump` decimal(5,2) DEFAULT NULL COMMENT '立定跳远，单位：米（m）',
  `solid_ball` decimal(5,2) DEFAULT NULL COMMENT '投掷实心球，单位：米（m）',
  `rope_skipping` decimal(5,2) DEFAULT NULL COMMENT '1分钟跳绳，单位：个数',
  `sit_and_reach` decimal(4,1) DEFAULT NULL COMMENT '坐位体前屈，单位：厘米（cm）',
  `measurement_date` DATE NOT NULL COMMENT '测量日期',
   PRIMARY KEY (`id`),
   FOREIGN KEY (`student_id`) REFERENCES `t_students`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学生身体测试表';
*/
