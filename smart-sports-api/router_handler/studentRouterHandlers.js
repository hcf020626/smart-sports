// 导入自己封装好的数据库工具
const db = require('../utils/DBHelper')

exports.getStudentsByIdcard = async (req, resp, next) => {
	// 接收表单数据
	const {idcard} = req.body;
	try{
		const sql = 'select * from t_students where p_idcard=?';
		const results = await db.exec(sql, [idcard]);
		
		if(results.length === 0){
			return resp.json({
				status: 1,
				data: [],
				msg: '当前不存在与您身份相匹配的学生信息，请确认您的身份证号码是否填写正确，如果确认无误，请联系学校相关工作人员'
			})
		}
		
		resp.json({
			status: 1,
			msg: '查询成功',
			data: results
		})
	}catch(e){
		//TODO handle the exception
		console.log("e: ", e);
		resp.json({
			status: 1,
			msg: '服务器出现错误，登录失败'
		})
	}
}