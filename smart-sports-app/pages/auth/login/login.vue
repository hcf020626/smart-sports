<template>
	<view class="container">
		<!-- 消息提示组件，用于提示用户在登录时碰到的问题 -->
		<u-toast ref="uToast"></u-toast>
		
		<!-- 头部 logo -->
		<view class="header">
			<image src="@/static/logo.png"></image>
		</view>

		<!-- 主体 表单 -->
		<view class="body">
			<u-form :model="form" ref="uForm">
				<u-form-item prop="phone" left-icon="account" :left-icon-style="leftIconStyle">
					<u-input type="text" v-model="form.phone" placeholder="请输入手机号码" />
				</u-form-item>
				<u-form-item prop="password" left-icon="lock" :left-icon-style="leftIconStyle">
					<u-input type="password" v-model="form.password" placeholder="请输入密码" />
				</u-form-item>
				<u-form-item prop="captcha" left-icon="file-text" :left-icon-style="leftIconStyle">
					<u-input type="text" v-model="form.captcha" placeholder="请输入验证码" />
				</u-form-item>
			</u-form>
			<u-button type="primary" @tap="loginHandler">登录</u-button>
		</view>

		<!-- 尾部 忘记密码和注册账户 -->
		<view class="footer">
			<navigator class="link" url="../forget/forget" open-type="navigate">忘记密码</navigator>
			<text>|</text>
			<navigator class="link" url="../reg/reg" open-type="navigate">注册账户</navigator>
		</view>

	</view>
</template>

<script>
	import api from '@/api/index.js'
	import {mapActions} from 'vuex'
	export default {
		data() {
			return {
				status: '',
				leftIconStyle: {'fontSize':'35rpx'},
				form: {
					phone: '',
					password: '',
					captcha: ''
				},
				rules: {
					phone: [
						{
							pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/g,
							// 正则检验前先将值转为字符串
							transform(value) {
								return String(value);
							},
							message: '手机号码格式不正确',
							trigger: ['change', 'blur']
						},
						// 对 phone 字段进行必填验证
						{
							required: true,
							message: '请输入手机号码',
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['change', 'blur'],
						},
					],
					password: [{
							min: 6,
							max: 20,
							message: '密码长度在6-20个字符之间',
							trigger: ['change', 'blur']
						},
						{
							required: true,
							message: '请输入密码',
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['change', 'blur'],
						}
					],
					captcha: [{
						required: true,
						message: '请输入验证码',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
				}
			}
		},
		methods: {
			...mapActions('accountModule', ['userLogin']),
			loginHandler() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						console.log('登录验证通过');
						api.account.login({phone: this.form.phone, password: this.form.password}).then(res=>{
							const {data: {status, msg, data, token}} = res;
							if(!status){
								// 将用户信息和 token 保存到Vuex和本地存储中
								this.userLogin({token, userInfo: data})
								// 弹出登录成功的提示框，并稍后跳转到首页
								this.$refs.uToast.show({
									type: 'success',
									title: msg,
									position: 'top',
									callback(){
										uni.switchTab({
											url: '/pages/index/index'
										})
									}
								})
							}else{
								// 弹出登录失败的提示框
								this.$refs.uToast.show({
									type: 'error',
									title: msg,
									position: 'top'
								})
							}
						}).catch((err)=>{
							// 弹出登录失败的提示框
							this.$refs.uToast.show({
								type: 'error',
								title: err.errMsg,
								position: 'top'
							})
						})
					} else {
						console.log('登录验证失败');
					}
				});
			}
		},
		onLoad({status}) {
			// 如果 status 等于 1，说明点击退出登录来到登录页面的，则弹出消息提示框
			this.status = status
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules);
			
			if(this.status === '1'){
				this.$refs.uToast.show({
					type: 'success',
					title: '您已经退出登录',
					position: 'top'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
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
		margin: 120rpx auto 0 auto;
	}

	.body .u-btn {
		width: 100%;
		margin: 60rpx 0;
	}

	.footer {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: 30rpx;
		text-align: center;
		color: $u-content-color;
		height: 40rpx;
		line-height: 40rpx;
	}

	.footer text {
		font-size: 24rpx;
		margin-left: 15rpx;
		margin-right: 15rpx;
	}
</style>
