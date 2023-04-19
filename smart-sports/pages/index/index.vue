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
						<uni-icons customPrefix="iconfont" :type="icons.data[icons.currentIcon].type"
							@click="toggleStudentCard"></uni-icons>
						<text>{{icons.data[icons.currentIcon].desc}}</text>
					</view>
				</view>
			</view>
			<view class="content">
				<swiper class="swiper" circular>
					<swiper-item v-for="(swiperCard,swiperCardIndex) in filteredSwiperCards" :key="swiperCardIndex">
						<view class="swiper-card">
							<view class="label">
								<text>{{swiperCard.label}}</text>
								<uni-icons customPrefix="iconfont" type="icon-settings" @click="goToPage('/pages/index/display-settings/display-settings')"></uni-icons>
							</view>
							<u-line length="90%" margin="0 auto"></u-line>
							<view class="icons">
								<view class="icon" v-for="(icon, iconIndex) in swiperCard.icons" :key="iconIndex"
									@click="goToPage(icon.pagePath)">
									<view>
										<uni-icons customPrefix="iconfont" :type="icon.iconName" :color="icon.iconColor"
											size="28"></uni-icons>
									</view>
									<view>
										<u-text :text="icon.title"></u-text>
									</view>
								</view>
							</view>
						</view>
					</swiper-item>
					<swiper-item v-if="filteredSwiperCards.length === 0">
						<view class="swiper-card">
							<view class="label">
								<text>空</text>
								<uni-icons customPrefix="iconfont" type="icon-settings" @click="goToPage('/pages/index/display-settings/display-settings')"></uni-icons>
							</view>
							<u-line length="90%" margin="0 auto"></u-line>
							<view class="empty-tips">
								这里什么都没有~
							</view>
						</view>
					</swiper-item>
				</swiper>
			</view>
		</template>
	</view>
</template>

<script>
	import {
		mapState,
		mapActions,
		mapGetters
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
				}
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
			...mapGetters('parentModule', ['filteredSwiperCards']),
			// 获取学生信息
			...mapState('studentModule', ['studentInfo']),
		},
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

	.content {
		flex-grow: 1;
		width: 100%;
	}
	
	.swiper {
		width: 100%;
		height: 450rpx;
		margin-top: 40rpx;
	}
	
	.swiper-card {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		box-sizing: border-box;
		width: 90%;
		height: 100%;
		margin: 0 auto;
		background-color: rgba(255, 255, 255, 0.5);
		border-radius: 20rpx;
	}

	.swiper-card .label {
		width: 90%;
		height: 85rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 30rpx;
	}
	
	.swiper-card .label .uni-icons:active {
		opacity: 0.25;
	}

	.swiper-card .icons {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
		width: 100%;
	}

	.swiper-card .icons .icon {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		height: 150rpx;
		width: 33.3%;
		font-size: 0.9rem;
	}
	
	.swiper-card .icons .icon:active {
		opacity: 0.25;
	}
	
	.swiper .empty-tips {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		color: #555;
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
