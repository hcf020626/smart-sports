// 导入自己封装好的数据库工具
const db = require('../utils/DBHelper')

exports.getStudentsByIdcard = async (req, resp, next) => {
	// 接收表单数据
	const {
		idcard
	} = req.body;
	try {
		const sql = 'select * from t_students where p_idcard=?';
		const results = await db.exec(sql, [idcard]);

		if (results.length === 0) {
			return resp.json({
				status: 1,
				students: [],
				msg: '当前不存在与您身份相匹配的学生信息，请确认您的身份证号码是否填写正确，如果确认无误，请联系学校相关工作人员'
			})
		}

		resp.json({
			status: 0,
			msg: '查询成功',
			students: results
		})
	} catch (e) {
		//TODO handle the exception
		console.log("e: ", e);
		resp.json({
			status: 1,
			msg: '服务器出现错误，查找学生信息失败'
		})
	}
}

exports.getWeightById = async (req, resp, next) => {
	const {
		id
	} = req.body;

	console.log("id: ", id);

	try {

		const sql = `
			SELECT measurement_date, weight, height FROM t_students_body_metrics WHERE student_id=?;
			
			SELECT measurement_date, ROUND(AVG(weight), 2) AS male_avg_weight
			FROM t_students_body_metrics
			WHERE student_id IN (
			  SELECT id
			  FROM t_students
			  WHERE class = (
			    SELECT class
			    FROM t_students
			    WHERE id = ?
			  )
			  AND gender = '男'
			)
			GROUP BY measurement_date;
			
			
			SELECT measurement_date, ROUND(AVG(weight), 2) AS female_avg_weight
			FROM t_students_body_metrics
			WHERE student_id IN (
			  SELECT id
			  FROM t_students
			  WHERE class = (
			    SELECT class
			    FROM t_students
			    WHERE id = ?
			  )
			  AND gender = '女'
			)
			GROUP BY measurement_date;
		`;
		const results = await db.exec(sql, [id, id, id]);


		if (results.length !== 3) {
			return resp.json({
				status: 1,
				msg: '查询结果存在异常，查询失败'
			})
		}
		for (let i = 0; i < results.length; i++) {
			results[i].forEach(row => {
				row.measurement_date.setDate(row.measurement_date.getDate() + 1);
			});
		}

		const weightMap = results[0].reduce((map, row) => {
			const date = new Date(row.measurement_date).toISOString().slice(0, 10);
			map[date] = {
				weight: row.weight,
				height: row.height
			};
			return map;
		}, {});

		const maleAvgWeightMap = results[1].reduce((map, row) => {
			const date = new Date(row.measurement_date).toISOString().slice(0, 10);
			map[date] = row.male_avg_weight;
			return map;
		}, {});

		const femaleAvgWeightMap = results[2].reduce((map, row) => {
			const date = new Date(row.measurement_date).toISOString().slice(0, 10);
			map[date] = row.female_avg_weight;
			return map;
		}, {});

		const dates = Object.keys(weightMap);
		const result = dates.map(date => ({
			date,
			weight: weightMap[date].weight,
			height: weightMap[date].height,
			maleAvgWeight: maleAvgWeightMap[date] ? maleAvgWeightMap[date] : null,
			femaleAvgWeight: femaleAvgWeightMap[date] ? femaleAvgWeightMap[date] : null
		}));

		resp.json({
			status: 0,
			msg: '查询成功',
			weightData: result,
		})
	} catch (e) {
		//TODO handle the exception
		console.log("e: ", e);
		resp.json({
			status: 1,
			msg: '服务器出现错误，查找学生信息失败'
		})
	}
}

exports.getHeightById = async (req, resp, next) => {
	const {
		id
	} = req.body;

	console.log("id: ", id);

	try {

		const sql = `
			SELECT measurement_date, height FROM t_students_body_metrics WHERE student_id=?;
			
			SELECT measurement_date, ROUND(AVG(height), 2) AS male_avg_height
			FROM t_students_body_metrics
			WHERE student_id IN (
			  SELECT id
			  FROM t_students
			  WHERE class = (
			    SELECT class
			    FROM t_students
			    WHERE id = ?
			  )
			  AND gender = '男'
			)
			GROUP BY measurement_date;
			
			
			SELECT measurement_date, ROUND(AVG(height), 2) AS female_avg_height
			FROM t_students_body_metrics
			WHERE student_id IN (
			  SELECT id
			  FROM t_students
			  WHERE class = (
			    SELECT class
			    FROM t_students
			    WHERE id = ?
			  )
			  AND gender = '女'
			)
			GROUP BY measurement_date;
		`;
		const results = await db.exec(sql, [id, id, id]);


		if (results.length !== 3) {
			return resp.json({
				status: 1,
				msg: '查询结果存在异常，查询失败'
			})
		}
		for (let i = 0; i < results.length; i++) {
			results[i].forEach(row => {
				row.measurement_date.setDate(row.measurement_date.getDate() + 1);
			});
		}

		const heightMap = results[0].reduce((map, row) => {
			const date = new Date(row.measurement_date).toISOString().slice(0, 10);
			map[date] = row.height;
			return map;
		}, {});

		const maleAvgHeightMap = results[1].reduce((map, row) => {
			const date = new Date(row.measurement_date).toISOString().slice(0, 10);
			map[date] = row.male_avg_height;
			return map;
		}, {});

		const femaleAvgHeightMap = results[2].reduce((map, row) => {
			const date = new Date(row.measurement_date).toISOString().slice(0, 10);
			map[date] = row.female_avg_height;
			return map;
		}, {});

		const dates = Object.keys(heightMap);
		const result = dates.map(date => ({
			date,
			height: heightMap[date],
			maleAvgHeight: maleAvgHeightMap[date] ? maleAvgHeightMap[date] : null,
			femaleAvgHeight: femaleAvgHeightMap[date] ? femaleAvgHeightMap[date] : null
		}));

		resp.json({
			status: 0,
			msg: '查询成功',
			heightData: result,
		})
	} catch (e) {
		//TODO handle the exception
		console.log("e: ", e);
		resp.json({
			status: 1,
			msg: '服务器出现错误，查找学生信息失败'
		})
	}
}

exports.getVisionById = async (req, resp, next) => {
	const {
		id
	} = req.body;

	console.log("id: ", id);

	try {

		const sql = `
			SELECT measurement_date, left_vision, right_vision FROM t_students_body_metrics WHERE student_id=?;
			
			SELECT measurement_date, ROUND(AVG(left_vision), 1) AS avg_left_vision, ROUND(AVG(right_vision), 1) AS avg_right_vision
			FROM t_students_body_metrics
			WHERE student_id IN (
			  SELECT id
			  FROM t_students
			  WHERE class = (
			    SELECT class
			    FROM t_students
			    WHERE id = ?
			  )
			)
			GROUP BY measurement_date;
		`;
		const results = await db.exec(sql, [id, id, id]);


		if (results.length !== 2) {
			return resp.json({
				status: 1,
				msg: '查询结果存在异常，查询失败'
			})
		}

		console.log(results);
		for (let i = 0; i < results.length; i++) {
			results[i].forEach(row => {
				row.measurement_date.setDate(row.measurement_date.getDate() + 1);
			});
		}

		const visionMap = results[0].reduce((map, row) => {
			const date = new Date(row.measurement_date).toISOString().slice(0, 10);
			map[date] = {
				leftVision: row.left_vision,
				rightVision: row.right_vision
			};
			return map;
		}, {});

		const avgVisionMap = results[1].reduce((map, row) => {
			const date = new Date(row.measurement_date).toISOString().slice(0, 10);
			map[date] = {
				avgLeftVision: row.avg_left_vision,
				avgRightVision: row.avg_right_vision
			};
			return map;
		}, {});

		const dates = Object.keys(visionMap);
		const result = dates.map(date => ({
			date,
			leftVision: visionMap[date].leftVision,
			rightVision: visionMap[date].rightVision,
			avgLeftVision: avgVisionMap[date] ? avgVisionMap[date].avgLeftVision : null,
			avgRightVision: avgVisionMap[date] ? avgVisionMap[date].avgRightVision : null
		}));

		resp.json({
			status: 0,
			msg: '查询成功',
			visionData: result,
		})
	} catch (e) {
		//TODO handle the exception
		console.log("e: ", e);
		resp.json({
			status: 1,
			msg: '服务器出现错误，查找学生信息失败'
		})
	}
}

exports.getBloodPressureById = async (req, resp, next) => {
	const {
		id
	} = req.body;

	console.log("id: ", id);

	try {

		const sql = `
			SELECT measurement_date, blood_pressure FROM t_students_body_metrics WHERE student_id=?;
		`;

		const results = await db.exec(sql, [id, id, id]);

		results.forEach(row => {
			row.measurement_date.setDate(row.measurement_date.getDate() + 1);
		});

		const processedResults = results.map(result => {
			// 使用了解构赋值将结果对象中的measurement_date和blood_pressure属性提取出来。
			const {
				measurement_date,
				blood_pressure
			} = result;
			// 使用split('/')方法将blood_pressure属性按照'/'分割成两个部分，SBP和DBP。
			const [SBP, DBP] = blood_pressure.split('/');
			return {
				// toISOString()方法返回一个ISO格式的日期字符串，我们使用slice()方法将其切割成只有日期部分的形式。
				date: measurement_date.toISOString().slice(0, 10),
				// 然后使用Number()方法将其转换为数字类型
				SBP: Number(SBP),
				DBP: Number(DBP),
			}
		});

		console.log(processedResults);


		resp.json({
			status: 0,
			msg: '查询成功',
			bloodPressureData: processedResults,
		})
	} catch (e) {
		//TODO handle the exception
		console.log("e: ", e);
		resp.json({
			status: 1,
			msg: '服务器出现错误，查找学生信息失败'
		})
	}
}

exports.getLungCapacityById = async (req, resp, next) => {
	const {
		id
	} = req.body;

	console.log("id: ", id);

	try {

		const sql = `
			SELECT measurement_date, lung_capacity FROM t_students_body_metrics WHERE student_id=?;
			
			SELECT measurement_date, ROUND(AVG(lung_capacity), 2) AS male_avg_lung_capacity
			FROM t_students_body_metrics
			WHERE student_id IN (
			  SELECT id
			  FROM t_students
			  WHERE class = (
			    SELECT class
			    FROM t_students
			    WHERE id = ?
			  )
			  AND gender = '男'
			)
			GROUP BY measurement_date;
			
			
			SELECT measurement_date, ROUND(AVG(lung_capacity), 2) AS female_avg_lung_capacity
			FROM t_students_body_metrics
			WHERE student_id IN (
			  SELECT id
			  FROM t_students
			  WHERE class = (
			    SELECT class
			    FROM t_students
			    WHERE id = ?
			  )
			  AND gender = '女'
			)
			GROUP BY measurement_date;
		`;
		const results = await db.exec(sql, [id, id, id]);


		if (results.length !== 3) {
			return resp.json({
				status: 1,
				msg: '查询结果存在异常，查询失败'
			})
		}
		for (let i = 0; i < results.length; i++) {
			results[i].forEach(row => {
				row.measurement_date.setDate(row.measurement_date.getDate() + 1);
			});
		}

		const lungCapacityMap = results[0].reduce((map, row) => {
			const date = new Date(row.measurement_date).toISOString().slice(0, 10);
			map[date] = row.lung_capacity;
			return map;
		}, {});

		const maleAvgLungCapacityMap = results[1].reduce((map, row) => {
			const date = new Date(row.measurement_date).toISOString().slice(0, 10);
			map[date] = row.male_avg_lung_capacity;
			return map;
		}, {});

		const femaleAvgLungCapacityMap = results[2].reduce((map, row) => {
			const date = new Date(row.measurement_date).toISOString().slice(0, 10);
			map[date] = row.female_avg_lung_capacity;
			return map;
		}, {});

		const dates = Object.keys(lungCapacityMap);
		const result = dates.map(date => ({
			date,
			lungCapacity: lungCapacityMap[date],
			maleAvgLungCapacity: maleAvgLungCapacityMap[date] ? maleAvgLungCapacityMap[date] : null,
			femaleAvgLungCapacity: femaleAvgLungCapacityMap[date] ? femaleAvgLungCapacityMap[date] : null
		}));

		resp.json({
			status: 0,
			msg: '查询成功',
			lungCapacityData: result,
		})
	} catch (e) {
		//TODO handle the exception
		console.log("e: ", e);
		resp.json({
			status: 1,
			msg: '服务器出现错误，查找学生信息失败'
		})
	}
}

exports.getPushUpsById = async (req, resp, next) => {
	const {
		id
	} = req.body;

	console.log("id: ", id);

	try {

		const sql = `
			SELECT measurement_date, push_ups FROM t_students_performance WHERE student_id=?;
			
			SELECT measurement_date, ROUND(AVG(push_ups), 2) AS male_avg_push_ups
			FROM t_students_performance
			WHERE student_id IN (
			  SELECT id
			  FROM t_students
			  WHERE class = (
			    SELECT class
			    FROM t_students
			    WHERE id = ?
			  )
			  AND gender = '男'
			)
			GROUP BY measurement_date;
		`;
		const results = await db.exec(sql, [id, id, id]);

		if (results.length !== 2) {
			return resp.json({
				status: 1,
				msg: '查询结果存在异常，查询失败'
			})
		}
		for (let i = 0; i < results.length; i++) {
			results[i].forEach(row => {
				row.measurement_date.setDate(row.measurement_date.getDate() + 1);
			});
		}

		const pushUpsMap = results[0].reduce((map, row) => {
			const date = new Date(row.measurement_date).toISOString().slice(0, 10);
			map[date] = row.push_ups;
			return map;
		}, {});

		const maleAvgPushUpsMap = results[1].reduce((map, row) => {
			const date = new Date(row.measurement_date).toISOString().slice(0, 10);
			map[date] = row.male_avg_push_ups;
			return map;
		}, {});

		const dates = Object.keys(pushUpsMap);
		const result = dates.map(date => ({
			date,
			pushUps: pushUpsMap[date],
			maleAvgPushUps: maleAvgPushUpsMap[date] ? maleAvgPushUpsMap[date] : null,
		}));

		resp.json({
			status: 0,
			msg: '查询成功',
			pushUpsData: result,
		})
	} catch (e) {
		//TODO handle the exception
		console.log("e: ", e);
		resp.json({
			status: 1,
			msg: '服务器出现错误，查找学生信息失败'
		})
	}
}