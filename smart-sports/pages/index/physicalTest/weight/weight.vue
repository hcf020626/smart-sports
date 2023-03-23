<template>
	<!-- container 容器包括两个部分：一个是 subsection，另一个是 content -->
	<view class="container">
		<!-- subsection 通过 u-subsection 组件渲染了一个 tab 栏，用于切换最新和历史两个页面。 -->
		<view class="subsection">
			<u-subsection :list="subsection.list" mode="button" :current="subsection.current" @change="sectionChange"
				activeColor="mediumslateblue"></u-subsection>
		</view>
		<!-- content 部分 -->
		<view class="content">
			<!-- 如果 subsection.current 为 0，渲染最新页面，该页面包含了一个数据区域和一个图表区域 -->
			<view class="latest" v-if="!subsection.current">
				<!-- 数据区域显示了当前的身高和日期 -->
				<view class="data-area">
					<view class="weight">
						<text class="number">{{weight}}</text>
						<text class="unit">kg</text>
					</view>
					<view class="date">{{date}}</view>
				</view>
				<!-- 图表区域通过 l-echart 组件渲染了一个仪表盘图表 -->
				<view class="charts-area">
					<view style="width: 100%;">
						<l-echart ref="chart1" @finished="init1"></l-echart>
					</view>
				</view>
			</view>
			<!-- 如果 subsection.current 为 1，渲染历史页面。 -->
			<view class="history" v-else>
				<view class="charts-area">
					<view style="width: 100%; margin-top: 30rpx;">
						<l-echart ref="chart2" @finished="init2"></l-echart>
					</view>
				</view>
			</view>
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
					list: ['最新', '历史'],
					current: 0
				},
				weight: ((Math.random() * 15) + 50).toFixed(2),
				height: ((Math.random() * 20) + 155).toFixed(2),
				age: 15,
				gender: "男",
				date: '2023年3月20日',
				option1: {},
				option2: {}
			}
		},
		created() {
			this.initOption1();
			this.initOption2();
		},
		methods: {
			sectionChange(index) {
				this.subsection.current = index;
			},
			async init1() {
				// init 是 echarts 初始化调用函数,第一个参数是传入echarts,第二个参数是回调函数，回调函数的参数是 chart 实例
				const chart1 = await this.$refs.chart1.init(echarts);
				chart1.setOption(this.option1)
			},
			initOption1() {
				// 计算 BMI
				let BMI = (this.weight / ((this.height / 100) ** 2)).toFixed(2);

				let rate;
				if (BMI <= 18.5) {
					rate = (BMI) / 18.5 * 0.25;
				} else if (BMI <= 24.0) {
					rate = (BMI - 18.5) / (24.0 - 18.5) * 0.25 + 0.25;
				} else if (BMI <= 28.0) {
					rate = (BMI - 24.0) / (28.0 - 24.0) * 0.25 + 0.5;
				} else if (BMI <= 40) {
					rate = (BMI - 28.0) / (40 - 28.0) * 0.25 + 0.75
				} else {
					rate = 1;
				}

				this.option1 = {
					series: [{
						type: 'gauge',
						startAngle: 180,
						endAngle: 0,
						center: ['50%', '75%'],
						radius: '90%',
						min: 0,
						max: 1,
						splitNumber: 8,
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
								color: '#7b68ee'
							}
						},
						axisTick: {
							length: 10,
							lineStyle: {
								color: '#000',
								width: 2
							}
						},
						splitLine: {
							length: 18,
							lineStyle: {
								color: '#000',
								width: 5
							}
						},
						axisLabel: {
							color: '#464646',
							fontSize: 20,
							distance: 20,
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
			async init2() {
				// init 是 echarts 初始化调用函数,第一个参数是传入echarts,第二个参数是回调函数，回调函数的参数是 chart 实例
				const chart2 = await this.$refs.chart2.init(echarts);
				chart2.setOption(this.option2)
			},
			initOption2() {
				let fakeData1 = [];
				for (let i = 0; i < 7; i++) {
				  fakeData1.push(((Math.random() * 15) + 50).toFixed(1));
				}
				
				let fakeData2 = [];
				for (let i = 0; i < 7; i++) {
				  fakeData2.push(((Math.random() * 5) + 55).toFixed(1));
				}
				
				this.option2 = {
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
					legend: {
						data: ['班级平均体重', '您孩子的体重']
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: {
						type: 'category',
						data: ['2022年03月01日', '2023年6月20日', '2023年9月10日', '202年12月20日', '2023年01月12日', '2023年02月06日',
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
							name: '班级平均体重',
							type: 'line',
							data: fakeData2,
						},
						{
							name: '您孩子的体重',
							type: 'line',
							data: fakeData1
						},
					]
				};
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
	.content>.latest {
		display: flex;
		flex-direction: column;
	}

	.latest>.data-area {
		width: 85%;
		margin: 35rpx auto;
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
		font-size: 0.8rem;
		color: $u-tips-color;
	}

	.latest>.charts-area {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
