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