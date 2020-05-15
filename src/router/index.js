import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login/Login.vue'
import Home from '../components/Admin/Home.vue'
import Welcome from '../components/Welcome.vue'
import Student from "../components/Admin/Student";
import Teacher from "../components/Admin/Teacher";
import Admin from "../components/Admin/Admin";
import College from "../components/Admin/College";
import Classes from "../components/Admin/Classes";
import Role from "../components/Admin/Role";
import Permission from "../components/Admin/Permission";
import Course from "../components/Admin/Course";
import Shome from "../components/Student/Shome";
import AllCourse from "../components/Student/AllCourse";
import MineCourse from "../components/Student/MineCourse";
import Creview from "../components/Student/Creview";
import Thome from "../components/Teacher/Thome";
import Tcourse from "../components/Teacher/Tcourse";
import Materials from "../components/Teacher/Materials";
import Amaterials from "../components/Admin/Amaterials";
import Smaterials from "../components/Student/Smaterials";

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
      {path: '/teacher', component: Teacher},
      {path: '/admin', component: Admin},
      {path: '/college', component: College},
      {path: '/classes', component: Classes},
      {path: '/role', component: Role},
      {path: '/permission', component: Permission},
      {path: '/course', component: Course},
      {path: '/amaterials', component: Amaterials},
    ]
  },
  {
    path: '/shome',
    component: Shome,
    redirect: "/minecourse",
    children: [
      {path: '/minecourse', component: MineCourse},
      {path: '/allcourse', component: AllCourse},
      {path: '/creview', component: Creview},
      {path: '/smaterials', component: Smaterials},
    ]
  },
  {
    path: '/thome',
    component: Thome,
    redirect: "/tcourse",
    children: [
      {path: '/tcourse', component: Tcourse},
      {path: '/materials', component: Materials},
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
