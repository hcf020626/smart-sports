<template>
	<!--页面容器-->
	<view class="container">
		<!-- 消息提示组件，用于提示用户在保存个人资料时碰到的问题 -->
		<u-toast ref="uToast"></u-toast>

		<u-form :model="formData" ref="uForm" labelPosition="left" labelWidth="70" :labelStyle="{fontSize:'30rpx'}"
			errorType="border-bottom">
			<!--头像表单项，使用 u-avatar 显示头像，点击头像触发上传事件-->
			<u-form-item label="头像" borderBottom>
				<u-avatar slot="right" :src="formData.avatar_url" shape="circle" size="60" @click="uploadAvatar">
				</u-avatar>
			</u-form-item>
			<!--姓名表单项，使用 u-input 输入姓名，必须为中文-->
			<u-form-item label="姓名" prop="realname" borderBottom>
				<u-input type="text" v-model="formData.realname" border="none" placeholder="姓名,只能为中文"
					inputAlign="right">
				</u-input>
			</u-form-item>
			<!--性别表单项，使用 u-input 输入框，点击输入框弹出 u-action-sheet 选择性别-->
			<u-form-item label="性别" prop="gender" borderBottom @click="isShowActionSheet = true">
				<u-input type="text" v-model="formData.gender" border="none" placeholder="请选择性别" disabled
					disabledColor="#F5F5F5" inputAlign="right" suffixIcon="arrow-right"></u-input>
			</u-form-item>
			<!--手机号表单项，使用 u-input 输入手机号-->
			<u-form-item label="手机号" prop="phone" borderBottom>
				<u-input type="number" v-model="formData.phone" border="none" placeholder="请输入手机号码" inputAlign="right">
				</u-input>
			</u-form-item>
			<!--身份证号表单项，使用 u-input 输入身份证号，需要校验-->
			<u-form-item label="身份证号" prop="idcard" borderBottom>
				<u-input type="idcard" v-model="formData.idcard" border="none" placeholder="请输入身份证号码"
					inputAlign="right">
				</u-input>
			</u-form-item>

			<!--保存按钮，点击触发 saveUserInfo 事件-->
			<u-form-item>
				<u-button type="primary" :loading="isLoading" loading-text="保存" @click="saveUserInfo">保存</u-button>
			</u-form-item>
		</u-form>

		<!--性别选择弹窗，使用 u-action-sheet 显示-->
		<u-action-sheet :actions="actionList" :closeOnClickOverlay="false" :closeOnClickAction="true"
			@select="selectGender" @close="isShowActionSheet=false" :show="isShowActionSheet" cancelText="取消">
		</u-action-sheet>
	</view>
</template>

<script>
	import {
		mapState,
		mapActions,
		mapGetters
	} from 'vuex'
	import {
		baseURL
	} from '@/config.js'
	import api from '@/api/index.js'
	export default {
		data() {
			return {
				formData: {
					realname: '',
					gender: '',
					phone: '',
					idcard: '',
					avatar_url: '',
				},
				isLoading: false,
				isShowActionSheet: false,
				actionList: [{
						name: '男'
					},
					{
						name: '女'
					},
				],
				// 一个字段可以设置多个内置规则，以及自定义规则，触发方式等， 每个字段的验证规则为一个数组，数组的每一个元素对象为其中一条规则
				rules: {
					realname: [{
							required: true,
							trigger: ['blur', 'change']
						},
						{
							pattern: /^[\u4e00-\u9fa5]+$/g,
							// 正则检验前先将值转为字符串
							transform(value) {
								return String(value);
							},
							trigger: ['blur', 'change']
						}
					],
					gender: [{
						required: true,
						trigger: ['blur', 'change']
					}],
					phone: [{
							required: true,
							trigger: ['change', 'blur'],
						},
						{
							// 自定义验证函数
							validator: (rule, value, callback) => {
								// 返回true表示校验通过，返回false表示不通过
								return uni.$u.test.mobile(value);
							},
							// 触发器可以同时用blur和change
							trigger: ['change', 'blur'],
						}
					],
					idcard: [{
						required: true,
						trigger: ['change', 'blur'],
					}, {
						pattern: /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dxX]$/g,
						// 正则检验前先将值转为字符串
						transform(value) {
							return String(value);
						},
						trigger: ['blur', 'change']
					}]
				}
			}
		},
		computed: {
			...mapState('accountModule', ['userInfo']),
			...mapGetters('accountModule', ['full_avatar_url'])
		},
		methods: {
			...mapActions('accountModule', ['updateUserInfo']),
			selectGender(index) {
				this.formData.gender = index.name
			},
			uploadAvatar() {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						this.formData.avatar_url = res.tempFilePaths[0]
					}
				})
			},
			saveUserInfo() {
				this.$refs.uForm.validate().then(res => {
					//如果表单合法，isLoading变量会被设置为true，表示正在加载中
					this.isLoading = true;
					// 使用setTimeout()函数模拟网络延迟
					// 使用setTimeout()函数模拟网络延迟
					setTimeout(async () => {
						try {
							// 调用api.account.saveUserInfo()异步请求保存用户接口，获取返回的status、msg、token和data等数据
							const {
								data: {
									msg,
									status,
									updatedUserInfo
								}
							} = await api.account.saveUserInfo({
								email: this.userInfo.email,
								realname: this.formData.realname,
								gender: this.formData.gender,
								idcard: this.formData.idcard,
								phone: this.formData.phone,
								avatar_url: this.formData.avatar_url,
								cur_bonding_id: this.userInfo.idcard === this.formData
									.idcard ? this.userInfo.cur_bonding_id : null
							});
							if (!status) {
								// 请求成功，更新本地用户信息，如果用户身份证信息发生变更，将本地的cur_bonding_id设置为1，提示用户需要重新进行亲子绑定。
								this.updateUserInfo({
									...updatedUserInfo,
									cur_bonding_id: this.userInfo.idcard === this.formData
										.idcard ? this.userInfo.cur_bonding_id : '-1'
								})
								// 弹出保存成功的提示框
								this.$refs.uToast.show({
									type: 'success',
									message: msg,
									icon: 'https://cdn.uviewui.com/uview/demo/toast/success.png',
									position: 'top'
								})
							} else {
								this.$refs.uToast.show({
									type: 'error',
									message: msg,
									icon: 'https://cdn.uviewui.com/uview/demo/toast/error.png',
									position: 'top'
								})
							}
						} catch (err) {
							console.log("err: ", err);
							this.$refs.uToast.show({
								type: 'error',
								message: '请求失败，请重试',
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
			}
		},
		created() {
			this.formData.realname = this.userInfo.realname;
			this.formData.gender = this.userInfo.gender;
			this.formData.phone = this.userInfo.phone;
			this.formData.idcard = this.userInfo.idcard;
			this.formData.avatar_url = this.full_avatar_url;
		},
		onReady() {
			//如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
			this.$refs.uForm.setRules(this.rules)
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
