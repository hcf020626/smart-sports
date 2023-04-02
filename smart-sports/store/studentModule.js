import Vue from 'vue'
export default {
	namespaced:true,//开启命名空间
	actions: {
		updateStudentInfo(context, value){
			context.commit('UPDATE_STUDENT_INFO', value)
		},
		clearStudentInfo(context, value){
			context.commit('CLEAR_STUDENT_INFO', value)
		},
	},
	mutations: {
		UPDATE_STUDENT_INFO(state, studentInfo){
			state.studentInfo = studentInfo
			uni.setStorageSync('studentInfo', JSON.stringify(state.studentInfo));
			console.log("in studentModule state.studentInfo: ",state.studentInfo);
		},
		CLEAR_STUDENT_INFO(state){
			state.studentInfo = {};
			console.log("state: ",state);
		}
	},
	state: {
		studentInfo: JSON.parse(uni.getStorageSync('studentInfo') || '{}')
	}
}