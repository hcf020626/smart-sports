import http from '@/utils/request.js'

export function getStudentsBasicInfo({email}){
	return http.request({
		method: 'POST',
		url: '/student/getStudentsBasicInfo',
		data: {
			email
		},
		custom: {auth: true}
	})
}
