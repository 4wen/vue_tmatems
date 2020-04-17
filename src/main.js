import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
//导入全局样式表
import './assets/css/global.css'
//导入elementUI的Loading,Message
import { Message,Loading } from 'element-ui'


let loading;

function startLoading() {
  loading = Loading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}

function endLoading() {

  setTimeout(() => {
    loading.close();
  }, 1000);

}

//配置axios
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8090/'
//请求拦截，带上token去请求后台接口
axios.interceptors.request.use(config => {
  
  if (!config.url.includes("/registered/")
    && !config.url.includes("/loadAllCollege")
    && !config.url.includes("/loadAllClasses/")) {
      //注册时候不要Loading,个人不喜欢
      startLoading();
  }
  
  //请求头对象，添加 Authorization 字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
//响应拦截
axios.interceptors.response.use(response => {

  if (!response.config.url.includes("/registered/")
    && !response.config.url.includes("/loadAllCollege")
    && !response.config.url.includes("/loadAllClasses/")) {
      endLoading();
  }
  //返回码为 401 token无效或者过期 重新登录
  if (response.data.code == 401) {
    Message.error("token过期，请重新登录");
    router.push('login')
  }

  return response
})

Vue.prototype.$http = axios //全局挂载axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
