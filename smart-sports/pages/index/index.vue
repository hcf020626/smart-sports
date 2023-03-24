<template>
	<view class="container">
		<view class="card">
			<view class="avatar">
				<u-avatar :src="studentInfo.imgSrc" size="60"></u-avatar>
			</view>
			<view class="studentInfo">
				<view>姓名：{{studentInfo.name}}</view>
				<view>性别：{{studentInfo.gender}}</view>
				<view>年龄：{{studentInfo.age}}</view>
				<view>学校：{{studentInfo.school}}</view>
				<view>班级：{{studentInfo.className}}</view>
				<view>学号：{{studentInfo.id}}</view>
			</view>
		</view>
		
		<view class="grid">
			<view v-for="(gridItem,itemIndex) in gridItems" :key="itemIndex" class="grid-item" @click="goToPage(gridItem.pagePath)">
				<view>
					<uni-icons customPrefix="iconfont" :type="gridItem.iconName" :color="gridItem.iconColor" size="28"></uni-icons>
				</view>
				<view>
					<u-text :text="gridItem.title"></u-text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState, mapActions} from 'vuex'
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
					iconName: 'icon-quanbu',
					iconColor: 'lightgreen',
					title: '全部',
					pagePath: '/pages/index/physicalTest/all/all'
				}],
			}
		},
		methods: {
			goToPage(path){
				uni.navigateTo({
					url: path
				})
			}
		},
		computed: {
			// 获取用户信息
			...mapState('studentModule', ['studentInfo']),
		},
	}
</script>


<style scoped>
	.container {
		width: 100vw;
		height: 100vh;
		background-color: whitesmoke;
		background-image: url('@/static/bg.png');
		background-repeat: no-repeat;
		background-size: 100%;
		background-position: center;
	}
	.card {
		width: 94vw;
		height: 300rpx;
		background-color: mediumslateblue;
		margin: 0 auto;
		border-radius: 15rpx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		font-size: 0.82rem;
		color: whitesmoke;
	}
	
	.card .avatar {
		margin-left: 30rpx;
		margin-right: 50rpx;
	}
	
	.grid {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
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
		width: 20vw;
		font-size: 0.9rem;
	}
	
	.grid-item:active {
		opacity: 0.7;
	}
</style>