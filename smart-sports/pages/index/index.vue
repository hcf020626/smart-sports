<template>
	<view class="container">
		<view class="card">
			<view class="avatar">
				<u-avatar :src="cardInfo.imgSrc" size="60"></u-avatar>
			</view>
			<view class="studentInfo">
				<view>姓名：{{cardInfo.studentName}}</view>
				<view>性别：{{cardInfo.studentGender}}</view>
				<view>年龄：{{cardInfo.studentAge}}</view>
				<view>学校：{{cardInfo.studentSchool}}</view>
				<view>班级：{{cardInfo.studentClass}}</view>
			</view>
		</view>
		<view>
			<!-- 智慧体育平台家长模块需要展示孩子的运动数据和健康数据，例如步数、心率、血压等，帮助家长更好地了解孩子的身体状况和运动情况 -->
			<u-grid :border="false" col="4">
				<u-grid-item v-for="(listItem,listIndex) in list" :key="listIndex">
					<u-icon :customStyle="{paddingTop:20+'rpx'}" :name="listItem.name" :size="22"></u-icon>
					<text class="grid-text">{{listItem.title}}</text>
				</u-grid-item>
			</u-grid>
			<u-toast ref="uToast" />
		</view>
	</view>
</template>

<script>
	import {baseURL} from '@/config.js'
	export default {
		data() {
			return {
				cardInfo: {
					imgSrc: baseURL + '/student/avatars/' + (Math.floor(Math.random() * 18) + 1) + '.png',
					studentName: '张小蛋',
					studentGender: '男',
					studentAge: 15,
					studentSchool: '衡阳市第一中学',
					studentClass: '高一二班'
				},
				list: [{
						name: 'photo',
						title: '资料'
					},
					{
						name: 'lock',
						title: '运动'
					},
					{
						name: 'star',
						title: '健康'
					},
					{
						name: 'hourglass',
						title: '荣誉'
					},
					{
						name: 'home',
						title: '训练'
					},
					{
						name: 'star',
						title: '比拼'
					},
				],
			}
		},
		methods: {
			click(name) {
				this.$refs.uToast.success(`点击了第${name}个`)
			}
		},
		mounted(){
			console.log("this.cardInfo.imgSrc: ",this.cardInfo.imgSrc);
		}
	}
</script>


<style scoped>
	.container {
		width: 100vw;
		height: 100vh;
		background-color: whitesmoke;
		background-image: url('@/static/bg.png');
		background-repeat: no-repeat;
		background-size: 100%;
		background-position: center;
	}
	.card {
		width: 94vw;
		height: 300rpx;
		background-color: mediumslateblue;
		margin: 0 auto;
		border-radius: 15rpx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		font-size: 0.8rem;
		color: whitesmoke;
	}
	
	.card .avatar {
		margin-left: 30rpx;
		margin-right: 20rpx;
	}
</style>
