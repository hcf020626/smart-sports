<template>
	<view class="container">
		<!-- 消息提示组件，用于提示用户在修改密码时碰到的问题 -->
		<u-toast ref="uToast"></u-toast>

		<view class="header">
			<text>若您忘记了密码，可在此重新设置新密码。</text>
		</view>

		<!-- 主体部分 表单 -->
		<view class="body">
			<!-- 表单组件 -->
			<u-form :model="forgetFormData" ref="uForm">
				<!-- 邮箱输入框 -->
				<u-form-item prop="email">
					<u-input type="text" v-model="forgetFormData.email" placeholder="请输入邮箱" clearable border="bottom">
					</u-input>
				</u-form-item>
				<!-- 密码输入框 -->
				<u-form-item prop="newPassword">
					<u-input type="password" v-model="forgetFormData.newPassword" placeholder="请输入新密码" clearable
						border="bottom">
					</u-input>
				</u-form-item>
				<!-- 验证码输入框 -->
				<u-form-item prop="code">
					<u-input type="number" v-model="forgetFormData.code" placeholder="请输入验证码" clearable border="bottom">
						<template slot="suffix">
							<u-code ref="uCode" @change="codeChange" seconds="120" startText="获取验证码" changeText="X秒重新获取"
								endText="重新获取">
							</u-code>
							<u-button @tap="getCode" :text="forgetFormData.tips" type="primary" size="mini" plain>
							</u-button>
						</template>
					</u-input>
				</u-form-item>
			</u-form>

			<!-- 修改密码按钮 -->
			<view class="forget-btn">
				<u-button type="primary" text="修改密码" :loading="isLoading" @tap="forgetHandler">
				</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import api from '@/api/index.js' // 导入封装好的发送请求的api模块
	export default {
		data() {
			return {
				forgetFormData: { // 修改密码表单数据
					email: '',
					newPassword: '',
					tips: '',
					code: '',
					token: ''
				},
				isLoading: false,
				rules: { // 表单验证规则
					email: [
						// 对 email 字段进行格式验证
						{
							type: 'email',
							message: '邮箱格式不正确',
							trigger: ['change', 'blur']
						},
						// 对 email 字段进行必填验证
						{
							required: true,
							message: '请输入邮箱',
							trigger: ['change', 'blur'],
						},
					],
					newPassword: [
						// 对 newPassword 字段进行长度验证
						{
							min: 6,
							max: 20,
							message: '密码长度在6-20个字符之间',
							trigger: ['change', 'blur']
						},
						// 对 password 字段进行必填验证
						{
							required: true,
							message: '请输入密码',
							trigger: ['change', 'blur'],
						},
					],
					code: [
						// 对 code 字段进行必填验证
						{
							required: true,
							message: '请输入验证码',
							trigger: ['change', 'blur'],
						},
						// 自定义规则对 code 字段进行格式验证
						{
							validator: (rule, value, callback) => {
								// 返回true表示校验通过，返回false表示不通过
								return uni.$u.test.code(value, 6)
							},
							trigger: ['change', 'blur'],
							message: '验证码为6位数字'
						},
					],
				}
			}
		},
		methods: {
			forgetHandler() {
				this.$refs.uForm.validate().then(res => {

					//如果表单合法，isLoading变量会被设置为true，表示正在加载中
					this.isLoading = true;
					// 使用setTimeout()函数模拟网络延迟
					setTimeout(async () => {
						try {
							// 调用api.parent.reg()异步请求修改密码接口，获取返回的status、msg
							const {
								data: {
									msg,
									status
								}
							} = await api.parent.forget({
								email: this.forgetFormData.email,
								password: this.forgetFormData.newPassword,
								code: this.forgetFormData.code,
								token: this.forgetFormData.token
							});

							if (!status) {
								// 弹出修改密码成功的提示框
								this.$refs.uToast.show({
									type: 'success',
									message: msg,
									icon: 'https://cdn.uviewui.com/uview/demo/toast/success.png',
									position: 'top'
								})

								// 清空表单元素的值和错误提示
								// this.$refs.uForm.resetFields();
							} else {
								// 弹出修改密码失败的提示框
								this.$refs.uToast.show({
									type: 'error',
									message: msg,
									icon: 'https://cdn.uviewui.com/uview/demo/toast/error.png',
									position: 'top'
								})
							}
						} catch (e) {
							//TODO handle the exception
							this.$refs.uToast.show({
								type: 'error',
								message: '修改密码发生异常，请稍后再试',
								icon: 'https://cdn.uviewui.com/uview/demo/toast/error.png',
								position: 'top'
							})
						} finally {
							console.log('here');
							this.isLoading = false;
						}
					}, 1500)
				}).catch(errors => {
					console.log("errors: ", errors);
					// 如果表单不合法，则在页面上弹出错误提示框
					return this.$refs.uToast.show({
						type: 'error',
						message: '请正确填写表单的每一项',
						icon: 'https://cdn.uviewui.com/uview/demo/toast/error.png',
						position: 'top'
					})
				})
			},
			codeChange(text) {
				this.forgetFormData.tips = text;
			},
			getCode() {
				this.$refs.uForm.validateField('email', (errorsRes)=>{
					if(errorsRes.length){
						console.log("errors: ", errorsRes);
						// 如果邮箱字段校验失败，则在页面上弹出错误提示框
						return this.$refs.uToast.show({
							type: 'error',
							message: errorsRes[0].message,
							icon: 'https://cdn.uviewui.com/uview/demo/toast/error.png',
							position: 'top'
						})
					}
					
					if (this.$refs.uCode.canGetCode) {
						uni.showLoading({
							title: '正在获取验证码'
						})
					
						try {
							setTimeout(async () => {
								try {
									// 调用api.parent.sendCode()异步请求修改密码接口，获取返回的status、msg和token
									const {
										data: {
											msg,
											status,
											token
										}
									} = await api.parent.sendCode(this.forgetFormData.email);
									if (!status) {
										this.forgetFormData.token = token;
										this.$refs.uToast.show({
											type: 'success',
											message: msg,
											icon: 'https://cdn.uviewui.com/uview/demo/toast/sucess.png',
											position: 'top'
										})
										// 通知验证码组件内部开始倒计时
										this.$refs.uCode.start();
									} else {
										this.$refs.uToast.show({
											type: 'error',
											message: msg,
											icon: 'https://cdn.uviewui.com/uview/demo/toast/error.png',
											position: 'top'
										})
									}
								} catch (e) {
									//TODO handle the exception
									console.log("e: ", e);
									this.$refs.uToast.show({
										type: 'error',
										message: '请求发生问题，请稍后再试',
										icon: 'https://cdn.uviewui.com/uview/demo/toast/error.png',
										position: 'top'
									})
								} finally {
									uni.hideLoading()
								}
							}, 500)
					
						} catch (e) {
							//TODO handle the exception
							this.$refs.uToast.show({
								type: 'error',
								message: e.errMsg,
								icon: 'https://cdn.uviewui.com/uview/demo/toast/error.png',
								position: 'top'
							})
						}
					} else {
						uni.$u.toast('倒计时结束后再发送');
					}
				})
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
		width: 80vw;
		color: #999999;
		font-size: 28rpx;
		line-height: 50rpx;
		margin: 50rpx auto;
	}

	.body {
		width: 80vw;
		display: flex;
		flex-direction: column;
		margin: 0 auto;
	}

	.body .u-form {}

	.body .forget-btn {
		width: 100%;
		margin: 60rpx 0;
	}
</style>
