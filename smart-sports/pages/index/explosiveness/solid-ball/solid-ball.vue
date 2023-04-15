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
				<view class="data-area" v-show="solidBallData.length">
					<view class="value">
						<text class="number">{{solidBall}}</text>
						<text class="unit" v-show="!isSingleSelectedEmtpy">m</text>
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
						<l-echart ref="solidBallGuage" @finished="initSolidBallGuage"></l-echart>
					</view>

					<view class="tips" v-show="solidBallData.length">{{tips}}</view>
				</view>
			</view>

			<!-- 如果 subsection.current 为 0，渲染日页面，该页面包含了一个数据区域和一个图表区域 -->
			<view class="stats" v-else>
				<view class="charts-area">
					<view style="width: 100%;height:300px;">
						<l-echart ref="solidBallLineChart" @finished="initSolidBallLineChart"></l-echart>
					</view>
				</view>

				<view class="range-date" v-show="solidBallData.length">
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
				solidBall: '',
				currentSelectedDate: '',
				startDate: '',
				endDate: '',
				isSingleSelectedEmtpy: false,
				solidBallGuageOption: {},
				solidBallLineChartOption: {},
				tips: '',
				calendarSelected: []
			}
		},
		computed: {
			// 获取学生信息，需要studentInfo的height
			...mapState('studentModule', ['studentInfo', 'solidBallData']),
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
			...mapActions('studentModule', ['updateSolidBallData']),
			openSingleCalendar() {
				this.$refs.singleCalendar.open();
			},
			openRangeCalendar() {
				this.$refs.rangeCalendar.open();
			},
			singleCalendarConfirm(e) {
				this.currentSelectedDate = e.fulldate;
				const targetData = this.solidBallData.find(d => d.date === this.currentSelectedDate);
				if (!targetData) {
					this.solidBall = '无';
					this.isSingleSelectedEmtpy = true;
					return;
				} else {
					this.isSingleSelectedEmtpy = false;
				}
				this.solidBall = targetData ? targetData.solidBall : 0;
				this.updateSolidBallGuageOption(this.solidBall)
				this.$refs.solidBallGuage.setOption(this.solidBallGuageOption)
			},
			rangeCalendarConfirm(e) {
				if (!e.range.data.length) {
					return;
				}

				this.startDate = e.range.data[0];
				this.endDate = e.range.data[e.range.data.length - 1];
				this.updateSolidBallLineChartOption(this.startDate, this.endDate);
				this.$refs.solidBallLineChart.setOption(this.solidBallLineChartOption);
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
								solidBallData
							}
						} = await api.student.getSolidBallById(this.studentInfo.id);
						if (!status) {
							this.updateSolidBallData(solidBallData);
							if (this.solidBallData.length) {
								try {
									this.initPageData();
								} catch (e) {
									//TODO handle the exception
									console.log('init page data err', e);
								}

								if (this.$refs.solidBallGuage) {
									this.$refs.solidBallGuage.clear();
									this.$refs.solidBallGuage.setOption(this.solidBallGuageOption);
								}
								if (this.$refs.solidBallLineChart) {
									this.$refs.solidBallLineChart.clear();
									this.$refs.solidBallLineChart.setOption(this.solidBallLineChartOption);
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
				if (!this.solidBallData.length) {
					console.log('The solid ball data is empty');
					this.solidBallGuageOption = this.solidBallLineChartOption = {
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

				this.solidBallData.forEach((item) => {
					this.calendarSelected.push({
						date: item.date,
						info: '有数据'
					})
				})

				this.currentSelectedDate = this.solidBallData[this.solidBallData.length - 1].date;
				this.solidBall = this.solidBallData[this.solidBallData.length - 1].solidBall;
				try {
					this.updateSolidBallGuageOption(this.solidBall)
				} catch (e) {
					//TODO handle the exception
					console.log('update solid ball guage option err', e);
				}

				this.startDate = this.solidBallData[0].date;
				this.endDate = this.solidBallData[this.solidBallData.length - 1].date;
				try {
					this.updateSolidBallLineChartOption(this.startDate, this.endDate);
				} catch (e) {
					//TODO handle the exception
					console.log('update solid ball line chart option err', e);
				}
			},
			// 初始化仪表盘
			initSolidBallGuage() {
				// init 是 echarts 初始化调用函数,第一个参数是传入echarts,第二个参数是回调函数，回调函数的参数是 chart 实例
				this.$refs.solidBallGuage.init(echarts, chart => {
					console.log('initializing solid ball guage');
					chart.setOption(this.solidBallGuageOption);
				});
			},
			// 初始化折线图
			initSolidBallLineChart() {
				// init 是 echarts 初始化调用函数,第一个参数是传入echarts,第二个参数是回调函数，回调函数的参数是 chart 实例
				this.$refs.solidBallLineChart.init(echarts, chart => {
					console.log('initializing solid ball line chart');
					chart.setOption(this.solidBallLineChartOption);
				});
			},
			// 更新仪表盘的配置选项
			updateSolidBallGuageOption(solidBall) {
				if (this.studentInfo.gender === "男") {

					if (solidBall >= 12.6) {
						this.tips = "您的孩子的实心球投掷表现非常出色，说明您的孩子拥有较强的肌肉力量和协调性，应该在课余时间多参加各类运动活动，增强自己的身体素质。";
					} else if (solidBall >= 9.4) {
						this.tips = "您的孩子的实心球投掷表现不错，说明您的孩子的肌肉力量和协调性都还可以，需要注意平时训练的规律性，保持身体素质的稳定提高。";
					} else if (solidBall >= 8.2) {
						this.tips =
							"您的孩子的实心球投掷表现一般，需要加强训练，提高肌肉力量和协调性。建议多进行相关训练，如增加肌肉力量、提高手臂协调性等，以提高投掷实心球成绩。同时，也要注意合理安排训练计划，避免过度训练导致身体受损。";
					} else {
						this.tips = "您的孩子的实心球投掷表现较差，需要在平时加强锻炼，多参加课外体育锻炼项目，提高肌肉力量和协调性。同时，建议您的孩子在日常生活中保持规律的作息时间，增强体质。";
					}
				} else {
					if (solidBall >= 9.6) {
						this.tips = "您的孩子的实心球投掷表现非常出色，说明您的孩子拥有较强的肌肉力量和协调性，应该在课余时间多参加各类运动活动，增强自己的身体素质。";
					} else if (solidBall >= 6.4) {
						this.tips = "您的孩子的实心球投掷表现不错，说明您的孩子的肌肉力量和协调性都还可以，需要注意平时训练的规律性，保持身体素质的稳定提高。";
					} else if (solidBall >= 5.5) {
						this.tips =
							"您的孩子的实心球投掷表现一般，需要加强训练，提高肌肉力量和协调性。建议多进行相关训练，如增加肌肉力量、提高手臂协调性等，以提高投掷实心球成绩。同时，也要注意合理安排训练计划，避免过度训练导致身体疲劳或损伤。"
					} else {
						this.tips =
							"您的孩子的实心球投掷表现比较差，说明您的孩子的肌肉力量和协调性有待提高。建议多进行相关训练，如增加肌肉力量、提高手臂协调性等，以提高投掷实心球成绩。同时，也要注意合理安排训练计划，避免过度训练导致身体疲劳或损伤。"
					}
				}

				this.solidBallGuageOption = {
					tooltip: {
						formatter: '{a} \n{b} : {c}%'
					},
					series: [{
						name: 'Throwing Solid Ball',
						type: 'gauge',
						min: 0,
						max: 20,
						progress: {
							show: true
						},
						detail: {
							valueAnimation: true,
							formatter: '{value}m',
							fontSize: 25
						},
						data: [{
							value: solidBall,
							name: '投掷距离',
						}]
					}]
				};
			},
			// 更新折线图的配置选项
			updateSolidBallLineChartOption(startDate, endDate) {
				let date = [];
				let maleAvgSolidBall = [];
				let femaleAvgSolidBall = [];
				let solidBall = [];

				this.solidBallData
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
						maleAvgSolidBall.push(item.maleAvgSolidBall);
						femaleAvgSolidBall.push(item.femaleAvgSolidBall);
						solidBall.push(item.solidBall);
					});

				this.solidBallLineChartOption = {
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
								result += series.marker + series.seriesName + ' : ' + series.value + 'm';
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
						data: ['班级男生平均投掷距离', '班级女生平均投掷距离', '您孩子的投掷距离']
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
							formatter: '{value}',
						},
					},
					series: [{
							name: '班级男生平均投掷距离',
							type: 'line',
							data: maleAvgSolidBall,
						}, {
							name: '班级女生平均投掷距离',
							type: 'line',
							data: femaleAvgSolidBall,
						},
						{
							name: '您孩子的投掷距离',
							type: 'line',
							data: solidBall
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
		align-items: baseline;
	}

	.value>.number {
		font-size: 2rem;
		font-weight: bold;
	}

	.value>.unit {}

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
