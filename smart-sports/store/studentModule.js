import {baseURL} from '../config.js'
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
		},
		clearWeightData(context, value){
			context.commit('CLEAR_WEIGHT_DATE', value)
		},
		updateHeightData(context, value){
			context.commit('UPDATE_HEIGHT_DATE', value)
		},
		clearHeightData(context, value){
			context.commit('CLEAR_HEIGHT_DATE', value)
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
			state.weightData = [];
			uni.removeStorageSync('studentInfo');
			uni.removeStorageSync('weightData')
		},
		UPDATE_WEIGHT_DATE(state, weightData){
			state.weightData = weightData;
			uni.setStorageSync('weightData', JSON.stringify(state.weightData));
		},
		CLEAR_WEIGHT_DATE(state){
			state.weightData = [];
			uni.removeStorageSync('weightData')
		},
		UPDATE_HEIGHT_DATE(state, heightData){
			state.heightData = heightData;
			uni.setStorageSync('heightData', JSON.stringify(state.heightData));
		},
		CLEAR_HEIGHT_DATE(state){
			state.heightData = [];
			uni.removeStorageSync('heightData')
		},
	},
	getters: {
		full_avatar_url(state){
			return baseURL + state.studentInfo.avatar_url
		}
	},
	state: {
		studentInfo: JSON.parse(uni.getStorageSync('studentInfo') || '{}'),
		// 测量日期，学生体重，班级男生平均体重，班级女生平均体重
		weightData: JSON.parse(uni.getStorageSync('weightData') || '[]'),
		heightData: JSON.parse(uni.getStorageSync('heightData') || '[]'),
	}
}