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
				<u-form-item prop="email">
					<u-input prefixIcon="account" type="text" v-model="form.email" placeholder="请输入邮箱" clearable
						border="bottom" />
				</u-form-item>
				<u-form-item prop="password">
					<u-input prefixIcon="lock" type="password" v-model="form.password" placeholder="请输入密码" clearable
						border="bottom" />
				</u-form-item>
				<u-form-item prop="password2">
					<u-input prefixIcon="lock-fill" type="password" v-model="form.password2" placeholder="请再次输入密码"
						clearable border="bottom" />
				</u-form-item>
				<u-form-item prop="code">
					<u-input prefixIcon="email" type="number" v-model="form.code" placeholder="请输入验证码" clearable
						border="bottom">
						<template slot="suffix">
							<u-code ref="uCode" @change="codeChange" seconds="120" startText="获取验证码" changeText="X秒重新获取"
								endText="重新获取">
							</u-code>
							<u-button @tap="getCode" :text="form.tips" type="primary" size="mini" plain>
							</u-button>
						</template>
					</u-input>
				</u-form-item>
			</u-form>

			<view class="reg-btn">
				<u-button type="primary" @tap="regHandler" :disabled="!agree">注册</u-button>
			</view>
		</view>

		<!-- 尾部 忘记密码和注册账户 -->
		<view class="footer">
			<u-checkbox-group>
				<u-checkbox shape="circle" :checked="agree" @change="agreeHandler"></u-checkbox>
			</u-checkbox-group>
			<text>勾选代表同意</text>
			<navigator url="./agreement/agreement" open-type="navigate">《软件用户协议》</navigator>
		</view>

	</view>
</template>

<script>
	import api from '@/api/index.js'
	import {
		verifyCode
	} from '../../../api/account'
	export default {
		data() {
			return {
				leftIconStyle: {
					'fontSize': '35rpx'
				},
				form: {
					email: '',
					password: '',
					password2: '',
					tips: '',
					token: ''
				},
				agree: false,
				rules: {
					email: [{
							type: 'email',
							message: '邮箱格式不正确',
							trigger: ['change', 'blur']
						},
						// 对 email 字段进行必填验证
						{
							required: true,
							message: '请输入邮箱',
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
					code: [{
						required: true,
						message: '请输入验证码',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
				}
			}
		},
		methods: {
			agreeHandler() {
				this.agree = !this.agree
			},
			async regHandler() {
			    try {
			        const isValid = await this.$refs.uForm.validate();
			
			        if (!isValid) {
			            return this.$refs.uToast.show({
			                type: 'error',
			                message: '表单校验失败，请正确填写表单的每一项',
			                icon: 'https://cdn.uviewui.com/uview/demo/toast/error.png',
			                position: 'top'
			            })
			        }
			
			        const { data: { msg, status } } = await api.account.reg({
			            email: this.form.email,
			            password: this.form.password2,
			            code: this.form.code,
			            token: this.form.token
			        });
			
			        if (!status) {
			            this.$refs.uToast.show({
			                type: 'success',
			                message: msg,
			                icon: 'https://cdn.uviewui.com/uview/demo/toast/success.png',
			                position: 'top'
			            })
			
			            // 清空表单元素的值和错误提示
			            this.$refs.uForm.resetFields();
			        } else {
			            this.$refs.uToast.show({
			                type: 'error',
			                message: msg,
			                icon: 'https://cdn.uviewui.com/uview/demo/toast/error.png',
			                position: 'top'
			            })
			        }
			    } catch (err) {
			        console.error(err); // 输出错误信息
			        // 进行错误处理逻辑，比如显示错误提示信息等
			    }
			},
			codeChange(text) {
				this.form.tips = text;
			},
			async getCode() {
				if (this.$refs.uCode.canGetCode) {
					uni.showLoading({
						title: '正在获取验证码'
					})

					const {
						data: {
							msg,
							status,
							token
						}
					} = await api.account.sendCode(this.form.email);

					uni.hideLoading()

					if (!status) {
						this.form.token = token;
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
				} else {
					uni.$u.toast('倒计时结束后再发送');
				}
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
