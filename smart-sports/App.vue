<script>
	import {
		mapState,
		mapActions
	} from 'vuex'
	import api from '@/api/index.js'
	import {
		baseURL,
		baseWSURL
	} from '@/config.js'
	export default {
		computed: {
			// 获取用户信息
			...mapState('parentModule', ['parentInfo', 'token', 'friendsApplicationMessages', 'pedometer']),
			// 获取学生信息
			...mapState('studentModule', ['studentInfo']),
		},
		methods: {
			...mapActions('parentModule', ['updateParentInfo', 'updateFriendsApplicationMessages', 'resetPedometer',
				'updatePedometerIsWalking'
			]),
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
								parentInfo,
								studentInfo
							}
						}
					} = await api.parent.getTheLatestInfo(this.parentInfo.email);
					if (!status) {
						this.updateParentInfo(parentInfo);
						this.updateStudentInfo({
							avatar_url: baseURL + studentInfo.avatar_url,
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
			},
			startWebSocket() {
				console.log('正在开启WebSocket连接...');
				const userId = this.parentInfo.id;
				const updateFriendsApplicationMessages = this.updateFriendsApplicationMessages;

				uni.connectSocket({
					url: baseWSURL
				});
				uni.onSocketOpen(function(res) {
					console.log('WebSocket连接已打开！');
					const message = {
						type: 'init',
						content: {
							userId
						}
					};
					uni.sendSocketMessage({
						data: JSON.stringify(message)
					});
				});

				uni.onSocketError(function(res) {
					console.log('WebSocket连接打开失败，请检查！', res);
				});

				uni.onSocketMessage(function(res) {
					console.log("res: ", res);
					console.log('收到服务器内容：' + res.data);
					const msgObj = JSON.parse(res.data);
					if (msgObj.type === 'init') {
						console.log(msgObj.content);
					} else if (msgObj.type === 'add friend') {
						updateFriendsApplicationMessages(msgObj);
					}
				});

				uni.onSocketClose(function(res) {
					console.log('WebSocket 已关闭！');
				});
			},
			startPedometer() {
				const today = new Date();
				const year = today.getFullYear();
				const month = String(today.getMonth() + 1).padStart(2, '0');
				const day = String(today.getDate()).padStart(2, '0');
				const formattedDate = `${year}-${month}-${day}`;

				// 重置计步器
				if (!this.pedometer.date || this.pedometer.date !== formattedDate) {
					this.resetPedometer(formattedDate);
				}

				// 初始化变量
				let lastX = 0;
				let lastY = 0;
				let lastZ = 0;
				let lastDirection = null;
				let lastStepCount = 0;
				let stepCount = 0;
				let pedometer = this.pedometer;

				// 设置监听加速度传感器
				uni.startAccelerometer({
					interval: 'game',
					success: function() {
						uni.onAccelerometerChange(function(res) {
							let curTime = new Date().getTime();
							if ((curTime - lastUpdate) > 100) {
								let diffTime = (curTime - lastUpdate);
								lastUpdate = curTime;
								let x = res.x;
								let y = res.y;
								let z = res.z;
								let acceleration = Math.sqrt(x * x + y * y + z * z);

								// 判断当前方向
								let direction = null;
								if (Math.abs(x) > Math.abs(y)) {
									if (x > 0) {
										direction = 'left';
									} else {
										direction = 'right';
									}
								} else {
									if (y > 0) {
										direction = 'up';
									} else {
										direction = 'down';
									}
								}

								// 判断是否在行走状态
								if (acceleration > 10) {
									if (lastDirection && lastDirection !== direction) {
										stepCount++;
										lastStepCount++;
									}
									lastDirection = direction;
								}

								// 判断是否达到一步
								if (stepCount === 1) {
									pedometer.isWalking = true;
								} else if (stepCount === 0 && pedometer.isWalking) {
									pedometer.isWalking = false;
									if (lastStepCount >= 10) {
										if (pedometer.steps.walking > pedometer.steps.running) {
											pedometer.steps.running++;
										} else {
											pedometer.steps.walking++;
										}
									}
									lastStepCount = 0;
								}

								lastX = x;
								lastY = y;
								lastZ = z;
								uni.setStorageSync('pedometer', JSON.stringify(pedometer))
							}
						});
					}
				});
			},
			sendPedometerDataInterval(time) {
				this.timer = setInterval(async () => {
					console.log("this.pedometer.steps.walking, this.pedometer.steps.running: ", this
						.pedometer.steps.walking, this.pedometer.steps.running);
					await api.parent.updateSteps({
						parent_id: this.parentInfo.id,
						measurement_date: this.pedometer.date,
						walking_steps: this.pedometer.steps.walking,
						running_steps: this.pedometer.steps.running
					})
				}, time)
			}
		},
		onLaunch: function() {
			console.log('App Launch')
			this.checkIsLogin()
			this.startWebSocket()
			// this.startPedometer();	// 开启计步器
			// this.sendPedometerDataInterval(5000);	
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
	}
</script>

<!-- 每个页面公共css -->
<style lang="scss">
	/* 在App.vue中首行的位置引入uView基础样式 */
	@import "@/uni_modules/uview-ui/index.scss";

	@import url('static/iconfont/icon/iconfont.css');
	// @import url('//at.alicdn.com/t/c/font_3944024_rvo1n18c5hs.css');

	@font-face {
		font-family: leo-he;
		src: url('/static/iconfont/font/ZCOOLKuaiLe-Regular.ttf');
	}

	view,
	text,
	ul,
	li {
		font-family: leo-he;
	}
</style>
