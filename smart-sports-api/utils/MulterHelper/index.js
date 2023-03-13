// multer 是一个 Node.js 中间件，用于处理 multipart/form-data 类型的请求体，主要用于处理文件上传。
const multer = require('multer');
const path = require('path');

// 创建一个存储上传文件的对象
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // 设置上传文件的存储路径
        cb(null, 'uploads/avatars');
    },
    filename: (req, file, cb) => {
        // 设置上传文件的文件名
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// 创建一个 multer 实例，使用上面创建的存储对象
const upload = multer({ storage: storage });

module.exports = upload