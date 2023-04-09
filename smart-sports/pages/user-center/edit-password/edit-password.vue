<template>
	<!-- 页面容器 -->
	<view class="container">
		<!-- 消息提示组件，用于提示用户在编辑密码时碰到的问题 -->
		<u-toast ref="uToast"></u-toast>

		<u-form :model="formData" ref="uForm">
			<u-form-item prop="oldPassword">
				<u-input type="password" v-model="formData.oldPassword" placeholder="请输入旧密码" :clearable="true">
					<uni-icons slot="prefix" custom-prefix="iconfont" type="icon-mima" color="grey" size="25">
					</uni-icons>
				</u-input>
			</u-form-item>

			<u-form-item prop="newPassword">
				<u-input type="password" v-model="formData.newPassword" placeholder="请输入新密码" :clearable="true">
					<uni-icons slot="prefix" custom-prefix="iconfont" type="icon-xinmima" color="grey" size="25">
					</uni-icons>
				</u-input>
			</u-form-item>

			<u-form-item prop="newPassword2">
				<u-input type="password" v-model="formData.newPassword2" placeholder="请再次输入新密码" :clearable="true">
					<uni-icons slot="prefix" custom-prefix="iconfont" type="icon-zaicishurumima" color="grey" size="25">
					</uni-icons>
				</u-input>
			</u-form-item>
			
			<!-- 滑动验证组件 -->
			<tf-verify-img @succeed="verifySucceed" @close="showVerify = false" v-if="showVerify"></tf-verify-img>

			<u-form-item>
				<u-button type="primary" text="提交修改" :loading="isLoading" @click="clickSaveBtn"></u-button>
			</u-form-item>
		</u-form>
	</view>
</template>

<script>
	import api from '@/api/index.js'
	import {
		mapActions
	} from 'vuex'
	export default {
		data() {
			return {
				showVerify: false,
				isLoading: false,
				formData: {
					oldPassword: '',
					newPassword: '',
					newPassword2: '',
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
				}
			}
		},
		methods: {
			...mapActions('parentModule', ['updateParentInfo']),
			clickSaveBtn(){
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
				// 验证成功，执行修改密码的逻辑
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
					
						const {
							data: {
								msg,
								status,
								password
							}
						} = await api.parent.updatePassword({
							email: this.$store.state.parentModule.parentInfo.email,
							oldPassword: this.formData.oldPassword,
							newPassword: this.formData.newPassword2,
						});
						if (!status) {
							this.updateParentInfo({password});
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
						//TODO handle the exception
						console.log("e: ", e);
						this.$refs.uToast.show({
							type: 'error',
							message: '请求发生问题，请稍后再试',
							icon: 'https://cdn.uviewui.com/uview/demo/toast/error.png',
							position: 'top'
						})
					}finally {
						this.isLoading = false;
					}
				}, 1500)
			}
		},
		onReady() {
			//如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
			this.$refs.uForm.setRules(this.rules)
		},
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
</style>
