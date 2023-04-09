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

		const weightMap = results[0].reduce((map, row) => {
			const date = new Date(row.measurement_date).toISOString().slice(0, 10);
			map[date] = row.height;
			return map;
		}, {});

		const maleAvgWeightMap = results[1].reduce((map, row) => {
			const date = new Date(row.measurement_date).toISOString().slice(0, 10);
			map[date] = row.male_avg_height;
			return map;
		}, {});

		const femaleAvgWeightMap = results[2].reduce((map, row) => {
			const date = new Date(row.measurement_date).toISOString().slice(0, 10);
			map[date] = row.female_avg_height;
			return map;
		}, {});

		const dates = Object.keys(weightMap);
		const result = dates.map(date => ({
			date,
			height: weightMap[date],
			maleAvgHeight: maleAvgWeightMap[date] ? maleAvgWeightMap[date] : null,
			femaleAvgHeight: femaleAvgWeightMap[date] ? femaleAvgWeightMap[date] : null
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
