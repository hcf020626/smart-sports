<template>
	<view class="content">
		<u-toast ref="uToast"></u-toast>
		<image class="logo" src="/static/logo.png"></image>
		<view>
			<navigator url="../auth/login/login" open-type="navigate">登录</navigator>
		</view>
		<view>
			<navigator url="../auth/reg/reg" open-type="navigate">注册</navigator>
		</view>
		<view>
			<u-button type="primary" @tap="showInfo">点我</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {
			showInfo(){
				
				const user = {
					...JSON.parse(uni.getStorageSync('userInfo'))
				}
				console.log("user: ",user);
			}
		}
	}
</script>

<style>
	.content {
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
	}

</style>
