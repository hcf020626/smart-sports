<template>
	<view>
		<u-cell-group title="账号">
			<u-cell-item icon="edit-pen" title="个人资料"></u-cell-item>
			<u-cell-item icon="edit-pen" title="修改密码"></u-cell-item>
		</u-cell-group>

		<u-cell-group title="关于">
			<u-cell-item icon="edit-pen" title="用户协议"></u-cell-item>
			<u-cell-item icon="edit-pen" title="隐私政策"></u-cell-item>
		</u-cell-group>

		<view class="logout-btn">
			<u-button type="error" @tap="showModal">退出登录</u-button>
		</view>

		<u-modal v-model="modalInfo.show" :content="modalInfo.content" @confirm="logout"></u-modal>
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
				},
				checked: false
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.logout-btn {
		margin: 40rpx 20rpx;
	}
</style>
