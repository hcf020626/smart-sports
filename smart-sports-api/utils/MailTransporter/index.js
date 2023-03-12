// 导入nodemailer。nodemailer 是一个 Node.js 的邮件发送模块，用于发送邮件；
const nodemailer = require('nodemailer')
// 将 .env 文件中配置的环境变量加载到 process.env 中
require('dotenv').config()

exports.generateVerificationCode = () => {
  const min = 100000;
  const max = 999999;
  const verificationCode = Math.floor(Math.random() * (max - min + 1)) + min;
  return verificationCode;
}

exports.transporter = nodemailer.createTransport({
  service: 'QQ',
  port: 465,
  secure: true,
  auth: {
    user: process.env.QQ_EMAIL,
    pass: process.env.QQ_PASS
  }
})