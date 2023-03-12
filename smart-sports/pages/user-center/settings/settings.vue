<template>
	<view class="container">
		<view class="cell-group">
			<u-cell-group :border="false">
				<u-cell icon="account" title="个人资料" :border="false" isLink></u-cell>
				<u-cell icon="lock" title="修改密码" :border="false" isLink></u-cell>
			</u-cell-group>
		</view>

		<view class="cell-group">
			<u-cell-group :border="false">
				<u-cell icon="file-text" title="用户协议" :border="false" isLink></u-cell>
				<u-cell icon="question" title="隐私政策" :border="false" isLink></u-cell>
			</u-cell-group>
		</view>

		<view class="logout-btn">
			<u-button type="error" @tap="showModal">退出登录</u-button>
		</view>

		<u-modal :show="modalInfo.show" :content="modalInfo.content" @confirm="logout" :showCancelButton="true" @cancel="modalInfo.show=false"></u-modal>
	</view>
</template>

<script>
	import {mapActions} from 'vuex'
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
				console.log('here in show modal');
			},
			logout() {
				this.userLogout()
				uni.reLaunch({
					url: '/pages/auth/login/login?status=1'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100vw;
		height: 100vh;
		background-color: WhiteSmoke ;
	}
	.cell-group{
		width: 100vw;
		margin: 20rpx 0;
		background-color: white;
	}
	.logout-btn {
		margin: 40rpx 20rpx;
	}
</style>
