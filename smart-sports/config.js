// export const baseURL = 'http://172.27.24.16:3000'
// export const baseWSURL = 'wss://172.27.24.16:3000'

export const baseURL = 'http://192.168.55.83:3000'
export const baseWSURL = 'ws://192.168.55.83:3000'

export const defaultSwiperCards = [{
		label: '身体指标',
		icons: [{
			show: true,
			iconName: 'icon-height',
			iconColor: '#2b85e4 ',
			title: '身高',
			pagePath: '/pages/index/body-metrics/height/height'
		}, {
			show: true,
			iconName: 'icon-weight',
			iconColor: '#18b566',
			title: '体重',
			pagePath: '/pages/index/body-metrics/weight/weight'
		}, {
			show: true,
			iconName: 'icon-vision',
			iconColor: '#606266',
			title: '视力',
			pagePath: '/pages/index/body-metrics/vision/vision'
		}, {
			show: true,
			iconName: 'icon-blood-pressure',
			iconColor: '#FF0000',
			title: '血压',
			pagePath: '/pages/index/body-metrics/blood-pressure/blood-pressure'
		}, {
			show: true,
			iconName: 'icon-lung-capacity',
			iconColor: '#00FF00',
			title: '肺活量',
			pagePath: '/pages/index/body-metrics/lung-capacity/lung-capacity'
		}]
	}, {
		label: '体能和耐力',
		icons: [{
			show: true,
			iconName: 'icon-push-ups',
			iconColor: '#0000FF',
			title: '俯卧撑',
			pagePath: '/pages/index/strength-and-stamina/push-ups/push-ups'
		}, {
			show: true,
			iconName: 'icon-sit-ups',
			iconColor: 'black',
			title: '仰卧起坐',
			pagePath: '/pages/index/strength-and-stamina/sit-ups/sit-ups'
		}, {
			show: true,
			iconName: 'icon-pull-ups',
			iconColor: '#18b566',
			title: '引体向上',
			pagePath: '/pages/index/strength-and-stamina/pull-ups/pull-ups'
		}, {
			show: true,
			iconName: 'icon-running',
			iconColor: 'purple',
			title: '跑步',
			pagePath: '/pages/index/strength-and-stamina/running/running'
		}, {
			show: true,
			iconName: 'icon-swimming',
			iconColor: '#606266',
			title: '游泳',
			pagePath: '/pages/index/strength-and-stamina/swimming/swimming'
		}]
	}, {
		label: '爆发力',
		icons: [{
			show: true,
			iconName: 'icon-long-jump',
			iconColor: 'blue',
			title: '立定跳远',
			pagePath: '/pages/index/explosiveness/long-jump/long-jump'
		}, {
			show: true,
			iconName: 'icon-solid-ball',
			iconColor: 'purple',
			title: '实心球',
			pagePath: '/pages/index/explosiveness/solid-ball/solid-ball'
		}]
	}, {
		label: '协调力',
		icons: [{
			show: true,
			iconName: 'icon-rope-skipping',
			iconColor: '#000',
			title: '跳绳',
			pagePath: '/pages/index/coordination/rope-skipping/rope-skipping'
		}]
	}, {
		label: '柔韧性',
		icons: [{
			show: true,
			iconName: 'icon-sit-and-reaches',
			iconColor: 'green',
			title: '坐位体前屈',
			pagePath: '/pages/index/flexibility/sit-and-reaches/sit-and-reaches'
		}]
	}, ]