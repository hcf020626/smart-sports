<template>
	<view class="container">
		<!-- 消息提示组件，用于提示用户在绑定时碰到的问题 -->
		<u-toast ref="uToast"></u-toast>

		<!-- 弹窗组件，用于显示“确定要换绑吗？” -->
		<u-modal :show="modalInfo.show" :content="modalInfo.content" @confirm="changeBonding" :showCancelButton="true"
			@cancel="modalInfo.show=false" :asyncClose="true"></u-modal>
		<view class="cell-group" v-if="parentInfo.idcard && cellItems.length">
			<!-- 单元格分组 -->
			<u-cell-group :border="false">
				<!-- 单元格，使用 v-for 循环渲染 cellItems 数组中的元素 -->
				<u-cell v-for="(item, index) in cellItems" :key="index"
					:label="item.studentInfo.gender + ' ' + item.studentInfo.age + '岁 ' + item.studentInfo.school + ' ' + item.studentInfo.class"
					:title="item.studentInfo.name" :border="false">
					<!-- 单元格左侧图标，使用 u-avatar 组件显示学生头像 -->
					<u-avatar slot="icon" :src="item.studentInfo.avatar_url"></u-avatar>
					<!-- 单元格右侧图标，使用 u-switch 组件实现单选按钮效果 -->
					<u-switch slot="right-icon" v-model="item.checked" asyncChange
						@change="showModal(item.studentInfo.id)"></u-switch>
				</u-cell>
			</u-cell-group>
		</view>

		<view class="errMsg" v-else-if="parentInfo.idcard && cellItems.length === 0" >
			<u-empty icon="../../../static/images/list.png" :text="errMsg.msg" :show="errMsg.show">
			</u-empty>
		</view>

		<view class="errMsg" v-else>
			<view>您尚未填写身份信息，请填写并保存成功后再操作！<navigator url="../edit-profile/edit-profile" open-type="navigate"
					class="link">填写身份信息</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		baseURL
	} from '@/config.js'
	import {
		mapState,
		mapGetters,
		mapActions
	} from 'vuex'
	import api from '@/api/index.js'
	export default {
		data() {
			return {
				// 弹窗组件的相关数据
				modalInfo: {
					content: '确定要修改吗？',
					show: false,
					data: {}
				},
				// 学生信息列表
				cellItems: [],
				errMsg: {
					msg: '',
					show: false
				}
			}
		},
		computed: {
			// 获取用户信息
			...mapState('parentModule', ['parentInfo', 'token']),
		},
		methods: {
			...mapActions('parentModule', ['updateParentInfo']),
			...mapActions('studentModule', ['updateStudentInfo', 'clearStudentInfo']),
			// 在showModal方法中，我们将modalInfo.show属性设置为true，表示弹出模态框，同时将被点击的学生信息对象的id属性赋值给modalInfo.data.id属性。
			showModal(id) {
				this.modalInfo.show = true;
				this.modalInfo.data.id = id;
			},
			// 点击提示框的确定按钮时执行的方法
			changeBonding() {
				// 首先从modalInfo.data.id属性中获取到被点击的学生的id
				const id = this.modalInfo.data.id;

				setTimeout(async () => {
					
					let isRemove = false;
					// 有两种操作：移除绑定和更换绑定，需要先遍历一下单元格，判断当前是要执行的是哪种操作
					this.cellItems.forEach((item) => {
						// 如果当前元素是被点击的元素，且已经被选中了，则将isRemove标记为true，表明要执行移除绑定操作
						if (item.studentInfo.id === id && item.checked) {
							isRemove = true;
						}
					})

					// 如果isRemove为true，则发送的id为null，否则，为被点击的学生的id
					const {
						data: {
							status,
							msg
						}
					} = await api.parent.changeBonding({
						email: this.parentInfo.email,
						id: isRemove ? null : id
					});
					
					if (!status) {
						// 更新vuex和本地存储中的用户绑定信息
						this.updateParentInfo({cur_bonding_id: isRemove ? '' : id});
						
						// 更新单元格右边开关的状态
						if(isRemove){	// 如果isRemove为true，表明要执行移除绑定的操作
							this.cellItems.forEach((item)=>{
								// 如果当前元素是被点击的元素，且已经被选中了，则将其checked修改为false
								if(item.studentInfo.id === id && item.checked){
									item.checked = !item.checked;
									// 移除vuex和本地存储中的学生信息
									this.clearStudentInfo();
								}
							})
						}else{	// 否则，执行更换绑定的操作
							this.cellItems.forEach((item) => {
								if (item.studentInfo.id === id && !item.checked) {
									// 如果当前元素是被点击的元素，且还没有被被选中了，则将其checked修改为true;
									item.checked = true
									// 更新vuex和本地中的数据
									this.updateStudentInfo({
										avatar_url: item.studentInfo.avatar_url,
										name: item.studentInfo.name,
										gender: item.studentInfo.gender,
										age: item.studentInfo.age,
										school: item.studentInfo.school,
										className: item.studentInfo.class,
										id: item.studentInfo.id
									})
								} else if (item.checked) {
									// 如果当前元素不是被点击的元素，且checked为true，则将其checked修改为false
									item.checked = false;
								}
							});
						}
					}

					// 关闭模态框
					this.modalInfo.show = false;
					// 弹出提示框
					this.$refs.uToast.show({
						type: status?'error':'success',
						message: msg,
						icon: 'https://cdn.uviewui.com/uview/demo/toast/success.png',
						position: 'top',
					})
				}, 500)
			},
		},
		mounted() {
			uni.showLoading({
				title: '加载中'
			});

			setTimeout(async () => {
				try{
					// 首先通过用户身份证号获取到该用户所关联的所有学生信息
					const idcard = this.parentInfo.idcard
					const {
						data: {
							status,
							msg,
							students
						}
					} = await api.student.getStudentsByIdcard(idcard);
					if (!status) {
						students.forEach((item) => {
							item.avatar_url = baseURL + item.avatar_url;
							//将学生信息对象和一个表示该学生是否被选中的布尔值（这里我们用checked表示）封装成一个对象，并将该对象推入到cellItems数组中。
							this.cellItems.push({
								studentInfo: item,
								checked: this.parentInfo.cur_bonding_id === item.id
							});
						})
					} else {
						this.errMsg.msg = msg;
						this.errMsg.show = true;
					}
				}catch(e){
					//TODO handle the exception
					console.log("e: ",e);
					this.$refs.uToast.show({
						type: 'error',
						message: '请求发生问题，请稍后再试',
						icon: 'https://cdn.uviewui.com/uview/demo/toast/error.png',
						position: 'top'
					})
				}finally{
					uni.hideLoading();
				}
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

	.errMsg {
		width: 90%;
		margin: 0 auto;
		padding-top: 200rpx;
		text-align: center;
		line-height: 50rpx;
		color: #82848a;
	}

	.errMsg .link {
		color: #2979ff;
		text-decoration: underline;
		display: inline;
	}
</style>
