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
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";
	
	.cell-hover-class {
		opacity: 0.7;
	}
</style>
