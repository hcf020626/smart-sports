//引入Vue核心库
import Vue from 'vue'
//引入Vuex
import Vuex from 'vuex'
//应用Vuex插件
Vue.use(Vuex)

import accountModule from './accountModule.js'
import studentModule from './studentModule.js'

const actions = {
	//context是一个mini的store对象，因为它能拿到state这个对象，所以它也能干mutations的活。
	setTheLatestData(context, value){
		context.commit('SET_THE_LATEST_DATA', value)
	}
}

const mutations = {
	SET_THE_LATEST_DATA(state, value){
	}
}


//创建 store 对象
const store =  new Vuex.Store({
	modules: {
		accountModule,
		studentModule
	},
	actions,
	mutations
})

export default store;