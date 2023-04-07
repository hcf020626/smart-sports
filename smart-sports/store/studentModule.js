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
		updateWeightData(context, value){
			context.commit('UPDATE_WEIGHT_DATE', value)
		}
	},
	mutations: {
		UPDATE_STUDENT_INFO(state, studentInfo){
			state.studentInfo = studentInfo
			uni.setStorageSync('studentInfo', JSON.stringify(state.studentInfo));
			console.log("in studentModule state.studentInfo: ",state.studentInfo);
		},
		CLEAR_STUDENT_INFO(state){
			state.studentInfo = {};
			uni.clearStorageSync();
		},
		UPDATE_WEIGHT_DATE(state, weightData){
			state.weightData = weightData;
			uni.setStorageSync('weightData', JSON.stringify(state.weightData));
		}
	},
	state: {
		studentInfo: JSON.parse(uni.getStorageSync('studentInfo') || '{}'),
		// 测量日期，学生体重，班级男生平均体重，班级女生平均体重
		weightData: JSON.parse(uni.getStorageSync('weightData') || '[]')
	}
}