<template>
	<view class="container">
		<view class="infoList">
			<view class="item1"><u-avatar :src="src" mode="circle" size="100"></u-avatar></view>
			<view class="item2"><text>{{nickname}}</text></view>
			<view class="item3"><text space="nbsp"> {{gender}} · {{address}}</text></view>
			<view class="item4"><text> {{signature}}</text></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src: 'D:\\Learning\\Graduation Design\\基于 Android 的智慧体育平台家长模块设计与实现\\smart-sports-app\\static\\avatar.png',
				nickname: 'Leo He',
				gender: '男',
				address: '湖南 衡阳',
				signature: '这个人有点懒，什么都没有留下'
			}
		},
		methods: {
			
		}
	}
</script>

<style scoped>
	.container{
		width: 100vw;
		height: 100vh;
		background-color: whitesmoke;
	}
	.infoList{
		display: flex;
		flex-direction: column;
		align-items: center;
		border-bottom: 1px solid lightgray;
	}
	.infoList view {
		margin: 10rpx 0;
	}
	.item2 {
		color: #303133 ;
		font-size: 1.2rem;
	}
	.item3 {
		border: 1px solid lightgray;
		border-radius: 10rpx;
		padding: 5rpx 20rpx;
		font-size: 0.6rem;
		color: #606266 ;
	}
	.item4 {
		font-size: 0.6rem;
		color: #909399;
	}
</style>
