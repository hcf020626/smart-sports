<template>
	<view class="container">
			<view class="category" v-for="(category, index) in categories" :key="index">
				<view class="label">{{category.label}}</view>
				<view class="items">
					<view class="item" v-for="(item, index) in category.items" :key="index"
						@click="goToPage(item.pagePath)">
						<view>
							<uni-icons customPrefix="iconfont" :type="item.iconName" :color="item.iconColor" size="28">
							</uni-icons>
						</view>
						<view>
							<u-text :text="item.title"></u-text>
						</view>
					</view>
				</view>
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
				categories: [{
					label: '身体指标',
					items: [{
						iconName: 'icon-height',
						iconColor: '#2b85e4 ',
						title: '身高',
						pagePath: '/pages/index/body-metrics/height/height'
					}, {
						iconName: 'icon-weight',
						iconColor: '#18b566',
						title: '体重',
						pagePath: '/pages/index/body-metrics/weight/weight'
					}, {
						iconName: 'icon-vision',
						iconColor: '#606266',
						title: '视力',
						pagePath: '/pages/index/body-metrics/vision/vision'
					}, {
						iconName: 'icon-blood-pressure',
						iconColor: 'red',
						title: '血压',
						pagePath: '/pages/index/body-metrics/blood-pressure/blood-pressure'
					}, {
						iconName: 'icon-lung-capacity',
						iconColor: 'lightgreen',
						title: '肺活量',
						pagePath: '/pages/index/body-metrics/lung-capacity/lung-capacity'
					}]
				}, {
					label: '体能和耐力',
					items: [{
						iconName: 'icon-push-ups',
						iconColor: 'red',
						title: '俯卧撑',
						pagePath: '/pages/index/strength-and-stamina/push-ups/push-ups'
					}, {
						iconName: 'icon-sit-ups',
						iconColor: 'blue',
						title: '仰卧起坐',
						pagePath: '/pages/index/strength-and-stamina/sit-ups/sit-ups'
					}, {
						iconName: 'icon-pull-ups',
						iconColor: 'darkgreen',
						title: '引体向上',
						pagePath: '/pages/index/strength-and-stamina/pull-ups/pull-ups'
					}, {
						iconName: 'icon-running',
						iconColor: 'purple',
						title: '跑步',
						pagePath: '/pages/index/strength-and-stamina/running/running'
					}, {
						iconName: 'icon-swimming',
						iconColor: 'purple',
						title: '游泳',
						pagePath: '/pages/index/strength-and-stamina/swimming/swimming'
					}]
				}, {
					label: '爆发力',
					items: [{
						iconName: 'icon-long-jump',
						iconColor: 'red',
						title: '立定跳远',
						pagePath: '/pages/index/explosiveness/long-jump/long-jump'
					}, {
						iconName: 'icon-solid-ball',
						iconColor: 'blue',
						title: '实心球',
						pagePath: '/pages/index/explosiveness/solid-ball/solid-ball'
					}]
				}, {
					label: '协调力',
					items: [{
						iconName: 'icon-rope-skipping',
						iconColor: 'red',
						title: '跳绳',
						pagePath: '/pages/index/coordination/rope-skipping/rope-skipping'
					}]
				}, {
					label: '柔韧度',
					items: [{
						iconName: 'icon-sit-and-reaches',
						iconColor: 'red',
						title: '坐位体前屈',
						pagePath: '/pages/index/flexibility/sit-and-reaches/sit-and-reaches'
					}]
				},],
			}
		},
		methods: {
			goToPage(path) {
				uni.navigateTo({
					url: path
				})
			}
		},
	}
</script>


<style scoped>
	.container {
		width: 100vw;
		height: 100vh;
		background-color: whitesmoke;
	}

	.category {
		display: flex;
		flex-direction: column;
		width: 95%;
		margin: 25rpx auto;
		background-color: white;
		border-radius: 20rpx;
	}

	.category .label {
		padding: 25rpx 50rpx 0 50rpx;
	}

	.category .items {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
		width: 100%;
		margin: 30rpx auto;
	}

	.category .items .item {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		height: 150rpx;
		width: 25%;
		font-size: 0.9rem;
	}

	.category .items .item:active {
		opacity: 0.5;
	}

	.errMsg {
		width: 90%;
		margin: 0 auto;
		padding-top: 200rpx;
		text-align: center;
		line-height: 50rpx;
		color: #82848a;
	}

	.errMsg .link {
		color: #2979ff;
		text-decoration: underline;
		display: inline;
	}
</style>
