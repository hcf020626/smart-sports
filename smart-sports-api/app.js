// 导入 express 模块
const express = require('express')
// 创建 express 的服务器实例
const app = express()
// 引入ws库
const WebSocket = require('ws');

// 导入解决跨域资源共享（Cross Origin Resource Sharing，简称 cors）的中间件
const cors = require('cors')
// 将 cors 注册为全局中间件
app.use(cors())

// 使用 express.static() 向外开放uploads/avatars文件下的头像图片
app.use('/parents/avatars', express.static('uploads/avatars/parents'))
app.use('/students/avatars', express.static('uploads/avatars/students'))
app.use('/account', express.static('pages'))

// 使用中间件记录请求的方法和路径
app.use((req, resp, next) => {
	console.log(req.method, req.path);
	next()
})

// 使用express.urlencoded() 中间件，处理 application/json 格式的请求体。使用该中间件后，解析后的数据会被放置在 req.body 对象中。
app.use(express.urlencoded({
	extended: false
}))
// 使用express.json() 中间件处理 application/x-www-form-urlencoded 格式的请求体。使用该中间件后，解析后的数据会被放置在 req.body 对象中。
app.use(express.json());



// 导入自定义的身份验证中间件
const {
	auth
} = require('./utils/auth')
// 将自定义的身份验证中间件注册为全局中间件
app.use(auth(['/parent/login', '/parent/reg', '/parent/send-code', '/parent/verify-code', '/parent/forget']))


// 导入并注册家长路由模块
app.use('/parent', require('./router/parentRouter'))
//导入并注册学生路由模块
app.use('/student', require('./router/studentRouter'))
/*
	wss 是 WebSocket.Server 类的实例，所以可以使用 WebSocket.Server 类的方法。以下是一些常用的 WebSocket.Server 方法：

    wss.on('connection', callback)：监听新的 WebSocket 连接，当客户端连接上来时会触发 callback 函数。
    wss.clients：获取当前所有连接的 WebSocket 客户端的集合。
    wss.broadcast(data)：将 data 数据发送给所有连接的 WebSocket 客户端。
    wss.close([callback])：关闭 WebSocket 服务器。
    wss.clients.forEach(callback)：遍历当前所有连接的 WebSocket 客户端，并执行 callback 函数。

	这些方法可以帮助开发者完成 WebSocket 服务器的基本操作，如处理连接、消息、广播、关闭等。
 */
// 调用 app.listen 方法，指定端口号并启动web服务器
const server = app.listen(3000, function() {
	console.log(`smart-sports-api server running at http://127.0.0.1:${3000}`)
})

const wss = new WebSocket.Server({
	server
}); // 创建WebSocket服务器

const messageQueue = {}; // 储存未发送的消息的哈希表
const connections = {}; // 存储WebSocket连接的哈希表

wss.on('connection', (ws) => { // 监听WebSocket连接事件
	console.log('WebSocket connection opened.');

	ws.on('message', (message) => { // 监听WebSocket消息事件
		console.log(`Received message: ${message}`);
		const msgObj = JSON.parse(message); // 将接收到的消息解析为对象
		console.log(msgObj);
		const userId = msgObj.content.userId; // 获取用户id
		if (msgObj.type === 'init') { // 如果收到的消息类型是初始化
			connections[userId] = ws; // 将WebSocket连接与用户id关联起来
			if (messageQueue[userId]) { // 如果有未发送的消息，则将其发送
				messageQueue[userId].forEach(msg => {
					ws.send(JSON.stringify(msg)); // 将消息序列化后发送给客户端
				});
				delete messageQueue[userId]; // 从哈希表中删除消息
			}
		} else if (msgObj.type === 'add friend') { // 如果收到的消息类型是添加好友
			const friendId = msgObj.content.friendId; // 获取好友id
			const friendWs = connections[friendId];
			if (friendWs) { // 如果好友当前在线，则将消息发送给好友
				friendWs.send(JSON.stringify(msgObj));
			} else { // 如果好友当前不在线，则将消息存储在哈希表中
				if (!messageQueue[friendId]) {
					messageQueue[friendId] = [];
				}
				messageQueue[friendId].push(msgObj);
			}
		}
	});
	
	const helloMsgObj = {
		type: 'init',
		content: 'WebSocket connection established.'
	}
	ws.send(JSON.stringify(helloMsgObj)); // 发送欢迎消息

	ws.on('close', () => { // 监听WebSocket关闭事件
		console.log('WebSocket connection closed.');
		Object.keys(connections).forEach((userId) => {
			if (connections[userId] === ws) {
				delete connections[userId]; // 从哈希表中删除用户的WebSocket连接
			}
		});
	});
});

/*
	ws 是 WebSocket 对象的一个实例，它具有以下常用的方法：
	
	(1) ws.send(data)：向客户端发送数据，data 可以是字符串、Buffer 对象、TypedArray 或 DataView。
		例如：
		ws.send('Hello, client!'); // 发送字符串数据
		ws.send(Buffer.from([0x68, 0x65, 0x6c, 0x6c, 0x6f])); // 发送二进制数据
	
	(2)ws.close([code[, reason]])：关闭连接，code 和 reason 是可选参数，分别表示关闭的状态码和原因。
		例如：
		ws.close(1000, 'Goodbye!'); // 关闭连接，状态码为 1000，原因为 'Goodbye!'
	
	(3)ws.ping([data[, mask[, cb]]])：发送 ping 消息，data 是可选参数，表示发送的数据，mask 表示是否掩码处理，cb 表示发送成功的回调函数。
		例如：
		ws.ping('Are you there?', true, () => {
		  console.log('Ping sent successfully!');
		});
	
	(4)ws.pong([data[, mask]])：发送 pong 消息，data 是可选参数，表示发送的数据，mask 表示是否掩码处理。
		例如：
		ws.pong('Yes, I am here!', true);
	
	(5)ws.readyState：表示 WebSocket 的当前状态，可能的值有：
	    WebSocket.CONNECTING：表示正在连接。
	    WebSocket.OPEN：表示已经连接并可以通信。
	    WebSocket.CLOSING：表示正在关闭。
	    WebSocket.CLOSED：表示已经关闭。
		例如：
		if (ws.readyState === WebSocket.OPEN) {
		  // WebSocket 已经连接并可以通信
		  ws.send('Hello, client!');
		}
	
	(6)ws.on(event, listener) 方法用于注册一个事件的监听器，当该事件被触发时，回调函数 listener 将被执行。其中，event 为字符串类型，表示需要监听的事件名称，常用的事件包括：
	    'open'：WebSocket 连接打开时触发；
	    'message'：收到 WebSocket 消息时触发；
	    'close'：WebSocket 连接关闭时触发；
	    'error'：WebSocket 连接出错时触发。
		例如，在上面的代码中，ws.on('message', (message) => {...}) 就是注册了一个 'message' 事件的监听器，用于在接收到 WebSocket 消息时输出消息内容。另外，ws.on('close', () => {...}) 则是注册了一个 'close' 事件的监听器，用于在 WebSocket 连接关闭时输出提示信息。
		需要注意的是，ws.on() 方法返回的是 WebSocket 实例对象本身，因此可以链式调用多个 ws.on() 方法来注册多个事件的监听器，例如：
		ws.on('open', () => {
			console.log('WebSocket connection opened.');
		})
		.on('message', (message) => {
			console.log(`Received message: ${message}`);
		})
		.on('close', () => {
			console.log('WebSocket connection closed.');
		})
		.on('error', (error) => {
			console.log(`WebSocket error: ${error.message}`);
		});
		这段代码就同时注册了 'open'、'message'、'close' 和 'error' 四个事件的监听器。
*/
