<template>
	<view class="container">
		<u-toast ref="uToast"></u-toast>
		
		<uni-nav-bar :fixed="true" :border="false" :status-bar="true" left-width="60rpx" right-width="60rpx">
			<uni-icons slot="left" customPrefix="iconfont" type="icon-arrow-left" @click="clickLeft" size="25">
			</uni-icons>
			<view class="navbar-default">
				<u-input class="input" type="text" v-model="keyword" placeholder="根据手机号码或昵称搜索用户" border="surround"
					clearable>
					<uni-icons slot="prefix" customPrefix="iconfont" type="icon-search"></uni-icons>
				</u-input>
			</view>

			<text class="navbar-right" slot="right" @click="clickSearch">搜索</text>
		</uni-nav-bar>

		<view class="content">
			<u-empty text="用户不存在" icon="/static/images/empty/data-empty.png" :show="isShowEmpty">
			</u-empty>
			<u-list>
				<u-list-item v-for="(user, index) in userList" :key="index">
					<u-cell :title="user.realname" :label="user.phone | phoneMask">
						<u-avatar slot="icon" shape="square" size="35" :src="baseURL + user.avatar_url"
							customStyle="margin: -3px 5px -3px 0"></u-avatar>
						<u-button slot="right-icon" type="primary" text="添加好友" size="small" @click="sendApplication(user.id)">
						</u-button>
					</u-cell>
				</u-list-item>
			</u-list>
		</view>
	</view>
</template>

<script>
	import {
		baseURL
	} from '@/config.js'
	import {mapState} from 'vuex'
	import api from '../../../../api/index.js'
	export default {
		computed: {
			...mapState('parentModule', ['parentInfo', 'friendList']),
		},
		data() {
			return {
				keyword: '',
				userList: [],
				isShowEmpty: false,
				baseURL
			}
		},
		methods: {
			clickLeft() {
				uni.navigateBack()
			},
			clickSearch() {
				if (!this.keyword.trim()) {
					// 弹出提示框
					this.$refs.uToast.show({
						type: 'error',
						message: '请输入用户手机号码或昵称！',
						icon: 'https://cdn.uviewui.com/uview/demo/toast/error.png',
						position: 'top',
					})

					return this.keyword = ''
				}
				uni.showLoading({
					title: '正在搜索...'
				});
				setTimeout(async () => {
					try {
						const {
							data: {
								status,
								msg,
								data: {
									userList
								}
							}
						} = await api.parent.getUserListByKeyword(this.keyword);
						if (!status) {
							this.userList = userList;
							this.isShowEmpty = this.userList.length === 0;
						} else {
							this.$refs.uToast.show({
								type: 'error',
								message: msg,
								icon: 'https://cdn.uviewui.com/uview/demo/toast/error.png',
								position: 'top'
							})
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
			},
			sendApplication(id){
				if(this.parentInfo.id === id){
					// 弹出提示框
					return this.$refs.uToast.show({
						type: 'error',
						message: '不能添加自己为好友！',
						icon: 'https://cdn.uviewui.com/uview/demo/toast/error.png',
						position: 'top',
					})
				}
				
				let hasFriend = false;
				
				this.friendList.forEach((friend)=>{
					if(friend.friend_id === id){
						return hasFriend = true;
					}
				})
				
				if(hasFriend){
					// 弹出提示框
					return this.$refs.uToast.show({
						type: 'error',
						message: '您已添加该好友，请勿重复添加！',
						icon: 'https://cdn.uviewui.com/uview/demo/toast/error.png',
						position: 'top',
					})
				}
				
				const message = {
					type: 'add friend',
					content: {
						userId: this.parentInfo.id,
						friendId: id,
						userExtraInfo: {
							realname: this.parentInfo.realname,
							avatar_url: this.parentInfo.avatar_url,
							phone: this.parentInfo.phone
						},
					}
				}
				
				uni.showLoading({
					title: '正在发送好友申请中...'
				});
				setTimeout(()=>{
					uni.sendSocketMessage({
						data: JSON.stringify(message),
						success() {
							uni.showToast({
								icon: 'success',
								title: '好友申请发送成功！',
								duration: 1500,
								position: 'top'
							})
						},
						fail() {
							uni.showToast({
								icon: 'error',
								title: '好友申请发送失败！！',
								duration: 1500,
								position: 'top'
							})
						},
						complete() {
							uni.hideLoading();
						}
					})
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
		height: 100%;
		background-color: whitesmoke;
	}

	.navbar-default {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.navbar-default .input {
		border: none;
		background-color: #F1F2F4;
		border-radius: 20rpx;
	}

	.navbar-right {
		font-size: 1.2em;
		color: #909399;
	}
</style>
