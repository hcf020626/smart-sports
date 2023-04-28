<template>
	<view class="container">
		<u-toast ref="uToast"></u-toast>
		<uni-nav-bar :fixed="true" :border="false" :status-bar="true">
			<uni-icons slot="left" customPrefix="iconfont" type="icon-arrow-left" @click="clickLeft" size="25">
			</uni-icons>
			<view class="navbar-title">
				<text class="title">运动步数</text>
				<!-- <view class="date">
					<text>{{currentSelectedDate | formatDate}}</text>
					<uni-icons customPrefix="iconfont" type="icon-arrow-down" color="#909399" @click="isShowActionSheet = true"></uni-icons>
				</view> -->
			</view>
			
			<view slot="right" style="position: relative;">
				<uni-icons customPrefix="iconfont" type="icon-list" @click="isShowPopup = true" size="25">
				</uni-icons>
				<u-badge :isDot="true" type="error" absolute :offset="[1.5, -0.5]"  :show="friendsApplicationMessages.length > 0"></u-badge>
			</view>
		</uni-nav-bar>
	
		<view class="charts-area">
			<view class="chart">
				<l-echart ref="stepsGuage" @finished="initStepsGuage"></l-echart>
			</view>
			<view class="data">
				<view class="data-item" v-for="(legend, index) in guageLegend" :key="index">
					<view class="title">
						<uni-icons customPrefix="iconfont" :type="legend.iconType" :color="legend.iconColor"></uni-icons>
						<text>{{legend.name}}</text>
					</view>
					<view class="data">
						<text class="value">{{legend.value}}</text>
						<text class="target">/{{legend.target}}</text>
					</view>
				</view>
			</view>
		</view>
		
		<u-collapse class="rating-list" :border="false" :value="['0']">
			<u-collapse-item title="步数排行榜" name="0">
				<uni-icons slot="icon" customPrefix="iconfont" type="icon-rating" color="#0088FF"></uni-icons>
				<u-cell-group :border="false">
					<!-- 单元格，使用 v-for 循环渲染 cellItems 数组中的元素 -->
					<u-cell v-for="(friend, index) in stepsRating" :key="index" :title="friend.realname" :value="friend.total_steps === 0 ? '0' : friend.total_steps" :center="true" :border="false" style="border-top: 1rpx solid #DCDFE6">
						<!-- 单元格左侧图标，使用 u-avatar 组件显示学生头像 -->
						<view slot="icon" class="left-icon">
							<text>{{index+1}}</text>
							<u-avatar :src="baseURL + friend.avatar_url"></u-avatar>
						</view>
						<view slot="right-icon" class="right-icon">
							<text>{{friend.likes}}</text>
							<uni-icons customPrefix="iconfont" type="icon-heart" :color="friend.isGiveLike ? 'red' : 'grey'" @click="changeLike(index, friend.isGiveLike)"></uni-icons>
						</view>
					</u-cell>
				</u-cell-group>
				<u-divider text="没有更多啦~" :hairline="true"></u-divider>
			</u-collapse-item>
		</u-collapse>
		
		<u-popup :show="isShowPopup" mode="bottom" @close="isShowPopup = false">
			<u-cell-group :border="false">
				<!-- 单元格，使用 v-for 循环渲染 cellItems 数组中的元素 -->
				<u-cell v-for="(menuItem, index) in menuList" :key="index" :title="menuItem.title" :border="false" :is-link="true" :url="menuItem.pagePath">
					<!-- 单元格左侧图标，使用 u-avatar 组件显示学生头像 -->
					<view slot="icon" style="position: relative;">
						<uni-icons customPrefix="iconfont" :type="menuItem.iconName" :color="menuItem.iconColor"></uni-icons>
						<u-badge type="error" :value="friendsApplicationMessages.length" max="999" numberType="overflow" absolute :offset="[-10, -10]"  :show="menuItem.title === '好友申请' && friendsApplicationMessages.length > 0"></u-badge>
					</view>
				</u-cell>
			</u-cell-group>
		</u-popup>
		<!-- <uni-calendar :date="currentSelectedDate" ref="calendar" :insert="false"
			:start-date="'1970-1-1'" :end-date="new Date().toLocaleString()" @confirm="singleCalendarConfirm" /> -->
	</view>
</template>

<script>
	// 引入 echarts，用于绘制图表
	import * as echarts from '@/uni_modules/lime-echart/static/echarts.min'
	import {mapState, mapActions} from 'vuex'
	import api from '../../../api/index.js'
	import {baseURL} from '@/config.js'
	export default {
		data() {
			return {
				baseURL,
				isShowPopup: false,
				stepsGuageOption: {},
				currentSelectedDate: '2023-4-22',
				menuList: [
					{
						iconName: 'icon-add-friend',
						iconColor: '#909399',
						title: '添加好友',
						pagePath: '/pages/user-center/daily-steps/add-friend/add-friend'
					},{
						iconName: 'icon-manage-friends',
						iconColor: '#909399',
						title: '好友管理',
						pagePath: '/pages/user-center/daily-steps/manage-friends/manage-friends'
					},{
						iconName: 'icon-new-friends',
						iconColor: '#909399',
						title: '好友申请',
						pagePath: '/pages/user-center/daily-steps/new-friends/new-friends'
					}
				],
				guageLegend: []
			}
		},
		computed: {
			...mapState('parentModule', ['parentInfo','friendsApplicationMessages', 'stepsRating', 'steps', 'friendList']),
		},
		methods: {
			...mapActions('parentModule', ['updateFriendList', 'updateStepsRating', 'updateSteps', 'updateLike']),
			clickLeft() {
				uni.navigateBack()
			},
			async changeLike(index, isGiveLike){
				
				console.log(this.stepsRating);
				let likes = this.stepsRating[index].likes;
				if(isGiveLike && likes > 0){
					likes--;
				}else{
					likes++;
				}
				
				try{
					const today = new Date();
					const year = today.getFullYear();
					const month = String(today.getMonth() + 1).padStart(2, '0');
					const day = String(today.getDate()).padStart(2, '0');
					const formattedDate = `${year}-${month}-${day}`
					
					const {data: {msg, status}} = await api.parent.updateParticularLike(this.stepsRating[index].id, likes, formattedDate);
					
					if(!status){
						this.updateLike({index, isGiveLike, likes});
						this.$refs.uToast.show({
							type: 'success',
							message: isGiveLike ? '取消点赞' : '点赞成功',
							icon: 'https://cdn.uviewui.com/uview/demo/toast/success.png',
							position: 'top'
						})
					}
				}catch(e){
					//TODO handle the exception
					console.log(e);
					this.$refs.uToast.show({
						type: 'error',
						message: '请求发生问题，请稍后再试',
						icon: 'https://cdn.uviewui.com/uview/demo/toast/error.png',
						position: 'top'
					})
				}
			},
			getPageData(){
				setTimeout(async ()=>{
					try{
						const friendListResults = await api.parent.getFriendListById(this.parentInfo.id);
						
						const friendListStatus = friendListResults.data.status;
						const friendListMsg = friendListResults.data.msg;
						const friendList = friendListResults.data.data.friendList;
						
						if(!friendListStatus){
							this.updateFriendList(friendList)
						}
						
						const today = new Date();
						const year = today.getFullYear();
						const month = String(today.getMonth() + 1).padStart(2, '0');
						const day = String(today.getDate()).padStart(2, '0');
						const formattedDate = `${year}-${month}-${day}`
						
						let parentIds = [];
						this.friendList.forEach((friend)=>{
							parentIds.push(friend.friend_id);
						})
						parentIds.push(this.parentInfo.id);
						
						const stepsRatingResults = await api.parent.getParticularStepsRating(parentIds, formattedDate);
						
						const stepsRatingStatus = stepsRatingResults.data.status;
						const stepsRatingMsg = stepsRatingResults.data.msg;
						const stepsRating = stepsRatingResults.data.data.stepsRating;
						if(!stepsRatingStatus){
							this.updateStepsRating(stepsRating);
						}
						
						const stepsResults = await api.parent.getParticularSteps(this.parentInfo.id, formattedDate);
						
						const stepsStatus = stepsResults.data.status;
						const stepsMsg = stepsResults.data.msg;
						const steps = stepsResults.data.data.steps;
						
						if(!stepsStatus){
							this.updateSteps(steps);
						}
						
						if(!friendListStatus && !stepsRatingStatus){
							this.$refs.uToast.show({
								type: 'success',
								message: '页面数据全部更新成功！',
								icon: 'https://cdn.uviewui.com/uview/demo/toast/success.png',
								position: 'top'
							})
						}else{
							this.$refs.uToast.show({
								type: 'error',
								message: friendListMsg + ' ' + stepsRatingMsg,
								icon: 'https://cdn.uviewui.com/uview/demo/toast/error.png',
								position: 'top'
							})
						}
					}catch(e){
						//TODO handle the exception
						console.log(e);
						this.$refs.uToast.show({
							type: 'error',
							message: '请求发生问题，请稍后再试',
							icon: 'https://cdn.uviewui.com/uview/demo/toast/error.png',
							position: 'top'
						})
					}finally {
						this.initPageData()
						uni.stopPullDownRefresh();
					}
				}, 500)
			},
			initPageData(){
				this.guageLegend = [
					{
						name: '总步数（步）',
						iconType: 'icon-all-steps',
						iconColor: '#FD6124',
						value: this.steps.total_steps,
						target: 6000
					},
					{
						name: '走路步数（步）',
						iconType: 'icon-walking-steps',
						iconColor: '#FFBE26',
						value: this.steps.walking_steps,
						target: 6000
					},
					{
						name: '跑步步数（步）',
						iconType: 'icon-running-steps',
						iconColor: '#41B8FF',
						value: this.steps.running_steps,
						target: 6000
					},
				]
				this.updateStepsGuageOption();
				if(this.$refs.stepsGuage){
					this.$refs.stepsGuage.setOption(this.stepsGuageOption);
				}
			},
			initStepsGuage() {
				this.$refs.stepsGuage.init(echarts, chart => {
					console.log('initializing steps guage');
					chart.setOption(this.stepsGuageOption);
				});
			},
			updateStepsGuageOption(){
				this.stepsGuageOption = {
					series: [{
							type: 'gauge',
							center: ['50%', '90%'],
							startAngle: 180,
							endAngle: 0,
							radius: 50,
							min: 0,
							max: 6000,
							itemStyle: {
								color: '#41B8FF',
							},
							progress: {
								show: true,
								width: 30
							},
							pointer: {
								show: false
							},
							axisLine: {
								lineStyle: {
									width: 30,
									color: [
										[1, '#D8EFFF']
									]
								},
							},
							axisTick: {
								show: false
							},
							splitLine: {
								show: false
							},
							axisLabel: {
								show: false
							},
							anchor: {
								show: false
							},
							title: {
								show: false
							},
							detail: {
								show: false
							},
							data: [{
								value: this.steps.running_steps
							}]
						},
						{
							type: 'gauge',
							center: ['50%', '90%'],
							startAngle: 180,
							endAngle: 0,
							radius: 90,
							min: 0,
							max: 6000,
							itemStyle: {
								color: '#FFBE26',
							},
							progress: {
								show: true,
								width: 30
							},
							pointer: {
								show: false
							},
							axisLine: {
								lineStyle: {
									width: 30,
									color: [
										[1, '#FFF1D4']
									]
								},
							},
							axisTick: {
								show: false
							},
							splitLine: {
								show: false
							},
							axisLabel: {
								show: false
							},
							anchor: {
								show: false
							},
							title: {
								show: false
							},
							detail: {
								show: false
							},
							data: [{
								value: this.steps.walking_steps
							}]
						},
						{
							type: 'gauge',
							center: ['50%', '90%'],
							startAngle: 180,
							endAngle: 0,
							radius: 130,
							min: 0,
							max: 6000,
							itemStyle: {
								color: '#FD6124',
							},
							progress: {
								show: true,
								width: 30,
							},
							pointer: {
								show: false
							},
							axisLine: {
								lineStyle: {
									width: 30,
									color: [
										[1, '#FFDFD5']
									]
								}
							},
							axisTick: {
								show: false
							},
							splitLine: {
								show: false
							},
							axisLabel: {
								show: false
							},
							anchor: {
								show: false
							},
							title: {
								show: false
							},
							detail: {
								show: false
							},
							data: [{
								value: this.steps.total_steps
							}]
						},
					]
				};
			}
		},
		onLoad() {
			this.initPageData();
		},
		// 页面刷新时获取页面数据
		onPullDownRefresh() {
			this.getPageData()
		},
		filters: {
			// 将YYYY-MM-DD形式的日期格式化成YYYY年MM月DD日
			formatDate(value) {
				if (value) {
					const date = new Date(value);
					const year = date.getFullYear();
					const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
					const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
					return `${year}年${month}月${day}日`;
				}
				return '';
			}
		}
	}
</script>

<style scoped>
	.container {
		width: 100vw;
		height: 100vh;
		background-color: whitesmoke;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
	}
	
	.navbar-title {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	
	.navbar-title .title {
		font-size: 16px;
		// #ifdef H5
		font-weight: 700;
		// #endif
		font-family: sans-serif;
	}
	
	.navbar-title .date {
		display: flex;
		justify-content: center;
		align-items: center;
		color: #909399;
	}
	
	.charts-area, .rating-list {
		width: 95%;
		margin: 20rpx;
		background-color: white;
		border-radius: 20rpx;
	}
	
	.charts-area .chart {
		width: 100%;
		height: 180px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.charts-area .data {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.data-item {
		width: 33.33%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding-bottom: 20rpx;
	}
	
	.data-item .title {
		font-size: 0.8em;
	}
	
	.data {
		padding-top: 10rpx;
	}
	
	.data .value {
		font-weight: 600;
	}
	
	.data .target {
		color: #909399;
	}
	
	.rating-list .left-icon {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.left-icon text {
		padding-right: 20rpx;
	}
	
	.rating-list .right-icon {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-left: 10rpx;
	}
	
	.right-icon text {
		color: #909399;
		font-size: 0.9em;
	}
</style>
