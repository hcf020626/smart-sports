import {baseURL, defaultSwiperCards} from '../config.js'

export default {
	namespaced:true,//开启命名空间
	actions: {
		//context是一个mini的store对象，因为它能拿到state这个对象，所以它也能干mutations的活。
		parentLogin(context, value){
			context.commit('PARENT_LOGIN', value)
		},
		parentLogout(context, value){
			context.commit('PARENT_LOGOUT', value)
		},
		updateParentInfo(context, value){
			context.commit('UPDATE_PARENT_INFO', value)
		},
	},
	mutations: {
		//mutations中的方法一般大写，用于区分actions中的方法。
		PARENT_LOGIN(state, {token, parentInfo}){
			state.token = token;
			state.parentInfo = parentInfo;
			uni.setStorageSync('token', state.token);
			uni.setStorageSync('parentInfo', JSON.stringify(state.parentInfo))
		},
		PARENT_LOGOUT(state, value){
			state.token = '';
			state.parentInfo = {};
			uni.clearStorageSync();
		},
		UPDATE_PARENT_INFO(state, {email, password, realname, gender, idcard, phone, cur_bonding_id, avatar_url}){
			state.parentInfo.email = email || state.parentInfo.email;
			state.parentInfo.password = password || state.parentInfo.password;
			state.parentInfo.realname = realname || state.parentInfo.realname;
			state.parentInfo.gender = gender || state.parentInfo.gender;
			state.parentInfo.idcard = idcard || state.parentInfo.idcard;
			state.parentInfo.phone = phone || state.parentInfo.phone;
			if(cur_bonding_id === ''){
				state.parentInfo.cur_bonding_id = '';
			}else{
				state.parentInfo.cur_bonding_id = cur_bonding_id || state.parentInfo.cur_bonding_id;
			}
			state.parentInfo.avatar_url = avatar_url || state.parentInfo.avatar_url;
			uni.setStorageSync('parentInfo', JSON.stringify(state.parentInfo))
			console.log("in parentModule: state.parentInfo: ",state.parentInfo);
		},
	},
	getters: {
		full_avatar_url(state){
			return baseURL + state.parentInfo.avatar_url
		},
		filteredSwiperCards(state){
			let filteredSwiperCards = [];
			state.swiperCards.forEach((swiperCard)=>{
				let label = swiperCard.label;
				let icons = swiperCard.icons.filter((icon)=>{
					return icon.show;
				})
				filteredSwiperCards.push({label, icons});
			})
			
			filteredSwiperCards = filteredSwiperCards.filter((swiperCard)=>{
				return swiperCard.icons.length > 0;
			})
			
			return filteredSwiperCards;
		}
	},
	state: {
		token: uni.getStorageSync('token') || '',
		parentInfo: JSON.parse(uni.getStorageSync('parentInfo') || '{}'),
		swiperCards: JSON.parse(uni.getStorageSync('swiperCards') || '[]').length <= 0 ? defaultSwiperCards : JSON.parse(uni.getStorageSync('swiperCards') || '[]')
	}
}