import http from '@/utils/request.js'

// 用户登录
export function login ({email, password}){
	return http.request({
		method: 'POST',
		url: '/account/login',
		data: {
			email,
			password
		},
		//可以加一些自定义参数，在拦截器等地方使用。比如这里我加了一个auth，可在拦截器里拿到，如果true就传token
		custom: {auth: false}
	})
}

// 用户注册
export function reg ({email, password, code, token}){
	return http.request({
		method: 'POST',
		url: '/account/reg',
		data: {
			email,
			password,
			code,
			token
		},
		//可以加一些自定义参数，在拦截器等地方使用。比如这里我加了一个auth，可在拦截器里拿到，如果true就传token
		custom: {auth: false}
	})
}

// 发送邮箱验证码
export function sendCode(email){
	return http.request({
		method: 'POST',
		url: '/account/send-verification-code',
		data: {
			email
		},
		//可以加一些自定义参数，在拦截器等地方使用。比如这里我加了一个auth，可在拦截器里拿到，如果true就传token
		custom: {auth: false}
	})
}

// 保存用户信息
export function saveUserInfo({avatar_url, email, realname, gender, phone, idcard}){
	return http.upload('/account/save-user-info', {
		filePath: avatar_url,	// 要上传文件资源的路径。
		name: 'avatar',	// 文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
		formData: {
			email,
			realname,
			gender,
			phone,
			idcard
		},
		custom: {auth: true}
	})
}


// 修改密码
export function updatePassword({email, oldPassword, newPassword, captcha, token}){
	return http.request({
		method: 'POST',
		url: '/account/update-password',
		data: {
			email,
			oldPassword,
			newPassword,
			captcha,
			token
		},
		custom: {auth: true}
	})
}

// 换绑
export function changeBonding({email, id}){
	return http.request({
		method: 'POST',
		url: '/account/change-bonding',
		data: {
			email,
			id
		},
		custom: {auth: true}
	})
}