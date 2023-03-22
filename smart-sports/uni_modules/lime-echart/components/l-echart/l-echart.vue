<template>
	<view class="lime-echart" :style="customStyle" v-if="canvasId" ref="limeEchart">
		<!-- #ifndef APP-NVUE -->
		<canvas
			class="lime-echart__canvas"
			v-if="use2dCanvas"
			type="2d"
			:id="canvasId"
			:style="canvasStyle"
			:disable-scroll="isDisableScroll"
			@touchstart="touchStart"
			@touchmove="touchMove"
			@touchend="touchEnd"
		/>
		<canvas
			class="lime-echart__canvas"
			v-else-if="isPc"
			:style="canvasStyle"
			:id="canvasId"
			:canvas-id="canvasId"
			:disable-scroll="isDisableScroll"
			@mousedown="touchStart"
			@mousemove="touchMove"
			@mouseup="touchEnd"
		/>
		<canvas
			class="lime-echart__canvas"
			v-else
			:width="nodeWidth"
			:height="nodeHeight"
			:style="canvasStyle"
			:canvas-id="canvasId"
			:id="canvasId"
			:disable-scroll="isDisableScroll"
			@touchstart="touchStart"
			@touchmove="touchMove"
			@touchend="touchEnd"
		/>
		<canvas v-if="isOffscreenCanvas" :style="offscreenStyle" :canvas-id="offscreenCanvasId"></canvas>
		<!-- #endif -->
		<!-- #ifdef APP-NVUE -->
		<web-view
			class="lime-echart__canvas"
			:id="canvasId"
			:style="canvasStyle"
			:webview-styles="webviewStyles"
			ref="webview"
			src="/uni_modules/lime-echart/static/index.html"
			@pagefinish="finished = true"
			@onPostMessage="onMessage"
		></web-view>
		<!-- #endif -->
	</view>
</template>

<script>
// #ifdef VUE3
// #ifdef APP-PLUS
global = {}
// #endif
// #endif
// #ifndef APP-NVUE
import {Canvas, setCanvasCreator, dispatch} from './canvas';
import { compareVersion, wrapTouch, devicePixelRatio ,sleep} from './utils';
// #endif
// #ifdef APP-NVUE
import { base64ToPath, sleep } from './utils';
import {Echarts} from './nvue'
// #endif
const charts = {}
const echartsObj = {}
export default {
	name: 'lime-echart',
	props: {
		// #ifdef MP-WEIXIN || MP-TOUTIAO
		type: {
			type: String,
			default: '2d'
		},
		// #endif
		// #ifdef APP-NVUE
		webviewStyles: Object,
		// hybrid: Boolean,
		// #endif
		customStyle: String,
		isDisableScroll: Boolean,
		isClickable: {
			type: Boolean,
			default: true
		},
		enableHover: Boolean,
		beforeDelay: {
			type: Number,
			default: 30
		}
	},
	data() {
		return {
			// #ifdef MP-WEIXIN || MP-TOUTIAO || MP-ALIPAY
			use2dCanvas: true,
			// #endif
			// #ifndef MP-WEIXIN || MP-TOUTIAO || MP-ALIPAY
			use2dCanvas: false,
			// #endif
			width: null,
			height: null,
			nodeWidth: null,
			nodeHeight: null,
			canvasNode: null,
			config: {},
			inited: false,
			finished: false,
			file: '',
			platform: '',
			isPc: false,
			isDown: false,
			isOffscreenCanvas: false,
			offscreenWidth: 0,
			offscreenHeight: 0
		};
	},
	computed: {
		canvasId() {
			return `lime-echart${this._ && this._.uid || this._uid}`
		},
		offscreenCanvasId() {
			return `${this.canvasId}_offscreen`
		},
		offscreenStyle() {
			return `width:${this.offscreenWidth}px;height: ${this.offscreenHeight}px; position: fixed; left: 99999px; background: red`
		},
		canvasStyle() {
			return  this.width && this.height ? ('width:' + this.width + 'px;height:' + this.height + 'px') : ''
		}
	},
	beforeDestroy() {
		this.clear()
		this.dispose()
		// #ifdef H5
		if(this.isPc) {
			document.removeEventListener('mousewheel', () => {})
		}
		// #endif
	},
	created() {
		// #ifdef H5
		if(!('ontouchstart' in window)) {
			this.isPc = true
			document.addEventListener('mousewheel', (e) => {
				if(this.chart) {
					const touch = this.getTouch(e)
					const handler = this.chart.getZr().handler;
					dispatch.call(handler, 'mousewheel', touch)
				}
			})
		}
		// #endif
		// #ifdef MP-WEIXIN || MP-TOUTIAO || MP-ALIPAY
		const { SDKVersion, version, platform, environment } = uni.getSystemInfoSync();
		// #endif
		// #ifdef MP-WEIXIN
		this.isPC = /windows/i.test(platform)
		// 截止 2023-03-22 mac pc小程序不支持 canvas 2d
		this.use2dCanvas = platform !=='mac' && this.type === '2d' && compareVersion(SDKVersion, '2.9.2') >= 0 && !((/ios/i.test(platform) && /7.0.20/.test(version)) || /wxwork/i.test(environment)) //&& !this.isPC;
		// #endif
		// #ifdef MP-TOUTIAO
		this.isPC = /devtools/i.test(platform)
		this.use2dCanvas = this.type === '2d' && compareVersion(SDKVersion, '1.78.0') >= 0;
		// #endif
		// #ifdef MP-ALIPAY
		this.use2dCanvas = this.type === '2d' && compareVersion(my.SDKVersion, '2.7.0') >= 0;
		// #endif
	},
	mounted() {
		this.$nextTick(() => {
			this.$emit('finished')
		})
	},
	methods: {
		// #ifdef APP-NVUE
		onMessage(e) {
			const res = e?.detail?.data[0] || null;
			if (res?.event) {
				if(res.event === 'inited') {
					this.inited = true
				}
				this.$emit(res.event, JSON.parse(res.data));
			} else if(res?.file){
				this.file = res.data
			} else if(!res[0] && JSON.stringify(res[0]) != '{}'){
				console.error(res);
			} else {
				console.log(...res)
			}
		},
		// #endif
		setChart(callback) {
			if(!this.chart) {
				console.warn(`组件还未初始化，请先使用 init`)
				return
			}
			if(typeof callback === 'function' && this.chart) {
				callback(this.chart);
			}
			// #ifdef APP-NVUE
			if(typeof callback === 'function') {
				this.$refs.webview.evalJs(`setChart(${JSON.stringify(callback.toString())}, ${JSON.stringify(this.chart.options)})`);
			}
			// #endif
		},
		setOption() {
			if (!this.chart || !this.chart.setOption) {
				console.warn(`组件还未初始化，请先使用 init`)
				return
			}
			this.chart.setOption(...arguments);
		},
		showLoading() {
			if(this.chart) {
				this.chart.showLoading(...arguments)
			}
		},
		hideLoading() {
			if(this.chart) {
				this.chart.hideLoading()
			}
		},
		clear() {
			if(this.chart) {
				this.chart.clear()
			}
		},
		dispose() {
			if(this.chart) {
				this.chart.dispose()
			}
		},
		resize(size) {
			if(size && size.width && size.height) {
				this.height = size.height
				this.width = size.width
				if(this.chart) {this.chart.resize(size)}
			} else {
				this.$nextTick(() => {
					uni.createSelectorQuery()
						.in(this)
						.select(`.lime-echart`)
						.boundingClientRect()
						.exec(res => {
							if (res) {
								let { width, height } = res[0];
								this.width = width = width || 300;
								this.height = height = height || 300;
								this.chart.resize({width, height})
							}
						});
				})
				
			}
			
		},
		canvasToTempFilePath(args = {}) {
			// #ifndef APP-NVUE
			const { use2dCanvas, canvasId, canvasNode } = this;
			return new Promise((resolve, reject) => {
				const copyArgs = Object.assign({
					canvasId,
					success: resolve,
					fail: reject
				}, args);
				if (use2dCanvas) {
					delete copyArgs.canvasId;
					copyArgs.canvas = canvasNode;
				}
				uni.canvasToTempFilePath(copyArgs, this);
			});
			// #endif
			// #ifdef APP-NVUE
			this.file = ''
			this.$refs.webview.evalJs(`canvasToTempFilePath()`);
			return new Promise((resolve, reject) => {
				this.$watch('file', async (file) => {
					if(file) {
						const tempFilePath = await base64ToPath(file)
						resolve(args.success({tempFilePath}))
					} else {
						reject(args.fail({error: ``}))
					}
				})
			})
			// #endif
		},
		async init(echarts, ...args) {
			// #ifndef APP-NVUE
			if(arguments && arguments.length < 1) {
				console.error('缺少参数：init(echarts, theme?:string, opts?: object, callback?: function)')
				return
			}
			// #endif
			let theme=null,opts={},callback;
			
			Array.from(arguments).forEach(item => {
				if(typeof item === 'function') {
					callback = item
				}
				if(['string'].includes(typeof item)) {
					theme = item
				}
				if(typeof item === 'object') {
					opts = item
				}
			})
			
			if(this.beforeDelay) {
				await sleep(this.beforeDelay)
			}
			let config = await this.getContext();
			// #ifndef APP-NVUE
			setCanvasCreator(echarts, config)
			this.chart = echarts.init(config.canvas, theme, Object.assign({}, config, opts))
			if(typeof callback === 'function') {
				callback(this.chart)
			} else {
				return this.chart
			}
			// #endif
			// #ifdef APP-NVUE
			this.chart = new Echarts(this.$refs.webview)
			this.$refs.webview.evalJs(`init(null, null, ${JSON.stringify(opts)}, ${theme})`)
			if(callback) {
				callback(this.chart)
			} else {
				return this.chart
			}
			// #endif
		},
		getContext() {
			// #ifdef APP-NVUE
			if(this.finished) {
				return Promise.resolve(this.finished)
			}
			return new Promise(resolve => {
				this.$watch('finished', (val) => {
					if(val) {
						resolve(this.finished)
					}
				})
			})
			// #endif
			// #ifndef APP-NVUE
			const { use2dCanvas } = this;
			let dpr = devicePixelRatio
			if (use2dCanvas) {
				return new Promise(resolve => {
					uni.createSelectorQuery()
						.in(this)
						.select(`#${this.canvasId}`)
						.fields({
							node: true,
							size: true
						})
						.exec(res => {
							let { node, width, height } = res[0];
							this.width = width = width || 300;
							this.height = height = height || 300;
							const ctx = node.getContext('2d');
							const canvas = new Canvas(ctx, this, true, node);
							this.canvasNode = node
							resolve({ canvas, width, height, devicePixelRatio: dpr, node });
						});
				});
			}
			return new Promise(resolve => {
				uni.createSelectorQuery()
					.in(this)
					.select(`#${this.canvasId}`)
					.boundingClientRect()
					.exec(res => {
						if (res) {
							let { width, height } = res[0];
							this.width = width = width || 300;
							this.height = height = height || 300;
							// #ifdef MP-TOUTIAO
							dpr = !this.isPC ? devicePixelRatio : 1// 1.25
							// #endif
							// #ifndef MP-ALIPAY || MP-TOUTIAO
							dpr = this.isPC ? devicePixelRatio : 1
							// #endif
							// #ifdef MP-ALIPAY || MP-LARK
							dpr = devicePixelRatio
							// #endif
							this.rect = res[0]
							this.nodeWidth = width * dpr;
							this.nodeHeight = height * dpr;
							const ctx = uni.createCanvasContext(this.canvasId, this);
							const canvas =  new Canvas(ctx, this, false);
							resolve({ canvas, width, height, devicePixelRatio: dpr });
						}
					});
			});
			// #endif
		},
		// #ifndef APP-NVUE
		getRelative(e) {
			return {x: e.pageX - this.rect.left, y: e.pageY - this.rect.top, wheelDelta: e.wheelDelta}
		},
		getTouch(e) {
			return e.touches && e.touches[0] && e.touches[0].x ? e.touches[0] : this.getRelative(e);
		},
		touchStart(e) {
			this.isDown = true
			if (this.chart && ((e.touches.length > 0 || e.touches['0'])  && e.type != 'mousemove' || e.type == 'mousedown')) {
				const touch = this.getTouch(e)
				this.startX = touch.x
				this.startY = touch.y
				this.startT = new Date()
				const handler = this.chart.getZr().handler;
				dispatch.call(handler, 'mousedown', touch)
				dispatch.call(handler, 'mousemove', touch)
				handler.processGesture(wrapTouch(e), 'start');
				clearTimeout(this.endTimer);
			}
		},
		touchMove(e) {
			if(this.isPc && this.enableHover && !this.isDown) {this.isDown = true}
			if (this.chart && ((e.touches.length > 0 || e.touches['0']) && e.type != 'mousemove' || e.type == 'mousemove' && this.isDown)) {
				const handler = this.chart.getZr().handler;
				dispatch.call(handler, 'mousemove', this.getTouch(e))
				handler.processGesture(wrapTouch(e), 'change');
			}
		},
		touchEnd(e) {
			this.isDown = false
			if (this.chart) {
				const {x} = e.changedTouches && e.changedTouches[0] || {}
				const touch = (x ? e.changedTouches[0] : this.getRelative(e)) || {};
				const handler = this.chart.getZr().handler;
				const isClick = Math.abs(touch.x - this.startX) < 10 && new Date() - this.startT < 200;
				dispatch.call(handler, 'mouseup', touch)
				handler.processGesture(wrapTouch(e), 'end');
				if(isClick) {
					dispatch.call(handler, 'click', touch)
				} else {
					this.endTimer = setTimeout(() => {
						dispatch.call(handler, 'mousemove', {x: 999999999,y: 999999999});
						dispatch.call(handler, 'mouseup', {x: 999999999,y: 999999999});
					},50)
				}
			}
		}
		// #endif
	}
};
</script>
<style scoped>
.lime-echart {
	position: relative;
	/* #ifndef APP-NVUE */
	width: 100%;
	height: 100%;
	/* #endif */
	/* #ifdef APP-NVUE */
	flex: 1;
	/* #endif */
}
.lime-echart__canvas {
	/* #ifndef APP-NVUE */
	width: 100%;
	height: 100%;
	/* #endif */
	/* #ifdef APP-NVUE */
	flex: 1;
	/* #endif */
}
</style>
