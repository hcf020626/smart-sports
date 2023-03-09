<template>
	<view class="content">
		<!-- 头部 logo -->
		<view class="header">
			<image src="@/static/logo.png"></image>
		</view>

		<view>
			<u-toast ref="uToast" />
		</view>
		<view class="body">
			<u-form :model="form" ref="uForm">
				<u-form-item prop="userName" left-icon="account" :left-icon-style="leftIconStyle">
					<u-input type="text" v-model="form.userName" placeholder="请输入用户名" />
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
					userName: '',
					password: '',
					password2: '',
					agree: false
				},
				rules: {
					userName: [
						// 以英文字母开头，只能包含英文字母、数字、下划线和短横线
						{
							pattern: /^[a-zA-Z][a-zA-Z0-9_-]*$/g,
							// 正则检验前先将值转为字符串
							transform(value) {
								return String(value);
							},
							message: '用户名必须以英文字母开头，只能包含英文字母、数字、下划线和短横线',
							trigger: ['change', 'blur']
						},
						// 对userName字段进行长度验证
						{
							min: 5,
							max: 15,
							message: '用户名长度在5-15个字符之间',
							trigger: ['change', 'blur']
						},
						// 对userName字段进行必填验证
						{
							required: true,
							message: '请输入用户名',
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['change', 'blur'],
						},
						// // 校验用户名是否已经被注册了
						// {
						// 	asyncValidator: (rule, value, callback) => {
						// 		this.$u.post('/xxx/xxx', {
						// 			name: value
						// 		}).then(res => {
						// 			// 如果验证不通过，需要在callback()抛出new Error('错误提示信息')
						// 			if (res.error) {
						// 				callback(new Error('姓名重复'));
						// 			} else {
						// 				// 如果校验通过，也要执行callback()回调
						// 				callback();
						// 			}
						// 		})
						// 	},
						// 	// 如果是异步校验，无需写message属性，错误的信息通过Error抛出即可
						// 	// message: 'xxx'
						// }
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
						api.account.reg({username: this.form.userName, password: this.form.password2}).then(res=>{
							console.log("res: ",res);
							const {data: {status, msg}} = res;
							if(!status){
								this.$refs.uToast.show({
									type: 'success',
									title: msg,
									position: 'top'
								})
							}else{
								this.$refs.uToast.show({
									type: 'error',
									title: msg,
									position: 'top'
								})
							}
						}).catch((err)=>{
							this.$refs.uToast.show({
								type: 'error',
								title: err.errMsg,
								position: 'top'
							})
						})
						
						this.form = {
							userName: '',
							password: '',
							password2: '',
							agree: false
						}
					} else {
						console.log('注册验证失败');
					}
				});
				
				
				
				// this.$refs.uToast.show({
				// 	title: '注册成功',
				// 	type: 'success',
				// 	position: 'top'
				// })
				
			},
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		}
	}
</script>

<style lang="scss" scoped>
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
