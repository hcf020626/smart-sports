import http from '@/utils/request.js'

export function getStudentsByIdcard(idcard){
	return http.request({
		method: 'POST',
		url: '/student/get-students-by-idcard',
		data: {
			idcard
		},
		custom: {auth: true}
	})
}

export function getWeightById(id){
	return http.request({
		method: 'POST',
		url: '/student/get-weight-by-id',
		data: {
			id
		},
		custom: {auth: true}
	})
}

export function getHeightById(id){
	return http.request({
		method: 'POST',
		url: '/student/get-height-by-id',
		data: {
			id
		},
		custom: {auth: true}
	})
}

export function getVisionById(id){
	return http.request({
		method: 'POST',
		url: '/student/get-vision-by-id',
		data: {
			id
		},
		custom: {auth: true}
	})
}

export function getBloodPressureById(id){
	return http.request({
		method: 'POST',
		url: '/student/get-blood-pressure-by-id',
		data: {
			id
		},
		custom: {auth: true}
	})
}

export function getLungCapacityById(id){
	return http.request({
		method: 'POST',
		url: '/student/get-lung-capacity-by-id',
		data: {
			id
		},
		custom: {auth: true}
	})
}

export function getPushUpsById(id){
	return http.request({
		method: 'POST',
		url: '/student/get-push-ups-by-id',
		data: {
			id
		},
		custom: {auth: true}
	})
}

export function getSitUpsById(id){
	return http.request({
		method: 'POST',
		url: '/student/get-sit-ups-by-id',
		data: {
			id
		},
		custom: {auth: true}
	})
}

export function getPullUpsById(id){
	return http.request({
		method: 'POST',
		url: '/student/get-pull-ups-by-id',
		data: {
			id
		},
		custom: {auth: true}
	})
}

export function getLongJumpById(id){
	return http.request({
		method: 'POST',
		url: '/student/get-long-jump-by-id',
		data: {
			id
		},
		custom: {auth: true}
	})
}

export function getSitAndReachesById(id){
	return http.request({
		method: 'POST',
		url: '/student/get-sit-and-reaches-by-id',
		data: {
			id
		},
		custom: {auth: true}
	})
}

export function getRopeSkippingById(id){
	return http.request({
		method: 'POST',
		url: '/student/get-rope-skipping-by-id',
		data: {
			id
		},
		custom: {auth: true}
	})
}

export function getSolidBallById(id){
	return http.request({
		method: 'POST',
		url: '/student/get-solid-ball-by-id',
		data: {
			id
		},
		custom: {auth: true}
	})
}

export function getSwimmingById(id){
	return http.request({
		method: 'POST',
		url: '/student/get-swimming-by-id',
		data: {
			id
		},
		custom: {auth: true}
	})
}