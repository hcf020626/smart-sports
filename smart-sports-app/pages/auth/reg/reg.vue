<template>
	<view class="content">
		<!-- 头部 logo -->
		<view class="header">
			<image src="@/static/logo.png"></image>
		</view>

		<uni-forms :modelValue="FormData" class="body">
			<uni-forms-item>
				<uni-easyinput prefixIcon="person" type="text" v-model="FormData.userName" placeholder="请输入用户名" />
			</uni-forms-item>
			<uni-forms-item>
				<uni-easyinput prefixIcon="locked" type="password" v-model="FormData.password" placeholder="请输入密码" />
			</uni-forms-item>
			<uni-forms-item>
				<uni-easyinput prefixIcon="locked" type="password" v-model="FormData.password2" placeholder="请再次输入密码" />
			</uni-forms-item>
			<uni-forms-item>
				<button class="g-btn g-btn--light-blue u-small u-block" @tap="loginHandler">注册</button>
			</uni-forms-item>
		</uni-forms>
		
		<view class="footer">
			 <checkbox-group @change="agreeHandler">
			 	<label>
			 		<checkbox :checked="FormData.agree" /><text>同意</text>
			 	</label>
			 </checkbox-group>
			  <navigator url="./agreement/agreement" open-type="navigate">《软件用户协议》</navigator>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				FormData: {
					userName: '',
					password: '',
					password2: '',
					agree: false
				}
			}
		},
		methods: {
			loginHandler(){
				// console.log(this.FormData);
			},
			agreeHandler(e) {
				this.FormData.agree = !this.FormData.agree;
				console.log(this.FormData.agree);
			}
		}
	}
</script>

<style>
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
		justify-content: flex-start;
		margin: 120rpx auto 0 auto;
	}
	
	.footer {
	  display: flex;
	  flex-direction: row;
	  justify-content: center;
	  align-items: center;
	  font-size: 30rpx;
	  margin-top: 40rpx;
	  color: grey;
	  text-align: center;
	  height: 40rpx;
	  line-height: 40rpx;
	}
</style>
