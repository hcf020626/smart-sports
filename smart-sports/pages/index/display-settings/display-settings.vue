<template>
	<view>
		<!-- <view class="cell-group" >
			
		</view> -->
		
		<u-collapse :accordion="true" :border="false" :value="defaultOpenItem">
			<u-collapse-item v-for="(swiperCard,swiperCardIndex) in swiperCards" :key="swiperCardIndex" :title="swiperCard.label" :name="swiperCardIndex">
				<u-cell-group >
					<u-cell v-for="(icon, iconIndex) in swiperCard.icons" :key="iconIndex" :title="icon.title">
						<uni-icons slot="icon" customPrefix="iconfont" :type="icon.iconName" :color="icon.iconColor" size="20"></uni-icons>
						<u-switch slot="right-icon" v-model="icon.show" @change="switchChange"></u-switch>
					</u-cell>
				</u-cell-group>
			</u-collapse-item>
		</u-collapse>
	</view>
</template>

<script>
	import {
		mapState,
		mapActions,
	} from 'vuex'
	export default {
		data() {
			return {
				defaultOpenItem: -1
			}
		},
		methods: {
			switchChange(icon){
				uni.setStorageSync('swiperCards', JSON.stringify(this.swiperCards));
			}
		},
		computed: {
			...mapState('parentModule', ['swiperCards']),
		},
		onLoad(option) {
			this.defaultOpenItem = option.item;
		}
	}
</script>

<style scoped>
	.container {
		width: 100vw;
		height: 100vh;
		background-color: red;
	}
</style>
