import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
//导入全局样式表
import './assets/css/global.css'


//配置axios
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8090/'
axios.interceptors.request.use(config => {
  //请求头对象，添加 Authorization 字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios //全局挂载axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
