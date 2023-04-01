// 导入 mysql 模块
const mysql = require('mysql');
require('dotenv').config();

// 创建数据库连接池
const pool  = mysql.createPool({
  connectionLimit : 10,
  host            : process.env.DB_HOST,
  user            : process.env.DB_USER,
  password        : process.env.DB_PASSWORD,
  database        : process.env.DB_DATABASE
});

module.exports = {
    exec(sql, params = []) {
        return new Promise((resolve, reject) => {
            pool.getConnection(function (err, conn) {
                if (err) {
                    console.log("连接数据库失败:" + err.message);
                    reject(err.message)
                }
                conn.query(sql, params, (err, results) => {
                    if (err) {
                        console.log("执行sql语句失败:" + err.message);
                        reject(err.message)
                    }
                    resolve(results);
                    //释放连接
                    conn.release();
                })

            })
        })
    }
}