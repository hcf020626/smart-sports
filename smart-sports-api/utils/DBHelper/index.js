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

// 导出数据库连接池
module.exports = pool