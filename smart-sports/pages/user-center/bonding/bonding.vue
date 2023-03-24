<template>
	<view class="container">
		<!-- 消息提示组件，用于提示用户在绑定时碰到的问题 -->
		<u-toast ref="uToast"></u-toast>
		
		<!-- 弹窗组件，用于显示“确定要换绑吗？” -->
		<u-modal :show="modalInfo.show" :content="modalInfo.content" @confirm="changeBonding" :showCancelButton="true"
			@cancel="modalInfo.show=false" :asyncClose="true"></u-modal>
			
		<view class="cell-group">
			 <!-- 单元格分组 -->
			<u-cell-group :border="false">
				<!-- 单元格，使用 v-for 循环渲染 cellItems 数组中的元素 -->
				<u-cell v-for="(item, index) in cellItems" :key="index"
					:label="item.studentInfo.gender + ' ' + item.studentInfo.age + '岁 ' + item.studentInfo.school + ' ' + item.studentInfo.class"
					:title="item.studentInfo.name" :border="false">
					<!-- 单元格左侧图标，使用 u-avatar 组件显示学生头像 -->
					<u-avatar slot="icon" :src="item.studentInfo.imgSrc"></u-avatar>
					<!-- 单元格右侧图标，使用 u-switch 组件实现单选按钮效果 -->
					<u-switch slot="right-icon" v-model="item.checked" asyncChange  @change="showModal(item.studentInfo.id)"></u-switch>
				</u-cell>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	import {
		baseURL
	} from '@/config.js'
	import {mapState, mapActions} from 'vuex'
	import api from '@/api/index.js'
	export default {
		data() {
			return {
				 // 弹窗组件的相关数据
				modalInfo: {
					content: '确定要换绑吗？',
					show: false,
					data: {}
				},
				// 学生信息列表
				cellItems: [],
				skeletonLoading: true
			}
		},
		computed: {
			// 获取用户信息
			...mapState('accountModule', ['userInfo']),
		},
		methods: {
			...mapActions('accountModule', ['updateBonding']),
			...mapActions('studentModule', ['updateStudent']),
			// 在showModal方法中，我们将modalInfo.show属性设置为true，表示弹出模态框，同时将被点击的学生信息对象的id属性赋值给modalInfo.data.id属性。
			showModal(id) {
				this.modalInfo.show = true;
				this.modalInfo.data.id = id;
			},
			// 点击提示框的确定按钮时执行的方法
			changeBonding() {
				// 首先从modalInfo.data.id属性中获取到被点击的学生的id
				const id = this.modalInfo.data.id;
	
				// 最后，我们将modalInfo.show属性设置为false，表示隐藏模态框。
				setTimeout( async ()=>{
					let isItself = false;
					this.cellItems.forEach((item)=>{
						// 如果当前元素是被点击的元素，且已经被选中了，则不要发送网络请求
						if(item.studentInfo.id === id && item.checked){
							isItself = true;
						}
					})
					
					if(isItself){
						// 关闭模态框
						this.modalInfo.show = false;
						// 弹出提示框
						return this.$refs.uToast.show({
							type: 'success',
							message: '绑定成功',
							icon: 'https://cdn.uviewui.com/uview/demo/toast/success.png',
							position: 'top',
						})
					}
					
					const {data: {status, msg}} = await api.account.changeBonding({email: this.userInfo.email, id});
					let toastType = '';
					if(!status){
						// 更新vuex和本地中的数据
						this.updateBonding(id);
						// 更新单元格右边开关的状态
						this.cellItems.forEach((item) => {
							// 如果当前元素是被点击的元素，且还没有被被选中了，则将其checked修改为true;
							if(item.studentInfo.id === id && !item.checked){
								item.checked = true
								// 更新vuex和本地中的数据
								this.updateStudent({
									imgSrc: item.studentInfo.imgSrc,
									name: item.studentInfo.name,
									gender: item.studentInfo.gender, 
									age: item.studentInfo.age,
									school: item.studentInfo.school,
									className: item.studentInfo.class,
									id: item.studentInfo.id
								})
							}else if(item.checked){
								// 如果当前元素不是被点击的元素，且checked为true，则将其checked修改为false
								item.checked = false;
							}
						});
						
						toastType = 'success';
					}else{
						toastType = 'error'
					}
					
					// 关闭模态框
					this.modalInfo.show = false;
					// 弹出提示框
					this.$refs.uToast.show({
						type: toastType,
						message: msg,
						icon: 'https://cdn.uviewui.com/uview/demo/toast/success.png',
						position: 'top',
					})
				}, 500)
			},
		},
		 mounted(){
			uni.showLoading({
				title: '加载中'
			});
			
			setTimeout(async()=>{
				 // 首先通过用户身份证号获取到该用户所关联的所有学生信息
				 const idcard = this.userInfo.idcard
				 const {data: {status, msg, data}} = await api.student.getStudentsByIdcard(idcard);
				 data.forEach((item)=>{
				 	//对于每个学生信息，我们需要根据其性别来生成对应的头像
				 	const fullSrc = baseURL + '/student/avatars/' + (item.gender === '女' ? (Math.floor(Math.random() * 10) + 1) : (Math.floor(Math.random() * 8) + 11)) + '.png';
				 	// 为每个学生信息对象添加一个 imgSrc 属性，用于显示学生头像，其值为随机生成的头像的url
				 	this.$set(item, 'imgSrc', fullSrc);
				 	//将处理后的学生信息对象以及一个表示该学生是否被选中的布尔值（这里我们用checked表示）封装成一个对象，并将该对象推入到cellItems数组中。
				 	this.cellItems.push({studentInfo: item, checked: this.userInfo.cur_bonding_id === item.id});
					uni.hideLoading();
				 })
			 }, 500)
			
			
		},
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
