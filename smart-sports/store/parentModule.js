import {
	baseURL,
	defaultSwiperCards
} from '../config.js'
import steps from '../uni_modules/uview-ui/libs/config/props/steps.js'

export default {
	namespaced: true, //开启命名空间
	actions: {
		//context是一个mini的store对象，因为它能拿到state这个对象，所以它也能干mutations的活。
		parentLogin(context, value) {
			context.commit('PARENT_LOGIN', value)
		},
		parentLogout(context, value) {
			context.commit('PARENT_LOGOUT', value)
		},
		updateParentInfo(context, value) {
			context.commit('UPDATE_PARENT_INFO', value)
		},
		updateFriendsApplicationMessages(context, value) {
			context.commit('UPDATE_FRIENDS_APPLICATIONS_MESSAGES', value)
		},
		removeFriendsApplicationMessages(context, value) {
			context.commit('REMOVE_FRIENDS_APPLICATIONS_MESSAGES', value)
		},
		updateFriendList(context, value) {
			context.commit('UPDATE_FRIEND_LIST', value)
		},
		removeFriendList(context, value) {
			context.commit('REMOVE_FRIEND_LIST', value)
		},
		updateStepsRating(context, value) {
			context.commit('UPDATE_STEPS_RATING', value)
		},
		removeStepsRating(context, value) {
			context.commit('REMOVE_STEPS_RATING', value)
		},
		updateSteps(context, value) {
			context.commit('UPDATE_STEPS', value)
		},
		removeSteps(context, value) {
			context.commit('REMOVE_STEPS', value)
		},
		resetPedometer(context, value){
			context.commit('RESET_PEDOMETER', value)
		},
		updateLike(context, value){
			context.commit('UPDATE_LIKE', value)
		}
	},
	mutations: {
		//mutations中的方法一般大写，用于区分actions中的方法。
		PARENT_LOGIN(state, {
			token,
			parentInfo
		}) {
			state.token = token;
			state.parentInfo = parentInfo;
			uni.setStorageSync('token', state.token);
			uni.setStorageSync('parentInfo', JSON.stringify(state.parentInfo))
		},
		PARENT_LOGOUT(state, value) {
			state.token = '';
			state.parentInfo = {};
			uni.clearStorageSync();
		},
		UPDATE_PARENT_INFO(state, {
			email,
			password,
			realname,
			gender,
			idcard,
			phone,
			cur_bonding_id,
			avatar_url
		}) {
			state.parentInfo.email = email || state.parentInfo.email;
			state.parentInfo.password = password || state.parentInfo.password;
			state.parentInfo.realname = realname || state.parentInfo.realname;
			state.parentInfo.gender = gender || state.parentInfo.gender;
			state.parentInfo.idcard = idcard || state.parentInfo.idcard;
			state.parentInfo.phone = phone || state.parentInfo.phone;
			if (cur_bonding_id === '') {
				state.parentInfo.cur_bonding_id = '';
			} else {
				state.parentInfo.cur_bonding_id = cur_bonding_id || state.parentInfo.cur_bonding_id;
			}
			state.parentInfo.avatar_url = avatar_url || state.parentInfo.avatar_url;
			uni.setStorageSync('parentInfo', JSON.stringify(state.parentInfo))
			console.log("in parentModule: state.parentInfo: ", state.parentInfo);
		},
		UPDATE_FRIENDS_APPLICATIONS_MESSAGES(state, value) {
			state.friendsApplicationMessages.push(value)
			uni.setStorageSync('friendsApplicationMessages', JSON.stringify(state.friendsApplicationMessages))
			console.log("state.friendsApplicationMessages: ",state.friendsApplicationMessages);
		},
		REMOVE_FRIENDS_APPLICATIONS_MESSAGES(state, value) {
			state.friendsApplicationMessages.splice(value, 1);
			uni.setStorageSync('friendsApplicationMessages', JSON.stringify(state.friendsApplicationMessages))
		},
		UPDATE_FRIEND_LIST(state, value) {
			state.friendList = value;
			uni.setStorageSync('friendList', JSON.stringify(state.friendList))
		},
		REMOVE_FRIEND_LIST(state, value) {
			state.friendList.splice(value, 1);
			uni.setStorageSync('friendList', JSON.stringify(state.friendList))
		},
		UPDATE_STEPS_RATING(state, value) {
			try{
				if(state.stepsRating.length === 0){
					state.stepsRating = value;
				}else {
					const oldArr = state.stepsRating;
					state.stepsRating = value;
					state.stepsRating.forEach((item)=>{
						let element = oldArr.find((el) => el.id === item.id);
						if(element){
							item.isGiveLike = element.isGiveLike;
						}
					})
				}
				uni.setStorageSync('stepsRating', JSON.stringify(state.stepsRating))
			}catch(e){
				//TODO handle the exception
				console.log(e);
			}
		},
		REMOVE_STEPS_RATING(state, value) {
			state.stepsRating = []
			uni.setStorageSync('stepsRating', JSON.stringify(state.stepsRating))
		},
		UPDATE_STEPS(state, value) {
			state.steps = value;
			uni.setStorageSync('steps', JSON.stringify(state.steps))
		},
		REMOVE_STEPS(state, value) {
			state.steps = {}
			uni.setStorageSync('steps', JSON.stringify(state.steps))
		},
		RESET_PEDOMETER(state, value){
			state.pedometer = {
				isWalking: false,
				steps: {
					walking: 0,
					running: 0
				},
				date: value
			}
			uni.setStorageSync('pedometer', JSON.stringify(state.pedometer))
		},
		UPDATE_LIKE(state, {index, isGiveLike, likes}){
			try{
				state.stepsRating[index].isGiveLike = !isGiveLike;
				state.stepsRating[index].likes = likes;
				uni.setStorageSync('stepsRating', JSON.stringify(state.stepsRating))
			}catch(e){
				//TODO handle the exception
				console.log(e);
			}
		}
	},
	getters: {
		full_avatar_url(state) {
			return baseURL + state.parentInfo.avatar_url
		},
		filteredSwiperCards(state) {
			let filteredSwiperCards = [];
			state.swiperCards.forEach((swiperCard) => {
				let label = swiperCard.label;
				let icons = swiperCard.icons.filter((icon) => {
					return icon.show;
				})
				filteredSwiperCards.push({
					label,
					icons
				});
			})

			filteredSwiperCards = filteredSwiperCards.filter((swiperCard) => {
				return swiperCard.icons.length > 0;
			})

			return filteredSwiperCards;
		},
	},
	state: {
		token: uni.getStorageSync('token') || '',
		parentInfo: JSON.parse(uni.getStorageSync('parentInfo') || '{}'),
		swiperCards: JSON.parse(uni.getStorageSync('swiperCards') || '[]').length <= 0 ? defaultSwiperCards : JSON
			.parse(uni.getStorageSync('swiperCards') || '[]'),
		friendsApplicationMessages: JSON.parse(uni.getStorageSync('friendsApplicationMessages') || '[]'),
		friendList: JSON.parse(uni.getStorageSync('friendList') || '[]'),
		stepsRating: JSON.parse(uni.getStorageSync('stepsRating') || '[]'),
		steps: JSON.parse(uni.getStorageSync('steps') || '{}'),
		pedometer: JSON.parse(uni.getStorageSync('pedometer') || '{}'),
	}
}
