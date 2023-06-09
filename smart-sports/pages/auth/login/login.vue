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
			<!-- 表单组件，用于接收用户输入的邮箱和密码 -->
			<u-form :model="loginFormData" ref="uForm">
				<u-form-item prop="email">
					<!-- 邮箱输入框 -->
					<u-input v-model="loginFormData.email" placeholder="请输入邮箱" clearable border="bottom">
						<uni-icons slot="prefix" custom-prefix="iconfont" type="icon-user" size="20">
						</uni-icons>
					</u-input>
				</u-form-item>
				<u-form-item prop="password">
					<!-- 密码输入框 -->
					<u-input type="password" v-model="loginFormData.password" placeholder="请输入密码"
						clearable border="bottom">
						<uni-icons slot="prefix" custom-prefix="iconfont" type="icon-old-password" size="20"></uni-icons>
					</u-input>
				</u-form-item>
			</u-form>

			<!-- 登录按钮 -->
			<view class="login-btn">
				<u-button type="primary" text="登录" :loading="isLoading" @tap="clickLoginBtn"></u-button>
			</view>
		</view>

		<!-- 滑动验证组件 -->
		<tf-verify-img @succeed="verifySucceed" @close="showVerify = false" v-if="showVerify"></tf-verify-img>

		<!-- 尾部 忘记密码和注册账户 -->
		<view class="footer">
			<!-- 忘记密码链接 -->
			<navigator class="link" url="../forget/forget" open-type="navigate">忘记密码</navigator>
			<text>|</text>
			<!-- 注册账户链接 -->
			<navigator class="link" url="../reg/reg" open-type="navigate">注册账户</navigator>
		</view>

	</view>
</template>

<script>
	import api from '@/api/index.js' // 导入封装好的发送请求的api模块
	import {
		mapState,
		mapActions
	} from 'vuex' // 导入vuex的辅助函数mapActions
	import {baseURL} from '@/config.js'
	import tfVerifyImg from '@/components/tf-verify-img/tf-verify-img.vue'; // 导入滑块验证组件

	export default {
		components: {
			tfVerifyImg
		},
		data() {
			return {
				enterStatus: '', // 进入登录页面时的状态
				loginFormData: { // 登录表单数据
					email: '',
					password: ''
				},
				isLoading: false,
				showVerify: false,
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
						}
					],
				}
			}
		},
		computed: {
			...mapState('studentModule', ['studentInfo']),
		},
		methods: {
			...mapActions('parentModule', ['parentLogin']),
			...mapActions('studentModule', ['updateStudentInfo']),
			clickLoginBtn() {
				this.$refs.uForm.validate().then(res => {
					// 显示滑块验证
					this.showVerify = true;
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
			verifySucceed() {
				// 验证成功，执行登录逻辑
				this.$refs.uToast.show({
					type: 'default',
					message: '验证成功',
					icon: 'https://cdn.uviewui.com/uview/demo/toast/default.png',
					position: 'top'
				})
				this.showVerify = false;
				
				//如果表单合法，isLoading变量会被设置为true，表示正在加载中
				this.isLoading = true;
				// 使用setTimeout()函数模拟网络延迟
				setTimeout(async () => {
					try {
						// 调用api.parent.login()异步请求登录接口，获取返回的status、msg、token和data等数据
						const {
							data: {
								status,
								msg,
								token,
								data
							}
						} = await api.parent.login({
							email: this.loginFormData.email,
							password: this.loginFormData.password
						});
				
						if (!status) {
							// 将用户信息和token保存到Vuex和本地存储中
							this.parentLogin({
								token,
								parentInfo: data.parentInfo
							})
							
							// 将学生信息保存到Vuex和本地存储中
							this.updateStudentInfo({
								avatar_url: baseURL + data.studentInfo.avatar_url,
								name: data.studentInfo.name,
								gender: data.studentInfo.gender,
								age: data.studentInfo.age,
								school: data.studentInfo.school,
								className: data.studentInfo.class,
								id: data.studentInfo.id
							})
				
							// 弹出登录成功的提示框，并稍后跳转到首页
							this.$refs.uToast.show({
								type: 'success',
								message: msg,
								icon: 'https://cdn.uviewui.com/uview/demo/toast/success.png',
								position: 'top',
								duration: 1500,
								complete() {
									uni.switchTab({
										url: '/pages/index/index'
									})
								}
							})
						} else {
							// 弹出登录失败的提示框
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
						this.isLoading = false;
					}
				}, 1500)
			},
		},
		onLoad({
			status
		}) {
			// 如果 status 等于 1，则说明是点击退出登录按钮来到登录页面的，弹出对应的消息提示框
			this.enterStatus = status
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules);

			if (this.enterStatus === '1') {
				this.$refs.uToast.show({
					type: 'success',
					message: '您已经成功退出登录',
					icon: 'https://cdn.uviewui.com/uview/demo/toast/success.png',
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

	.body .login-btn {
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
