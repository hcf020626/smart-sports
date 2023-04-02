import {baseURL} from '../config.js'
export default {
	namespaced:true,//开启命名空间
	actions: {
		//context是一个mini的store对象，因为它能拿到state这个对象，所以它也能干mutations的活。
		userLogin(context, value){
			context.commit('USER_LOGIN', value)
		},
		userLogout(context, value){
			context.commit('USER_LOGOUT', value)
		},
		updateUserInfo(context, value){
			context.commit('UPDATE_USER_INFO', value)
		}
	},
	mutations: {
		//mutations中的方法一般大写，用于区分actions中的方法。
		USER_LOGIN(state, {token, userInfo}){
			state.token = token;
			state.userInfo = userInfo;
			uni.setStorageSync('token', state.token);
			uni.setStorageSync('userInfo', JSON.stringify(state.userInfo))
		},
		USER_LOGOUT(state, value){
			state.token = '';
			state.userInfo = {};
			uni.clearStorageSync();
		},
		UPDATE_USER_INFO(state, {email, password, realname, gender, idcard, phone, cur_bonding_id, avatar_url}){
			state.userInfo.email = email || state.userInfo.email;
			state.userInfo.password = password || state.userInfo.password;
			state.userInfo.realname = realname || state.userInfo.realname;
			state.userInfo.gender = gender || state.userInfo.gender;
			state.userInfo.idcard = idcard || state.userInfo.idcard;
			state.userInfo.phone = phone || state.userInfo.phone;
			if(cur_bonding_id === ''){
				state.userInfo.cur_bonding_id = '';
			}else{
				state.userInfo.cur_bonding_id = cur_bonding_id || state.userInfo.cur_bonding_id;
			}
			state.userInfo.avatar_url = avatar_url || state.userInfo.avatar_url;
			uni.setStorageSync('userInfo', JSON.stringify(state.userInfo))
			console.log("in accountModule: state.userInfo: ",state.userInfo);
		},
	},
	getters: {
		full_avatar_url(state){
			return baseURL + state.userInfo.avatar_url
		}
	},
	state: {
		token: uni.getStorageSync('token') || '',
		userInfo: JSON.parse(uni.getStorageSync('userInfo') || '{}'),
	}
}