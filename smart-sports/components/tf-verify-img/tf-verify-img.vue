<template>
	<view class="tf-Box-Bg">
		<view class="tf-Box">
			<view class="tf-Box-title">
				请完成安全验证
				<view class="tf-close" @click.stop="close_"></view>
			</view>
			<canvas :style="{ width: canvasW + 'px', height: canvasH + 'px' }" class="tf-Box-center"
				canvas-id="tf-verify-canvas" id="tf-verify-canvas"></canvas>
			<movable-area class="tf-Box-BtnBox">
				<view class="tf-Box-BtnBox-text">滑动滑块完成拼图</view>
				<movable-view class="tf-Box-BtnNei" direction="all" :x="canvasX2" @change="changePath"
					@touchend="endTouch">
					<view class="tf-Box-BtnNei-leftBox" :style="{backgroundColor:verifyImgs[verifyIndex].color}"></view>
				</movable-view>
			</movable-area>
		</view>
	</view>
</template>

<script>
	export default {
		name: "tf-verify-img",
		data() {
			return {
				verifyImgs: [{
						src: '/static/images/slide-verification/0.jpg',
						color: '#4de1d1'
					},
					{
						src: '/static/images/slide-verification/1.jpg',
						color: '#f4dfc7'
					},
					{
						src: '/static/images/slide-verification/2.jpg',
						color: '#8ba917'
					},
					{
						src: '/static/images/slide-verification/3.jpg',
						color: '#e168e0'
					},
					{
						src: '/static/images/slide-verification/4.jpg',
						color: '#bd9842'
					},
					{
						src: '/static/images/slide-verification/5.jpg',
						color: '#fd90ba'
					},
					{
						src: '/static/images/slide-verification/6.jpg',
						color: '#64c681'
					},
					{
						src: '/static/images/slide-verification/7.jpg',
						color: '#c754e5'
					},
					{
						src: '/static/images/slide-verification/8.jpg',
						color: '#29e662'
					},
					{
						src: '/static/images/slide-verification/9.jpg',
						color: '#51d105'
					},
					{
						src: '/static/images/slide-verification/10.jpg',
						color: '#6dac01'
					},
					{
						src: '/static/images/slide-verification/11.jpg',
						color: '#41ecea'
					}
				],
				verifyIndex: 0,
				canvasW: "",
				canvasH: "",
				canvasX2: 0, //归为用的
				canvasX: 0, //实时移动X
				ctx: false,
				jgX: 0, //结果X
				dqImgPath: '', //本地临时图片路径
			};
		},
		created() {
			this.canvasW = uni.upx2px(580);
			this.canvasH = uni.upx2px(290);
		},
		mounted() {
			this.$nextTick(() => {
				this.init()
			})
		},
		methods: {
			// 生成从minNum到maxNum的随机数
			randomNum(minNum, maxNum) {
				switch (arguments.length) {
					case 1:
						return parseInt(Math.random() * minNum + 1, 10);
						break;
					case 2:
						return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
						break;
					default:
						return 0;
						break;
				}
			},
			close_() {
				this.$emit('close')
			},
			init() {
				this.canvasX2--;
				this.canvasX = 0;
				this.verifyIndex = this.randomNum(0, this.verifyImgs.length - 1);
				this.ctx = uni.createCanvasContext('tf-verify-canvas', this);
				this.jgX = this.randomNum(uni.upx2px(150), uni.upx2px(450));
				this.dqImgPath = this.verifyImgs[this.verifyIndex].src;
				this.huatu();
			},
			endTouch() {
				if (Math.abs(this.canvasX - this.jgX) <= 5) {
					this.$emit('succeed')
				} else {
					uni.showToast({
						title: '验证失败',
						icon: "error"
					});
					this.init();
				}
			},
			huatu() {
				let this_ = this;
				let r = uni.upx2px(10);
				let XX = this.canvasX;
				let YY = uni.upx2px(100);
				let cs = uni.upx2px(20);
				this_.ctx.drawImage(this_.dqImgPath, 0, 0, this_.canvasW, this_.canvasH);

				//画不可移动的拼图块
				this_.ctx.beginPath();
				this_.ctx.moveTo(-2 * r + this_.jgX + cs + 2 * r, YY - 2 * r + 2 * r);
				this_.ctx.lineTo(-2 * r + this_.jgX + cs + 5.5 * r, YY - 2 * r + 2 * r);
				this_.ctx.arcTo(-2 * r + this_.jgX + cs + 5.5 * r, YY - 2 * r + 3 * r, XX - 2 + this_.jgX * r + cs + 6.5 *
					r, YY - 2 * r + 3 * r, r);
				this_.ctx.lineTo(-2 * r + this_.jgX + cs + 7.5 * r, YY - 2 * r + 3 * r);
				this_.ctx.arcTo(-2 * r + this_.jgX + cs + 8.5 * r, YY - 2 * r + 3 * r, -2 * r + this_.jgX + cs + 8.5 * r,
					YY - 2 * r + 2 * r, r);
				this_.ctx.lineTo(-2 * r + this_.jgX + cs + 12 * r, YY - 2 * r + 2 * r);
				this_.ctx.lineTo(-2 * r + this_.jgX + cs + 12 * r, YY - 2 * r + 11 * r);
				this_.ctx.lineTo(-2 * r + this_.jgX + cs + 8.5 * r, YY - 2 * r + 11 * r);
				this_.ctx.arcTo(-2 * r + this_.jgX + cs + 8.5 * r, YY - 2 * r + 12 * r, -2 * r + this_.jgX + cs + 7.5 * r,
					YY - 2 * r + 12 * r, r);
				this_.ctx.lineTo(-2 * r + this_.jgX + cs + 6.5 * r, YY - 2 * r + 12 * r);
				this_.ctx.arcTo(-2 * r + this_.jgX + cs + 5.5 * r, YY - 2 * r + 12 * r, -2 * r + this_.jgX + cs + 5.5 * r,
					YY - 2 * r + 11 * r, r);
				this_.ctx.lineTo(-2 * r + this_.jgX + cs + 2 * r, YY - 2 * r + 11 * r);
				this_.ctx.lineTo(-2 * r + this_.jgX + cs + 2 * r, YY - 2 * r + 8 * r);
				this_.ctx.arcTo(-2 * r + this_.jgX + cs + 3 * r, YY - 2 * r + 8 * r, -2 * r + this_.jgX + cs + 3 * r, YY -
					2 * r + 7 * r, r);
				this_.ctx.lineTo(-2 * r + this_.jgX + cs + 3 * r, YY - 2 * r + 6 * r);
				this_.ctx.arcTo(-2 * r + this_.jgX + cs + 3 * r, YY - 2 * r + 5 * r, -2 * r + this_.jgX + cs + 2 * r, YY -
					2 * r + 5 * r, r);
				this_.ctx.lineTo(-2 * r + this_.jgX + cs + 2 * r, YY - 2 * r + 2 * r);
				this_.ctx.shadowBlur = 10;
				this_.ctx.shadowColor = "#ffffff";
				this_.ctx.fillStyle = "rgba(0,0,0,0.5)";
				this_.ctx.fill();
				this_.ctx.restore();
				//画可移动的拼图块
				this_.ctx.beginPath();
				this_.ctx.save();
				this_.ctx.moveTo(XX - 2 * r + cs + 2 * r, YY - 2 * r + 2 * r);
				this_.ctx.lineTo(XX - 2 * r + cs + 5.5 * r, YY - 2 * r + 2 * r);
				this_.ctx.arcTo(XX - 2 * r + cs + 5.5 * r, YY - 2 * r + 3 * r, XX - 2 * r + cs + 6.5 * r, YY - 2 * r + 3 *
					r, r);
				this_.ctx.lineTo(XX - 2 * r + cs + 7.5 * r, YY - 2 * r + 3 * r);
				this_.ctx.arcTo(XX - 2 * r + cs + 8.5 * r, YY - 2 * r + 3 * r, XX - 2 * r + cs + 8.5 * r, YY - 2 * r + 2 *
					r, r);
				this_.ctx.lineTo(XX - 2 * r + cs + 12 * r, YY - 2 * r + 2 * r);
				this_.ctx.lineTo(XX - 2 * r + cs + 12 * r, YY - 2 * r + 11 * r);
				this_.ctx.lineTo(XX - 2 * r + cs + 8.5 * r, YY - 2 * r + 11 * r);
				this_.ctx.arcTo(XX - 2 * r + cs + 8.5 * r, YY - 2 * r + 12 * r, XX - 2 * r + cs + 7.5 * r, YY - 2 * r +
					12 * r, r);
				this_.ctx.lineTo(XX - 2 * r + cs + 6.5 * r, YY - 2 * r + 12 * r);
				this_.ctx.arcTo(XX - 2 * r + cs + 5.5 * r, YY - 2 * r + 12 * r, XX - 2 * r + cs + 5.5 * r, YY - 2 * r +
					11 * r, r);
				this_.ctx.lineTo(XX - 2 * r + cs + 2 * r, YY - 2 * r + 11 * r);
				this_.ctx.lineTo(XX - 2 * r + cs + 2 * r, YY - 2 * r + 8 * r);
				this_.ctx.arcTo(XX - 2 * r + cs + 3 * r, YY - 2 * r + 8 * r, XX - 2 * r + cs + 3 * r, YY - 2 * r + 7 * r,
					r);
				this_.ctx.lineTo(XX - 2 * r + cs + 3 * r, YY - 2 * r + 6 * r);
				this_.ctx.arcTo(XX - 2 * r + cs + 3 * r, YY - 2 * r + 5 * r, XX - 2 * r + cs + 2 * r, YY - 2 * r + 5 * r,
					r);
				this_.ctx.lineTo(XX - 2 * r + cs + 2 * r, YY - 2 * r + 2 * r);
				this_.ctx.shadowBlur = 10;
				this_.ctx.shadowColor = "#ffffff";
				this_.ctx.fill();
				this_.ctx.clip();
				this_.ctx.drawImage(this_.dqImgPath, this_.canvasX - this_.jgX, 0, this_.canvasW, this_.canvasH);
				this_.ctx.restore();
				//绘图
				this_.ctx.draw();
			},
			changePath(e) {
				this.canvasX = e.target.x;
				this.huatu();
			}
		}
	}
</script>

<style lang="less">
	.tf-Box-Bg {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 100;
		background-color: rgba(0, 0, 0, .3);
		display: flex;
		align-items: center;
		justify-content: center;

		.tf-Box {
			width: 640upx;
			height: 584upx;
			background-color: #fff;
			border-radius: 6upx;
			box-shadow: 0 0 50upx 0upx rgba(0, 0, 0, .2);

			.tf-Box-title {
				height: 100upx;
				line-height: 1;
				padding: 0 32upx;
				font-size: 32upx;
				border-bottom: 1px solid #E1E3E9;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.tf-close {
					width: 28upx;
					height: 28upx;
					background-image: url(img/tf-close.png);
					background-size: 100% 100%;
				}
			}

			.tf-Box-center {
				margin: 30upx auto;
				border-radius: 6upx;
			}

			.tf-Box-BtnBox {
				margin: 30upx auto;
				width: 580upx;
				height: 75upx;
				line-height: 75upx;
				text-align: center;
				font-size: 28upx;
				border-radius: 6upx;
				border: 1px solid #E1E3E9;
				background-color: #F7F8F9;
				overflow: hidden;
				position: relative;

				.tf-Box-BtnBox-text {
					width: 100%;
					height: 75upx;
					position: absolute;
					top: 0;
					left: 0;
					color: #424649;
					text-align: center;
				}

				.tf-Box-BtnNei {
					height: 75upx;
					width: 75upx;
					background-color: #fff;
					box-shadow: 0 0 10upx 0upx rgba(0, 0, 0, .2);
					background-image: url(img/tf-arrows.png);
					background-size: 34upx;
					background-position: center;
					background-repeat: no-repeat;

					.tf-Box-BtnNei-leftBox {
						position: absolute;
						top: 0;
						left: -580upx;
						width: 580upx;
						height: 100%;
					}
				}
			}
		}
	}
</style>
