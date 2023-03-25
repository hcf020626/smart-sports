<template>
	<view>
		<view class="grid">
			<view v-for="(gridItem,itemIndex) in gridItems" :key="itemIndex" class="grid-item"
				@click="goToPage(gridItem.pagePath)">
				<view>
					<uni-icons customPrefix="iconfont" :type="gridItem.iconName" :color="gridItem.iconColor" size="28">
					</uni-icons>
				</view>
				<view>
					<u-text :text="gridItem.title"></u-text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				gridItems: [{
					iconName: 'icon-ceshengao',
					iconColor: '#2b85e4 ',
					title: '身高',
					pagePath: '/pages/index/physicalTest/height/height'
				}, {
					iconName: 'icon-ziyuan',
					iconColor: '#18b566',
					title: '体重',
					pagePath: '/pages/index/physicalTest/weight/weight'
				}, {
					iconName: 'icon-shilibiao',
					iconColor: '#606266',
					title: '视力',
					pagePath: '/pages/index/physicalTest/vision/vision'
				}, {
					iconName: 'icon-ziyuan1',
					iconColor: '#ff5733',
					title: '血压',
					pagePath: '/pages/index/physicalTest/blood-pressure/blood-pressure'
				}, {
					iconName: 'icon-iconfhl',
					iconColor: '#ffbd33',
					title: '肺活量',
					pagePath: '/pages/index/physicalTest/lung-capacity/lung-capacity'
				}, {
					iconName: 'icon-yangwoqizuopingtai',
					iconColor: '#dbff33',
					title: '仰卧起坐',
					pagePath: '/pages/index/physicalTest/sit-ups/sit-ups'
				}, {
					iconName: 'icon-fuwocheng',
					iconColor: '#75ff33',
					title: '俯卧撑',
					pagePath: '/pages/index/physicalTest/push-ups/push-ups'
				}, {
					iconName: 'icon-celiang',
					iconColor: '#33ffbd',
					title: '坐位体前屈',
					pagePath: '/pages/index/physicalTest/sit-and-reachs/sit-and-reachs'
				}, {
					iconName: 'icon-dangang',
					iconColor: '#33ff57',
					title: '引体向上',
					pagePath: '/pages/index/physicalTest/pull-ups/pull-ups'
				}, {
					iconName: 'icon-paobu',
					iconColor: '#bd33ff',
					title: '跑步',
					pagePath: '/pages/index/physicalTest/running/running'
				}],
			}
		},
		methods: {
			goToPage(path) {
				uni.navigateTo({
					url: path
				})
			}
		}
	}
</script>

<style>
	.grid {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
		height: 200rpx;
		width: 95vw;
		margin: 30rpx auto;
	}

	.grid-item {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		height: 150rpx;
		width: 31.6vw;
		/* font-size: 5rpx; */
	}

	.grid-item:active {
		opacity: 0.7;
	}
</style>
