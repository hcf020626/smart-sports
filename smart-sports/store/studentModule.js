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
		updateVisionData(context, value){
			context.commit('UPDATE_VISION_DATE', value)
		},
		clearVisionData(context, value){
			context.commit('CLEAR_VISION_DATE', value)
		},
		updateBloodPressureData(context, value){
			context.commit('UPDATE_BLOOD_PRESSURE_DATE', value)
		},
		clearBloodPressureData(context, value){
			context.commit('CLEAR_BLOOD_PRESSURE_DATE', value)
		},
		updateLungCapacityData(context, value){
			context.commit('UPDATE_LUNG_CAPACITY_DATE', value)
		},
		clearLungCapacityData(context, value){
			context.commit('CLEAR_LUNG_CAPACITY_DATE', value)
		},
		updatePushUpsData(context, value){
			context.commit('UPDATE_PUSH_UPS_DATE', value)
		},
		clearPushUpsData(context, value){
			context.commit('CLEAR_PUSH_UPS_DATE', value)
		},
		updateSitUpsData(context, value){
			context.commit('UPDATE_SIT_UPS_DATE', value)
		},
		clearSitUpsData(context, value){
			context.commit('CLEAR_SIT_UPS_DATE', value)
		},
		updatePullUpsData(context, value){
			context.commit('UPDATE_PULL_UPS_DATE', value)
		},
		clearPullUpsData(context, value){
			context.commit('CLEAR_PULL_UPS_DATE', value)
		},
		updateLongJumpData(context, value){
			context.commit('UPDATE_LONG_JUMP_DATE', value)
		},
		clearLongJumpData(context, value){
			context.commit('CLEAR_LONG_JUMP_DATE', value)
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
		UPDATE_VISION_DATE(state, visionData){
			state.visionData = visionData;
			uni.setStorageSync('visionData', JSON.stringify(state.visionData));
		},
		CLEAR_VISION_DATE(state){
			state.visionData = [];
			uni.removeStorageSync('visionData')
		},
		UPDATE_BLOOD_PRESSURE_DATE(state, bloodPressureData){
			state.bloodPressureData = bloodPressureData;
			uni.setStorageSync('bloodPressureData', JSON.stringify(state.bloodPressureData));
		},
		CLEAR_BLOOD_PRESSURE_DATE(state){
			state.bloodPressureData = [];
			uni.removeStorageSync('bloodPressureData')
		},
		UPDATE_LUNG_CAPACITY_DATE(state, lungCapacityData){
			state.lungCapacityData = lungCapacityData;
			uni.setStorageSync('lungCapacityData', JSON.stringify(state.lungCapacityData));
		},
		CLEAR_LUNG_CAPACITY_DATE(state){
			state.lungCapacityData = [];
			uni.removeStorageSync('lungCapacityData')
		},
		UPDATE_PUSH_UPS_DATE(state, pushUpsData){
			state.pushUpsData = pushUpsData;
			uni.setStorageSync('pushUpsData', JSON.stringify(state.pushUpsData));
		},
		CLEAR_PUSH_UPS_DATE(state){
			state.pushUpsData = [];
			uni.removeStorageSync('pushUpsData')
		},
		UPDATE_SIT_UPS_DATE(state, sitUpsData){
			state.sitUpsData = sitUpsData;
			uni.setStorageSync('sitUpsData', JSON.stringify(state.sitUpsData));
		},
		CLEAR_SIT_UPS_DATE(state){
			state.sitUpsData = [];
			uni.removeStorageSync('sitUpsData')
		},
		UPDATE_PULL_UPS_DATE(state, pullUpsData){
			state.pullUpsData = pullUpsData;
			uni.setStorageSync('pullUpsData', JSON.stringify(state.pullUpsData));
		},
		CLEAR_PULL_UPS_DATE(state){
			state.pullUpsData = [];
			uni.removeStorageSync('pullUpsData')
		},
		UPDATE_LONG_JUMP_DATE(state, longJumpData){
			state.longJumpData = longJumpData;
			uni.setStorageSync('longJumpData', JSON.stringify(state.longJumpData));
		},
		CLEAR_LONG_JUMP_DATE(state){
			state.longJumpData = [];
			uni.removeStorageSync('longJumpData')
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
		visionData: JSON.parse(uni.getStorageSync('visionData') || '[]'),
		bloodPressureData: JSON.parse(uni.getStorageSync('bloodPressureData') || '[]'),
		lungCapacityData: JSON.parse(uni.getStorageSync('lungCapacityData') || '[]'),
		pushUpsData: JSON.parse(uni.getStorageSync('pushUpsData') || '[]'),
		sitUpsData: JSON.parse(uni.getStorageSync('sitUpsData') || '[]'),
		pullUpsData: JSON.parse(uni.getStorageSync('pullUpsData') || '[]'),
		longJumpData: JSON.parse(uni.getStorageSync('longJumpData') || '[]'),
	}
}