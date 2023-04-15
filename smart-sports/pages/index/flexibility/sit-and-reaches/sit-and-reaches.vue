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
				<view class="data-area" v-show="sitAndReachesData.length">
					<view class="value">
						<text class="number">{{sitAndReaches}}</text>
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
						<l-echart ref="sitAndReachesGuage" @finished="initSitAndReachesGuage"></l-echart>
					</view>

					<view class="legend" v-show="sitAndReachesData.length">
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

					<view class="tips" v-show="sitAndReachesData.length">{{tips}}</view>
				</view>
			</view>

			<!-- 如果 subsection.current 为 0，渲染日页面，该页面包含了一个数据区域和一个图表区域 -->
			<view class="stats" v-else>
				<view class="charts-area">
					<view style="width: 100%;height:300px;">
						<l-echart ref="sitAndReachesLineChart" @finished="initSitAndReachesLineChart"></l-echart>
					</view>
				</view>

				<view class="range-date" v-show="sitAndReachesData.length">
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
				sitAndReaches: '',
				currentSelectedDate: '',
				startDate: '',
				endDate: '',
				isSingleSelectedEmtpy: false,
				sitAndReachesGuageOption: {},
				sitAndReachesLineChartOption: {},
				tips: '',
				calendarSelected: []
			}
		},
		computed: {
			// 获取学生信息，需要studentInfo的height
			...mapState('studentModule', ['studentInfo', 'sitAndReachesData']),
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
			...mapActions('studentModule', ['updateSitAndReachesData']),
			openSingleCalendar() {
				this.$refs.singleCalendar.open();
			},
			openRangeCalendar() {
				this.$refs.rangeCalendar.open();
			},
			singleCalendarConfirm(e) {
				this.currentSelectedDate = e.fulldate;
				const targetData = this.sitAndReachesData.find(d => d.date === this.currentSelectedDate);
				if (!targetData) {
					this.sitAndReaches = '无';
					this.isSingleSelectedEmtpy = true;
					return;
				} else {
					this.isSingleSelectedEmtpy = false;
				}
				this.sitAndReaches = targetData ? targetData.sitAndReaches : 0;
				this.updateSitAndReachesGuageOption(this.sitAndReaches)
				this.$refs.sitAndReachesGuage.setOption(this.sitAndReachesGuageOption)
			},
			rangeCalendarConfirm(e) {
				if (!e.range.data.length) {
					return;
				}

				this.startDate = e.range.data[0];
				this.endDate = e.range.data[e.range.data.length - 1];
				this.updateSitAndReachesLineChartOption(this.startDate, this.endDate);
				this.$refs.sitAndReachesLineChart.setOption(this.sitAndReachesLineChartOption);
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
								sitAndReachesData
							}
						} = await api.student.getSitAndReachesById(this.studentInfo.id);
						if (!status) {
							this.updateSitAndReachesData(sitAndReachesData);
							if (this.sitAndReachesData.length) {
								this.initPageData();
								if (this.$refs.sitAndReachesGuage) {
									this.$refs.sitAndReachesGuage.clear();
									this.$refs.sitAndReachesGuage.setOption(this.sitAndReachesGuageOption);
								}
								if (this.$refs.sitAndReachesLineChart) {
									this.$refs.sitAndReachesLineChart.clear();
									this.$refs.sitAndReachesLineChart.setOption(this
										.sitAndReachesLineChartOption);
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
				if (!this.sitAndReachesData.length) {
					console.log('The sit and reaches data is empty');
					this.sitAndReachesGuageOption = this.sitAndReachesLineChartOption = {
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

				this.sitAndReachesData.forEach((item) => {
					this.calendarSelected.push({
						date: item.date,
						info: '有数据'
					})
				})

				this.currentSelectedDate = this.sitAndReachesData[this.sitAndReachesData.length - 1].date;
				this.sitAndReaches = this.sitAndReachesData[this.sitAndReachesData.length - 1].sitAndReaches;
				this.updateSitAndReachesGuageOption(this.sitAndReaches)

				this.startDate = this.sitAndReachesData[0].date;
				this.endDate = this.sitAndReachesData[this.sitAndReachesData.length - 1].date;
				this.updateSitAndReachesLineChartOption(this.startDate, this.endDate);
			},
			// 初始化仪表盘
			initSitAndReachesGuage() {
				// init 是 echarts 初始化调用函数,第一个参数是传入echarts,第二个参数是回调函数，回调函数的参数是 chart 实例
				this.$refs.sitAndReachesGuage.init(echarts, chart => {
					console.log('initializing sit and reaches guage');
					chart.setOption(this.sitAndReachesGuageOption);
				});
			},
			// 初始化折线图
			initSitAndReachesLineChart() {
				// init 是 echarts 初始化调用函数,第一个参数是传入echarts,第二个参数是回调函数，回调函数的参数是 chart 实例
				this.$refs.sitAndReachesLineChart.init(echarts, chart => {
					console.log('initializing sit and reaches line chart');
					chart.setOption(this.sitAndReachesLineChartOption);
				});
			},
			// 更新仪表盘的配置选项
			updateSitAndReachesGuageOption(sitAndReaches) {

				// for boys
				if (this.studentInfo.gender === "男") {
					if (sitAndReaches >= 25) {
						this.tips = "您的孩子的坐位体前屈表现非常出色，说明您的孩子拥有较好的柔韧性和身体控制能力，应该在课余时间多参加各类有益身体健康的运动项目，增强自己的身体素质。";
					} else if (sitAndReaches >= 20) {
						this.tips = "您的孩子的坐位体前屈成绩不错，说明您的孩子的柔韧性和身体控制能力都还可以，需要注意平时训练的规律性，保持身体素质的稳定提高。";
					} else if (sitAndReaches >= 15) {
						this.tips = "您的孩子的坐位体前屈成绩一般，需要加强训练，提高柔韧性和身体控制能力。建议多进行相关训练，如增加腰腹部的柔韧性和力量，以提高坐位体前屈成绩。";
					} else {
						this.tips =
							"您的孩子的坐位体前屈成绩较差，需要在平时加强锻炼，多参加课外体育锻炼项目，提高身体素质。建议进行适当的伸展运动，以提高柔韧性和身体控制能力。同时，也要注意保护腰椎，避免过度受力导致运动损伤。";
					}
				}
				// for girls
				else {
					if (sitAndReaches >= 30) {
						this.tips = "您的孩子的坐位体前屈表现非常出色，说明您的孩子拥有较好的柔韧性和身体控制能力，应该在课余时间多参加各类有益身体健康的运动项目，增强自己的身体素质。";
					} else if (sitAndReaches >= 25) {
						this.tips = "您的孩子的坐位体前屈成绩不错，说明您的孩子的柔韧性和身体控制能力都还可以，需要注意平时训练的规律性，保持身体素质的稳定提高。";
					} else if (sitAndReaches >= 20) {
						this.tips = "您的孩子的坐位体前屈成绩一般，需要加强训练，提高柔韧性和身体控制能力。建议多进行相关训练，如拉伸训练、瑜伽等，以提高坐位体前屈成绩。同时，也要注意合理安排训练计划，避免过度训练导致身体受损。";
					} else {
						this.tips = "您的孩子的坐位体前屈成绩较差，需要在平时加强训练，提高柔韧性和身体控制能力。建议多进行相关训练，如拉伸训练、瑜伽等，以提高坐位体前屈成绩。同时，也要注意合理安排训练计划，避免过度训练导致身体受损。";
					}
				}


				this.sitAndReachesGuageOption = {
					series: [{
						type: 'gauge',
						min: -10,
						max: 40,
						center: ['50%', '65%'],
						radius: '80%',
						axisLine: {
							lineStyle: {
								width: 20,
								color: [
									[this.studentInfo.gender === "男" ? 0.4 : 0.3, '#FF6E76'],
									[this.studentInfo.gender === "男" ? 0.5 : 0.6, '#FDDD60'],
									[this.studentInfo.gender === "男" ? 0.7 : 0.8, '#58D9F9'],
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
							fontSize: 20
						},
						detail: {
							valueAnimation: true,
							formatter: '{value}cm',
							color: 'inherit',
							fontSize: 25
						},
						data: [{
							value: sitAndReaches
						}]
					}]
				};
			},
			// 更新折线图的配置选项
			updateSitAndReachesLineChartOption(startDate, endDate) {
				let date = [];
				let maleAvgSitAndReaches = [];
				let femaleAvgSitAndReaches = [];
				let sitAndReaches = [];

				this.sitAndReachesData
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
						maleAvgSitAndReaches.push(item.maleAvgSitAndReaches);
						femaleAvgSitAndReaches.push(item.femaleAvgSitAndReaches);
						sitAndReaches.push(item.sitAndReaches);
					});

				this.sitAndReachesLineChartOption = {
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
								result += series.marker + series.seriesName + ' : ' + series.value + 'cm';
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
						data: ['班级男生平均座位提前屈距离', '班级女生平均座位提前屈距离', '您孩子的座位提前屈距离']
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
						min: -10,
						max: 40,
						axisLabel: {
							formatter: '{value}',
						},
					},
					series: [{
							name: '班级男生平均座位提前屈距离',
							type: 'line',
							data: maleAvgSitAndReaches,
						}, {
							name: '班级女生平均座位提前屈距离',
							type: 'line',
							data: femaleAvgSitAndReaches,
						},
						{
							name: '您孩子的座位提前屈距离',
							type: 'line',
							data: sitAndReaches
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
