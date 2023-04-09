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
				<view class="data-area" v-show="weightData.length">
					<view class="value">
						<text class="number">{{weight}}</text>
						<text class="unit" v-show="!isSingleSelectedEmtpy">kg</text>
					</view>
					<view class="date" @click="openSingleCalendar">
						<text>{{currentSelectedDate | formatDate }}</text>
						<uni-icons customPrefix="iconfont" type="icon-arrow-down"></uni-icons>
					</view>
				</view>
				<u-empty text="数据为空" icon="../../../../static/images/empty/data-empty.png" :show="isSingleSelectedEmtpy">
				</u-empty>
				<!-- 图表区域通过 l-echart 组件渲染了一个仪表盘图表 -->
				<view class="charts-area" v-show="!isSingleSelectedEmtpy">
					<view style="width: 100%;height:300px;">
						<l-echart ref="weightGuage" @finished="initWeightGuage"></l-echart>
					</view>
					<view class="legend" v-show="weightData.length">
						<view class="item">
							<view class="box box1"></view>
							<text>偏瘦</text>
						</view>
						<view class="item">
							<view class="box box2"></view>
							<text>正常</text>
						</view>
						<view class="item">
							<view class="box box3"></view>
							<text>超重</text>
						</view>
						<view class="item">
							<view class="box box4"></view>
							<text>肥胖</text>
						</view>
					</view>

					<view class="tips" v-show="weightData.length">{{tips}}</view>
				</view>
			</view>

			<!-- 如果 subsection.current 为 0，渲染日页面，该页面包含了一个数据区域和一个图表区域 -->
			<view class="stats" v-else>
				<view class="charts-area">
					<view style="width: 100%;height:300px;">
						<l-echart ref="weightLineChart" @finished="initWeightLineChart"></l-echart>
					</view>
				</view>

				<view class="range-date" v-show="weightData.length">
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
				weight: '',
				height: '',
				currentSelectedDate: '',
				startDate: '',
				endDate: '',
				isSingleSelectedEmtpy: false,
				weightGuageOption: {},
				weightLineChartOption: {},
				tips: '',
				calendarSelected: []
			}
		},
		computed: {
			// 获取学生信息，需要studentInfo的height
			...mapState('studentModule', ['studentInfo', 'weightData']),
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
			...mapActions('studentModule', ['updateWeightData']),
			openSingleCalendar() {
				this.$refs.singleCalendar.open();
			},
			openRangeCalendar() {
				this.$refs.rangeCalendar.open();
			},
			singleCalendarConfirm(e) {
				this.currentSelectedDate = e.fulldate;
				const targetData = this.weightData.find(d => d.date === this.currentSelectedDate);
				if (!targetData) {
					this.weight = '无';
					this.isSingleSelectedEmtpy = true;
					return;
				}else{
					this.isSingleSelectedEmtpy = false;
				}
				this.weight = targetData ? targetData.weight : 0;
				this.height = targetData ? targetData.height : 0;
				this.updateWeightGuageOption(this.height, this.weight)
				this.$refs.weightGuage.setOption(this.weightGuageOption)
			},
			rangeCalendarConfirm(e) {
				if (!e.range.data.length) {
					return;
				}

				this.startDate = e.range.data[0];
				this.endDate = e.range.data[e.range.data.length - 1];
				this.updateWeightLineChartOption(this.startDate, this.endDate);
				this.$refs.weightLineChart.setOption(this.weightLineChartOption);
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
								weightData
							}
						} = await api.student.getWeightById(this.studentInfo.id);
						if (!status) {
							this.updateWeightData(weightData);
							if (this.weightData.length) {
								this.initPageData();
								if (this.$refs.weightGuage) {
									this.$refs.weightGuage.clear();
									this.$refs.weightGuage.setOption(this.weightGuageOption);
								}
								if (this.$refs.weightLineChart) {
									this.$refs.weightLineChart.clear();
									this.$refs.weightLineChart.setOption(this.weightLineChartOption);
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
				if (!this.weightData.length) {
					console.log('The weight data is empty');
					this.weightGuageOption = this.weightLineChartOption = {
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

				this.weightData.forEach((item) => {
					this.calendarSelected.push({
						date: item.date,
						info: '有数据'
					})
				})

				this.currentSelectedDate = this.weightData[this.weightData.length - 1].date;
				this.weight = this.weightData[this.weightData.length - 1].weight;
				this.height = this.weightData[this.weightData.length - 1].height;
				this.updateWeightGuageOption(this.height, this.weight)

				this.startDate = this.weightData[0].date;
				this.endDate = this.weightData[this.weightData.length - 1].date;
				this.updateWeightLineChartOption(this.startDate, this.endDate);
			},
			// 初始化仪表盘
			initWeightGuage() {
				// init 是 echarts 初始化调用函数,第一个参数是传入echarts,第二个参数是回调函数，回调函数的参数是 chart 实例
				this.$refs.weightGuage.init(echarts, chart => {
					console.log('initializing weight guage');
					chart.setOption(this.weightGuageOption);
				});
			},
			// 初始化折线图
			initWeightLineChart() {
				// init 是 echarts 初始化调用函数,第一个参数是传入echarts,第二个参数是回调函数，回调函数的参数是 chart 实例
				this.$refs.weightLineChart.init(echarts, chart => {
					console.log('initializing weight line chart');
					chart.setOption(this.weightLineChartOption);
				});
			},
			// 更新仪表盘的配置选项
			updateWeightGuageOption(height, weight) {
				// 计算 BMI
				const heightInMeters = height / 100;
				const BMI = (weight / heightInMeters ** 2).toFixed(2);

				const bmiRanges = [{
						range: [0, 18.5],
						rate: 0
					},
					{
						range: [18.5, 24.0],
						rate: 0.25
					},
					{
						range: [24.0, 28.0],
						rate: 0.5
					},
					{
						range: [28.0, 40],
						rate: 0.75
					},
					{
						range: [40, Infinity],
						rate: 1
					},
				];

				// 计算 BMI 级别
				let rate = 0;
				for (const {
						range,
						rate: r
					} of bmiRanges) {
					if (BMI >= range[0] && BMI <= range[1]) {
						rate = (BMI - range[0]) / (range[1] - range[0]) * 0.25 + r;
						break;
					}
				}

				if (rate <= 0.25) {
					this.tips = 'BMI偏低，需改善您的小孩的饮食营养结构，尤其是增加优质蛋白的摄入，保持营养饮食均衡，运动方面增加力量训练如仰卧起坐、举重等，循序渐进。'
				} else if (rate <= 0.5) {
					this.tips = 'BMI正常，请保持您的小孩良好的饮食和运动习惯，防止腹部脂肪过多堆积';
				} else if (rate <= 0.75) {
					this.tips = 'BMI偏高，建议让您的小孩每周坚持运动锻炼，增加有氧运动比如跑步、跳绳等。同时控制饮食总摄入量，增加膳食纤维和优质蛋白的摄入，少吃油炸等高热量的食物。'
				} else {
					this.tips = '长期处于肥胖状态的人，稍微运动会出现心悸气短、怕热、多汗、易疲劳的情况，甚至会有慢性疾病的风险。建议您的小孩的改善生活习惯，坚持控制饮食摄入量，坚持运动锻炼，减少脂肪的囤积。'
				}

				this.weightGuageOption = {
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
								if (value === 0.75) {
									return '28.0';
								} else if (value === 0.5) {
									return '24.0';
								} else if (value === 0.25) {
									return '18.5';
								} else {
									return '';
								}
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
								return BMI;
							},
							color: 'inherit'
						},
						data: [{
							value: rate,
							name: 'BMI Rating'
						}]
					}]
				};
			},
			// 更新折线图的配置选项
			updateWeightLineChartOption(startDate, endDate) {
				let date = [];
				let maleAvgWeight = [];
				let femaleAvgWeight = [];
				let weight = [];

				this.weightData
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
						maleAvgWeight.push(item.maleAvgWeight);
						femaleAvgWeight.push(item.femaleAvgWeight)
						weight.push(item.weight);
					});

				this.weightLineChartOption = {
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
								result += series.marker + series.seriesName + ' : ' + series.value + 'kg';
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
						data: ['班级男生平均体重', '班级女生平均体重', '您孩子的体重']
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
						min: 90,
						max: 30,
						axisLabel: {
							formatter: '{value} kg',
						},
					},
					series: [{
							name: '班级男生平均体重',
							type: 'line',
							data: maleAvgWeight,
						}, {
							name: '班级女生平均体重',
							type: 'line',
							data: femaleAvgWeight,
						},
						{
							name: '您孩子的体重',
							type: 'line',
							data: weight
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
		background-color: #58D9F9;
	}

	.box2 {
		background-color: #7CFFB2;
	}

	.box3 {
		background-color: #FDDD60;
	}

	.box4 {
		background-color: #FF6E76;
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
