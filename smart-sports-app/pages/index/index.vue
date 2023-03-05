<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view>
			<navigator url="../auth/login/login" open-type="navigate">登录</navigator>
		</view>
		<view>
			<navigator url="../auth/reg/reg" open-type="navigate">注册</navigator>
		</view>
		<view>
			<navigator url="../auth/agreement/agreement" open-type="navigate">用户协议</navigator>
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
