<template>
  <el-container class="home-container">
    <!-- 头部区域开始 -->
    <el-header>
      <div>
        <span>教学评论材料管理系统-管理员端</span>
      </div>
      <el-dropdown>
        <span class="el-dropdown-link">
          你好：{{adminName}}
          <i class="el-icon-arrow-down el-icon--right"/>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-user" @click.native="updateDialogVisible = true">修改密码</el-dropdown-item>
          <el-dropdown-item icon="el-icon-switch-button" @click.native="logout">退出系统</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
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
              <i :class="item.icon"></i>
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

        <!-- 修改密码对话框 -->
        <el-dialog
                title="修改密码"
                :visible.sync="updateDialogVisible"
                width="40%"
                @close="upadteDialogClosed"
        >
          <!-- 主体部分 -->
          <el-input placeholder="请输入新密码" v-model="admin.password" show-password/>

          <!-- 底部 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="updateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="updatePassword">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 修改密码结束 -->
      </el-main>
    </el-container>
    <!-- 主体结束 -->
  </el-container>
</template>

<script>
  export default {
    data() {
      return {
        superAdminMenuList: [
          {
            id: 1,
            authName: "用户管理",
            icon: "el-icon-s-custom",
            path: "users",
            children: [
              {
                id: 2,
                authName: "学生管理",
                path: "student",
                children: []
              },
              {
                id: 3,
                authName: "教师管理",
                path: "teacher",
                children: []
              },
              {
                id: 4,
                authName: "管理员管理",
                path: "admin",
                children: []
              }
            ]
          },
          {
            id: 5,
            authName: "教务管理",
            icon: "el-icon-s-management",
            path: "affairs",
            children: [
              {
                id: 6,
                authName: "学院管理",
                path: "coolege",
                children: []
              },
              {
                id: 7,
                authName: "班级管理",
                path: "classes",
                children: []
              },
              {
                id: 8,
                authName: "课程管理",
                path: "course",
                children: []
              },
              {
                id: 9,
                authName: "教学材料管理",
                path: "materials",
                children: []
              }
            ]
          },
          {
            id: 10,
            authName: "教学评论管理",
            icon: "el-icon-s-comment",
            path: "review",
            children: [
              {
                id: 11,
                authName: "课堂评论",
                path: "creview",
                children: []
              },
              {
                id: 12,
                authName: "教师评论",
                path: "treview",
                children: []
              },
              {
                id: 13,
                authName: "教学材料评论",
                path: "mreview",
                children: []
              }
            ]
          },
          {
            id: 14,
            authName: "系统设置",
            icon: "el-icon-s-grid",
            path: "system",
            children: [
              {
                id: 15,
                authName: "角色列表",
                path: "role",
                children: []
              },
              {
                id: 16,
                authName: "权限列表",
                path: "permission",
                children: []
              },
              {
                id: 17,
                authName: "系统日志",
                path: "log",
                children: []
              }
            ]
          }
        ],
        adminMenuList: [
          {
            id: 1,
            authName: "用户管理",
            icon: "el-icon-s-custom",
            path: "users",
            children: [
              {
                id: 2,
                authName: "学生管理",
                path: "student",
                children: []
              },
              {
                id: 3,
                authName: "教师管理",
                path: "teacher",
                children: []
              }
            ]
          },
          {
            id: 4,
            authName: "教务管理",
            icon: "el-icon-s-management",
            path: "affairs",
            children: [
              {
                id: 5,
                authName: "学院管理",
                path: "coolege",
                children: []
              },
              {
                id: 6,
                authName: "班级管理",
                path: "classes",
                children: []
              },
              {
                id: 7,
                authName: "课程管理",
                path: "course",
                children: []
              },
              {
                id: 8,
                authName: "教学材料管理",
                path: "materials",
                children: []
              }
            ]
          },
          {
            id: 9,
            authName: "教学评论管理",
            icon: "el-icon-s-comment",
            path: "review",
            children: [
              {
                id: 10,
                authName: "课堂评论",
                path: "creview",
                children: []
              },
              {
                id: 11,
                authName: "教师评论",
                path: "treview",
                children: []
              },
              {
                id: 12,
                authName: "教学材料评论",
                path: "mreview",
                children: []
              }
            ]
          }
        ],

        //修改密码对话框的 显示与隐藏
        updateDialogVisible: false,

        //修改密码参数
        admin: {
          id: "",
          password: ""
        },

        menulist: [], //菜单列表
        adminName: "",

        isCollapse: false, //是否折叠
        activePath: "" //链接高亮 激活状态
      };
    },
    created() {
      this.loadMenuListAndAdminName();
      this.activePath = window.sessionStorage.getItem("activePath");
    },
    methods: {
      //根据角色加载菜单列表
      loadMenuListAndAdminName() {
        const role = window.sessionStorage.getItem("role");
        if (role == 1) {
          this.menulist = this.superAdminMenuList;
        } else if (role == 4) {
          this.menulist = this.adminMenuList;
        }
        const name = window.sessionStorage.getItem("name");
        this.adminName = name;

        this.admin.id = this.$store.state.user.id;
      },

      //退出方法
      logout() {
        window.sessionStorage.clear();
        this.$router.push("/login");
      },

      //学生注册对话框关闭事件
      upadteDialogClosed() {
        //对话框关闭时，表单重置
        this.newPassword = "";
      },

      //修改密码
      async updatePassword() {
        //console.log(this.newPassword)
        const {data: res} = await this.$http.put("admin", this.admin);
        console.log(res);
      },

      //菜单伸缩按钮
      toggleCollapse() {
        this.isCollapse = !this.isCollapse;
      },
      //保存链接的激活状态
      saveNavState(activePath) {
        window.sessionStorage.setItem("activePath", activePath);
        this.activePath = activePath;
      }
    }
  };
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }

  .el-header {
    background-color: #333744;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
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

  .el-dropdown-link {
    cursor: pointer;
    color: #fff;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>