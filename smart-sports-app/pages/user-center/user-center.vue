<template>
	<view>
		<view class="wrap">
			<view class="wrap-item item1">
				<u-avatar :src="src" size="150"></u-avatar>
			</view>
			<view class="wrap-item item2">
				<text>{{nickName}}</text>
			</view>
			<view class="wrap-item item3" >
				<text>主页</text><u-icon name="arrow-right"></u-icon>
			</view>
		</view>

		<u-cell-group>
				<u-cell-item icon="integral-fill" title="会员等级" value="新版本" hover-class="cell-hover-class" ></u-cell-item>
				<u-cell-item icon="setting-fill" title="设置" hover-class="cell-hover-class" @click="goToSettingsPage"></u-cell-item>
			</u-cell-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src: 'D:\\Learning\\Graduation Design\\基于 Android 的智慧体育平台家长模块设计与实现\\smart-sports-app\\static\\avatar.png',
				nickName: 'Leo He'
			}
		},
		methods: {
			goToSettingsPage(){
				uni.navigateTo({
					url: '/pages/user-center/settings/settings'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		width: 100vw;
		height: 200rpx;
		display: flex;
		align-items: center;
		border-bottom: 1px solid $u-border-color;
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
</style>
