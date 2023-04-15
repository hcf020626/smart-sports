<template>
	<view class="container">
		<view class="errMsg" v-if="parentInfo.cur_bonding_id === '-1'">
			<view>您当前的身份证号码已发送变更，请重新进行亲子绑定再操作！<navigator url="../user-center/bonding/bonding" open-type="navigate"
					class="link">亲子绑定</navigator>
			</view>
		</view>
		<view class="errMsg" v-else-if="parentInfo.cur_bonding_id === '' || parentInfo.cur_bonding_id === null">
			<view>您当前未进行亲子绑定或者亲子绑定失败，请亲子绑定成功后再操作！<navigator url="../user-center/bonding/bonding" open-type="navigate"
					class="link">亲子绑定</navigator>
			</view>
		</view>
		<template v-else>
			<view class="card">
				<view class="avatar">
					<u-avatar :src="studentInfo.avatar_url" size="60"></u-avatar>
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
				<view v-for="(gridItem,itemIndex) in gridItems" :key="itemIndex" class="grid-item"
					@click="goToPage(gridItem.pagePath)">
					<view>
						<uni-icons customPrefix="iconfont" :type="gridItem.iconName" :color="gridItem.iconColor"
							size="28"></uni-icons>
					</view>
					<view>
						<u-text :text="gridItem.title"></u-text>
					</view>
				</view>
			</view>
		</template>
	</view>
</template>

<script>
	import {
		mapState,
		mapActions
	} from 'vuex'
	export default {
		data() {
			return {
				gridItems: [{
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
					iconName: 'icon-all',
					iconColor: 'lightgreen',
					title: '全部',
					pagePath: '/pages/index/all/all'
				}],
			}
		},
		methods: {
			goToPage(path) {
				uni.navigateTo({
					url: path
				})
			}
		},
		computed: {
			// 获取用户信息
			...mapState('parentModule', ['parentInfo']),
			// 获取学生信息
			...mapState('studentModule', ['studentInfo']),
		},
	}
</script>


<style scoped lang="scss">
	.container {
		width: 100vw;
		height: 100vh;
		background-color: whitesmoke;
		background-image: url('@/static/images/bg.png');
		background-repeat: no-repeat;
		background-size: 100%;
		// #ifndef APP
		background-position: center;
		// #endif
		// #ifdef APP
		background-position: center 60%;
		// #endif
	}

	.card {
		width: 94vw;
		height: 300rpx;
		background-color: mediumslateblue;
		margin: 0 auto;
		border-radius: 15rpx;
		box-shadow: 0 5px 20px rgba(0, 0, 0, 0.35);
		position: relative;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		font-size: 0.9rem;
		line-height: 1.2rem;
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
		width: 100%;
		margin: 30rpx auto;
	}

	.grid-item {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		height: 150rpx;
		width: 25%;
		font-size: 0.9rem;
	}

	.grid-item:active {
		opacity: 0.7;
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
