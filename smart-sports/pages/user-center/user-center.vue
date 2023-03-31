<template>
	<!-- 整个页面的最外层容器，使用flex布局，纵向居中 -->
	<view class="container">
		<!-- 该部分展示了用户头像、真实姓名和跳转链接，通过点击该区域可以进入到用户信息编辑页面。 -->
		<view class="custom-cell-group" hover-class="custom-cell-hover-class" @tap="goToEditProfile">
			<!-- 用户头像 -->
			<view class="custom-cell avatar">
				<u-avatar :src="fullAvatarURL" size="70"></u-avatar>
			</view>
			<!-- 真实姓名 -->
			<view class="custom-cell realname">
				<text>{{userInfo.realname?userInfo.realname:'亲，您还未设置真实姓名'}}</text>
			</view>
			<!-- 右侧箭头图标 -->
			<view class="custom-cell right-icon">
				<u-icon name="arrow-right" label="主页" labelPos="left" labelSize="12" size="13"></u-icon>
			</view>
		</view>

		<!-- 功能入口展示区域 -->
		<view class="grid">
			<!-- 循环遍历渲染每一个功能入口 -->
			<view v-for="(gridItem,itemIndex) in gridItems" :key="itemIndex" class="grid-item"
				@click="goToPage(gridItem.pagePath)">
				<!-- 使用uni-icons组件渲染对应的图标 -->
				<view>
					<uni-icons customPrefix="iconfont" :type="gridItem.iconName" :color="gridItem.iconColor" size="30">
					</uni-icons>
				</view>
				<!-- 渲染对应的功能名称 -->
				<view>
					<u-text :text="gridItem.title"></u-text>
				</view>
			</view>
		</view>

		<view class="cell-group">
			<u-cell-group :border="false">
				<u-cell title="关于" :border="false" isLink url="./about/about">
					<uni-icons slot="icon" customPrefix="iconfont" type="icon-guanyuwomen" color="mediumslateblue"
						size="20">
					</uni-icons>
				</u-cell>
				<u-cell title="退出登录" :border="false" isLink @click="showModal">
					<uni-icons slot="icon" customPrefix="iconfont" type="icon-tuichudenglu" color="mediumslateblue"
						size="20">
					</uni-icons>
				</u-cell>
			</u-cell-group>
		</view>

		<!-- 退出登录弹窗 -->
		<u-modal :show="modalInfo.show" :content="modalInfo.content" @confirm="logout" :showCancelButton="true"
			@cancel="modalInfo.show=false"></u-modal>
	</view>
</template>

<script>
	import {
		mapState, // 从vuex中引入mapState函数，用于在计算属性中映射store中的state
		mapActions, // 从vuex中引入mapActions函数，用于在methods中映射store中的actions
		mapGetters // 从vuex中引入mapGetters函数，用于在计算属性中映射store中的getters
	} from 'vuex'
	import {
		baseURL // 引入config.js中的baseURL
	} from '@/config.js';
	export default {
		data() { // 定义data数据
			return { // 返回数据对象
				gridItems: [ // 定义一个数组gridItems
					{ // 对象1
						iconName: 'icon-shenfenrenzheng', // 图标名称
						iconColor: '#2b85e4 ', // 图标颜色
						title: '身份认证', // 标题
						pagePath: '/pages/user-center/authentification/authentification' // 跳转路径
					},
					{
						iconName: 'icon-changyonglvyouyewutubiao_fuzhi_qinzi', // 图标名称
						iconColor: '#18b566', // 图标颜色
						title: '亲子绑定', // 标题
						pagePath: '/pages/user-center/bonding/bonding' // 跳转路径
					},
					{
						iconName: 'icon-xiugaimima', // 图标名称
						iconColor: '#606266', // 图标颜色
						title: '修改密码', // 标题
						pagePath: '/pages/user-center/edit-password/edit-password' // 跳转路径
					}
				],
				modalInfo: { // 定义一个modalInfo对象
					content: '确定要退出登录吗？', // 内容
					show: false // 是否展示
				}
			}
		},
		methods: { // 定义methods方法
			...mapActions('accountModule', ['userLogout']), // 映射store中的actions到方法中
			showModal() { // 定义showModal方法
				this.modalInfo.show = true; // 修改modalInfo的show属性
			},
			logout() { // 定义logout方法
				this.userLogout() // 调用userLogout action
				uni.reLaunch({ // 重新启动应用
					url: '/pages/auth/login/login?status=1' // 跳转到登录页
				})
			},
			goToEditProfile() { // 定义goToEditProfile方法
				uni.navigateTo({ // 跳转到编辑用户资料页
					url: '/pages/user-center/edit-profile/edit-profile'
				})
			},
			goToPage(path) { // 定义goToPage方法
				uni.navigateTo({ // 跳转到指定页面
					url: path
				})
			}
		},
		computed: {
			// 使用mapState和mapGetters函数从Vuex store中获取accountModule模块的userInfo状态和fullAvatarURL计算属性。
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

	.custom-cell-group {
		width: 100vw;
		height: 200rpx;
		display: flex;
		align-items: center;
	}

	.custom-cell {
		margin: auto 20rpx;
	}

	.custom-cell-group .avatar {}

	.custom-cell-group .realname {
		flex-grow: 1;
		color: #969799;
	}

	.custom-cell-group .right-icon {}
	
	.custom-cell-hover-class {
		opacity: 0.7;
	}

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
		opacity: 0.5;
	}

	.cell-group {
		width: 95vw;
		margin: 30rpx auto;
		border-radius: 20rpx;
		background-color: white;
	}

	.logout-btn {
		margin: 40rpx 20rpx;
	}
</style>
