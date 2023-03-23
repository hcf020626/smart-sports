<template>
	<view class="container">
		<!-- 消息提示组件，用于提示用户在登录时碰到的问题 -->
		<u-toast ref="uToast"></u-toast>

		<!--
			通过model参数绑定一个对象，这个对象的属性为各个u-form-item内组件的对应变量；
			由于表单验证和绑定表单规则时，需要通过ref操作，故这里需要给form组件声明ref="uForm"属性。
		 -->
		<u-form :model="form" ref="uForm" labelPosition="left" labelWidth="70" :labelStyle="{fontSize:'30rpx'}"
			errorType="border-bottom">
			<!-- 
				prop为传入Form组件的rules中的属性字段
			 -->
			<u-form-item label="头像" borderBottom>
				<u-avatar :src="form.avatarUrl" shape="circle" size="60" slot="right" @click="uploadAvatar"></u-avatar>
			</u-form-item>
			<u-form-item label="姓名" prop="realname" borderBottom>
				<u-input type="text" v-model="form.realname" border="none" placeholder="姓名,只能为中文" inputAlign="right">
				</u-input>
			</u-form-item>
			<u-form-item label="性别" prop="gender" borderBottom @click="isShowActionSheet = true">
				<u-input type="text" v-model="form.gender" border="none" placeholder="请选择性别" disabled
					disabledColor="#F5F5F5" inputAlign="right" suffixIcon="arrow-right"></u-input>
			</u-form-item>
			<u-form-item label="手机号" prop="phone" borderBottom>
				<u-input type="number" v-model="form.phone" border="none" placeholder="请输入手机号码" inputAlign="right">
				</u-input>
			</u-form-item>
			<u-form-item label="身份证号" prop="idCard" borderBottom>
				<u-input type="idcard" v-model="form.idCard" border="none" placeholder="请输入身份证号码" disabled disabledColor="whitesmoke" color="#909399" inputAlign="right">
				</u-input>
			</u-form-item>
			<u-form-item>
				<u-button type="primary" @click="saveUserInfo">保存</u-button>
			</u-form-item>
		</u-form>
		
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
	export default {
		data() {
			return {
				form: {
					realname: '',
					gender: '',
					phone: '',
					idCard: '',
					avatarUrl: '',
				},
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
				}
			}
		},
		computed: {
			...mapState('accountModule', ['userInfo', 'token']),
			...mapGetters('accountModule', ['fullAvatarURL'])
		},
		methods: {
			...mapActions('accountModule', ['updateUser']),
			selectGender(index) {
				this.form.gender = index.name
			},
			uploadAvatar() {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						this.form.avatarUrl = res.tempFilePaths[0]
					}
				})
			},
			async saveUserInfo() {
				try {
					const isValid = await this.$refs.uForm.validate();

					if (!isValid) {
						return this.$refs.uToast.show({
							type: 'error',
							message: '请检查表单是否填写完整',
							icon: 'https://cdn.uviewui.com/uview/demo/toast/error.png',
							position: 'top'
						})
					}

					try {
						const res = await new Promise((resolve, reject) => {
							uni.uploadFile({
								url: baseURL + '/account/saveUserInfo',
								header: {
									'Authorization': this.token
								},
								filePath: this.form.avatarUrl,
								name: 'avatar',
								method: 'POST',
								formData: {
									email: this.userInfo.email,
									realname: this.form.realname,
									gender: this.form.gender,
									phone: this.form.phone,
									idCard: this.form.idCard
								},
								success: resolve,
								fail: reject,
							});
						});


						const {
							msg,
							status,
							data
						} = JSON.parse(res.data)

						if (!status) {
							// 请求成功，更新本地用户信息
							this.updateUser(data)
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
					}
				} catch (e) {
					this.$refs.uToast.show({
						type: 'error',
						message: '请检查表单是否填写完整',
						icon: 'https://cdn.uviewui.com/uview/demo/toast/error.png',
						position: 'top'
					})
				}
			}
		},
		created() {
			this.form.realname = this.userInfo.realname;
			this.form.gender = this.userInfo.gender;
			this.form.phone = this.userInfo.phone;
			this.form.idCard = this.userInfo.idcard;
			this.form.avatarUrl = this.fullAvatarURL;
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
