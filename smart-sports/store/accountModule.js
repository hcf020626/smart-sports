import {baseURL} from '../config.js'
import Vue from  'vue'
export default {
	namespaced:true,//开启命名空间
	actions: {
		//context是一个mini的store对象，因为它能拿到state这个对象，所以它也能干mutations的活。
		setUserInfo(context, value){
			// console.log('here in actions');
			context.commit('SET_USER_INFO', value)
		},
		userLogout(context, value){
			context.commit('USER_LOGOUT', value)
		},
		updateUser(context, value){
			context.commit('UPDATE_USER', value)
		},
		updatePassword(context, value){
			context.commit('UPDATE_PASSWORD', value)
		},
		updateBonding(context, value){
			context.commit('UPDATE_BONDING', value)
		},
	},
	mutations: {
		//mutations中的方法一般大写，用于区分actions中的方法。
		SET_USER_INFO(state, {token, userInfo}){
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
		UPDATE_USER(state, {email, realname, gender, idCard, phone, avatar_url}){
			state.userInfo.email = email;
			state.userInfo.realname = realname;
			state.userInfo.gender = gender;
			state.userInfo.idCard = idCard;
			state.userInfo.phone = phone;
			state.userInfo.avatar_url = avatar_url;
			uni.setStorageSync('userInfo', JSON.stringify(state.userInfo))
		},
		UPDATE_PASSWORD(state, value){
			state.userInfo.password = value;
			uni.setStorageSync('userInfo', JSON.stringify(state.userInfo));
		},
		UPDATE_BONDING(state, value){
			state.userInfo.cur_bonding_id = value;
			uni.setStorageSync('userInfo', JSON.stringify(state.userInfo));
		}
	},
	getters: {
		fullAvatarURL(state){
			return baseURL + state.userInfo.avatar_url
		}
	},
	state: {
		token: uni.getStorageSync('token') || '',
		userInfo: JSON.parse(uni.getStorageSync('userInfo') || '{}')
	}
}
