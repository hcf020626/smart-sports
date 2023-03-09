<template>
	<view class="container">
		<view class="wrap" hover-class="cell-hover-class" @tap="goToProfile">
			<view class="wrap-item item1">
				<u-avatar :src="src" size="150"></u-avatar>
			</view>
			<view class="wrap-item item2">
				<text>{{userInfo.realname?userInfo.realname:'亲，您还未设置真实姓名'}}</text>
			</view>
			<view class="wrap-item item3" >
				<text>主页</text><u-icon name="arrow-right"></u-icon>
			</view>
		</view>

		<view class="cell-group">
			<u-cell-group>
					<u-cell-item icon="integral-fill" title="会员等级" value="新版本" hover-class="cell-hover-class" :border-bottom="false" :arrow="false"></u-cell-item>
					<u-cell-item icon="setting-fill" title="设置" hover-class="cell-hover-class" @click="goToSettingsPage" :border-bottom="false" :arrow="false"></u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				src: 'D:\\Learning\\Graduation Design\\基于 Android 的智慧体育平台家长模块设计与实现\\smart-sports-app\\static\\avatar.png',
			}
		},
		methods: {
			goToSettingsPage(){
				uni.navigateTo({
					url: '/pages/user-center/settings/settings'
				})
			},
			goToProfile(){
				uni.navigateTo({
					url: '/pages/user-center/profile/profile'
				})
			}
		},
		computed: {
			...mapState('accountModule', ['userInfo'])
		},
		onLoad() {
			console.log("this.userInfo.realname: ",this.userInfo.realname);
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100vw;
		height: 100vh;
		background-color: WhiteSmoke ;
	}
	.wrap {
		width: 100vw;
		height: 200rpx;
		display: flex;
		align-items: center;
	}
	.wrap-item {
		margin: auto 20rpx;
	}
	
	.item1 {
	}
	
	.item2 {
		flex-grow: 1;
	}
	
	.item3 {
		color: #969799;
	}
	
	.item3 .u-icon {
		margin: 0 12rpx;
	}
	
	.cell-group{
		width: 95vw;
		margin: 0 auto;
	}
	
</style>
