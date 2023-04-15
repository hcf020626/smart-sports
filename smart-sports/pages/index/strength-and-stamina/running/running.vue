<template>
	<!-- container 容器包括两个部分：一个是 subsection，另一个是 content -->
	<view class="container">
		<uni-nav-bar :fixed="true" :border="false" :status-bar="true">
			<uni-icons slot="left" customPrefix="iconfont" type="icon-arrow-left" @click="navigateBack" size="25">
			</uni-icons>
			<view class="navbar-title">
				<text>{{currentSelectedTitle}}</text>
				<uni-icons customPrefix="iconfont" type="icon-arrow-down" @click="isShowActionSheet = true"></uni-icons>
			</view>
		</uni-nav-bar>
		<u-toast ref="uToast"></u-toast>
		<!-- subsection 通过 u-subsection 组件渲染了一个 tab 栏，用于切换日和统计两个页面。 -->
		<view class="subsection">
			<u-subsection :list="subsection.list" mode="button" :current="subsection.current" @change="sectionChange"
				activeColor="mediumslateblue"></u-subsection>
		</view>
		<!-- content 部分 -->
		<view class="content">
			<!-- 如果 subsection.current 为 1，渲染统计页面。 -->
			<view class="day" v-if="!subsection.current">
				<!-- 数据区域显示了当前的体重和日期 -->
				<view class="data-area" v-show="runningData.length">
					<view class="value baseline" v-if="currentSelectedTitle === '50m跑步'">
						<text class="number">{{running}}</text>
						<text class="unit" v-show="!isSingleSelectedEmtpy">s</text>
					</view>
					<view class="value up" v-else>
						<text class="number">{{Math.floor(running/60)}}</text>
						<text class="unit" v-show="!isSingleSelectedEmtpy">'</text>
						<text class="number">{{running%60}}</text>
						<text class="unit" v-show="!isSingleSelectedEmtpy">''</text>
					</view>
					<view class="date" @click="openSingleCalendar">
						<text>{{currentSelectedDate | formatDate }}</text>
						<uni-icons customPrefix="iconfont" type="icon-arrow-down"></uni-icons>
					</view>
				</view>
				<u-empty text="数据为空" icon="../../../../static/images/empty/data-empty.png"
					:show="isSingleSelectedEmtpy">
				</u-empty>
				<!-- 图表区域通过 l-echart 组件渲染了一个仪表盘图表 -->
				<view class="charts-area" v-show="!isSingleSelectedEmtpy">
					<view style="width: 100%;height:300px;">
						<l-echart ref="runningGuage" @finished="initRunningGuage"></l-echart>
					</view>

					<view class="tips" v-show="runningData.length">{{tips}}</view>
				</view>
			</view>

			<!-- 如果 subsection.current 为 0，渲染日页面，该页面包含了一个数据区域和一个图表区域 -->
			<view class="stats" v-else>
				<view class="charts-area">
					<view style="width: 100%;height:300px;">
						<l-echart ref="runningLineChart" @finished="initRunningLineChart"></l-echart>
					</view>
				</view>

				<view class="range-date" v-show="runningData.length">
					<text>{{startDate | formatDate }}</text><text>-</text><text>{{endDate | formatDate }}</text>
					<uni-icons customPrefix="iconfont" type="icon-arrow-down" @click="openRangeCalendar"></uni-icons>
				</view>
			</view>

			<uni-calendar :selected="calendarSelected" :date="currentSelectedDate" ref="singleCalendar" :insert="false"
				:start-date="'1970-1-1'" :end-date="new Date().toLocaleString()" @confirm="singleCalendarConfirm" />
			<uni-calendar :selected="calendarSelected" ref="rangeCalendar" :range="true" :insert="false"
				:start-date="'1970-1-1'" :end-date="new Date().toLocaleString()" @confirm="rangeCalendarConfirm" />
		</view>

		<u-action-sheet :actions="actionList" :closeOnClickOverlay="true" :closeOnClickAction="true"
			@select="selectTitle" @close="isShowActionSheet=false" :show="isShowActionSheet" cancelText="取消">
		</u-action-sheet>
	</view>
</template>

<script>
	// 引入 echarts，用于绘制图表
	import * as echarts from '@/uni_modules/lime-echart/static/echarts.min'
	import {
		mapState,
		mapActions
	} from 'vuex'
	import api from '@/api/index.js'
	export default {
		data() {
			return {
				actionList: [],
				isShowActionSheet: false,
				currentSelectedTitle: '50m跑步',
				subsection: {
					list: ['日', '统计'],
					current: 0
				},
				running: '',
				currentSelectedDate: '',
				startDate: '',
				endDate: '',
				isSingleSelectedEmtpy: false,
				runningGuageOption: {},
				runningLineChartOption: {},
				tips: '',
				calendarSelected: []
			}
		},
		computed: {
			// 获取学生信息，需要studentInfo的height
			...mapState('studentModule', ['studentInfo', 'runningData']),
		},
		// 页面加载时初始化页面数据，并开启下拉刷新。
		onLoad() {
			this.actionList.push({
				name: '50m跑步'
			});
			this.actionList.push({
				name: this.studentInfo.gender === '男' ? '1000m跑步' : '800m跑步'
			});
			this.initPageData();
			uni.startPullDownRefresh();
		},
		// 页面刷新时获取页面数据
		onPullDownRefresh() {
			this.getPageData()
		},
		methods: {
			...mapActions('studentModule', ['updateRunningData']),
			navigateBack() {
				uni.navigateBack()
			},
			selectTitle(index) {
				if (this.currentSelectedTitle !== index.name) {
					this.currentSelectedTitle = index.name;
					this.initPageData();
					if (this.$refs.runningGuage) {
						this.$refs.runningGuage.clear();
						this.$refs.runningGuage.setOption(this.runningGuageOption);
					}
					if (this.$refs.runningLineChart) {
						this.$refs.runningLineChart.clear();
						this.$refs.runningLineChart.setOption(this.runningLineChartOption);
					}
				}
			},
			openSingleCalendar() {
				this.$refs.singleCalendar.open();
			},
			openRangeCalendar() {
				this.$refs.rangeCalendar.open();
			},
			singleCalendarConfirm(e) {
				this.currentSelectedDate = e.fulldate;
				const targetData = this.runningData.find(d => d.date === this.currentSelectedDate);
				if (!targetData) {
					this.running = '无';
					this.isSingleSelectedEmtpy = true;
					return;
				} else {
					this.isSingleSelectedEmtpy = false;
				}
				this.running = targetData ? (this.currentSelectedTitle === '50m跑步' ? targetData.shortRun : targetData
					.longRun) : 0;

				this.updateRunningGuageOption(this.running)
				this.$refs.runningGuage.setOption(this.runningGuageOption)
			},
			rangeCalendarConfirm(e) {
				if (!e.range.data.length) {
					return;
				}

				this.startDate = e.range.data[0];
				this.endDate = e.range.data[e.range.data.length - 1];
				this.updateRunningLineChartOption(this.startDate, this.endDate);
				this.$refs.runningLineChart.setOption(this.runningLineChartOption);
			},
			sectionChange(index) {
				this.subsection.current = index;
			},
			// 获取页面数据
			getPageData() {
				setTimeout(async () => {
					try {
						const {
							data: {
								status,
								msg,
								runningData
							}
						} = await api.student.getRunningById(this.studentInfo.id);
						if (!status) {
							this.updateRunningData(runningData);
							if (this.runningData.length) {
								try {
									this.initPageData();
								} catch (e) {
									//TODO handle the exception
									console.log('init page data err', e);
								}

								if (this.$refs.runningGuage) {
									this.$refs.runningGuage.clear();
									this.$refs.runningGuage.setOption(this.runningGuageOption);
								}
								if (this.$refs.runningLineChart) {
									this.$refs.runningLineChart.clear();
									this.$refs.runningLineChart.setOption(this.runningLineChartOption);
								}
								this.$refs.uToast.show({
									type: 'default',
									message: '已获取最新数据',
									icon: 'https://cdn.uviewui.com/uview/demo/toast/default.png',
									position: 'top'
								})
							}
						}
					} catch (e) {
						//TODO handle the exception
						console.log("e: ", e);
					} finally {
						uni.stopPullDownRefresh();
					}
				}, 1500)
			},
			// 初始化页面数据
			initPageData() {
				if (!this.runningData.length) {
					console.log('The running data is empty');
					this.runningGuageOption = this.runningLineChartOption = {
						// 设置一个空的 series
						series: [],
						// 设置一个 empty 效果
						graphic: {
							type: 'text',
							left: 'center',
							top: 'middle',
							style: {
								fill: '#999',
								text: '暂无数据',
								font: 'bold 20px Microsoft YaHei'
							}
						}
					};
					return;
				}

				this.runningData.forEach((item) => {
					this.calendarSelected.push({
						date: item.date,
						info: '有数据'
					})
				})

				this.currentSelectedDate = this.runningData[this.runningData.length - 1].date;

				this.running = this.currentSelectedTitle === '50m跑步' ? this.runningData[this.runningData.length - 1]
					.shortRun : this.runningData[this.runningData.length - 1].longRun;

				try {
					this.updateRunningGuageOption(this.running)
				} catch (e) {
					//TODO handle the exception
					console.log('update running guage option err', e);
				}

				this.startDate = this.runningData[0].date;
				this.endDate = this.runningData[this.runningData.length - 1].date;
				try {
					this.updateRunningLineChartOption(this.startDate, this.endDate);
				} catch (e) {
					//TODO handle the exception
					console.log('update running line chart option err', e);
				}
			},
			// 初始化仪表盘
			initRunningGuage() {
				// init 是 echarts 初始化调用函数,第一个参数是传入echarts,第二个参数是回调函数，回调函数的参数是 chart 实例
				this.$refs.runningGuage.init(echarts, chart => {
					console.log('initializing running guage');
					chart.setOption(this.runningGuageOption);
				});
			},
			// 初始化折线图
			initRunningLineChart() {
				// init 是 echarts 初始化调用函数,第一个参数是传入echarts,第二个参数是回调函数，回调函数的参数是 chart 实例
				this.$refs.runningLineChart.init(echarts, chart => {
					console.log('initializing running line chart');
					chart.setOption(this.runningLineChartOption);
				});
			},
			// 更新仪表盘的配置选项
			updateRunningGuageOption(running) {
				if (this.currentSelectedTitle === '50m跑步') {

					if (this.studentInfo.gender === "男") {
						if (running <= 8) {
							this.tips = "您的孩子50米跑步表现非常出色，达到了优秀水平。这证明您的孩子身体素质很好，建议在平时加强锻炼，维持身体健康。";
						} else if (running <= 9) {
							this.tips = "您的孩子的50米跑步成绩不错，已经达到了良好水平。建议您的孩子在平时加强锻炼，争取取得更好的成绩。";
						} else if (running <= 10) {
							this.tips = "您的孩子的50米跑步成绩一般，需要加强训练，提高身体素质。建议您的孩子多参加有益身体健康的运动项目，如慢跑、游泳等，以提高身体素质。";
						} else {
							this.tips = "您的孩子的50米跑步成绩较差，需要在平时加强锻炼，多参加课外体育锻炼项目，提高身体素质。同时，建议您的孩子在日常生活中保持规律的作息时间，增强体质。";
						}
					} else {
						if (running <= 9) {
							this.tips = "您的孩子50米跑步表现非常出色，达到了优秀水平。这证明您的孩子身体素质很好，建议在平时加强锻炼，维持身体健康。";
						} else if (running <= 10) {
							this.tips = "您的孩子的50米跑步成绩不错，已经达到了良好水平。建议您的孩子在平时加强锻炼，争取取得更好的成绩。";
						} else if (running <= 11) {
							this.tips = "您的孩子的50米跑步成绩一般，需要加强训练，提高身体素质。建议您的孩子多参加有益身体健康的运动项目，如慢跑、游泳等，以提高身体素质。";
						} else {
							this.tips = "您的孩子的50米跑步成绩较差，需要在平时加强锻炼，多参加课外体育锻炼项目，提高身体素质。同时，建议您的孩子在日常生活中保持规律的作息时间，增强体质。";
						}
					}

					this.runningGuageOption = {
						tooltip: {
							formatter: '{a} \n{b} : {c}s'
						},
						series: [{
							name: this.currentSelectedTitle,
							type: 'gauge',
							center: ['50%', '60%'],
							radius: '90%',
							min: 0,
							max: 20,
							progress: {
								show: true
							},
							axisLabel: {
								formatter: '{value}s'
							},
							detail: {
								valueAnimation: true,
								formatter: '{value}s',
								fontSize: 20
							},
							data: [{
								value: running,
								name: this.currentSelectedTitle
							}]
						}]
					};
				} else {
					if (this.studentInfo.gender === "男") {
						if (running <= 180) {
							this.tips = "您的孩子1000米跑步表现非常出色，达到了优秀水平。这证明您的孩子身体素质很好，建议在平时加强锻炼，维持身体健康。";
						} else if (running <= 210) {
							this.tips = "您的孩子的1000米跑步成绩不错，已经达到了良好水平。建议您的孩子在平时加强锻炼，争取取得更好的成绩。";
						} else if (running <= 240) {
							this.tips = "您的孩子的1000米跑步成绩一般，需要加强训练，提高身体素质。建议您的孩子多参加有益身体健康的运动项目，如慢跑、游泳等，以提高身体素质。";
						} else {
							this.tips = "您的孩子的1000米跑步成绩较差，需要在平时加强锻炼，多参加课外体育锻炼项目，提高身体素质。同时，建议您的孩子在日常生活中保持规律的作息时间，增强体质。";
						}
					} else {
						if (running <= 150) {
							this.tips = "您的孩子800米跑步表现非常出色，达到了优秀水平。这证明您的孩子身体素质很好，建议在平时加强锻炼，维持身体健康。";
						} else if (running <= 180) {
							this.tips = "您的孩子的800米跑步成绩不错，已经达到了良好水平。建议您的孩子在平时加强锻炼，争取取得更好的成绩。";
						} else if (running <= 210) {
							this.tips = "您的孩子的800米跑步成绩一般，需要加强训练，提高身体素质。建议您的孩子多参加有益身体健康的运动项目，如慢跑、游泳等，以提高身体素质。";
						} else {
							this.tips = "您的孩子的800米跑步成绩较差，需要在平时加强锻炼，多参加课外体育锻炼项目，提高身体素质。同时，建议您的孩子在日常生活中保持规律的作息时间，增强体质。";
						}
					}
					this.runningGuageOption = {
						tooltip: {
							formatter: '{a} \n{b} : {c}%'
						},
						series: [{
							name: this.currentSelectedTitle,
							type: 'gauge',
							center: ['50%', '60%'],
							radius: '90%',
							min: 0,
							max: 600,
							progress: {
								show: true
							},
							axisLabel: {
								formatter: function(params) {
									return `${Math.floor(params/60)}'${params%60}''`;
								}
							},
							detail: {
								valueAnimation: true,
								formatter: function(params) {
									return `${Math.floor(params/60)}'${params%60}''`;
								},
								fontSize: 20
							},
							data: [{
								value: running,
								name: this.currentSelectedTitle
							}]
						}]
					};
				}
			},
			// 更新折线图的配置选项
			updateRunningLineChartOption(startDate, endDate) {
				let date = [];
				let maleAvgShortRun = [];
				let femaleAvgShortRun = [];
				let shortRun = [];
				let maleAvgLongRun = [];
				let femaleAvgLongRun = [];
				let longRun = [];

				this.runningData
					.filter(item => {
						return item.date >= startDate && item.date <= endDate;
					})
					.forEach(item => {
						// 然后，我们再对过滤后的数组使用forEach()方法来进行处理。
						const d = new Date(item.date);
						const year = d.getFullYear();
						const month = d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1;
						const day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
						date.push(`${year}年${month}月${day}日`);
						shortRun.push(item.shortRun);
						longRun.push(item.longRun);
						maleAvgShortRun.push(item.maleAvgShortRun);
						femaleAvgShortRun.push(item.femaleAvgShortRun);
						maleAvgLongRun.push(item.maleAvgLongRun);
						femaleAvgLongRun.push(item.femaleAvgLongRun);
					});

				if (this.currentSelectedTitle === '50m跑步') {
					this.runningLineChartOption = {
						tooltip: {
							trigger: 'axis',
							axisPointer: {
								// 显示提示框上的日期
								label: {
									show: true
								}
							},
							formatter: function(params) {
								var result = params[0].name + '\n';
								for (var i = 0, l = params.length; i < l; i++) {
									var series = params[i];
									result += series.marker + series.seriesName + ' : ' + series.value + 's';
									// 添加了一个条件语句来检查是否为最后一个系列，如果不是，则添加一个换行符。这样就可以确保最后没有多余的换行符了。
									if (i !== l - 1) {
										result += '\n';
									}
								}
								return result;
							}
						},
						grid: {
							left: '3%',
							right: '4%',
							bottom: 60, // 较大的值，用于容纳 legend 的高度
							containLabel: true
						},
						legend: {
							// type: 'scroll',
							orient: 'horizontal',
							left: 'center',
							bottom: 5, // 使 legend 位于 grid 的下方
							data: ['班级男生平均50米跑步时长', '班级女生平均50米跑步时长', '您孩子的50米跑步时长']
						},
						xAxis: {
							type: 'category',
							data: date,
							axisLabel: {
								// 隐藏 x 轴上的日期
								show: false
							}
						},
						yAxis: {
							type: 'value',
							min: 0,
							max: 20,
							axisLabel: {
								formatter: '{value}s',
							},
						},
						series: [{
								name: '班级男生平均50米跑步时长',
								type: 'line',
								data: maleAvgShortRun,
							}, {
								name: '班级女生平均50米跑步时长',
								type: 'line',
								data: femaleAvgShortRun,
							},
							{
								name: '您孩子的50米跑步时长',
								type: 'line',
								data: shortRun
							},
						]
					};
				} else {
					this.runningLineChartOption = {
						tooltip: {
							trigger: 'axis',
							axisPointer: {
								// 显示提示框上的日期
								label: {
									show: true
								}
							},
							formatter: function(params) {
								var result = params[0].name + '\n';
								for (var i = 0, l = params.length; i < l; i++) {
									var series = params[i];
									result += series.marker + series.seriesName + ' : ' + Math.floor(series.value /
										60) + '\'' + (series.value % 60).toFixed(0) + '\'\'';
									// 添加了一个条件语句来检查是否为最后一个系列，如果不是，则添加一个换行符。这样就可以确保最后没有多余的换行符了。
									if (i !== l - 1) {
										result += '\n';
									}
								}
								return result;
							}
						},
						grid: {
							left: '3%',
							right: '4%',
							bottom: 60, // 较大的值，用于容纳 legend 的高度
							containLabel: true
						},
						legend: {
							// type: 'scroll',
							orient: 'horizontal',
							left: 'center',
							bottom: 5, // 使 legend 位于 grid 的下方
							data: ['班级男生平均1000米跑步时长', '班级女生平均800米跑步时长', this.studentInfo.gender === '男' ?
								'您孩子的1000米跑步时长' : '您孩子的800米跑步时长'
							]
						},
						xAxis: {
							type: 'category',
							data: date,
							axisLabel: {
								// 隐藏 x 轴上的日期
								show: false
							}
						},
						yAxis: {
							type: 'value',
							min: 0,
							max: 600,
							axisLabel: {
								formatter: function(value) {
									return `${Math.floor(value/60)}'${value%60}''`;
								},
							},
						},
						series: [{
								name: '班级男生平均1000米跑步时长',
								type: 'line',
								data: maleAvgLongRun,
							}, {
								name: '班级女生平均800米跑步时长',
								type: 'line',
								data: femaleAvgLongRun,
							},
							{
								name: this.studentInfo.gender === '男' ? '您孩子的1000米跑步时长' : '您孩子的800米跑步时长',
								type: 'line',
								data: longRun
							},
						]
					};
				}
			}
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

<style scoped lang="scss">
	.container {
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: whitesmoke;
	}

	.navbar-title {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.navbar-title text {
		font-size: 16px;
		// #ifdef H5
		font-weight: 700;
		// #endif
		font-family: sans-serif;
	}

	// 分段器
	.subsection {}

	// 内容区域，内容区域根据分段器的选择来展示某一个场景
	.content {
		width: 100%;
		flex-grow: 1;
	}

	// 场景一：最新，最新包括数据区域、图表区域
	.content>.day {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}

	.day>.data-area {
		width: 100%;
		padding: 50rpx 50rpx 0 50rpx;
	}

	.data-area>.value {
		display: flex;
		flex-direction: row;
	}

	.data-area>.up {
		align-items: flex-start;
	}

	.data-area>.baseline {
		align-items: baseline;
	}

	.value>.number {
		font-size: 2rem;
		font-weight: bold;
	}

	.up>.unit {
		font-size: 2rem;
	}

	.data-area>.date {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}

	.date text {
		font-size: 0.8rem;
		color: $u-tips-color;
	}

	.day>.charts-area {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
	}

	.charts-area .tips {
		padding: 30rpx;
		font-size: 0.8rem;
		color: $u-tips-color;
	}

	.stats {
		width: 100%;
	}

	.stats .range-date {
		width: 95%;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
		margin: 0 auto;
	}

	.stats .range-date text {
		font-size: 0.8rem;
		color: $u-tips-color;
	}
</style>
