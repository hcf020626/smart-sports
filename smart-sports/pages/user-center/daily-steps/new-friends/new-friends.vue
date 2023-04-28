<template>
	<view class="container">
		<u-toast ref="uToast"></u-toast>
		<u-empty text="暂无好友申请" icon="/static/images/empty/data-empty.png" :show="friendsApplicationMessages.length === 0">
			</u-empty>
		<u-list>
			<u-list-item v-for="(message, index) in friendsApplicationMessages" :key="index">
				<u-cell :title="message.content.userExtraInfo.realname" :label="message.content.userExtraInfo.phone | phoneMask">
					<u-avatar slot="icon" shape="square" size="35" :src="baseURL + message.content.userExtraInfo.avatar_url"
						customStyle="margin: -3px 5px -3px 0"></u-avatar>
					<u-button slot="right-icon" type="primary" text="同意" size="small" @click="agree(message.content.userId, message.content.friendId, index)">
					</u-button>
				</u-cell>
			</u-list-item>
		</u-list>
	</view>
</template>

<script>
	import {baseURL} from '@/config.js'
	import api from '../../../../api/index.js'
	import {mapState, mapActions} from 'vuex';
	export default {
		computed: {
			...mapState('parentModule', ['friendsApplicationMessages']),
		},
		data() {
			return {
				baseURL
			}
		},
		methods: {
			...mapActions('parentModule', ['removeFriendsApplicationMessages']),
			agree(parent_id, friend_id, index){
				uni.showLoading({
					title: '添加中...'
				})
				setTimeout(async ()=>{
					try{
						const {data: {msg, status}} = await api.parent.createFriendship({parent_id, friend_id});
						this.$refs.uToast.show({
							type: status === 0 ? 'success' : 'error',
							message: msg,
							icon: status === 0 ? 'https://cdn.uviewui.com/uview/demo/toast/success.png' : 'https://cdn.uviewui.com/uview/demo/toast/error.png',
							position: 'top'
						})
						
						if(status === 0 || status === 2){
							this.removeFriendsApplicationMessages(index);
						}
					}catch(e){
						//TODO handle the exception
						console.log("e: ", e);
						this.$refs.uToast.show({
							type: 'error',
							message: '请求发生问题，请稍后再试',
							icon: 'https://cdn.uviewui.com/uview/demo/toast/error.png',
							position: 'top'
						})
					}finally{
						uni.hideLoading();
					}
				}, 500)
			}
		},
		filters: {
			// 电话号码脱敏
			phoneMask(value) {
				if (!value) return ''
				const visibleDigitsStart = 3 // 号码中开头的可见数字数量
				const visibleDigitsEnd = 2 // 号码结尾的可见数字数量
				const maskedDigits = value.length - visibleDigitsStart - visibleDigitsEnd // 中间需要屏蔽的数字数量
				const masked = '*'.repeat(maskedDigits)
				const visibleStart = value.substr(0, visibleDigitsStart)
				const visibleEnd = value.substr(value.length - visibleDigitsEnd, visibleDigitsEnd)
				return `${visibleStart}${masked}${visibleEnd}`
			}
		},
		onLoad() {
			console.log("this.friendsApplicationMessages: ",this.friendsApplicationMessages);
		}
	}
</script>

<style scoped>
	.container {
		width: 100vw;
		height: 100%;
		background-color: whitesmoke;
	}
</style>
