//引入Vue核心库
import Vue from 'vue'
//引入Vuex
import Vuex from 'vuex'
//应用Vuex插件
Vue.use(Vuex)

import parentModule from './parentModule.js'
import studentModule from './studentModule.js'

//创建 store 对象
const store =  new Vuex.Store({
	modules: {
		parentModule,
		studentModule
	}
})

export default store;