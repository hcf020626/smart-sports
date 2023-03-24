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
