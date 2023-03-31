import Vue from 'vue'
export default {
	namespaced:true,//开启命名空间
	actions: {
		setStudentInfo(context, value){
			context.commit('SET_STUDENT_INFO', value)
		},
		clearStudentInfo(context, value){
			context.commit('CLEAR_STUDENT_INFO', value)
		},
	},
	mutations: {
		SET_STUDENT_INFO(state, studentInfo){
			state.studentInfo = studentInfo
			uni.setStorageSync('studentInfo', JSON.stringify(state.studentInfo));
		},
		CLEAR_STUDENT_INFO(state){
			state.studentInfo = {};
			uni.removeStorageSync('studentInfo')
		}
	},
	state: {
		studentInfo: JSON.parse(uni.getStorageSync('studentInfo') || '{}')
	}
}