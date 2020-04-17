<template>
  <el-container class="home-container">
    <!-- 头部区域开始 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" height="60px" width="60px" />
        <span>教学评论材料管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 头部结束 -->

    <!-- 主体开始 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 菜单伸缩按钮 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>

        <!-- 侧边栏菜单 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单的模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <!-- 图标 -->
              <i class="el-icon-location"></i>
              <!-- 文本 -->
              <span>{{subItem.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 右边栏 -->
      <el-main>
        <!-- 这里有一个孤独的路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
    <!-- 主体结束 -->
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist: [], //菜单列表
      iconsObj: { //菜单icon数组
        
      },
      isCollapse: false, //是否折叠
      activePath: '' //链接高亮 激活状态
    };
  },
  created() {
    this.activePath = window.sessionStorage.getItem("activePath")
  },
  methods: {
    //退出方法
    logout() {
      
    },
   
    //菜单伸缩按钮
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    //保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath = activePath
    }
  }
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #cff1ef;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #1eb2a6;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #9b8064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
}
</style>