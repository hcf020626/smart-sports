import Vue from 'vue'
export default {
	namespaced:true,//开启命名空间
	actions: {
		updateStudent(context, value){
			context.commit('UPDATE_STUDENT', value)
		},
		clearStudent(context, value){
			context.commit('CLEAR_STUDENT', value)
		},
	},
	mutations: {
		UPDATE_STUDENT(state, {imgSrc, name, gender, age, school, className, id}){
			Vue.set(state.studentInfo, 'imgSrc', imgSrc);
			Vue.set(state.studentInfo, 'name', name);
			Vue.set(state.studentInfo, 'gender', gender);
			Vue.set(state.studentInfo, 'age', age);
			Vue.set(state.studentInfo, 'school', school);
			Vue.set(state.studentInfo, 'className', className);
			Vue.set(state.studentInfo, 'id', id);
			uni.setStorageSync('studentInfo', JSON.stringify(state.studentInfo));
		},
		CLEAR_STUDENT(state){
			state.studentInfo = {};
			uni.removeStorageSync('studentInfo')
		}
	},
	state: {
		studentInfo: JSON.parse(uni.getStorageSync('studentInfo') || '{}')
	}
}