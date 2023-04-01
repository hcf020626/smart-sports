<template>
	<!-- 页面容器 -->
	<view class="container">
		<!-- 消息提示组件，用于提示用户在登录时碰到的问题 -->
		<u-toast ref="uToast"></u-toast>

		<u-form :model="formData" ref="uFrom">

			<u-form-item prop="oldPassword">
				<u-input type="password" v-model="formData.oldPassword" placeholder="请输入旧密码" :clearable="true"></u-input>
			</u-form-item>

			<u-form-item prop="newPassword">
				<u-input type="password" v-model="formData.newPassword" placeholder="请输入新密码" :clearable="true"></u-input>
			</u-form-item>

			<u-form-item prop="newPassword2">
				<u-input type="password" v-model="formData.newPassword2" placeholder="请再次输入新密码" :clearable="true"></u-input>
			</u-form-item>

			<u-form-item prop="captcha">
				<u-input type="text" v-model="formData.captcha" placeholder="请输入验证码" :clearable="true">
					<image slot="suffix" :src="svgUrl" mode="aspectFill" @click="refreshCaptcha" style="width: 300rpx; height: 100rpx;"/>
				</u-input>
			</u-form-item>

			<u-form-item>
				<u-button type="primary" class="save-btn" @click="submitChanges">提交修改</u-button>
			</u-form-item>
		</u-form>
	</view>
</template>

<script>
	import api from '@/api/index.js'
	import {
		mapActions
	} from 'vuex'
	import {baseURL} from '@/config.js'
	export default {
		data() {
			return {
				svgUrl: '',
				formData: {
					oldPassword: '',
					newPassword: '',
					newPassword2: '',
					captcha: '',
					token: ''
				},
				rules: {
					oldPassword: [{
						required: true,
						message: '请输入旧密码',
						trigger: ['change', 'blur']
					},{
						min: 6,
						max: 20,
						message: '密码长度在6-20个字符之间',
						trigger: ['change', 'blur']
					}],
					newPassword: [{
						min: 6,
						max: 20,
						message: '密码长度在6-20个字符之间',
						trigger: ['change', 'blur']
					}, {
						required: true,
						message: '请输入新密码',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					newPassword2: [{
							required: true,
							message: '请再次输入新密码',
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['change', 'blur'],
						},
						// 自定义规则判断密码是否一致
						{
							validator: (rule, value, callback) => {
								return this.formData.newPassword === value
							},
							trigger: ['change', 'blur'],
							message: '两次密码不一致'
						},
					],
					captcha: [{
						required: true,
						message: '请输入验证码',
						trigger: ['change', 'blur']
					}]
				}
			}
		},
		methods: {
			...mapActions('accountModule', ['updatePassword']),
			refreshCaptcha(){
				uni.request({
					url: baseURL + '/account/send-captcha',
					method: 'GET',
					success: (res) => {
						console.log("res: ",res);
						this.svgUrl = 'data:image/svg+xml;base64,' + btoa(res.data.data);
						this.formData.token = res.data.token;
					},
					header: {
						Authorization: uni.getStorageSync('token')
					}
				})
			},
			async submitChanges() {
				try {
					const isValid = await this.$refs.uFrom.validate();

					if (!isValid) {						
						return this.$refs.uToast.show({
							type: 'error',
							message: '表单校验失败，请正确填写表单的每一项',
							icon: 'https://cdn.uviewui.com/uview/demo/toast/error.png',
							position: 'top'
						})
					}

					const {
						data: {
							msg,
							status,
							password
						}
					} = await api.account.updatePassword({
						email: this.$store.state.accountModule.userInfo.email,
						oldPassword: this.formData.oldPassword,
						newPassword: this.formData.newPassword2,
						captcha: this.formData.captcha,
						token: this.formData.token
					});
					if (!status) {
						this.updatePassword(password);
						this.$refs.uToast.show({
							type: 'success',
							message: msg,
							icon: 'https://cdn.uviewui.com/uview/demo/toast/success.png',
							position: 'top',
							complete(){
								uni.reLaunch({
									url: '/pages/auth/login/login',
								})
							}
						})
					}else{
						this.$refs.uToast.show({
							type: 'error',
							message: msg,
							icon: 'https://cdn.uviewui.com/uview/demo/toast/error.png',
							position: 'top'
						})
					}
				} catch (e) {
					console.log("e: ",e);
					const {data: {msg}} = e
					//TODO handle the exception
					this.$refs.uToast.show({
						type: 'error',
						message: msg,
						icon: 'https://cdn.uviewui.com/uview/demo/toast/error.png',
						position: 'top'
					})
				}
			}
		},
		onReady() {
			//如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
			this.$refs.uFrom.setRules(this.rules)
		},
		mounted() {
			uni.request({
				url: baseURL + '/account/send-captcha',
				method: 'GET',
				success: (res) => {
					console.log("res: ",res);
					this.svgUrl = 'data:image/svg+xml;base64,' + btoa(res.data.data);
					this.formData.token = res.data.token
				},
				header: {
					Authorization: uni.getStorageSync('token')
				}
			})
		}
	}
</script>

<style scoped>
	.container {
		width: 100vw;
		height: 100vh;
		background-color: WhiteSmoke;
	}

	.u-form {
		width: 90vw;
		margin: 0 auto;
	}

	.save-btn {
		margin: 40rpx 20rpx;
	}
</style>
