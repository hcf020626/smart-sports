<template>
	<view class="content">
		<!-- 头部 logo -->
		<view class="header">
			<image src="@/static/logo.png"></image>
		</view>
		<uni-forms :modelValue="FormData" class="body">
			<uni-forms-item>
				<uni-easyinput prefixIcon="person" type="text" v-model="FormData.userName" placeholder="请输入用户名" />
			</uni-forms-item>
			<uni-forms-item>
				<uni-easyinput prefixIcon="locked" type="password" v-model="FormData.password" placeholder="请输入密码" />
			</uni-forms-item>
			<uni-forms-item>
				<button class="g-btn g-btn--light-blue u-small u-block">登录</button>
			</uni-forms-item>
		</uni-forms>
		
		<view class="footer">
			<navigator class="link" url="../forget/forget" open-type="navigate">忘记密码</navigator>
			<text>|</text>
			<navigator class="link" url="../reg/reg" open-type="navigate">注册账户</navigator>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				FormData: {
					userName: '',
					password: ''
				}
			}
		},
	}
</script>

<style>
	.content {
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	}

	.header {
		width: 200rpx;
		height: 200rpx;
		background: rgba(63, 205, 235, 1);
		box-shadow: 0rpx 12rpx 13rpx 0rpx rgba(63, 205, 235, 0.47);
		border-radius: 50%;
		margin-top: 30rpx;
		margin-left: auto;
		margin-right: auto;
	}

	.header image {
		width: 200rpx;
		height: 200rpx;
		border-radius: 50%;
	}
	
	.body {
		width: 80vw;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		margin: 120rpx auto 0 auto;
	}

	.footer {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: 30rpx;
		margin-top: 10rpx;
		text-align: center;
		color: gray;
		height: 40rpx;
		line-height: 40rpx;
	}

	.footer text {
		font-size: 24rpx;
		margin-left: 15rpx;
		margin-right: 15rpx;
	}
</style>
