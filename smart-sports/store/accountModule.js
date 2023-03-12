export default {
	namespaced:true,//开启命名空间
	actions: {
		//context是一个mini的store对象，因为它能拿到state这个对象，所以它也能干mutations的活。
		userLogin(context, value){
			// console.log('here in actions');
			context.commit('USER_LOGIN', value)
		},
		userLogout(context, value){
			context.commit('USER_LOGOUT', value)
		}
	},
	mutations: {
		//mutations中的方法一般大写，用于区分actions中的方法。
		USER_LOGIN(state, value){
			// console.log('here in mutations');
			state.token = value.token;
			state.userInfo = value.userInfo;
			uni.setStorageSync('token', state.token);
			uni.setStorageSync('userInfo', JSON.stringify(state.userInfo))
		},
		USER_LOGOUT(state, value){
			// console.log('bye');
			state.token = '';
			state.userInfo = {};
			uni.clearStorageSync();
		}
	},
	getters: {},
	state: {
		token: uni.getStorageSync('token'),
		userInfo: JSON.parse(uni.getStorageSync('userInfo') || '{}')
	}
}
