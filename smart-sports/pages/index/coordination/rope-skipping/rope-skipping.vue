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
				<view class="data-area" v-show="ropeSkippingData.length">
					<view class="value">
						<text class="number">{{ropeSkipping}}</text>
						<text class="unit" v-show="!isSingleSelectedEmtpy">个</text>
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
						<l-echart ref="ropeSkippingGuage" @finished="initRopeSkippingGuage"></l-echart>
					</view>

					<view class="legend" v-show="ropeSkippingData.length">
						<view class="item">
							<view class="box box1"></view>
							<text>不合格</text>
						</view>
						<view class="item">
							<view class="box box2"></view>
							<text>合格</text>
						</view>
						<view class="item">
							<view class="box box3"></view>
							<text>良好</text>
						</view>
						<view class="item">
							<view class="box box4"></view>
							<text>优秀</text>
						</view>
					</view>

					<view class="tips" v-show="ropeSkippingData.length">{{tips}}</view>
				</view>
			</view>

			<!-- 如果 subsection.current 为 0，渲染日页面，该页面包含了一个数据区域和一个图表区域 -->
			<view class="stats" v-else>
				<view class="charts-area">
					<view style="width: 100%;height:300px;">
						<l-echart ref="ropeSkippingLineChart" @finished="initRopeSkippingLineChart"></l-echart>
					</view>
				</view>

				<view class="range-date" v-show="ropeSkippingData.length">
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
				ropeSkipping: '',
				currentSelectedDate: '',
				startDate: '',
				endDate: '',
				isSingleSelectedEmtpy: false,
				ropeSkippingGuageOption: {},
				ropeSkippingLineChartOption: {},
				tips: '',
				calendarSelected: []
			}
		},
		computed: {
			// 获取学生信息，需要studentInfo的height
			...mapState('studentModule', ['studentInfo', 'ropeSkippingData']),
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
			...mapActions('studentModule', ['updateRopeSkippingData']),
			openSingleCalendar() {
				this.$refs.singleCalendar.open();
			},
			openRangeCalendar() {
				this.$refs.rangeCalendar.open();
			},
			singleCalendarConfirm(e) {
				this.currentSelectedDate = e.fulldate;
				const targetData = this.ropeSkippingData.find(d => d.date === this.currentSelectedDate);
				if (!targetData) {
					this.ropeSkipping = '无';
					this.isSingleSelectedEmtpy = true;
					return;
				} else {
					this.isSingleSelectedEmtpy = false;
				}
				this.ropeSkipping = targetData ? targetData.ropeSkipping : 0;
				this.updateRopeSkippingGuageOption(this.ropeSkipping)
				this.$refs.ropeSkippingGuage.setOption(this.ropeSkippingGuageOption)
			},
			rangeCalendarConfirm(e) {
				if (!e.range.data.length) {
					return;
				}

				this.startDate = e.range.data[0];
				this.endDate = e.range.data[e.range.data.length - 1];
				this.updateRopeSkippingLineChartOption(this.startDate, this.endDate);
				this.$refs.ropeSkippingLineChart.setOption(this.ropeSkippingLineChartOption);
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
								ropeSkippingData
							}
						} = await api.student.getRopeSkippingById(this.studentInfo.id);
						if (!status) {
							this.updateRopeSkippingData(ropeSkippingData);
							if (this.ropeSkippingData.length) {
								try {
									this.initPageData();
								} catch (e) {
									//TODO handle the exception
									console.log('init page data err', e);
								}
								if (this.$refs.ropeSkippingGuage) {
									this.$refs.ropeSkippingGuage.clear();
									this.$refs.ropeSkippingGuage.setOption(this.ropeSkippingGuageOption);
								}
								if (this.$refs.ropeSkippingLineChart) {
									this.$refs.ropeSkippingLineChart.clear();
									this.$refs.ropeSkippingLineChart.setOption(this
										.ropeSkippingLineChartOption);
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
				if (!this.ropeSkippingData.length) {
					console.log('The rope skipping data is empty');
					this.ropeSkippingGuageOption = this.ropeSkippingLineChartOption = {
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

				this.ropeSkippingData.forEach((item) => {
					this.calendarSelected.push({
						date: item.date,
						info: '有数据'
					})
				})

				this.currentSelectedDate = this.ropeSkippingData[this.ropeSkippingData.length - 1].date;
				this.ropeSkipping = this.ropeSkippingData[this.ropeSkippingData.length - 1].ropeSkipping;
				try {
					this.updateRopeSkippingGuageOption(this.ropeSkipping)
				} catch (e) {
					//TODO handle the exception
					console.log('update rope skipping guage option err', e);
				}

				this.startDate = this.ropeSkippingData[0].date;
				this.endDate = this.ropeSkippingData[this.ropeSkippingData.length - 1].date;
				try {
					this.updateRopeSkippingLineChartOption(this.startDate, this.endDate);
				} catch (e) {
					//TODO handle the exception
					console.log('update rope skipping line chart option err', e);
				}
			},
			// 初始化仪表盘
			initRopeSkippingGuage() {
				// init 是 echarts 初始化调用函数,第一个参数是传入echarts,第二个参数是回调函数，回调函数的参数是 chart 实例
				this.$refs.ropeSkippingGuage.init(echarts, chart => {
					console.log('initializing rope skipping guage');
					chart.setOption(this.ropeSkippingGuageOption);
				});
			},
			// 初始化折线图
			initRopeSkippingLineChart() {
				// init 是 echarts 初始化调用函数,第一个参数是传入echarts,第二个参数是回调函数，回调函数的参数是 chart 实例
				this.$refs.ropeSkippingLineChart.init(echarts, chart => {
					console.log('initializing rope skipping line chart');
					chart.setOption(this.ropeSkippingLineChartOption);
				});
			},
			// 更新仪表盘的配置选项
			updateRopeSkippingGuageOption(ropeSkipping) {

				if (this.studentInfo.gender === "男") {
					if (ropeSkipping >= 180) {
						this.tips = "您的孩子的跳绳成绩非常出色，说明您的孩子有很好的协调性和耐力，应该在课余时间多参加各类运动活动，增强自己的身体素质。";
					} else if (ropeSkipping >= 160) {
						this.tips = "您的孩子的跳绳成绩不错，说明您的孩子有良好的协调性和耐力，可以继续努力训练，争取取得更好的成绩。建议在平时增加跳绳时间，并结合其他有氧运动进行锻炼，以提高身体素质。";
					} else if (ropeSkipping >= 140) {
						this.tips = "您的孩子的跳绳成绩一般，需要加强训练，提高协调性和耐力。建议多进行相关训练，如增加跳绳时间、加强身体素质等，以提高跳绳成绩。同时，也要注意合理安排训练计划，避免过度训练导致身体受损。";
					} else {
						this.tips = "您的孩子的跳绳成绩较差，需要在平时加强训练，提高协调性和耐力。建议多进行相关训练，如增加跳绳时间、加强身体素质等，以提高跳绳成绩。同时，也要注意合理安排训练计划，避免过度训练导致身体受损。";
					}
				} else {
					if (ropeSkipping >= 160) {
						this.tips = "您的孩子的跳绳成绩非常出色，说明您的孩子有很好的协调性和耐力，应该在课余时间多参加各类运动活动，增强自己的身体素质。";
					} else if (ropeSkipping >= 140) {
						this.tips = "您的孩子的跳绳成绩不错，说明您的孩子有良好的协调性和耐力，可以继续努力训练，争取取得更好的成绩。建议在平时增加跳绳时间，并结合其他有氧运动进行锻炼，以提高身体素质。";
					} else if (ropeSkipping >= 120) {
						this.tips = "您的孩子的跳绳成绩一般，需要加强训练，提高跳绳技巧和身体素质。建议多进行相关训练，如提高手腕力量、增强腿部协调性等，以提高跳绳成绩。同时，也要注意合理安排训练计划，避免过度训练导致身体受损。";
					} else {
						this.tips = "您的孩子的跳绳成绩较差，需要在平时加强锻炼，提高跳绳技巧和身体素质。建议多进行相关训练，如提高手腕力量、增强腿部协调性等，以提高跳绳成绩。同时，也要注意合理安排训练计划，避免过度训练导致身体受损。";
					}
				}
				
				this.ropeSkippingGuageOption = {
					series: [{
						type: 'gauge',
						min: 0,
						max: 200,
						center: ['50%', '65%'],
						radius: '80%',
						axisLine: {
							lineStyle: {
								width: 20,
								color: [
									[this.studentInfo.gender === "男" ? 0.7 : 0.6, '#FF6E76'],
									[this.studentInfo.gender === "男" ? 0.8 : 0.7, '#FDDD60'],
									[this.studentInfo.gender === "男" ? 0.9 : 0.8, '#58D9F9'],
									[1, '#7CFFB2']
								]
							}
						},
						pointer: {
							itemStyle: {
								color: 'grey'
							}
						},
						axisTick: {
							distance: -20,
							length: 7,
							lineStyle: {
								color: '#fff',
								width: 2
							}
						},
						splitLine: {
							distance: -30,
							length: 30,
							lineStyle: {
								color: '#fff',
								width: 4
							}
						},
						axisLabel: {
							color: 'inherit',
							distance: 28,
							fontSize: 19
						},
						detail: {
							valueAnimation: true,
							formatter: '{value}个',
							color: 'inherit',
							fontSize: 25
						},
						data: [{
							value: ropeSkipping
						}]
					}]
				};
			},
			// 更新折线图的配置选项
			updateRopeSkippingLineChartOption(startDate, endDate) {
				let date = [];
				let maleAvgRopeSkipping = [];
				let femaleAvgRopeSkipping = [];
				let ropeSkipping = [];

				this.ropeSkippingData
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
						maleAvgRopeSkipping.push(item.maleAvgRopeSkipping);
						femaleAvgRopeSkipping.push(item.femaleAvgRopeSkipping);
						ropeSkipping.push(item.ropeSkipping);
					});

				this.ropeSkippingLineChartOption = {
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
								result += series.marker + series.seriesName + ' : ' + series.value + '个';
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
						data: ['班级男生平均跳绳个数', '班级女生平均跳绳个数', '您孩子的跳绳个数']
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
						max: 200,
						axisLabel: {
							formatter: '{value}',
						},
					},
					series: [{
							name: '班级男生平均跳绳个数',
							type: 'line',
							data: maleAvgRopeSkipping,
						}, {
							name: '班级女生平均跳绳个数',
							type: 'line',
							data: femaleAvgRopeSkipping,
						},
						{
							name: '您孩子的跳绳个数',
							type: 'line',
							data: ropeSkipping
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

	.charts-area .legend {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
	}

	.legend .item {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 25%;
		padding: 0 30rpx;
		text-align: center;
	}

	.item .box {
		height: 10px;
		width: 15px;
		border-radius: 10rpx;
	}

	.box1 {
		background-color: #FF6E76;
	}

	.box2 {
		background-color: #FDDD60;
	}

	.box3 {
		background-color: #58D9F9;
	}

	.box4 {
		background-color: #7CFFB2;
	}

	.item text {
		padding: 0 10rpx;
		white-space: nowrap;
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
