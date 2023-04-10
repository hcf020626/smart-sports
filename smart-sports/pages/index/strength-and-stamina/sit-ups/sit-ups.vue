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
				<view class="data-area" v-show="sitUpsData.length && studentInfo.gender === '女'">
					<view class="value">
						<text class="number">{{sitUps}}</text>
						<text class="unit" v-show="!isSingleSelectedEmtpy">个/分</text>
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
						<l-echart ref="sitUpsGuage" @finished="initSitUpsGuage"></l-echart>
					</view>

					<view class="legend" v-show="sitUpsData.length && studentInfo.gender === '女'">
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

					<view class="tips" v-show="sitUpsData.length">{{tips}}</view>
				</view>
			</view>

			<!-- 如果 subsection.current 为 0，渲染日页面，该页面包含了一个数据区域和一个图表区域 -->
			<view class="stats" v-else>
				<view class="charts-area">
					<view style="width: 100%;height:300px;">
						<l-echart ref="sitUpsLineChart" @finished="initSitUpsLineChart"></l-echart>
					</view>
				</view>

				<view class="range-date" v-show="sitUpsData.length && studentInfo.gender === '女'">
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
				sitUps: '',
				currentSelectedDate: '',
				startDate: '',
				endDate: '',
				isSingleSelectedEmtpy: false,
				sitUpsGuageOption: {},
				sitUpsLineChartOption: {},
				tips: '',
				calendarSelected: []
			}
		},
		computed: {
			// 获取学生信息，需要studentInfo的height
			...mapState('studentModule', ['studentInfo', 'sitUpsData']),
		},
		// 页面加载时初始化页面数据，并开启下拉刷新。
		onLoad() {
			this.initPageData();
			if(this.studentInfo.gender === '女'){
				uni.startPullDownRefresh();
			}
		},
		// 页面刷新时获取页面数据
		onPullDownRefresh() {
			if(this.studentInfo.gender === '女'){
				this.getPageData();
			}else{
				uni.stopPullDownRefresh();
			}
		},
		methods: {
			...mapActions('studentModule', ['updateSitUpsData']),
			openSingleCalendar() {
				this.$refs.singleCalendar.open();
			},
			openRangeCalendar() {
				this.$refs.rangeCalendar.open();
			},
			singleCalendarConfirm(e) {
				this.currentSelectedDate = e.fulldate;
				const targetData = this.sitUpsData.find(d => d.date === this.currentSelectedDate);
				if (!targetData) {
					this.sitUps = '无';
					this.isSingleSelectedEmtpy = true;
					return;
				} else {
					this.isSingleSelectedEmtpy = false;
				}
				this.sitUps = targetData ? targetData.sitUps : 0;
				this.updateSitUpsOption(this.sitUps)
				this.$refs.sitUpsGuage.setOption(this.sitUpsGuageOption)
			},
			rangeCalendarConfirm(e) {
				if (!e.range.data.length) {
					return;
				}

				this.startDate = e.range.data[0];
				this.endDate = e.range.data[e.range.data.length - 1];
				this.updateSitUpsLineChartOption(this.startDate, this.endDate);
				this.$refs.sitUpsLineChart.setOption(this.sitUpsLineChartOption);
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
								sitUpsData
							}
						} = await api.student.getSitUpsById(this.studentInfo.id);
						if (!status) {
							this.updateSitUpsData(sitUpsData);
							if (this.sitUpsData.length) {
								this.initPageData();
								if (this.$refs.sitUpsGuage) {
									this.$refs.sitUpsGuage.clear();
									this.$refs.sitUpsGuage.setOption(this.sitUpsGuageOption);
								}
								if (this.$refs.sitUpsLineChart) {
									this.$refs.sitUpsLineChart.clear();
									this.$refs.sitUpsLineChart.setOption(this.sitUpsLineChartOption);
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
				if (!this.sitUpsData.length) {
					if(this.studentInfo.gender === '男'){
						uni.stopPullDownRefresh();
						return this.sitUpsGuageOption = this.sitUpsLineChartOption = {
							// 设置一个空的 series
							series: [],
							// 设置一个 empty 效果
							graphic: {
								type: 'text',
								left: 'center',
								top: 'middle',
								style: {
									fill: '#999',
									text: '男生不需要做仰卧起坐',
									font: 'bold 20px Microsoft YaHei'
								}
							}
						};
					}
					console.log('The sit ups data is empty');
					return this.sitUpsGuageOption = this.sitUpsLineChartOption = {
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
				}

				this.sitUpsData.forEach((item) => {
					this.calendarSelected.push({
						date: item.date,
						info: '有数据'
					})
				})

				this.currentSelectedDate = this.sitUpsData[this.sitUpsData.length - 1].date;
				this.sitUps = this.sitUpsData[this.sitUpsData.length - 1].sitUps;
				this.updateSitUpsOption(this.sitUps);

				this.startDate = this.sitUpsData[0].date;
				this.endDate = this.sitUpsData[this.sitUpsData.length - 1].date;
				this.updateSitUpsLineChartOption(this.startDate, this.endDate);
			},
			// 初始化仪表盘
			initSitUpsGuage() {
				// init 是 echarts 初始化调用函数,第一个参数是传入echarts,第二个参数是回调函数，回调函数的参数是 chart 实例
				this.$refs.sitUpsGuage.init(echarts, chart => {
					console.log('initializing sit ups guage');
					chart.setOption(this.sitUpsGuageOption);
				});
			},
			// 初始化折线图
			initSitUpsLineChart() {
				// init 是 echarts 初始化调用函数,第一个参数是传入echarts,第二个参数是回调函数，回调函数的参数是 chart 实例
				this.$refs.sitUpsLineChart.init(echarts, chart => {
					console.log('initializing sit ups line chart');
					chart.setOption(this.sitUpsLineChartOption);
				});
			},
			// 更新仪表盘的配置选项
			updateSitUpsOption(sitUps) {

				  if (sitUps >= 60) {
				    this.tips = "优秀，表现极佳。您的孩子的核心力量和肌耐力非常强，可以持续做出高强度的运动。这个成绩不仅能够支持平时的体育课，也能在训练和比赛中获得优势。建议继续保持，并在训练中逐步提高强度和挑战自己的极限。";
				  } else if (sitUps >= 40) {
				    this.tips = "良好，表现不错。您的孩子的核心力量和肌耐力还有提升的空间，但已经有一定的基础了。这个成绩可以支撑日常的体育课，但可能需要在训练中逐步提高强度和挑战自己的极限。建议继续努力，提高成绩。";
				  } else if (sitUps >= 20) {
				    this.tips = "及格，表现一般。您的孩子的核心力量和肌耐力需要加强，这个成绩可能无法支撑日常的体育课。建议加强锻炼，逐步提高强度，以提高成绩和身体素质。";
				  } else {
				    this.tips = "不及格，表现较差。您的孩子的核心力量和肌耐力需要大幅度提高，这个成绩无法支撑日常的体育课。建议加强锻炼，逐步提高强度，以提高成绩和身体素质。可以向学校的体育老师或者专业的训练师咨询建议和指导。";
				  }

				this.sitUpsGuageOption = {
					series: [{
						type: 'gauge',
						min: 0,
						max: 100,
						center: ['50%', '65%'],
						radius: '80%',
						axisLine: {
							lineStyle: {
								width: 20,
								color: [
									[0.2, '#FF6E76'],
									[0.4, '#FDDD60'],
									[0.6, '#58D9F9'],
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
							formatter: '{value}个',
							color: 'inherit',
							fontSize: 30
						},
						data: [{
							value: sitUps
						}]
					}]
				};
			},
			// 更新折线图的配置选项
			updateSitUpsLineChartOption(startDate, endDate) {
				let date = [];
				let femaleAvgSitUps = [];
				let sitUps = []

				this.sitUpsData
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
						femaleAvgSitUps.push(item.femaleAvgSitUps);
						sitUps.push(item.sitUps);
					});

				this.sitUpsLineChartOption = {
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
								result += series.marker + series.seriesName + ' : ' + series.value + '个/分';
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
						data: ['班级男生平均俯卧撑个数', '您孩子的俯卧撑个数']
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
						max: 100,
						interval: 10,
						axisLabel: {
							formatter: '{value}',
						},
					},
					series: [{
							name: '班级男生平均俯卧撑个数',
							type: 'line',
							smooth: true,
							data: femaleAvgSitUps,
						},
						{
							name: '您孩子的俯卧撑个数',
							type: 'line',
							smooth: true,
							data: sitUps
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
