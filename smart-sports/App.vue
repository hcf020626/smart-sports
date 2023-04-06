<script>
	import {
		mapState,
		mapActions
	} from 'vuex'
	import api from '@/api/index.js'
	import {baseURL} from '@/config.js'
	export default {
		computed: {
			// 获取用户信息
			...mapState('accountModule', ['userInfo', 'token']),
			// 获取学生信息
			...mapState('studentModule', ['studentInfo']),
		},
		methods: {
			...mapActions('accountModule', ['updateUserInfo']),
			...mapActions('studentModule', ['updateStudentInfo']),
			checkIsLogin() {
				// 判断用户是否登录
				if (!this.token) {
					uni.showModal({
						content: '您当前未登录，请先登录后再进行操作',
						showCancel: false,
						success() {
							uni.reLaunch({
								url: '/pages/auth/login/login'
							})
						}
					})
				} else {
					this.getAndUpdateTheLatestInfo()
				}
			},
			async getAndUpdateTheLatestInfo() {
				try {
					const {
						data: {
							msg,
							status,
							data: {
								userInfo,
								studentInfo
							}
						}
					} = await api.account.getTheLatestInfo(this.userInfo.email);
					if (!status) {
						this.updateUserInfo(userInfo);
						this.updateStudentInfo({
							avatar_url: this.studentInfo.avatar_url ,
							name: studentInfo.name,
							gender: studentInfo.gender,
							age: studentInfo.age,
							school: studentInfo.school,
							className: studentInfo.class,
							id: studentInfo.id
						})
					}

					console.log(msg);
				} catch (e) {
					//TODO handle the exception
					console.log(e.errMsg);
				}
			}
		},
		onLaunch: function() {
			console.log('App Launch')
			this.checkIsLogin()
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

	@import url('//at.alicdn.com/t/c/font_3944024_14rryqypq87.css');
	
	@font-face {
		font-family: leo-he;
		src: url('/static/iconfont/font/ZCOOLKuaiLe-Regular.ttf');
	}
	
	view, text, ul, li {
		font-family: leo-he;
	}
</style>
