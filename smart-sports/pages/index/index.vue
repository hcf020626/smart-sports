<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>
		<view>
			<navigator url="../auth/login/login" open-type="navigate">登录</navigator>
		</view>
		<view>
			<navigator url="../auth/reg/reg" open-type="navigate">注册</navigator>
		</view>
		<view>
			<u-button type="primary" @click="showInfo">点我在控制台输出 Vuex 中的用户数据</u-button>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				title: 'Smart Sports',
				show: false
			}
		},
		onLoad() {

		},
		computed: {
			...mapState('accountModule', ['userInfo', 'token'])
		},
		methods: {
			showInfo(){
				console.log("this.userInfo: ",this.userInfo);
				console.log("this.token: ",this.token);
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
