<template>
	<view class="container">
		<view class="wrap" hover-class="cell-hover-class" @tap="goToEditProfile">
			<view class="wrap-item avatar">
				<u-avatar :src="fullAvatarURL" size="70"></u-avatar>
			</view>
			<view class="wrap-item realname">
				<text>{{userInfo.realname?userInfo.realname:'亲，您还未设置真实姓名'}}</text>
			</view>
			<view class="wrap-item right-icon">
				<u-icon name="arrow-right" label="主页" labelPos="left" labelSize="12" size="13"></u-icon>
			</view>
		</view>

		<view class="cell-group">
			<u-cell-group :border="false">
				<u-cell icon="lock" title="修改密码" :border="false" isLink url="./edit-password/edit-password"></u-cell>
			</u-cell-group>
		</view>

		<view class="cell-group">
			<u-cell-group :border="false">
				<u-cell icon="question" title="关于" :border="false" isLink url="./about/about">
				</u-cell>
			</u-cell-group>
		</view>


		<view class="logout-btn">
			<u-button type="error" @tap="showModal">退出登录</u-button>
		</view>

		<u-modal :show="modalInfo.show" :content="modalInfo.content" @confirm="logout" :showCancelButton="true"
			@cancel="modalInfo.show=false"></u-modal>
	</view>
</template>

<script>
	import {
		mapState,
		mapActions,
		mapGetters
	} from 'vuex'
	import {
		baseURL
	} from '@/config.js';
	export default {
		data() {
			return {
				modalInfo: {
					content: '确定要退出登录吗？',
					show: false
				}
			}
		},
		methods: {
			...mapActions('accountModule', ['userLogout']),
			showModal() {
				this.modalInfo.show = true;
			},
			logout() {
				this.userLogout()
				uni.reLaunch({
					url: '/pages/auth/login/login?status=1'
				})
			},
			goToEditProfile() {
				uni.navigateTo({
					url: '/pages/user-center/edit-profile/edit-profile'
				})
			}
		},
		computed: {
			...mapState('accountModule', ['userInfo']),
			...mapGetters('accountModule', ['fullAvatarURL'])
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100vw;
		height: 100vh;
		background-color: WhiteSmoke;
	}

	.wrap {
		width: 100vw;
		height: 200rpx;
		display: flex;
		align-items: center;
	}

	.wrap-item {
		margin: auto 20rpx;
	}

	.wrap .avatar {}

	.wrap .realname {
		flex-grow: 1;
		color: #969799;
	}

	.wrap .right-icon {}

	.cell-group {
		width: 95vw;
		margin: 0 auto 30rpx auto;
		border-radius: 20rpx;
		background-color: white;
	}

	.logout-btn {
		margin: 40rpx 20rpx;
	}
</style>
