<template>
	<view class="container">
		<u-toast ref="uToast"></u-toast>
		<u-empty text="您还没有好友,快去添加一个吧~" icon="/static/images/empty/data-empty.png" :show="friendList.length === 0">
		</u-empty>
		<u-swipe-action>
			<u-swipe-action-item :options="options" v-for="(friend, index) in friendList" :key="index" :index="index"
				:name="index" @click="clickSwipeActionBtn">
				<u-cell :title="friend.realname" :label="friend.phone | phoneMask" size="mini">
					<u-avatar slot="icon" shape="square" size="35" :src="baseURL + friend.avatar_url"
						customStyle="margin: -3px 5px -3px 0"></u-avatar>
				</u-cell>
			</u-swipe-action-item>
		</u-swipe-action>
	</view>
</template>

<script>
	import {
		baseURL
	} from '@/config.js'
	import api from '../../../../api/index.js'
	import {
		mapState,
		mapActions
	} from 'vuex';
	export default {
		computed: {
			...mapState('parentModule', ['parentInfo', 'friendList']),
		},
		data() {
			return {
				baseURL,
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#fa3534'
					}
				}]
			}
		},
		methods: {
			...mapActions('parentModule', ['removeFriendList']),
			clickSwipeActionBtn({
				name,
				index
			}) {
				const friend_id = this.friendList[index].friend_id;
				const parent_id = this.parentInfo.id;
				this.deleteFriendShip(parent_id, friend_id, index)
			},
			deleteFriendShip(parent_id, friend_id, index) {
				console.log(parent_id, friend_id);
				uni.showLoading({
					title: '删除中...'
				})
				setTimeout(async () => {
					try {
						const {
							data: {
								msg,
								status
							}
						} = await api.parent.deleteFriendship({
							parent_id,
							friend_id
						});
						this.$refs.uToast.show({
							type: status === 0 ? 'success' : 'error',
							message: msg,
							icon: status === 0 ?
								'https://cdn.uviewui.com/uview/demo/toast/success.png' :
								'https://cdn.uviewui.com/uview/demo/toast/error.png',
							position: 'top'
						})

						if (!status) {
							this.removeFriendList(index);
						}
					} catch (e) {
						//TODO handle the exception
						console.log("e: ", e);
						this.$refs.uToast.show({
							type: 'error',
							message: '请求发生问题，请稍后再试',
							icon: 'https://cdn.uviewui.com/uview/demo/toast/error.png',
							position: 'top'
						})
					} finally {
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
	}
</script>

<style scoped>
	.container {
		width: 100vw;
		height: 100vh;
		background-color: whitesmoke;
	}
</style>
