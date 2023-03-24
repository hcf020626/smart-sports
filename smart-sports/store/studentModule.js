export default {
	namespaced:true,//开启命名空间
	actions: {
		updateStudent(context, value){
			context.commit('UPDATE_STUDENT', value)
		},
	},
	mutations: {
		UPDATE_STUDENT(state, {imgSrc, name, gender, age, school, className, id}){
			state.studentInfo.imgSrc = imgSrc;
			state.studentInfo.name = name;
			state.studentInfo.gender = gender;
			state.studentInfo.gender = gender;
			state.studentInfo.age = age;
			state.studentInfo.school = school;
			state.studentInfo.className = className;
			state.studentInfo.id = school;
			uni.setStorageSync('studentInfo', JSON.stringify(state.studentInfo))
			console.log("state: ",state);
		},
	},
	state: {
		studentInfo: JSON.parse(uni.getStorageSync('studentInfo') || '{}')
	}
}