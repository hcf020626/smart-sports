//引入Vue核心库
import Vue from 'vue'
//引入Vuex
import Vuex from 'vuex'
//应用Vuex插件
Vue.use(Vuex)

import accountModule from './accountModule.js'

//创建 store 对象
const store =  new Vuex.Store({
	modules: {
		accountModule
	}
})

export default store;