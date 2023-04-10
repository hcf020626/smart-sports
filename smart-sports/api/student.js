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