<template>
	<view class="container">
		<image class="logo" src="/static/logo.png"></image>
		<view class="title-area">
			<text class="title">{{title}}</text>
		</view>

		<view class="content-area">
			<text class="app-name">{{appName}}</text>旨在帮助家长更好地关注和管理孩子的体育锻炼。该平台提供了以下功能：
			<ul>
				<li>课程管理：家长可以通过平台查看孩子的课程表和学习进度，了解孩子的体育锻炼情况。</li>
				<li>成绩分析：平台会对孩子的体育成绩进行分析和评估，让家长更好地了解孩子的体育水平和发展状况。</li>
				<li>健康监测：平台还提供了健康监测功能，家长可以通过监测孩子的身体指标和健康状况，及时了解孩子的身体状况，并采取相应的措施。</li>
				<li>学习资料：平台还提供了各种学习资料和知识，让家长可以帮助孩子更好地学习和理解体育知识。</li>
				<li>互动社区：平台还设有互动社区，让家长可以与其他家长交流和分享经验，共同促进孩子的健康成长。</li>
			</ul>
		</view>
		<view class="footer">
			<navigator url="../user-agreement/user-agreement" open-type="navigate" class="link">用户协议</navigator>
			<text class>与</text>
			<navigator url="../privacy-policy/privacy-policy" open-type="navigate" class="link">隐私政策</navigator>
		</view>

		<view>
			<u-button type="primary" @click="showInfo">点我在控制台输出 Vuex 中的用户数据</u-button>
		</view>
		<view style="flex-grow: 1;"></view>
		<view style="margin-bottom: 45rpx; color: #909399;">
			<text>当前版本：0.1.0</text>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				title: 'Smart Sports Platform For Parents',
				appName: '智慧体育平台家长模块',
				show: false
			}
		},
		onLoad() {

		},
		computed: {
			...mapState('accountModule', ['userInfo', 'token'])
		},
		methods: {
			showInfo() {
				console.log("this.userInfo: ", this.userInfo);
				console.log("this.token: ", this.token);
			}
		}
	}
</script>

<style scoped>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		height: 170vh;
	}

	.logo {
		height: 250rpx;
		width: 250rpx;
		margin-top: 150rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.title-area {
		display: flex;
		justify-content: center;
		margin-bottom: 50rpx;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}

	.content-area {
		width: 90vw;
		margin: 0 auto;
		font-size: 36rpx;
		font-family: Arial, sans-serif;
		letter-spacing: 2.5rpx;
		line-height: 2;
		color: #606266;
	}

	.content-area .app-name {
		font-weight: bold;
	}

	.content-area ul {
		padding: 30rpx;
	}

	.footer {
		display: flex;
		flex-direction: row;
		justify-content: center;
		margin-bottom: 30rpx;
	}

	.footer .link {
		color: #2979ff;
		text-decoration: underline;
	}
	.footer .link, .footer text{
		margin: 10rpx;
	}
</style>
