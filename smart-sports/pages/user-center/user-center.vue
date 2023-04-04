<template>
	<!-- 整个页面的最外层容器 -->
	<view class="container">
		<!-- 该部分展示了用户头像、真实姓名 -->
		<u-cell-group :border="false">
			<u-cell :border="false">
				<!-- 单元格左侧图标，使用 u-avatar 组件显示用户头像 -->
				<u-avatar slot="icon" :src="full_avatar_url" size="70"></u-avatar>
				<template slot="title">
					<u-text :text="userInfo.realname?userInfo.realname:'亲，您还未设置真实姓名'"></u-text>
				</template>
				<!-- 标题下方的描述信息 -->
				<u-text slot="label" :text="userInfo.phone | phoneMask" color="#909399" size="13.5" :show-sex="true"></u-text>
			</u-cell>
		</u-cell-group>
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
					<uni-icons slot="icon" customPrefix="iconfont" type="icon-about" color="mediumslateblue"
						size="20">
					</uni-icons>
				</u-cell>
				<u-cell title="退出登录" :border="false" isLink @click="showModal">
					<uni-icons slot="icon" customPrefix="iconfont" type="icon-exit" color="mediumslateblue"
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
						iconName: 'icon-auth', // 图标名称
						iconColor: '#2b85e4 ', // 图标颜色
						title: '个人资料', // 标题
						pagePath: '/pages/user-center/edit-profile/edit-profile' // 跳转路径
					},
					{
						iconName: 'icon-parent-child', // 图标名称
						iconColor: '#18b566', // 图标颜色
						title: '亲子绑定', // 标题
						pagePath: '/pages/user-center/bonding/bonding' // 跳转路径
					},
					{
						iconName: 'icon-edit-password', // 图标名称
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
			goToPage(path) { // 定义goToPage方法
				uni.navigateTo({ // 跳转到指定页面
					url: path
				})
			}
		},
		computed: {
			// 使用mapState和mapGetters函数从Vuex store中获取accountModule模块的userInfo状态和fullAvatarURL计算属性。
			...mapState('accountModule', ['userInfo']),
			...mapGetters('accountModule', ['full_avatar_url'])
		},
		filters: {
			// 电话号码脱敏
			phoneMask(value) {
				if (!value) return ''
				const visibleDigitsStart = 3 // 号码中开头的可见数字数量
				const visibleDigitsEnd = 2 // 号码结尾的可见数字数量
				const maskedDigits = value.length - visibleDigitsStart - visibleDigitsEnd // 中间需要屏蔽的数字数量
				const masked = '*'.repeat(maskedDigits)
				const visibleStart = value.substr(0, visibleDigitsStart)
				const visibleEnd = value.substr(value.length - visibleDigitsEnd, visibleDigitsEnd)
				return `${visibleStart}${masked}${visibleEnd}`
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100vw;
		height: 100vh;
		background-color: WhiteSmoke;
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
		border-radius: 20rpx;
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
