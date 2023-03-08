import App from './App'


// #ifndef VUE3
import Vue from 'vue'

// 引入 uView 主 JS 库
import uView from "uview-ui";
Vue.use(uView);

// 引入 store 对象
import store from "store/index.js"

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	// 把 store 对象提供给 “store” 选项，这可以把 store 的实例注入所有的子组件
	store,
    ...App
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