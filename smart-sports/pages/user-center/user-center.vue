<template>
	<view class="container">
		<view class="wrap" hover-class="cell-hover-class" @tap="goToProfile">
			<view class="wrap-item avatar">
				<u-avatar :src="avatar_url" size="70"></u-avatar>
			</view>
			<view class="wrap-item realname">
				<text>{{userInfo.realname?userInfo.realname:'亲，您还未设置真实姓名'}}</text>
			</view>
			<view class="wrap-item right-icon">
				<u-icon name="arrow-right" label="主页" labelPos="left" labelSize="12" size="13"></u-icon>
			</view>
		</view>

		<view class="cell-group">
			<u-cell-group :border="false">
					<u-cell icon="integral-fill" title="会员等级" :border="false" value="新版本"></u-cell>
					<u-cell icon="setting-fill" title="设置" :border="false" isLink url="/pages/user-center/settings/settings"></u-cell>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	import { baseURL } from '@/config.js';
	export default {
		data() {
			return {
				avatar_url: ''
			}
		},
		methods: {
			goToProfile(){
				uni.navigateTo({
					url: '/pages/user-center/profile/profile'
				})
			}
		},
		computed: {
			...mapState('accountModule', ['userInfo'])
		},
		mounted() {
			this.$nextTick(()=>{
				this.avatar_url = baseURL + this.userInfo.avatar_url
			})
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
	
	.wrap .avatar {
	}
	
	.wrap .realname {
		flex-grow: 1;
		color: #969799;
	}
	
	.wrap .right-icon {
	}
	
	.cell-group{
		width: 95vw;
		margin: 0 auto 30rpx auto;
		border-radius: 20rpx;
		background-color: white;
	}
	
</style>
