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
				<view class="data-area" v-show="visionData.length">
					<view class="value">
						<text class="number">{{vision}}</text>
						<text class="unit" v-show="!isSingleSelectedEmtpy"></text>
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
						<l-echart ref="visionGuage" @finished="initWeightGuage"></l-echart>
					</view>

					<view class="tips" v-show="visionData.length">{{tips}}</view>
				</view>
			</view>

			<!-- 如果 subsection.current 为 0，渲染日页面，该页面包含了一个数据区域和一个图表区域 -->
			<view class="stats" v-else>
				<view class="charts-area">
					<view style="width: 100%;height:300px;">
						<l-echart ref="visionLineChart" @finished="initWeightLineChart"></l-echart>
					</view>
				</view>

				<view class="range-date" v-show="visionData.length">
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
				vision: '',
				currentSelectedDate: '',
				startDate: '',
				endDate: '',
				isSingleSelectedEmtpy: false,
				visionGuageOption: {},
				visionLineChartOption: {},
				tips: '',
				calendarSelected: []
			}
		},
		computed: {
			// 获取学生信息，需要studentInfo的height
			...mapState('studentModule', ['studentInfo', 'visionData']),
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
			...mapActions('studentModule', ['updateVisionData']),
			openSingleCalendar() {
				this.$refs.singleCalendar.open();
			},
			openRangeCalendar() {
				this.$refs.rangeCalendar.open();
			},
			singleCalendarConfirm(e) {
				this.currentSelectedDate = e.fulldate;
				const targetData = this.visionData.find(d => d.date === this.currentSelectedDate);
				if (!targetData) {
					this.vision = '无';
					this.isSingleSelectedEmtpy = true;
					return;
				} else {
					this.isSingleSelectedEmtpy = false;
				}
				let leftVision = targetData ? targetData.leftVision : 0;
				let rightVision = targetData ? targetData.rightVision : 0;
				this.vision = `${leftVision}/${rightVision}`;
				this.updateWeightGuageOption(leftVision, rightVision)
				this.$refs.visionGuage.setOption(this.visionGuageOption)
			},
			rangeCalendarConfirm(e) {
				if (!e.range.data.length) {
					return;
				}

				this.startDate = e.range.data[0];
				this.endDate = e.range.data[e.range.data.length - 1];
				this.updateVisionLineChartOption(this.startDate, this.endDate);
				this.$refs.visionLineChart.setOption(this.visionLineChartOption);
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
								visionData
							}
						} = await api.student.getVisionById(this.studentInfo.id);
						if (!status) {
							this.updateVisionData(visionData);
							if (this.visionData.length) {
								this.initPageData();
								if (this.$refs.visionGuage) {
									this.$refs.visionGuage.clear();
									this.$refs.visionGuage.setOption(this.visionGuageOption);
								}
								if (this.$refs.visionLineChart) {
									this.$refs.visionLineChart.clear();
									this.$refs.visionLineChart.setOption(this.visionLineChartOption);
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
				if (!this.visionData.length) {
					console.log('The vision data is empty');
					this.visionGuageOption = this.visionLineChartOption = {
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

				this.visionData.forEach((item) => {
					this.calendarSelected.push({
						date: item.date,
						info: '有数据'
					})
				})

				this.currentSelectedDate = this.visionData[this.visionData.length - 1].date;
				let leftVision = this.visionData[this.visionData.length - 1].leftVision;
				let rightVision = this.visionData[this.visionData.length - 1].rightVision;
				this.vision = `${leftVision}/${rightVision}`;
				this.updateWeightGuageOption(leftVision, rightVision);

				this.startDate = this.visionData[0].date;
				this.endDate = this.visionData[this.visionData.length - 1].date;
				this.updateVisionLineChartOption(this.startDate, this.endDate);
			},
			// 初始化仪表盘
			initWeightGuage() {
				// init 是 echarts 初始化调用函数,第一个参数是传入echarts,第二个参数是回调函数，回调函数的参数是 chart 实例
				this.$refs.visionGuage.init(echarts, chart => {
					console.log('initializing vision guage');
					chart.setOption(this.visionGuageOption);
				});
			},
			// 初始化折线图
			initWeightLineChart() {
				// init 是 echarts 初始化调用函数,第一个参数是传入echarts,第二个参数是回调函数，回调函数的参数是 chart 实例
				this.$refs.visionLineChart.init(echarts, chart => {
					console.log('initializing vision line chart');
					chart.setOption(this.visionLineChartOption);
				});
			},
			// 更新仪表盘的配置选项
			updateWeightGuageOption(leftVision, rightVision) {
				const gaugeData = [{
						value: leftVision,
						name: '左眼视力值\n',
						title: {
							offsetCenter: ['-42%', '105%']
						},
						detail: {
							offsetCenter: ['-42%', '120%']
						}
					},
					{
						value: rightVision,
						name: '右眼视力值\n',
						title: {
							offsetCenter: ['42%', '105%']
						},
						detail: {
							offsetCenter: ['42%', '120%']
						}
					}
				];
				this.visionGuageOption = {
					series: [{
						type: 'gauge',
						min: 4.0,
						max: 5.3,
						anchor: {
							show: true,
							showAbove: true,
							size: 18,
							itemStyle: {
								color: '#FAC858'
							}
						},
						pointer: {
							icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
							width: 8,
							length: '80%',
							offsetCenter: [0, '8%']
						},
						progress: {
							show: true,
							overlap: true,
							roundCap: true
						},
						axisLine: {
							roundCap: true
						},
						data: gaugeData,
						title: {
							fontSize: 14
						},
						detail: {
							width: 40,
							height: 14,
							fontSize: 14,
							color: '#fff',
							backgroundColor: 'inherit',
							borderRadius: 3,
							formatter: '{value}'
						}
					}]
				};
			},
			// 更新折线图的配置选项
			updateVisionLineChartOption(startDate, endDate) {
				let date = [];
				let avgLeftVision = [];
				let avgRightVision = [];
				let leftVision = [];
				let rightVision = []

				this.visionData
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
						avgLeftVision.push(item.avgLeftVision);
						avgRightVision.push(item.avgRightVision);
						leftVision.push(item.leftVision);
						rightVision.push(item.rightVision);
					});

				this.visionLineChartOption = {
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
								result += series.marker + series.seriesName + ' : ' + series.value + '';
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
						data: ['班级平均左眼视力', '班级平均右眼视力', '您孩子的左眼视力', '您孩子的右眼视力']
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
						min: 4.0,
						max: 5.3,
						interval: 0.1,
						axisLabel: {
							formatter: '{value}',
						},
					},
					series: [{
							name: '班级平均左眼视力',
							type: 'line',
							smooth: true,
							data: avgLeftVision,
						}, {
							name: '班级平均右眼视力',
							type: 'line',
							smooth: true,
							data: avgRightVision,
						},
						{
							name: '您孩子的左眼视力',
							type: 'bar',
							smooth: true,
							data: leftVision
						},
						{
							name: '您孩子的右眼视力',
							type: 'bar',
							smooth: true,
							data: rightVision
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
