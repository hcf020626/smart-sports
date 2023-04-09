<template>
	<view class="container">
		<!-- 消息提示组件，用于提示用户在登录时碰到的问题 -->
		<u-toast ref="uToast"></u-toast>

		<!-- 头部 logo -->
		<view class="header">
			<image src="@/static/images/logo.png"></image>
		</view>

		<!-- 主体部分 表单 -->
		<view class="body">
			<!-- 表单组件 -->
			<u-form :model="regFormData" ref="uForm">
				<!-- 邮箱输入框 -->
				<u-form-item prop="email">
					<u-input type="text" v-model="regFormData.email" placeholder="请输入邮箱" clearable border="bottom">
						<uni-icons slot="prefix" custom-prefix="iconfont" type="icon-user" size="20">
						</uni-icons>
					</u-input>
				</u-form-item>
				<!-- 密码输入框 -->
				<u-form-item prop="password">
					<u-input type="password" v-model="regFormData.password" placeholder="请输入密码" clearable
						border="bottom">
						<uni-icons slot="prefix" custom-prefix="iconfont" type="icon-old-password" size="20">
						</uni-icons>
					</u-input>
				</u-form-item>
				<!-- 再次输入密码输入框 -->
				<u-form-item prop="password2">
					<u-input type="password" v-model="regFormData.password2" placeholder="请再次输入密码" clearable
						border="bottom">
						<uni-icons slot="prefix" custom-prefix="iconfont" type="icon-once-again-password" size="20">
						</uni-icons>
					</u-input>
				</u-form-item>
				<!-- 验证码输入框 -->
				<u-form-item prop="code">
					<u-input type="number" v-model="regFormData.code" placeholder="请输入验证码" clearable border="bottom">
						<uni-icons slot="prefix" custom-prefix="iconfont" type="icon-code" size="20"></uni-icons>
						<template slot="suffix">
							<u-code ref="uCode" @change="codeChange" seconds="120" startText="获取验证码" changeText="X秒重新获取"
								endText="重新获取">
							</u-code>
							<u-button @tap="getCode" :text="regFormData.tips" type="primary" size="mini" plain>
							</u-button>
						</template>
					</u-input>
				</u-form-item>
			</u-form>

			<!-- 注册按钮 -->
			<view class="reg-btn">
				<u-button type="primary" text="注册" :loading="isLoading" @tap="regHandler" :disabled="!isAgree">
				</u-button>
			</view>
		</view>

		<!-- 尾部 软件用户协议 -->
		<view class="footer">
			<u-checkbox-group>
				<u-checkbox shape="circle" :checked="isAgree" @change="agreeHandler"></u-checkbox>
			</u-checkbox-group>
			<text>勾选代表同意</text>
			<navigator url="../../user-center/user-agreement/user-agreement" open-type="navigate">《软件用户协议》</navigator>
		</view>
	</view>
</template>

<script>
	import api from '@/api/index.js' // 导入封装好的发送请求的api模块
	export default {
		data() {
			return {
				regFormData: { // 注册表单数据
					email: '',
					password: '',
					password2: '',
					tips: '',
					code: '',
					token: ''
				},
				isLoading: false,
				isAgree: false,
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
					password: [
						// 对 password 字段进行长度验证
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
					password2: [
						// 对 password2 字段进行必填验证
						{
							required: true,
							message: '请再次输入密码',
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
			// agreeHandler方法用于处理用户是否同意注册协议的逻辑，通过改变isAgree变量的值来更新页面上的选择框状态。
			agreeHandler() {
				this.isAgree = !this.isAgree
			},
			regHandler() {
				this.$refs.uForm.validate().then(res => {

					//如果表单合法，isLoading变量会被设置为true，表示正在加载中
					this.isLoading = true;
					// 使用setTimeout()函数模拟网络延迟
					setTimeout(async () => {
						try {
							// 调用api.parent.reg()异步请求注册接口，获取返回的status、msg
							const {
								data: {
									msg,
									status
								}
							} = await api.parent.reg({
								email: this.regFormData.email,
								password: this.regFormData.password2,
								code: this.regFormData.code,
								token: this.regFormData.token
							});

							if (!status) {
								// 弹出注册成功的提示框
								this.$refs.uToast.show({
									type: 'success',
									message: msg,
									icon: 'https://cdn.uviewui.com/uview/demo/toast/success.png',
									position: 'top'
								})

								// 清空表单元素的值和错误提示
								// this.$refs.uForm.resetFields();
							} else {
								// 弹出注册失败的提示框
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
								message: '注册发生异常，请稍后再试',
								icon: 'https://cdn.uviewui.com/uview/demo/toast/error.png',
								position: 'top'
							})
						} finally {
							this.isLoading = false;
						}
					}, 500)
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
				this.regFormData.tips = text;
			},
			getCode() {
				this.$refs.uForm.validateField('email', (errorsRes) => {
					if (errorsRes.length) {
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
									// 调用api.parent.sendCode()异步请求注册接口，获取返回的status、msg和token
									const {
										data: {
											msg,
											status,
											token
										}
									} = await api.parent.sendCode(this.regFormData.email);
									if (!status) {
										this.regFormData.token = token;
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

	.body .reg-btn {
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
