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

// 根据学生id查询测量日期，班级平均左眼视力，班级平均右眼视力，学生左眼视力，学生右眼视力
studentRouter.post('/get-vision-by-id', require('../router_handler/studentRouterHandlers').getVisionById)

// 根据学生id查询测量日期，学生收缩压，学生舒张压
studentRouter.post('/get-blood-pressure-by-id', require('../router_handler/studentRouterHandlers').getBloodPressureById)

// 根据学生id查询测量日期，学生肺活量，班级男生平均肺活量，班级女生平均肺活量
studentRouter.post('/get-lung-capacity-by-id', require('../router_handler/studentRouterHandlers').getLungCapacityById)

// 根据学生id查询测量日期，学生俯卧撑数，班级男生平均俯卧撑数
studentRouter.post('/get-push-ups-by-id', require('../router_handler/studentRouterHandlers').getPushUpsById)

// 根据学生id查询测量日期，学生仰卧起坐数，班级女生平均仰卧起坐数
studentRouter.post('/get-sit-ups-by-id', require('../router_handler/studentRouterHandlers').getSitUpsById)

// 根据学生id查询测量日期，学生引体向上数，班级男生平均引体向上数
studentRouter.post('/get-pull-ups-by-id', require('../router_handler/studentRouterHandlers').getPullUpsById)

// 根据学生id查询测量日期，学生跳远距离，班级男生平均跳远距离，班级女生平均跳远距离
studentRouter.post('/get-long-jump-by-id', require('../router_handler/studentRouterHandlers').getLongJumpById)

// 根据学生id查询测量日期，学生坐位体前屈距离，班级男生平均坐位体前屈距离，班级女生平均坐位体前屈距离
studentRouter.post('/get-sit-and-reaches-by-id', require('../router_handler/studentRouterHandlers').getSitAndReachesById)

// 根据学生id查询测量日期，学生跳绳个数，班级男生平均跳绳个数，班级女生平均跳绳个数
studentRouter.post('/get-rope-skipping-by-id', require('../router_handler/studentRouterHandlers').getRopeSkippingById)

// 根据学生id查询测量日期，学生实心球投掷距离，班级男生平均实心球投掷距离，班级女生平均实心球投掷距离
studentRouter.post('/get-solid-ball-by-id', require('../router_handler/studentRouterHandlers').getSolidBallById)

// 根据学生id查询测量日期，学生100米游泳耗时，班级男生平均100米游泳耗时，班级女生平均100米游泳耗时
studentRouter.post('/get-swimming-by-id', require('../router_handler/studentRouterHandlers').getSwimmingById)

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
