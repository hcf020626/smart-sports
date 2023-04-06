<template>
	<!-- container 容器包括两个部分：一个是 subsection，另一个是 content -->
	<view class="container">
		<!-- subsection 通过 u-subsection 组件渲染了一个 tab 栏，用于切换日和统计两个页面。 -->
		<view class="subsection">
			<u-subsection :list="subsection.list" mode="button" :current="subsection.current" @change="sectionChange"
				activeColor="mediumslateblue"></u-subsection>
		</view>
		<!-- content 部分 -->
		<view class="content">
			<!-- 如果 subsection.current 为 0，渲染日页面，该页面包含了一个数据区域和一个图表区域 -->
			<view class="day" v-if="!subsection.current">
				<!-- 数据区域显示了当前的身高和日期 -->
				<view class="data-area">
					<view class="weight">
						<text class="number">{{weight}}</text>
						<text class="unit">kg</text>
					</view>
					<view class="date" @click="openSingleCalendar">
						<text>{{currentSelectedDate | formatDate }}</text>
						<uni-icons customPrefix="iconfont" type="icon-arrow-down"></uni-icons>
					</view>
				</view>
				<!-- 图表区域通过 l-echart 组件渲染了一个仪表盘图表 -->
				<view class="charts-area">
					<view style="width: 100%;height:300px;">
						<l-echart ref="weightGuage" @finished="initWeightGuage"></l-echart>
					</view>
					<view class="legend">
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

					<view class="tips">{{tips}}</view>
				</view>
			</view>
			<!-- 如果 subsection.current 为 1，渲染统计页面。 -->
			<view class="stats" v-else>
				<view class="charts-area">
					<view style="width: 100%;">
						<l-echart ref="weightLineChart" @finished="initWeightLineChart"></l-echart>
					</view>
				</view>

				<view class="range-date">
					<text>{{startDate | formatDate }}</text><text>-</text><text>{{endDate | formatDate }}</text>
					<uni-icons customPrefix="iconfont" type="icon-arrow-down" @click="openRangeCalendar"></uni-icons>
				</view>
			</view>

			<uni-calendar ref="singleCalendar" :insert="false" :start-date="'1970-1-1'"
				:end-date="new Date().toLocaleString()" @confirm="singleCalendarConfirm" />
			<uni-calendar ref="rangeCalendar" :range="true" :insert="false" :start-date="'1970-1-1'"
				:end-date="new Date().toLocaleString()" @confirm="rangeCalendarConfirm" />
		</view>
	</view>
</template>

<script>
	// 引入 echarts，用于绘制图表
	import * as echarts from '@/uni_modules/lime-echart/static/echarts.min'

	export default {
		data() {
			return {
				subsection: {
					list: ['日', '统计'],
					current: 0
				},
				weight: ((Math.random() * 25) + 40).toFixed(2),
				height: ((Math.random() * 20) + 155).toFixed(2),
				age: 15,
				gender: "男",
				currentSelectedDate: '2023-3-20',
				startDate: '2022-03-01',
				endDate: '2023-3-20',
				weightGuageOption: {},
				weightLineChartOption: {},
				tips: '',

			}
		},
		computed: {},
		created() {
			this.initWeightGuageOption();
			this.initWeightLineChartOption();
		},
		methods: {
			openSingleCalendar() {
				this.$refs.singleCalendar.open();
			},
			openRangeCalendar() {
				this.$refs.rangeCalendar.open();
			},
			singleCalendarConfirm(e) {
				this.currentSelectedDate = e.fulldate;
			},
			rangeCalendarConfirm(e) {
				this.startDate = e.range.before ? e.range.before : this.startDate;
				this.endDate = e.range.after ? e.range.after : this.endDate;
			},
			sectionChange(index) {
				this.subsection.current = index;
			},
			async initWeightGuage() {
				// init 是 echarts 初始化调用函数,第一个参数是传入echarts,第二个参数是回调函数，回调函数的参数是 chart 实例
				const weightGuage = await this.$refs.weightGuage.init(echarts);
				weightGuage.setOption(this.weightGuageOption)
			},
			async initWeightLineChart() {
				// init 是 echarts 初始化调用函数,第一个参数是传入echarts,第二个参数是回调函数，回调函数的参数是 chart 实例
				const weightLineChart = await this.$refs.weightLineChart.init(echarts);
				weightLineChart.setOption(this.weightLineChartOption)
			},
			initWeightGuageOption() {
				// 计算 BMI
				const heightInMeters = this.height / 100;
				const BMI = (this.weight / heightInMeters ** 2).toFixed(2);

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
			initWeightLineChartOption() {
				let fakeData1 = [];
				for (let i = 0; i < 7; i++) {
					fakeData1.push(((Math.random() * 20) + 45).toFixed(1));
				}

				let fakeData2 = [];
				for (let i = 0; i < 7; i++) {
					fakeData2.push(((Math.random() * 10) + 40).toFixed(1));
				}

				let fakeData3 = [];
				for (let i = 0; i < 7; i++) {
					fakeData3.push(((Math.random() * 20) + 45).toFixed(1));
				}

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
						data: ['2022年03月01日', '2023年6月20日', '2023年9月10日', '2023年12月20日', '2023年01月12日', '2023年02月06日',
							'2023年3月20日'
						],
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
							data: fakeData1,
						}, {
							name: '班级女生平均体重',
							type: 'line',
							data: fakeData2,
						},
						{
							name: '您孩子的体重',
							type: 'line',
							data: fakeData3
						},
					]
				};
			}
		},
		filters: {
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

	.data-area>.weight {
		display: flex;
		flex-direction: row;
		align-items: baseline;
	}

	.weight>.number {
		font-size: 2rem;
		font-weight: bold;
	}

	.weight>.unit {}

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
