import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login/Login.vue'
import Home from '../components/Admin/Home.vue'
import Welcome from '../components/Welcome.vue'
import Student from "../components/Admin/Student";

Vue.use(VueRouter);

const routes = [
  {path: '/', redirect: '/login'},
  {path: '/login', component: Login},
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {path: '/welcome', component: Welcome},
      {path: '/student', component: Student},
    ]
  }
];

const router = new VueRouter({
  routes
});

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to --> 将要访问的路径
  //from --> 代表从哪个路径跳转而来
  //next --> 是一个函数,表示放行; next() --> 放行, next('/login') --> 强制跳转 

  if (to.path === '/login') return next(); //如果路径是login 放行

  const tokenStr = window.sessionStorage.getItem('token'); //拿到token
  if (!tokenStr) return next('/login'); //如果没有token,强制去login
  next() //有token 放行
});

export default router
