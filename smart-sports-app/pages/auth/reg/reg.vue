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
					<u-input type="text" v-model="form.phone" placeholder="请输入用户名" />
				</u-form-item>
				<u-form-item prop="password" left-icon="lock" :left-icon-style="leftIconStyle">
					<u-input type="password" v-model="form.password" placeholder="请输入密码" />
				</u-form-item>
				<u-form-item prop="password2" left-icon="lock" :left-icon-style="leftIconStyle">
					<u-input type="password" v-model="form.password2" placeholder="请再次输入密码" />
				</u-form-item>
			</u-form>
			<u-button type="primary" @tap="regHandler" :disabled="!form.agree">注册</u-button>
		</view>

		<!-- 尾部 忘记密码和注册账户 -->
		<view class="footer">
			<u-checkbox v-model="form.agree" shape="circle"></u-checkbox><text>勾选代表同意</text>
			<navigator url="./agreement/agreement" open-type="navigate">《软件用户协议》</navigator>
		</view>

	</view>
</template>

<script>
	import api from '@/api/index.js'
	export default {
		data() {
			return {
				leftIconStyle: {'fontSize':'35rpx'},
				form: {
					phone: '',
					password: '',
					password2: '',
					agree: false
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
						},
					],
					password2: [{
							required: true,
							message: '请再次输入密码',
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['change', 'blur'],
						},
						// 自定义规则判断密码是否一致
						{
							validator: (rule, value, callback) => {
								return this.form.password === value
							},
							trigger: ['change', 'blur'],
							message: '两次密码不一致'
						},
					],
				}
			}
		},
		methods: {
			regHandler() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						console.log('注册验证通过');
						console.log("this.form: ",this.form);
						api.account.reg({phone: this.form.phone, password: this.form.password2}).then(res=>{
							const {data: {status, msg}} = res;
							if(!status){
								// 弹出注册成功的提示框，并清空表单数据
								this.$refs.uToast.show({
									type: 'success',
									title: msg,
									position: 'top'
								})
								
								this.form = {
									userName: '',
									password: '',
									password2: '',
									agree: false
								}
							}else{
								// 弹出注册失败的提示框
								this.$refs.uToast.show({
									type: 'error',
									title: msg,
									position: 'top'
								})
							}
						}).catch((err)=>{
							// 弹出注册失败的提示框
							this.$refs.uToast.show({
								type: 'error',
								title: err.errMsg,
								position: 'top'
							})
						})
					} else {
						console.log('注册验证失败');
					}
				});
			},
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules);
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

	.body .u-form {}

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
		font-size: 0.8rem;
	}
</style>
