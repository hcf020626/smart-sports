<template>
	<view>
		<web-view :src="page_url"></web-view>
	</view>
</template>



<script>
	import {baseURL} from 'config.js'
	export default {
		data() {
			return {
				page_url: baseURL + '/account/privacy-policy.html'
			}
		},
		methods: {
			
		},
	}
</script>

<style>

</style>
