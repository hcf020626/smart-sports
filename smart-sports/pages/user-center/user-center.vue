<template>
	<view class="container">
		<view class="wrap" hover-class="cell-hover-class" @tap="goToEditProfile">
			<view class="wrap-item avatar">
				<u-avatar :src="fullAvatarURL" size="70"></u-avatar>
			</view>
			<view class="wrap-item realname">
				<text>{{userInfo.realname?userInfo.realname:'亲，您还未设置真实姓名'}}</text>
			</view>
			<view class="wrap-item right-icon">
				<u-icon name="arrow-right" label="主页" labelPos="left" labelSize="12" size="13"></u-icon>
			</view>
		</view>
		
		<view class="grid">
			<view v-for="(gridItem,itemIndex) in gridItems" :key="itemIndex" class="grid-item" @click="goToPage(gridItem.pagePath)">
				<view>
					<uni-icons customPrefix="iconfont" :type="gridItem.iconName" :color="gridItem.iconColor" size="30">
					</uni-icons>
				</view>
				<view>
					<u-text :text="gridItem.title"></u-text>
				</view>
			</view>
		</view>

		<view class="cell-group">
			<u-cell-group :border="false">
				<u-cell title="关于" :border="false" isLink url="./about/about">
					<uni-icons slot="icon" customPrefix="iconfont" type="icon-guanyuwomen" color="mediumslateblue" size="20">
					</uni-icons>
				</u-cell>
			</u-cell-group>
			<u-cell-group :border="false">
				<u-cell title="退出登录" :border="false" isLink @click="showModal">
					<uni-icons slot="icon" customPrefix="iconfont" type="icon-tuichudenglu" color="mediumslateblue" size="20">
					</uni-icons>
				</u-cell>
			</u-cell-group>
		</view>

		<u-modal :show="modalInfo.show" :content="modalInfo.content" @confirm="logout" :showCancelButton="true"
			@cancel="modalInfo.show=false"></u-modal>
	</view>
</template>

<script>
	import {
		mapState,
		mapActions,
		mapGetters
	} from 'vuex'
	import {
		baseURL
	} from '@/config.js';
	export default {
		data() {
			return {
				gridItems: [{
					iconName: 'icon-shenfenrenzheng',
					iconColor: '#2b85e4 ',
					title: '身份认证',
					pagePath: '/pages/user-center/authentification/authentification'
				}, {
					iconName: 'icon-changyonglvyouyewutubiao_fuzhi_qinzi',
					iconColor: '#18b566',
					title: '亲子绑定',
					pagePath: '/pages/user-center/bonding/bonding'
				}, {
					iconName: 'icon-xiugaimima',
					iconColor: '#606266',
					title: '修改密码',
					pagePath: '/pages/user-center/edit-password/edit-password'
				}],
				modalInfo: {
					content: '确定要退出登录吗？',
					show: false
				}
			}
		},
		methods: {
			...mapActions('accountModule', ['userLogout']),
			showModal() {
				this.modalInfo.show = true;
			},
			logout() {
				this.userLogout()
				uni.reLaunch({
					url: '/pages/auth/login/login?status=1'
				})
			},
			goToEditProfile() {
				uni.navigateTo({
					url: '/pages/user-center/edit-profile/edit-profile'
				})
			},
			goToPage(path){
				uni.navigateTo({
					url: path
				})
			}
		},
		computed: {
			...mapState('accountModule', ['userInfo']),
			...mapGetters('accountModule', ['fullAvatarURL'])
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100vw;
		height: 100vh;
		background-color: WhiteSmoke;
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

	.wrap .avatar {}

	.wrap .realname {
		flex-grow: 1;
		color: #969799;
	}

	.wrap .right-icon {}
	
	.grid {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		height: 200rpx;
		width: 95vw;
		margin: 30rpx auto;
		background-color: white;
	}
	
	.grid-item {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	
	.grid-item:active {
		opacity: 0.7;
	}

	.cell-group {
		width: 95vw;
		margin:30rpx auto;
		border-radius: 20rpx;
		background-color: white;
	}

	.logout-btn {
		margin: 40rpx 20rpx;
	}
</style>
