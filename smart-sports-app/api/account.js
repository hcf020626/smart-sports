import http from '@/utils/request.js'

const login = ({username, password})=>{
	return http.request({
		method: 'POST',
		url: '/account/login',
		data: {
			username,
			password
		},
		//可以加一些自定义参数，在拦截器等地方使用。比如这里我加了一个auth，可在拦截器里拿到，如果true就传token
		custom: {auth: false}
	})
}

const reg = ({username, password})=>{
	return http.request({
		method: 'POST',
		url: '/account/reg',
		data: {
			username,
			password
		},
		//可以加一些自定义参数，在拦截器等地方使用。比如这里我加了一个auth，可在拦截器里拿到，如果true就传token
		custom: {auth: false}
	})
}

export {
	login,
	reg
}