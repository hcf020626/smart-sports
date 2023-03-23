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
					<view class="height">
						<text class="number">{{height}}</text>
						<text class="unit">cm</text>
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
	// 引入 heightRefTable.js，该文件是一个身高参考表
	import heightRefTable from './heightRefTable.js'

	export default {
		data() {
			return {
				subsection: {
					list: ['最新', '历史'],
					current: 0
				},
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
				let height = this.height;
				const heightData = heightRefTable[this.gender][this.age - 1]
				let rate;

				if (height <= heightData[0]) {
					rate = (height / heightData[0]) * 0.25;
				} else if (height <= heightData[1]) {
					rate = ((height - heightData[0]) / (heightData[1] - heightData[0])) * 0.25 + 0.25;
				} else if (height <= heightData[2]) {
					rate = ((height - heightData[1]) / (heightData[2] - heightData[1])) * 0.25 + 0.5;
				} else if (height <= heightData[3]) {
					rate = ((height - heightData[2]) / (heightData[3] - heightData[2])) * 0.25 + 0.75;
				} else {
					rate = 1
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
									[0.5, '#FDDD60'],
									[0.75, '#7CFFB2'],
									[1, '#FF6E76']
								]
							}
						},
						pointer: {
							icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
							length: '12%',
							width: 20,
							offsetCenter: [0, '-60%'],
							itemStyle: {
								color: '#7b68ee'
							}
						},
						axisTick: {
							length: 12,
							lineStyle: {
								color: '#000',
								width: 2
							}
						},
						splitLine: {
							length: 20,
							lineStyle: {
								color: '#000',
								width: 5
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
			async init2() {
				// init 是 echarts 初始化调用函数,第一个参数是传入echarts,第二个参数是回调函数，回调函数的参数是 chart 实例
				const chart2 = await this.$refs.chart2.init(echarts);
				chart2.setOption(this.option2)
			},
			initOption2() {
				let fakeData1 = [];
				for (let i = 0; i < 7; i++) {
				  fakeData1.push(((Math.random() * 20) + 155).toFixed(1));
				}
				
				let fakeData2 = [];
				for (let i = 0; i < 7; i++) {
				  fakeData2.push(((Math.random() * 10) + 160).toFixed(1));
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
								result += series.marker + series.seriesName + ' : ' + series.value + 'cm';
								// 添加了一个条件语句来检查是否为最后一个系列，如果不是，则添加一个换行符。这样就可以确保最后没有多余的换行符了。
								if (i !== l - 1) {
									result += '\n';
								}
							}
							return result;
						}
					},
					legend: {
						data: ['班级平均身高', '您孩子的身高']
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
						min: 60,
						max: 190,
						axisLabel: {
							formatter: '{value} cm',
						},
					},
					series: [{
							name: '班级平均身高',
							type: 'line',
							data: fakeData2,
						},
						{
							name: '您孩子的身高',
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
