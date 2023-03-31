<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// 判断用户是否登录
			if(!uni.getStorageSync('token')){
				uni.showModal({
					content: '您当前未登录，请先登录后再进行操作',
					showCancel: false,
					success() {
						uni.reLaunch({
							url: '/pages/auth/login/login'
						})
					}
				})
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<!-- 每个页面公共css -->
<style lang="scss">
	/* 在App.vue中首行的位置引入uView基础样式 */
	@import "@/uni_modules/uview-ui/index.scss";
		
	// 引入首页的字体图标
	@import url('@/static/iconfont/index/physical-test/iconfont.css');
	@import url('@/static/iconfont/index/common/iconfont.css');
	// 引入我的页面的字体图标
	@import url('@/static/iconfont/user-center/iconfont.css');
	// 引入登录和注册的字体图标
	@import url('@/static/iconfont/login-reg/iconfont.css');
</style>
