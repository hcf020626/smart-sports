<template>
	<view class="container">
		<view class="header">
			<image src="@/static/images/logo.png"></image>
			<text>{{title}}</text>
		</view>

		<view class="content">
			<u-collapse :accordion="true" :border="false">
				<u-collapse-item title="作者">
					<uni-icons slot="icon" custom-prefix="iconfont" type="icon-author"></uni-icons>
					<view class="list">
						<view class="list-item">
							<text>贺灿飞</text>
						</view>
						<view class="list-item">
							<view v-for="(link, index) in links" :key="index" class="link">
								<uni-icons  custom-prefix="iconfont" :type="link.iconName" :color="link.iconColor"></uni-icons>
								<u-text mode="link" :text="link.name" :href="link.url" ></u-text>
							</view>
						</view>
					</view>
				</u-collapse-item>
				<u-collapse-item title="项目名称">
					<uni-icons slot="icon" custom-prefix="iconfont" type="icon-title"></uni-icons>
					<text>《基于Andriod的智慧体育平台家长模块设计与实现》</text>
				</u-collapse-item>
				<u-collapse-item title="项目简介">
					<uni-icons slot="icon" custom-prefix="iconfont" type="icon-project-description"></uni-icons>
					<text>智慧体育平台家长模块旨在帮助家长更好地关注孩子的身体健康状况和体育锻炼结果。</text>
				</u-collapse-item>
				<u-collapse-item title="项目技术栈">
					<uni-icons slot="icon" custom-prefix="iconfont" type="icon-tech-support"></uni-icons>
					<view class="list">
						<view class="list-item">
							<text>前端：</text>
							<text>uni-app框架和uView UI框架</text>
						</view>
						<view class="list-item">
							<text>后端：</text>
							<text>Node.js和express框架</text>
						</view>
						<view class="list-item">
							<text>数据库：</text>
							<text>MySQL</text>
						</view>
						<view class="list-item">
							<text>网络请求库：</text>
							<text>luch-request</text>
						</view>
					</view>
				</u-collapse-item>
				<u-collapse-item title="项目源码">
					<uni-icons slot="icon" custom-prefix="iconfont" type="icon-source-code"></uni-icons>
					<u-text mode="link" text="Github 仓库地址" href="https://github.com/hcf020626/smart-sports" ></u-text>
				</u-collapse-item>
			</u-collapse>
		</view>
		<view class="footer">
			<navigator url="../user-agreement/user-agreement" open-type="navigate" class="link">用户协议</navigator>
			<text class>与</text>
			<navigator url="../privacy-policy/privacy-policy" open-type="navigate" class="link">隐私政策</navigator>
		</view>

		<view style="margin-bottom: 45rpx; color: #909399;">
			<text>当前版本：0.1.0</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Smart Sports Platform For Parents',
				show: false,
				links: [
					{
						name: 'Github',
						iconName: 'icon-github',
						iconColor: '#333333',
						url: 'https://github.com/hcf020626'
					},{
						name: 'Gitee',
						iconName: 'icon-gitee',
						iconColor: '#C71D23',
						url: 'https://gitee.com/hcf062626'
					},{
						name: 'bilibili',
						iconName: 'icon-bilibili',
						iconColor: '#1FB0E3',
						url: 'https://space.bilibili.com/449997465'
					},
				]
			}
		},
	}
</script>

<style scoped>
	.container {
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
	}

	.header {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		margin: 30rpx 0;
	}

	.header image {
		width: 200rpx;
		height: 200rpx;
		background: rgba(63, 205, 235, 1);
		box-shadow: 0rpx 12rpx 13rpx 0rpx rgba(63, 205, 235, 0.47);
		border-radius: 50%;
	}

	.header text {
		font-size: 36rpx;
		color: #8f8f94;
		padding: 30rpx;
	}

	.content {
		width: 98%;
		margin: 0 auto;
		flex-grow: 1;
	}
	
	.content .list {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
	}
	
	.list .list-item {
		display: flex;
		flex-direction: row;
	}
	
	.list-item .link {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		margin-right: 20rpx;
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

	.footer .link,
	.footer text {
		margin: 10rpx;
	}
</style>
