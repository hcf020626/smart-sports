<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			if(!uni.getStorageSync('token')){
				uni.reLaunch({
					url: '/pages/auth/login/login'
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

<style lang="scss">
	/*每个页面公共css */

	/* 在App.vue中首行的位置引入uView基础样式 */
	@import "@/uni_modules/uview-ui/index.scss";
	
	.cell-hover-class {
		opacity: 0.7;
	}
</style>
