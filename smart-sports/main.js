import App from './App'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false

// 引入并使用uView的JS库，注意这两行要放在import Vue之后。
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)

// 引入 store 对象
import store from "store/index.js"

App.mpType = 'app'
const app = new Vue({
    ...App,
	// 把 store 对象提供给 “store” 选项，这可以把 store 的实例注入所有的子组件
	store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif