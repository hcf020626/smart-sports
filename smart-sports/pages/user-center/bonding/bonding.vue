<template>
	<view class="container">
		<u-modal :show="modalInfo.show" :content="modalInfo.content" @confirm="changeBonding" :showCancelButton="true"
			@cancel="modalInfo.show=false"></u-modal>
		<view class="cell-group">
			<u-cell-group :border="false">
				<u-cell v-for="(item, index) in cellItems" :key="index"
					:label="item.studentInfo.studentGender + ' ' + item.studentInfo.studentAge + '岁 ' + item.studentInfo.studentSchool + ' ' + item.studentInfo.studentClass"
					:title="item.studentInfo.studentName" :border="false">
					<u-avatar slot="icon" :src="item.studentInfo.imgSrc"></u-avatar>
					<u-switch slot="right-icon" v-model="item.checked" asyncChange  @change="showModal(item.studentInfo.studentID)"></u-switch>
				</u-cell>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	import {
		baseURL
	} from '@/config.js'
	import {mapState} from 'vuex'
	
	export default {
		data() {
			return {
				modalInfo: {
					content: '确定要换绑吗？',
					show: false,
					data: {}
				},
				cellItems: [{
					studentInfo: {
						imgSrc: baseURL + '/student/avatars/' + (Math.floor(Math.random() * 18) + 1) + '.png',
						studentName: '张小蛋',
						studentGender: '男',
						studentAge: '15',
						studentSchool: '衡阳市第一中学',
						studentClass: '高一二班',
						studentID: '20190440614'
					},
					checked: false
				}, {
					studentInfo: {
						imgSrc: baseURL + '/student/avatars/' + (Math.floor(Math.random() * 18) + 1) + '.png',
						studentName: '张小花',
						studentGender: '女',
						studentAge: '15',
						studentSchool: '衡阳市第一中学',
						studentClass: '高一二班',
						studentID: '20190440613'
					},
					checked: false
				}]
			}
		},
		computed: {
			...mapState('accountModule', ['userInfo']),
		},
		methods: {
			showModal(id) {
				this.modalInfo.show = true;
				this.modalInfo.data.id = id;
			},
			changeBonding() {
				const id = this.modalInfo.data.id;
				this.cellItems.forEach((item) => {
					// 如果当前元素是被点击的元素，则将其checked修改为true
					if(item.studentInfo.studentID === id){
						item.checked = true;
					}else if(item.checked){
						// 如果当前元素不是被点击的元素，且checked为true，则将其checked修改为false
						item.checked = false;
					}
				});
				
				this.modalInfo.show = false;
			},
			initCellItems(){
				const idcard = this.userInfo.idcard
				
			},
		},
		created() {
			this.initCellItems();
		}
	}
</script>

<style scoped>
	.container {
		width: 100vw;
		height: 100vh;
		background-color: whitesmoke;
	}

	.cell-group {
		width: 95vw;
		margin: 30rpx auto;
		border-radius: 20rpx;
		background-color: white;
	}
</style>
