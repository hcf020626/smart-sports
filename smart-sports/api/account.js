import http from '@/utils/request.js'

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

export function updatePassword({email, oldPassword, newPassword, captcha, token}){
	return http.request({
		method: 'POST',
		url: '/account/updatePassword',
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