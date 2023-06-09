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
			context.commit('UPDATE_WEIGHT_DATA', value)
		},
		clearWeightData(context, value){
			context.commit('CLEAR_WEIGHT_DATA', value)
		},
		updateHeightData(context, value){
			context.commit('UPDATE_HEIGHT_DATA', value)
		},
		clearHeightData(context, value){
			context.commit('CLEAR_HEIGHT_DATA', value)
		},
		updateVisionData(context, value){
			context.commit('UPDATE_VISION_DATA', value)
		},
		clearVisionData(context, value){
			context.commit('CLEAR_VISION_DATA', value)
		},
		updateBloodPressureData(context, value){
			context.commit('UPDATE_BLOOD_PRESSURE_DATA', value)
		},
		clearBloodPressureData(context, value){
			context.commit('CLEAR_BLOOD_PRESSURE_DATA', value)
		},
		updateLungCapacityData(context, value){
			context.commit('UPDATE_LUNG_CAPACITY_DATA', value)
		},
		clearLungCapacityData(context, value){
			context.commit('CLEAR_LUNG_CAPACITY_DATA', value)
		},
		updatePushUpsData(context, value){
			context.commit('UPDATE_PUSH_UPS_DATA', value)
		},
		clearPushUpsData(context, value){
			context.commit('CLEAR_PUSH_UPS_DATA', value)
		},
		updateSitUpsData(context, value){
			context.commit('UPDATE_SIT_UPS_DATA', value)
		},
		clearSitUpsData(context, value){
			context.commit('CLEAR_SIT_UPS_DATA', value)
		},
		updatePullUpsData(context, value){
			context.commit('UPDATE_PULL_UPS_DATA', value)
		},
		clearPullUpsData(context, value){
			context.commit('CLEAR_PULL_UPS_DATA', value)
		},
		updateLongJumpData(context, value){
			context.commit('UPDATE_LONG_JUMP_DATA', value)
		},
		clearLongJumpData(context, value){
			context.commit('CLEAR_LONG_JUMP_DATA', value)
		},
		updateSitAndReachesData(context, value){
			context.commit('UPDATE_SIT_AND_REACHES_DATA', value)
		},
		clearSitAndReachesData(context, value){
			context.commit('CLEAR_SIT_AND_REACHES_DATA', value)
		},
		updateRopeSkippingData(context, value){
			context.commit('UPDATE_ROPE_SKIPPING_DATA', value)
		},
		clearRopeSkippingData(context, value){
			context.commit('CLEAR_ROPE_SKIPPING_DATA', value)
		},
		updateSolidBallData(context, value){
			context.commit('UPDATE_SOLID_BALL_DATA', value)
		},
		clearSolidBallData(context, value){
			context.commit('CLEAR_SOLID_BALL_DATA', value)
		},
		updateSwimmingData(context, value){
			context.commit('UPDATE_SWIMMING_DATA', value)
		},
		clearSwimmingData(context, value){
			context.commit('CLEAR_SWIMMING_DATA', value)
		},
		updateRunningData(context, value){
			context.commit('UPDATE_SWIMMING_DATA', value)
		},
		clearRunningData(context, value){
			context.commit('CLEAR_SWIMMING_DATA', value)
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
		UPDATE_WEIGHT_DATA(state, weightData){
			state.weightData = weightData;
			uni.setStorageSync('weightData', JSON.stringify(state.weightData));
		},
		CLEAR_WEIGHT_DATA(state){
			state.weightData = [];
			uni.removeStorageSync('weightData')
		},
		UPDATE_HEIGHT_DATA(state, heightData){
			state.heightData = heightData;
			uni.setStorageSync('heightData', JSON.stringify(state.heightData));
		},
		CLEAR_HEIGHT_DATA(state){
			state.heightData = [];
			uni.removeStorageSync('heightData')
		},
		UPDATE_VISION_DATA(state, visionData){
			state.visionData = visionData;
			uni.setStorageSync('visionData', JSON.stringify(state.visionData));
		},
		CLEAR_VISION_DATA(state){
			state.visionData = [];
			uni.removeStorageSync('visionData')
		},
		UPDATE_BLOOD_PRESSURE_DATA(state, bloodPressureData){
			state.bloodPressureData = bloodPressureData;
			uni.setStorageSync('bloodPressureData', JSON.stringify(state.bloodPressureData));
		},
		CLEAR_BLOOD_PRESSURE_DATA(state){
			state.bloodPressureData = [];
			uni.removeStorageSync('bloodPressureData')
		},
		UPDATE_LUNG_CAPACITY_DATA(state, lungCapacityData){
			state.lungCapacityData = lungCapacityData;
			uni.setStorageSync('lungCapacityData', JSON.stringify(state.lungCapacityData));
		},
		CLEAR_LUNG_CAPACITY_DATA(state){
			state.lungCapacityData = [];
			uni.removeStorageSync('lungCapacityData')
		},
		UPDATE_PUSH_UPS_DATA(state, pushUpsData){
			state.pushUpsData = pushUpsData;
			uni.setStorageSync('pushUpsData', JSON.stringify(state.pushUpsData));
		},
		CLEAR_PUSH_UPS_DATA(state){
			state.pushUpsData = [];
			uni.removeStorageSync('pushUpsData')
		},
		UPDATE_SIT_UPS_DATA(state, sitUpsData){
			state.sitUpsData = sitUpsData;
			uni.setStorageSync('sitUpsData', JSON.stringify(state.sitUpsData));
		},
		CLEAR_SIT_UPS_DATA(state){
			state.sitUpsData = [];
			uni.removeStorageSync('sitUpsData')
		},
		UPDATE_PULL_UPS_DATA(state, pullUpsData){
			state.pullUpsData = pullUpsData;
			uni.setStorageSync('pullUpsData', JSON.stringify(state.pullUpsData));
		},
		CLEAR_PULL_UPS_DATA(state){
			state.pullUpsData = [];
			uni.removeStorageSync('pullUpsData')
		},
		UPDATE_LONG_JUMP_DATA(state, longJumpData){
			state.longJumpData = longJumpData;
			uni.setStorageSync('longJumpData', JSON.stringify(state.longJumpData));
		},
		CLEAR_LONG_JUMP_DATA(state){
			state.longJumpData = [];
			uni.removeStorageSync('longJumpData')
		},
		UPDATE_SIT_AND_REACHES_DATA(state, sitAndReachesData){
			state.sitAndReachesData = sitAndReachesData;
			uni.setStorageSync('sitAndReachesData', JSON.stringify(state.sitAndReachesData));
		},
		CLEAR_SIT_AND_REACHES_DATA(state){
			state.sitAndReachesData = [];
			uni.removeStorageSync('sitAndReachesData')
		},
		UPDATE_ROPE_SKIPPING_DATA(state, ropeSkippingData){
			state.ropeSkippingData = ropeSkippingData;
			uni.setStorageSync('ropeSkippingData', JSON.stringify(state.ropeSkippingData));
		},
		CLEAR_ROPE_SKIPPING_DATA(state){
			state.ropeSkippingData = [];
			uni.removeStorageSync('ropeSkippingData')
		},
		UPDATE_SOLID_BALL_DATA(state, solidBallData){
			state.solidBallData = solidBallData;
			uni.setStorageSync('solidBallData', JSON.stringify(state.solidBallData));
		},
		CLEAR_SOLID_BALL_DATA(state){
			state.solidBallData = [];
			uni.removeStorageSync('solidBallData')
		},
		UPDATE_SWIMMING_DATA(state, swimmingData){
			state.swimmingData = swimmingData;
			uni.setStorageSync('swimmingData', JSON.stringify(state.swimmingData));
		},
		CLEAR_SWIMMING_DATA(state){
			state.swimmingData = [];
			uni.removeStorageSync('swimmingData')
		},
		UPDATE_SWIMMING_DATA(state, runningData){
			state.runningData = runningData;
			uni.setStorageSync('runningData', JSON.stringify(state.runningData));
		},
		CLEAR_SWIMMING_DATA(state){
			state.runningData = [];
			uni.removeStorageSync('runningData')
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
		sitAndReachesData: JSON.parse(uni.getStorageSync('sitAndReachesData') || '[]'),
		ropeSkippingData: JSON.parse(uni.getStorageSync('ropeSkippingData') || '[]'),
		solidBallData: JSON.parse(uni.getStorageSync('solidBallData') || '[]'),
		swimmingData: JSON.parse(uni.getStorageSync('swimmingData') || '[]'),
		runningData: JSON.parse(uni.getStorageSync('runningData') || '[]'),
	}
}