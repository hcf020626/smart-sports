<template>
	<view class="container">
		<view class="errMsg" v-if="parentInfo.cur_bonding_id === '-1'">
			<view>您当前的身份证号码已发送变更，请重新进行亲子绑定再操作！<navigator url="../user-center/bonding/bonding" open-type="navigate"
					class="link">亲子绑定</navigator>
			</view>
		</view>
		<view class="errMsg" v-else-if="parentInfo.cur_bonding_id === '' || parentInfo.cur_bonding_id === null">
			<view>您当前未进行亲子绑定或者亲子绑定失败，请亲子绑定成功后再操作！<navigator url="../user-center/bonding/bonding" open-type="navigate"
					class="link">亲子绑定</navigator>
			</view>
		</view>
		<template v-else>
			<view class="card" :class="cardHeightStyle">
				<view class="imgBox" :class="imgSizeStyle">
					<image :src="studentInfo.avatar_url"></image>
				</view>
				<view class="content">
					<view class="abstract" v-show="icons.currentIcon === 0">
						<text class="row1">{{studentInfo.name}}</text>
						<text class="row2">{{studentInfo.school + ' ' + studentInfo.className}}</text>
					</view>
					<view class="details" v-show="icons.currentIcon === 1">
						<view>姓名：{{studentInfo.name}}</view>
						<view>性别：{{studentInfo.gender}}</view>
						<view>年龄：{{studentInfo.age}}</view>
						<view>学校：{{studentInfo.school}}</view>
						<view>班级：{{studentInfo.className}}</view>
						<view>学号：{{studentInfo.id}}</view>
					</view>
					<view class="icons">
						<uni-icons customPrefix="iconfont" :type="icons.data[icons.currentIcon].type" @click="toggleStudentCard"></uni-icons>
						<text>{{icons.data[icons.currentIcon].desc}}</text>
					</view>
				</view>
			</view>
			<view class="content">
				<z-swiper v-model="categories" :options="options">
					<z-swiper-item :custom-style="{width:'500rpx',height:'500rpx'}" v-for="(category,index) in categories" :key="index">
							<view class="category">
								<view class="label">{{category.label}}</view>
								<view class="items">
									<view class="item" v-for="(item, index) in category.items" :key="index"
										@click="goToPage(item.pagePath)">
										<view>
											<uni-icons customPrefix="iconfont" :type="item.iconName" :color="item.iconColor" size="28">
											</uni-icons>
										</view>
										<view>
											<u-text :text="item.title"></u-text>
										</view>
									</view>
								</view>
							</view>
					</z-swiper-item>
				</z-swiper>
			</view>
		</template>
	</view>
</template>

<script>
	import {
		mapState,
		mapActions
	} from 'vuex'
	export default {
		data() {
			return {
				cardHeightStyle: {
					cardMinHeight: true,
					cardMaxHeight: false
				},
				imgSizeStyle: {
					imgBoxMinSize: true,
					imgBoxMaxSize: false
				},
				icons: {
					currentIcon: 0,
					data: [{
						type: 'icon-arrow-down',
						desc: '展开'
					}, {
						type: 'icon-arrow-up',
						desc: '收起'
					}]
				},
				options: {
					effect: 'coverflow',
					centeredSlides: true,
					slidesPerView: 'auto',
					coverflowEffect: {
						rotate: 50,
						stretch: 0,
						depth: 100,
						modifier: 1,
						slideShadows: true,
					},
					loop: true
				},
				categories: [{
					label: '身体指标',
					items: [{
						iconName: 'icon-height',
						iconColor: '#2b85e4 ',
						title: '身高',
						pagePath: '/pages/index/body-metrics/height/height'
					}, {
						iconName: 'icon-weight',
						iconColor: '#18b566',
						title: '体重',
						pagePath: '/pages/index/body-metrics/weight/weight'
					}, {
						iconName: 'icon-vision',
						iconColor: '#606266',
						title: '视力',
						pagePath: '/pages/index/body-metrics/vision/vision'
					}, {
						iconName: 'icon-blood-pressure',
						iconColor: '#FF0000',
						title: '血压',
						pagePath: '/pages/index/body-metrics/blood-pressure/blood-pressure'
					}, {
						iconName: 'icon-lung-capacity',
						iconColor: '#00FF00',
						title: '肺活量',
						pagePath: '/pages/index/body-metrics/lung-capacity/lung-capacity'
					}]
				}, {
					label: '体能和耐力',
					items: [{
						iconName: 'icon-push-ups',
						iconColor: '#0000FF',
						title: '俯卧撑',
						pagePath: '/pages/index/strength-and-stamina/push-ups/push-ups'
					}, {
						iconName: 'icon-sit-ups',
						iconColor: 'black',
						title: '仰卧起坐',
						pagePath: '/pages/index/strength-and-stamina/sit-ups/sit-ups'
					}, {
						iconName: 'icon-pull-ups',
						iconColor: '#18b566',
						title: '引体向上',
						pagePath: '/pages/index/strength-and-stamina/pull-ups/pull-ups'
					}, {
						iconName: 'icon-running',
						iconColor: 'purple',
						title: '跑步',
						pagePath: '/pages/index/strength-and-stamina/running/running'
					}, {
						iconName: 'icon-swimming',
						iconColor: '#606266',
						title: '游泳',
						pagePath: '/pages/index/strength-and-stamina/swimming/swimming'
					}]
				}, {
					label: '爆发力',
					items: [{
						iconName: 'icon-long-jump',
						iconColor: 'blue',
						title: '立定跳远',
						pagePath: '/pages/index/explosiveness/long-jump/long-jump'
					}, {
						iconName: 'icon-solid-ball',
						iconColor: 'purple',
						title: '实心球',
						pagePath: '/pages/index/explosiveness/solid-ball/solid-ball'
					}]
				}, {
					label: '协调力',
					items: [{
						iconName: 'icon-rope-skipping',
						iconColor: '#000',
						title: '跳绳',
						pagePath: '/pages/index/coordination/rope-skipping/rope-skipping'
					}]
				}, {
					label: '柔韧性',
					items: [{
						iconName: 'icon-sit-and-reaches',
						iconColor: 'green',
						title: '坐位体前屈',
						pagePath: '/pages/index/flexibility/sit-and-reaches/sit-and-reaches'
					}]
				}, ],
			}
		},
		methods: {
			goToPage(path) {
				uni.navigateTo({
					url: path
				})
			},
			toggleStudentCard() {
				this.cardHeightStyle.cardMaxHeight = !this.cardHeightStyle.cardMaxHeight;
				this.cardHeightStyle.cardMinHeight = !this.cardHeightStyle.cardMinHeight;

				this.imgSizeStyle.imgBoxMaxSize = !this.imgSizeStyle.imgBoxMaxSize;
				this.imgSizeStyle.imgBoxMinSize = !this.imgSizeStyle.imgBoxMinSize;
				
				this.icons.currentIcon = this.icons.currentIcon === 1 ? 0 : 1;
			}
		},
		computed: {
			// 获取用户信息
			...mapState('parentModule', ['parentInfo']),
			// 获取学生信息
			...mapState('studentModule', ['studentInfo']),
		}
	}
</script>


<style scoped lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		width: 100vw;
		height: 100vh;
		background-color: whitesmoke;
		background-image: url('@/static/images/bg.png');
		background-repeat: no-repeat;
		background-size: 100%;
		// #ifndef APP
		background-position: center;
		// #endif
		// #ifdef APP
		background-position: center 60%;
		// #endif
	}

	.card {
		position: relative;
		margin-top: 60rpx;
		width: 500rpx;
		background-color: #fff;
		border-radius: 20rpx;
		box-shadow: 0 35rpx 80rpx rgba(0, 0, 0, 0.15);
		transition: 0.5s;
	}

	.cardMinHeight {
		height: 250rpx;
	}

	.cardMaxHeight {
		height: 400rpx;
	}

	.imgBox {
		position: absolute;
		left: 50%;
		top: -50rpx;
		transform: translateX(-50%);
		background: #fff;
		border-radius: 20rpx;
		box-shadow: 0 15rpx 50rpx rgba(0, 0, 0, 0.35);
		overflow: hidden;
		transition: 0.5s;
	}

	.imgBoxMinSize {
		width: 150rpx;
		height: 150rpx;
	}

	.imgBoxMaxSize {
		width: 200rpx;
		height: 200rpx;
	}

	.imgBox image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.card .content {
		position: absolute;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
	}

	.card .content .abstract {
		width: 100%;
		transition: 0.5s;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.card .content .abstract .row1 {
		font-size: 1.25em;
		font-weight: 600;
		color: #555;
		line-height: 1.2em;
	}

	.card .content .abstract .row2 {
		font-size: 0.75em;
		font-weight: 500;
		opacity: 0.5;
	}
	
	.card .details {
		width: 70%;
		font-size: 0.8em;
		font-weight: 500;
		opacity: 0.5;
	}
	
	.card .icons {
		font-size: 0.7em;
		font-weight: 500;
		opacity: 0.5;
		padding: 10rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.category {
		display: flex;
		flex-direction: column;
		width: 95%;
		height: 450rpx;
		margin: 25rpx auto;
		background-color: rgba(255, 255, 255, 0.5);
		border-radius: 20rpx;
	}
	
	.content {
		flex-grow: 1;
	}
	
	.category .label {
		padding: 25rpx 50rpx 0 50rpx;
	}
	
	.category .items {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
		width: 100%;
		margin: 30rpx auto;
	}
	
	.category .items .item {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		height: 150rpx;
		width: 33.3%;
		font-size: 0.9rem;
	}
	
	.category .items .item:active {
		opacity: 0.5;
	}

	.errMsg {
		width: 90%;
		margin: 0 auto;
		padding-top: 200rpx;
		text-align: center;
		line-height: 50rpx;
		color: #82848a;
	}

	.errMsg .link {
		color: #2979ff;
		text-decoration: underline;
		display: inline;
	}
</style>
