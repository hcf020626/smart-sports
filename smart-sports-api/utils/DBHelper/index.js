// 导入 mysql 模块
const mysql = require('mysql');
require('dotenv').config(); // 加载 .env 文件中的环境变量

// 创建数据库连接池
const pool = mysql.createPool({
	connectionLimit: 10, // 连接池的最大连接数量
	host: process.env.DB_HOST, // 数据库主机地址
	user: process.env.DB_USER, // 数据库用户名
	password: process.env.DB_PASSWORD, // 数据库密码
	database: process.env.DB_DATABASE, // 数据库名
	multipleStatements: true, // 开启执行多条查询的功能
});

module.exports = {
	/**
	 * 执行 SQL 语句的工具函数
	 * @param {string} sql - SQL 语句
	 * @param {array} params - SQL 语句的参数
	 * @returns {Promise} - 返回 Promise 对象，解析结果为执行 SQL 语句后返回的结果
	 */
	exec(sql, params = []) {
		return new Promise((resolve, reject) => {
			pool.getConnection(function(err, conn) { // 获取连接
				if (err) { // 连接出错
					console.log("连接数据库失败:" + err.message);
					reject(err.message)
				}
				conn.query(sql, params, (err, results) => { // 执行 SQL 语句
					if (err) { // 执行 SQL 语句出错
						console.log("执行sql语句失败:" + err.message);
						reject(err.message)
					}
					resolve(results); // 返回执行结果
					//释放连接
					conn.release();
				})
			})
		})
	}
}
