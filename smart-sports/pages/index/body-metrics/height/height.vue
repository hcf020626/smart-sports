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
				<!-- 数据区域显示了当前的身高和日期 -->
				<view class="data-area" v-show="heightData.length">
					<view class="height">
						<text class="number">{{height}}</text>
						<text class="unit" v-show="!isSingleSelectedEmtpy">cm</text>
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
						<l-echart ref="heightGuage" @finished="initHeightGuage"></l-echart>
					</view>

					<view class="tips" v-show="heightData.length">{{tips}}</view>
				</view>
			</view>

			<!-- 如果 subsection.current 为 0，渲染日页面，该页面包含了一个数据区域和一个图表区域 -->
			<view class="stats" v-else>
				<view class="charts-area">
					<view style="width: 100%;height:300px;">
						<l-echart ref="heightLineChart" @finished="initHeightLineChart"></l-echart>
					</view>
				</view>

				<view class="range-date" v-show="heightData.length">
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
	// 引入 heightRefTable.js，该文件是一个身高参考表
	import heightRefTable from './heightRefTable.js'
	export default {
		data() {
			return {
				subsection: {
					list: ['日', '统计'],
					current: 0
				},
				height: '',
				currentSelectedDate: '',
				startDate: '',
				endDate: '',
				isSingleSelectedEmtpy: false,
				heightGuageOption: {},
				heightLineChartOption: {},
				tips: '',
				calendarSelected: []
			}
		},
		computed: {
			// 获取学生信息，需要studentInfo的height
			...mapState('studentModule', ['studentInfo', 'heightData']),
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
			...mapActions('studentModule', ['updateHeightData']),
			openSingleCalendar() {
				this.$refs.singleCalendar.open();
			},
			openRangeCalendar() {
				this.$refs.rangeCalendar.open();
			},
			singleCalendarConfirm(e) {
				this.currentSelectedDate = e.fulldate;
				const targetData = this.heightData.find(d => d.date === this.currentSelectedDate);
				if (!targetData) {
					this.height = '无';
					this.isSingleSelectedEmtpy = true;
					return;
				} else {
					this.isSingleSelectedEmtpy = false;
				}
				this.height = targetData ? targetData.height : 0;
				this.updateHeightGuageOption(this.height)
				this.$refs.heightGuage.setOption(this.heightGuageOption)
			},
			rangeCalendarConfirm(e) {
				if (!e.range.data.length) {
					return;
				}

				this.startDate = e.range.data[0];
				this.endDate = e.range.data[e.range.data.length - 1];
				this.updateHeightLineChartOption(this.startDate, this.endDate);
				this.$refs.heightLineChart.setOption(this.heightLineChartOption);
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
								heightData
							}
						} = await api.student.getHeightById(this.studentInfo.id);
						if (!status) {
							this.updateHeightData(heightData);
							if (this.heightData.length) {
								this.initPageData();
								if (this.$refs.heightGuage) {
									this.$refs.heightGuage.clear();
									this.$refs.heightGuage.setOption(this.heightGuageOption);
								}
								if (this.$refs.heightLineChart) {
									this.$refs.heightLineChart.clear();
									this.$refs.heightLineChart.setOption(this.heightLineChartOption);
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
				if (!this.heightData.length) {
					console.log('The height data is empty');
					this.heightGuageOption = this.heightLineChartOption = {
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

				this.heightData.forEach((item) => {
					this.calendarSelected.push({
						date: item.date,
						info: '有数据'
					})
				})

				this.currentSelectedDate = this.heightData[this.heightData.length - 1].date;
				this.height = this.heightData[this.heightData.length - 1].height;
				this.updateHeightGuageOption(this.height)

				this.startDate = this.heightData[0].date;
				this.endDate = this.heightData[this.heightData.length - 1].date;
				this.updateHeightLineChartOption(this.startDate, this.endDate);
			},
			// 初始化仪表盘
			initHeightGuage() {
				// init 是 echarts 初始化调用函数,第一个参数是传入echarts,第二个参数是回调函数，回调函数的参数是 chart 实例
				this.$refs.heightGuage.init(echarts, chart => {
					console.log('initializing height guage');
					chart.setOption(this.heightGuageOption);
				});
			},
			// 初始化折线图
			initHeightLineChart() {
				// init 是 echarts 初始化调用函数,第一个参数是传入echarts,第二个参数是回调函数，回调函数的参数是 chart 实例
				this.$refs.heightLineChart.init(echarts, chart => {
					console.log('initializing height line chart');
					chart.setOption(this.heightLineChartOption);
				});
			},
			// 更新仪表盘的配置选项
			updateHeightGuageOption(height) {
				console.log("this.studentInfo.gender: ",this.studentInfo.gender);
				const heightRefTableElem = heightRefTable[this.studentInfo.gender][this.studentInfo.age - 1];
				const heightRanges = [{
						range: [0, heightRefTableElem[0]],
						rate: 0
					},
					{
						range: [heightRefTableElem[0], heightRefTableElem[1]],
						rate: 0.25
					},
					{
						range: [heightRefTableElem[1], heightRefTableElem[2]],
						rate: 0.5
					},
					{
						range: [heightRefTableElem[2], heightRefTableElem[3]],
						rate: 0.75
					},
					{
						range: [heightRefTableElem[3], Infinity],
						rate: 1
					},
				];
				let rate = 0;
				for (const {
						range,
						rate: rangeRate
					} of heightRanges) {
					if (height <= range[1]) {
						rate = (height - range[0]) / (range[1] - range[0]) * 0.25 + rangeRate;
						break;
					}
				}
				this.heightGuageOption = {
					series: [{
						// type: 设置图表类型为 gauge，即仪表盘类型。
						type: 'gauge',
						// startAngle 和 endAngle: 指定仪表盘起始和结束的角度，这里起始角度为 180，结束角度为 0，即逆时针旋转。
						startAngle: 180,
						endAngle: 0,
						// center 和 radius: 控制仪表盘的位置和大小，这里的 center 为 ['50%', '75%'] 表示相对于容器宽度和高度的位置，radius 为 '100%' 表示宽度和高度都为 100%。
						center: ['50%', '90%'],
						radius: '100%',
						// min 和 max: 控制指针的取值范围，这里设置最小值为 0，最大值为 1。
						min: 0,
						max: 1,
						// splitNumber: 控制仪表盘轴线的分割段数。
						splitNumber: 8,
						// axisLine: 设置仪表盘轴线的样式，包括线宽和颜色。
						axisLine: {
							lineStyle: {
								width: 6,
								color: [
									[0.25, '#58D9F9'],
									[0.5, '#7CFFB2'],
									[0.75, '#FDDD60'],
									[1, '#FF6E76']
								]
							}
						},
						pointer: {
							icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
							length: '12%',
							width: 20,
							offsetCenter: [0, '-55%'],
							itemStyle: {
								color: '#333333'
							}
						},
						axisTick: {
							length: 10,
							lineStyle: {
								color: '#333333',
								width: 2
							}
						},
						splitLine: {
							length: 20,
							lineStyle: {
								color: '#333333',
								width: 4
							}
						},
						axisLabel: {
							color: '#464646',
							fontSize: 20,
							distance: -60,
							rotate: 'tangential',
							formatter: function(value) {
								if (value === 0.875) {
									return '高';
								} else if (value === 0.625) {
									return '标准';
								} else if (value === 0.375) {
									return '偏矮';
								} else if (value === 0.125) {
									return '矮小';
								}
								return '';
							}
						},
						title: {
							offsetCenter: [0, '-10%'],
							fontSize: 20
						},
						detail: {
							fontSize: 25,
							offsetCenter: [0, '-35%'],
							valueAnimation: true,
							formatter: function(value) {
								return height + 'cm';
							},
							color: 'inherit'
						},
						data: [{
							value: rate,
							name: 'Height Rating'
						}]
					}]
				}
			},
			// 更新折线图的配置选项
			updateHeightLineChartOption(startDate, endDate) {
				let date = [];
				let maleAvgHeight = [];
				let femaleAvgHeight = [];
				let height = [];

				this.heightData
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
						maleAvgHeight.push(item.maleAvgHeight);
						femaleAvgHeight.push(item.femaleAvgHeight)
						height.push(item.height);
					});
				this.heightLineChartOption = {
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
						type: 'scroll',
						orient: 'horizontal',
						left: 'center',
						bottom: 5, // 使 legend 位于 grid 的下方
						data: ['班级男生平均身高', '班级女生平均身高', '您孩子的身高']
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
						min: 60,
						max: 190,
						axisLabel: {
							formatter: '{value} cm',
						},
					},
					series: [{
							name: '班级男生平均身高',
							type: 'line',
							data: maleAvgHeight,
						},
						{
							name: '班级女生平均身高',
							type: 'line',
							data: femaleAvgHeight,
						},
						{
							name: '您孩子的身高',
							type: 'line',
							data: height
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

	.data-area>.height {
		display: flex;
		flex-direction: row;
		align-items: baseline;
	}

	.height>.number {
		font-size: 2rem;
		font-weight: bold;
	}

	.height>.unit {}

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
