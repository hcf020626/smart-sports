import http from '@/utils/request.js'

// 家长登录
export function login({
	email,
	password
}) {
	return http.request({
		method: 'POST',
		url: '/parent/login',
		data: {
			email,
			password
		},
		//可以加一些自定义参数，在拦截器等地方使用。比如这里我加了一个auth，可在拦截器里拿到，如果true就传token
		custom: {
			auth: false
		}
	})
}

// 家长注册
export function reg({
	email,
	password,
	code,
	token
}) {
	return http.request({
		method: 'POST',
		url: '/parent/reg',
		data: {
			email,
			password,
			code,
			token
		},
		//可以加一些自定义参数，在拦截器等地方使用。比如这里我加了一个auth，可在拦截器里拿到，如果true就传token
		custom: {
			auth: false
		}
	})
}

// 家长忘记密码
export function forget({
	email,
	password,
	code,
	token
}) {
	return http.request({
		method: 'POST',
		url: '/parent/forget',
		data: {
			email,
			password,
			code,
			token
		},
		//可以加一些自定义参数，在拦截器等地方使用。比如这里我加了一个auth，可在拦截器里拿到，如果true就传token
		custom: {
			auth: false
		}
	})
}

// 发送邮箱验证码
export function sendCode(email) {
	return http.request({
		method: 'POST',
		url: '/parent/send-code',
		data: {
			email
		},
		//可以加一些自定义参数，在拦截器等地方使用。比如这里我加了一个auth，可在拦截器里拿到，如果true就传token
		custom: {
			auth: false
		}
	})
}

// 保存家长信息
export function saveParentInfo({
	email,
	realname,
	gender,
	idcard,
	phone,
	avatar_url,
	cur_bonding_id
}) {
	return http.upload('/parent/save-parent-info', {
		filePath: avatar_url, // 要上传文件资源的路径。
		name: 'avatar', // 文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
		formData: {
			email,
			realname,
			gender,
			phone,
			idcard,
			cur_bonding_id
		},
		custom: {
			auth: true
		}
	})
}


// 修改密码
export function updatePassword({
	email,
	oldPassword,
	newPassword
}) {
	return http.request({
		method: 'POST',
		url: '/parent/update-password',
		data: {
			email,
			oldPassword,
			newPassword,
		},
		custom: {
			auth: true
		}
	})
}

// 换绑
export function changeBonding({
	email,
	id
}) {
	return http.request({
		method: 'POST',
		url: '/parent/change-bonding',
		data: {
			email,
			id
		},
		custom: {
			auth: true
		}
	})
}

export function getUserListByKeyword(keyword) {
	return http.request({
		method: 'POST',
		url: '/parent/get-userlist-by-keyword',
		data: {
			keyword
		},
		custom: {
			auth: true
		}
	})
}

export function createFriendship({
	parent_id,
	friend_id
}) {
	return http.request({
		method: 'POST',
		url: '/parent/create-friendship',
		data: {
			parent_id,
			friend_id
		},
		custom: {
			auth: true
		}
	})
}

export function deleteFriendship({
	parent_id,
	friend_id
}) {
	return http.request({
		method: 'POST',
		url: '/parent/delete-friendship',
		data: {
			parent_id,
			friend_id
		},
		custom: {
			auth: true
		}
	})
}

// 获取最新的家长和对应的学生信息
export function getTheLatestInfo(email) {
	return http.request({
		method: 'POST',
		url: '/parent/get-the-latest-info',
		data: {
			email
		},
		custom: {
			auth: true
		}
	})
}

export function getFriendListById(id) {
	return http.request({
		method: 'POST',
		url: '/parent/get-friend-list-by-id',
		data: {
			id
		},
		custom: {
			auth: true
		}
	})
}

export function getParticularStepsRating(parentIds, date) {
	return http.request({
		method: 'POST',
		url: '/parent/get-particular-steps-rating',
		data: {
			parentIds,
			date
		},
		custom: {
			auth: true
		}
	})
}

export function getParticularSteps(id, date) {
	return http.request({
		method: 'POST',
		url: '/parent/get-particular-steps',
		data: {
			id,
			date
		},
		custom: {
			auth: true
		}
	})
}

export function updateSteps({
	parent_id,
	measurement_date,
	walking_steps,
	running_steps
}) {
	return http.request({
		method: 'POST',
		url: '/parent/update-steps',
		data: {
			parent_id,
			measurement_date,
			walking_steps,
			running_steps
		},
		custom: {
			auth: true
		}
	})
}

export function updateParticularLike(parent_id, likes, measurement_date) {
	return http.request({
		method: 'POST',
		url: '/parent/update-particular-like',
		data: {
			parent_id,
			likes,
			measurement_date
		},
		custom: {
			auth: true
		}
	})
}