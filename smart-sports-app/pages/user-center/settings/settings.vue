<template>
	<view>
		<u-cell-group title="账号">
			<u-cell-item  icon="edit-pen" title="个人资料"></u-cell-item>
			<u-cell-item  icon="edit-pen" title="修改密码"></u-cell-item>
		</u-cell-group>
		
		<u-cell-group title="关于">
			<u-cell-item  icon="edit-pen" title="用户协议"></u-cell-item>
			<u-cell-item  icon="edit-pen" title="隐私政策"></u-cell-item>
		</u-cell-group>
		
		<view class="logout-btn">
			<u-button type="error">退出登录</u-button>
		</view> 
	</view>
</template>

<script>
	export default {
		data() {
			return {
				checked: false
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
	.logout-btn {
		margin: 40rpx 20rpx;
	}
</style>
