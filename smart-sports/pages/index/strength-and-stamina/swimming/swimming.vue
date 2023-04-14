<template>
	<!-- container 容器包括两个部分：一个是 subsection，另一个是 content -->
	<view class="container">
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
				<view class="data-area" v-show="swimmingData.length">
					<view class="value">
						<text class="number">{{Math.floor(swimming/60)}}</text>
						<text class="unit" v-show="!isSingleSelectedEmtpy">'</text>
						<text class="number">{{swimming%60}}</text>
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
						<l-echart ref="swimmingGuage" @finished="initSwimmingGuage"></l-echart>
					</view>

					<view class="tips" v-show="swimmingData.length">{{tips}}</view>
				</view>
			</view>

			<!-- 如果 subsection.current 为 0，渲染日页面，该页面包含了一个数据区域和一个图表区域 -->
			<view class="stats" v-else>
				<view class="charts-area">
					<view style="width: 100%;height:300px;">
						<l-echart ref="swimmingLineChart" @finished="initSwimmingLineChart"></l-echart>
					</view>
				</view>

				<view class="range-date" v-show="swimmingData.length">
					<text>{{startDate | formatDate }}</text><text>-</text><text>{{endDate | formatDate }}</text>
					<uni-icons customPrefix="iconfont" type="icon-arrow-down" @click="openRangeCalendar"></uni-icons>
				</view>
			</view>

			<uni-calendar :selected="calendarSelected" :date="currentSelectedDate" ref="singleCalendar" :insert="false"
				:start-date="'1970-1-1'" :end-date="new Date().toLocaleString()" @confirm="singleCalendarConfirm" />
			<uni-calendar :selected="calendarSelected" ref="rangeCalendar" :range="true" :insert="false"
				:start-date="'1970-1-1'" :end-date="new Date().toLocaleString()" @confirm="rangeCalendarConfirm" />
		</view>
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
				subsection: {
					list: ['日', '统计'],
					current: 0
				},
				swimming: '',
				currentSelectedDate: '',
				startDate: '',
				endDate: '',
				isSingleSelectedEmtpy: false,
				swimmingGuageOption: {},
				swimmingLineChartOption: {},
				tips: '',
				calendarSelected: []
			}
		},
		computed: {
			// 获取学生信息，需要studentInfo的height
			...mapState('studentModule', ['studentInfo', 'swimmingData']),
		},
		// 页面加载时初始化页面数据，并开启下拉刷新。
		onLoad() {
			this.initPageData();
			uni.startPullDownRefresh();
		},
		// 页面刷新时获取页面数据
		onPullDownRefresh() {
			this.getPageData()
		},
		methods: {
			...mapActions('studentModule', ['updateSwimmingData']),
			openSingleCalendar() {
				this.$refs.singleCalendar.open();
			},
			openRangeCalendar() {
				this.$refs.rangeCalendar.open();
			},
			singleCalendarConfirm(e) {
				this.currentSelectedDate = e.fulldate;
				const targetData = this.swimmingData.find(d => d.date === this.currentSelectedDate);
				if (!targetData) {
					this.swimming = '无';
					this.isSingleSelectedEmtpy = true;
					return;
				} else {
					this.isSingleSelectedEmtpy = false;
				}
				this.swimming = targetData ? targetData.swimming : 0;
				this.updateSwimmingGuageOption(this.swimming)
				this.$refs.swimmingGuage.setOption(this.swimmingGuageOption)
			},
			rangeCalendarConfirm(e) {
				if (!e.range.data.length) {
					return;
				}

				this.startDate = e.range.data[0];
				this.endDate = e.range.data[e.range.data.length - 1];
				this.updateSwimmingLineChartOption(this.startDate, this.endDate);
				this.$refs.swimmingLineChart.setOption(this.swimmingLineChartOption);
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
								swimmingData
							}
						} = await api.student.getSwimmingById(this.studentInfo.id);
						if (!status) {
							this.updateSwimmingData(swimmingData);
							if (this.swimmingData.length) {
								try {
									this.initPageData();
								} catch (e) {
									//TODO handle the exception
									console.log('init page data err', e);
								}

								if (this.$refs.swimmingGuage) {
									this.$refs.swimmingGuage.clear();
									this.$refs.swimmingGuage.setOption(this.swimmingGuageOption);
								}
								if (this.$refs.swimmingLineChart) {
									this.$refs.swimmingLineChart.clear();
									this.$refs.swimmingLineChart.setOption(this.swimmingLineChartOption);
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
				if (!this.swimmingData.length) {
					console.log('The swimming data is empty');
					this.swimmingGuageOption = this.swimmingLineChartOption = {
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

				this.swimmingData.forEach((item) => {
					this.calendarSelected.push({
						date: item.date,
						info: '有数据'
					})
				})

				this.currentSelectedDate = this.swimmingData[this.swimmingData.length - 1].date;
				this.swimming = this.swimmingData[this.swimmingData.length - 1].swimming;
				try {
					this.updateSwimmingGuageOption(this.swimming)
				} catch (e) {
					//TODO handle the exception
					console.log('update swimming guage option err', e);
				}

				this.startDate = this.swimmingData[0].date;
				this.endDate = this.swimmingData[this.swimmingData.length - 1].date;
				try {
					this.updateSwimmingLineChartOption(this.startDate, this.endDate);
				} catch (e) {
					//TODO handle the exception
					console.log('update swimming line chart option err', e);
				}
			},
			// 初始化仪表盘
			initSwimmingGuage() {
				// init 是 echarts 初始化调用函数,第一个参数是传入echarts,第二个参数是回调函数，回调函数的参数是 chart 实例
				this.$refs.swimmingGuage.init(echarts, chart => {
					console.log('initializing swimming guage');
					chart.setOption(this.swimmingGuageOption);
				});
			},
			// 初始化折线图
			initSwimmingLineChart() {
				// init 是 echarts 初始化调用函数,第一个参数是传入echarts,第二个参数是回调函数，回调函数的参数是 chart 实例
				this.$refs.swimmingLineChart.init(echarts, chart => {
					console.log('initializing swimming line chart');
					chart.setOption(this.swimmingLineChartOption);
				});
			},
			// 更新仪表盘的配置选项
			updateSwimmingGuageOption(swimming) {
				if (this.studentInfo.gender === "男") {
					if (swimming <= 192) {
						this.tips = "恭喜，您的孩子游泳表现非常出色，达到了优秀水平。游泳是一项优秀的全身锻炼运动，可以增强身体素质，提高心肺功能。建议您的孩子继续坚持游泳训练，保持良好的身体状态。";
					} else if (swimming <= 300) {
						this.tips = "您的孩子的游泳表现不错，已经达到了良好的水平。游泳是一项全身锻炼运动，可以锻炼身体各个部位的肌肉，提高心肺功能。建议您的孩子继续坚持游泳训练，争取取得更好的成绩。";
					} else if (swimming <= 360) {
						this.tips = "您的孩子的游泳表现达到了及格水平，但还有提高的空间。建议您的孩子加强游泳训练，提高游泳速度和耐力，达到更好的成绩。同时，也要注意游泳姿势的正确性，避免受伤。";
					} else {
						this.tips =
							"您的孩子的游泳表现不及格，需要加强游泳训练。游泳是一项全身锻炼运动，可以提高身体素质，增强心肺功能，建议您的孩子多加练习，争取取得更好的成绩。同时，也要注意游泳安全，避免发生意外情况。";
					}
				} else {
					if (swimming <= 202) {
						this.tips = "恭喜，您的孩子游泳表现非常出色，达到了优秀水平。游泳是一项优秀的全身锻炼运动，可以增强身体素质，提高心肺功能。建议您的孩子继续坚持游泳训练，保持良好的身体状态。";
					} else if (swimming <= 320) {
						this.tips = "您的孩子的游泳表现不错，已经达到了良好的水平。游泳是一项全身锻炼运动，可以锻炼身体各个部位的肌肉，提高心肺功能。建议您的孩子继续坚持游泳训练，争取取得更好的成绩。";
					} else if (swimming <= 380) {
						this.tips =
							"您的孩子的游泳表现一般，需要加强训练。游泳是一项全身锻炼运动，可以增强身体素质，提高心肺功能，但需要长期坚持才能看到效果。建议您的孩子继续加强游泳训练，争取取得更好的成绩。";
					} else {
						this.tips = "您的孩子的游泳表现较差，需要加强训练。游泳是一项全身锻炼运动，可以增强身体素质，提高心肺功能，但需要长期坚持才能看到效果。建议您的孩子加强游泳训练，争取取得更好的成绩。";
					}
				}
				this.swimmingGuageOption = {
					tooltip: {
						formatter: '{a} \n{b} : {c}%'
					},
					series: [{
						name: '100米游泳时长',
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
							value: swimming,
							name: '100米游泳成绩'
						}]
					}]
				};
			},
			// 更新折线图的配置选项
			updateSwimmingLineChartOption(startDate, endDate) {
				let date = [];
				let maleAvgSwimming = [];
				let femaleAvgSwimming = [];
				let swimming = [];

				this.swimmingData
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
						maleAvgSwimming.push(item.maleAvgSwimming);
						femaleAvgSwimming.push(item.femaleAvgSwimming);
						swimming.push(item.swimming);
					});

				this.swimmingLineChartOption = {
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
						type: 'scroll',
						orient: 'horizontal',
						left: 'center',
						bottom: 5, // 使 legend 位于 grid 的下方
						data: ['班级男生平均100米游泳时长', '班级女生平均100米游泳时长', '您孩子的100米游泳时长']
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
							name: '班级男生平均100米游泳时长',
							type: 'line',
							data: maleAvgSwimming,
						}, {
							name: '班级女生平均100米游泳时长',
							type: 'line',
							data: femaleAvgSwimming,
						},
						{
							name: '您孩子的100米游泳时长',
							type: 'line',
							data: swimming
						},
					]
				};
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
		align-items: flex-start;
	}

	.value>.number {
		font-size: 2rem;
		font-weight: bold;
	}

	.value>.unit {
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
