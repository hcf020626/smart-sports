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
				<view class="data-area" v-show="lungCapacityData.length">
					<view class="value">
						<text class="number">{{lungCapacity}}</text>
						<text class="unit" v-show="!isSingleSelectedEmtpy">ml</text>
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
						<l-echart ref="lungCapacityGuage" @finished="initLungCapacityGuage"></l-echart>
					</view>

					<view class="tips" v-show="lungCapacityData.length">{{tips}}</view>
				</view>
			</view>

			<!-- 如果 subsection.current 为 0，渲染日页面，该页面包含了一个数据区域和一个图表区域 -->
			<view class="stats" v-else>
				<view class="charts-area">
					<view style="width: 100%;height:300px;">
						<l-echart ref="lungCapacityLineChart" @finished="initLungCapacityLineChart"></l-echart>
					</view>
				</view>

				<view class="range-date" v-show="lungCapacityData.length">
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
				lungCapacity: '',
				currentSelectedDate: '',
				startDate: '',
				endDate: '',
				isSingleSelectedEmtpy: false,
				lungCapacityGuageOption: {},
				lungCapacityLineChartOption: {},
				tips: '',
				calendarSelected: []
			}
		},
		computed: {
			// 获取学生信息，需要studentInfo的height
			...mapState('studentModule', ['studentInfo', 'lungCapacityData']),
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
			...mapActions('studentModule', ['updateLungCapacityData']),
			openSingleCalendar() {
				this.$refs.singleCalendar.open();
			},
			openRangeCalendar() {
				this.$refs.rangeCalendar.open();
			},
			singleCalendarConfirm(e) {
				this.currentSelectedDate = e.fulldate;
				const targetData = this.lungCapacityData.find(d => d.date === this.currentSelectedDate);
				if (!targetData) {
					this.lungCapacity = '无';
					this.isSingleSelectedEmtpy = true;
					return;
				} else {
					this.isSingleSelectedEmtpy = false;
				}
				this.lungCapacity = targetData ? targetData.lungCapacity : 0;
				this.updateWeightGuageOption(this.lungCapacity)
				this.$refs.lungCapacityGuage.setOption(this.lungCapacityGuageOption)
			},
			rangeCalendarConfirm(e) {
				if (!e.range.data.length) {
					return;
				}

				this.startDate = e.range.data[0];
				this.endDate = e.range.data[e.range.data.length - 1];
				this.updateLungCapacityLineChartOption(this.startDate, this.endDate);
				this.$refs.lungCapacityLineChart.setOption(this.lungCapacityLineChartOption);
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
								lungCapacityData
							}
						} = await api.student.getLungCapacityById(this.studentInfo.id);
						if (!status) {
							this.updateLungCapacityData(lungCapacityData);
							if (this.lungCapacityData.length) {
								this.initPageData();
								if (this.$refs.lungCapacityGuage) {
									this.$refs.lungCapacityGuage.clear();
									this.$refs.lungCapacityGuage.setOption(this.lungCapacityGuageOption);
								}
								if (this.$refs.lungCapacityLineChart) {
									this.$refs.lungCapacityLineChart.clear();
									this.$refs.lungCapacityLineChart.setOption(this
										.lungCapacityLineChartOption);
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
				if (!this.lungCapacityData.length) {
					console.log('The lung capacity data is empty');
					this.lungCapacityGuageOption = this.lungCapacityLineChartOption = {
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

				this.lungCapacityData.forEach((item) => {
					this.calendarSelected.push({
						date: item.date,
						info: '有数据'
					})
				})

				this.currentSelectedDate = this.lungCapacityData[this.lungCapacityData.length - 1].date;
				this.lungCapacity = this.lungCapacityData[this.lungCapacityData.length - 1].lungCapacity;
				this.updateWeightGuageOption(this.lungCapacity)

				this.startDate = this.lungCapacityData[0].date;
				this.endDate = this.lungCapacityData[this.lungCapacityData.length - 1].date;
				this.updateLungCapacityLineChartOption(this.startDate, this.endDate);
			},
			// 初始化仪表盘
			initLungCapacityGuage() {
				// init 是 echarts 初始化调用函数,第一个参数是传入echarts,第二个参数是回调函数，回调函数的参数是 chart 实例
				this.$refs.lungCapacityGuage.init(echarts, chart => {
					console.log('initializing lungCapacity guage');
					chart.setOption(this.lungCapacityGuageOption);
				});
			},
			// 初始化折线图
			initLungCapacityLineChart() {
				// init 是 echarts 初始化调用函数,第一个参数是传入echarts,第二个参数是回调函数，回调函数的参数是 chart 实例
				this.$refs.lungCapacityLineChart.init(echarts, chart => {
					console.log('initializing lungCapacity line chart');
					chart.setOption(this.lungCapacityLineChartOption);
				});
			},
			// 更新仪表盘的配置选项
			updateWeightGuageOption(lungCapacity) {
				if (this.studentInfo.gender === "男") {
				    if (lungCapacity < 2000) {
				      this.tips = "您的孩子的肺活量偏低，请留意是否有呼吸系统疾病或者其他健康问题，建议咨询医生进行进一步检查。同时可以多进行一些有氧运动，提高肺活量和身体素质。";
				    } else if (lungCapacity >= 2000 && lungCapacity <= 4800) {
				      this.tips = "您的孩子的肺活量在正常范围内，说明身体健康状况良好。建议继续保持良好的生活习惯和适量运动，保持健康状态。";
				    } else if (lungCapacity > 4800) {
				      this.tips = "您的孩子的肺活量比正常范围稍高，这可能是由于他们平时进行了一些有氧运动或者其他的特殊原因造成的。肺活量高不一定代表身体更加健康，建议适量进行运动，不要过度劳累。";
				    }
				  } else if (this.studentInfo.gender === "女") {
				    if (lungCapacity < 1500) {
				      this.tips = "您的孩子的肺活量偏低，请留意是否有呼吸系统疾病或者其他健康问题，建议咨询医生进行进一步检查。同时可以多进行一些有氧运动，提高肺活量和身体素质。";
				    } else if (lungCapacity >= 1500 && lungCapacity <= 3600) {
				      this.tips = "您的孩子的肺活量在正常范围内，说明身体健康状况良好。建议继续保持良好的生活习惯和适量运动，保持健康状态。";
				    } else if (lungCapacity > 3600) {
				      this.tips = "您的孩子的肺活量比正常范围稍高，这可能是由于她们平时进行了一些有氧运动或者其他的特殊原因造成的。肺活量高不一定代表身体更加健康，建议适量进行运动，不要过度劳累。";
				    }
				  }
				this.lungCapacityGuageOption = {
					series: [{
							type: 'gauge',
							center: ['50%', '70%'],
							startAngle: 200,
							endAngle: -20,
							min: 0,
							max: 6000,
							// interval:
							splitNumber: 12,
							itemStyle: {
								color: '#FFAB91'
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
									width: 30
								}
							},
							axisTick: {
								distance: -45,
								splitNumber: 5,
								lineStyle: {
									width: 2,
									color: '#999'
								}
							},
							splitLine: {
								distance: -52,
								length: 14,
								lineStyle: {
									width: 3,
									color: '#999'
								}
							},
							axisLabel: {
								distance: -20,
								color: '#999',
								fontSize: 13
							},
							anchor: {
								show: false
							},
							title: {
								show: false
							},
							detail: {
								valueAnimation: true,
								width: '60%',
								lineHeight: 20,
								borderRadius: 8,
								offsetCenter: [0, '0%'],
								fontSize: 30,
								fontWeight: 'bolder',
								formatter: '{value} ml',
								color: 'inherit'
							},
							data: [{
								value: lungCapacity
							}]
						},
						{
							type: 'gauge',
							center: ['50%', '70%'],
							startAngle: 200,
							endAngle: -20,
							min: 0,
							max: 6000,
							itemStyle: {
								color: '#FD7347'
							},
							progress: {
								show: true,
								width: 8
							},
							pointer: {
								show: false
							},
							axisLine: {
								show: false
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
							detail: {
								show: false
							},
							data: [{
								value: lungCapacity
							}]
						}
					]
				};
			},
			// 更新折线图的配置选项
			updateLungCapacityLineChartOption(startDate, endDate) {
				let date = [];
				let maleAvgLungCapacity = [];
				let femaleAvgLungCapacity = [];
				let lungCapacity = [];

				this.lungCapacityData
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
						maleAvgLungCapacity.push(item.maleAvgLungCapacity);
						femaleAvgLungCapacity.push(item.femaleAvgLungCapacity)
						lungCapacity.push(item.lungCapacity);
					});

				this.lungCapacityLineChartOption = {
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
								result += series.marker + series.seriesName + ' : ' + series.value + 'ml';
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
						data: ['班级男生平均肺活量', '班级女生平均肺活量', '您孩子的肺活量']
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
						max: 6000,
						axisLabel: {
							formatter: '{value} kg',
						},
					},
					series: [{
							name: '班级男生平均肺活量',
							type: 'line',
							data: maleAvgLungCapacity,
						}, {
							name: '班级女生平均肺活量',
							type: 'line',
							data: femaleAvgLungCapacity,
						},
						{
							name: '您孩子的肺活量',
							type: 'bar',
							data: lungCapacity
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
