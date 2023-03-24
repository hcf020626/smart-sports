// 导入数据库连接池
const pool = require('../utils/DBHelper')

exports.getStudentsByIdcard = (req, resp, next) => {
	// 接收表单数据
	const {idcard} = req.body;
	
	const sql = 'select * from t_students where p_idcard=?';
	pool.query(sql, [idcard], (err, results, fields)=>{
		//执行 sql 语句失败
		if (err) {
			return resp.json({
				status: 1,
				msg: err.message
			})
		}
		
		resp.json({
			status: 1,
			msg: '查询成功',
			data: results
		})
	})
}