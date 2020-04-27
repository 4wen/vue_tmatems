<template>
  <el-container class="home-container">
    <!-- 头部区域开始 -->
    <el-header>
      <div>
        <span>教学评估材料管理系统-学生端</span>
      </div>
      <el-dropdown>
        <span class="el-dropdown-link">
          你好：{{name}}
          <i class="el-icon-arrow-down el-icon--right"/>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-edit" @click.native="updateDialogVisible = true">修改密码</el-dropdown-item>
          <el-dropdown-item icon="el-icon-user" @click.native="openDrawer">个人信息</el-dropdown-item>
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
          <el-menu-item v-for="item in menulist"
                        :index="'/' + item.path"
                        :key="item.id"
                        @click="saveNavState('/' + item.path)">

            <!-- 图标 -->
            <i :class="item.icon"/>
            <!-- 文本 -->
            <span slot="title">{{item.authName}}</span>

          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 右边栏 -->
      <el-main>
        <!-- 这里有一个孤独的路由占位符 -->
        <router-view/>

        <!-- 修改密码对话框 -->
        <el-dialog
                title="修改密码"
                :visible.sync="updateDialogVisible"
                width="40%"
                @close="updateDialogClosed"
        >
          <el-form
                  :model="updateForm"
                  status-icon
                  :rules="updatePwdRules"
                  ref="updatePwdRef"
                  label-width="70px"
          >
            <!-- 主体部分 -->
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="updateForm.password" clearable/>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
              <el-input type="password" v-model="updateForm.checkPass" auto-complete="off" clearable/>
            </el-form-item>

          </el-form>

          <!-- 底部 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="updateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="updatePassword">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 修改密码结束 -->

        <!--查看个人信息抽屉-->
        <el-drawer
                title="查看个人信息"
                :visible.sync="showDrawer"
                direction="rtl"
                custom-class="demo-drawer"
                ref="drawer"
        >
          <div class="demo-drawer__content">
            <el-form :model="DrawerForm">
              <el-form-item label="姓名:" :label-width="formLabelWidth">
                <span>{{DrawerForm.name}}</span>
              </el-form-item>
              <el-form-item label="用户名:" :label-width="formLabelWidth">
                <span>{{DrawerForm.username}}</span>
              </el-form-item>
              <el-form-item label="性别:" :label-width="formLabelWidth">
                <span>{{DrawerForm.sex ===1 ? '男':'女'}}</span>
              </el-form-item>
              <el-form-item label="学院:" :label-width="formLabelWidth">
                <span>{{DrawerForm.collegeName}}</span>
              </el-form-item>
              <el-form-item label="班级:" :label-width="formLabelWidth">
                <span>{{DrawerForm.classesName}}</span>
              </el-form-item>
            </el-form>
            <div class="demo-drawer__footer">
              <el-button @click="showDrawer = false">取 消</el-button>
              <el-button type="primary"
                         @click="$refs.drawer.closeDrawer()">确 定
              </el-button>
            </div>
          </div>
        </el-drawer>

      </el-main>
    </el-container>
    <!-- 主体结束 -->
  </el-container>
</template>

<script>
  export default {
    name: "Shome",
    data() {
      //自定义验证 确认密码
      const validatePass = (rule, value, callback) => {
        if (this.updateForm.checkPass !== "") {
          this.$refs.updatePwdRef.validateField("checkPass");
        }
        callback();
      };
      const validatePass2 = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请再次输入密码"));
        } else if (value !== this.updateForm.password) {
          callback(new Error("两次输入密码不一致!"));
        } else {
          callback();
        }
      };
      return {
        //学生的菜单
        studentMenuList: [
          {
            id: 1,
            authName: "我的课程",
            icon: "iconfont iconwodekecheng",
            path: "minecourse"
          },
          {
            id: 2,
            authName: "学生选课",
            icon: "iconfont iconsuoyou",
            path: "allcourse"
          },
          {
            id: 3,
            authName: "课堂评论",
            icon: "iconfont iconpinglun2",
            path: "creview",
          },
          {
            id: 5,
            authName: "教师评论",
            icon: "iconfont iconpinglun1",
            path: "treview",
          },
          {
            id: 6,
            authName: "教学材料评论",
            icon: "iconfont iconpinglun",
            path: "mreview",
          }
        ],

        //修改密码对话框的 显示与隐藏
        updateDialogVisible: false,

        //是否展示修改个人信息
        showDrawer: false,

        //修改个人信息参数
        DrawerForm: {},

        //性别选择框
        SexOptions: [
          {
            id: 1,
            name: '男',
          },
          {
            id: 2,
            name: '女',
          }
        ],

        formLabelWidth: '60px',

        //修改密码参数
        updateForm: {
          password: "",
          checkPass: ""
        },

        updatePwdRules: {
          password: [
            {required: true, message: "请输入密码", trigger: "blur"},
            {validator: validatePass, trigger: "blur"},
            {
              pattern: /^(\w){6,20}$/,
              message: "只能输入6-20个字母、数字、下划线的组合"
            }
          ],
          checkPass: [{validator: validatePass2, trigger: "blur"}],
        },

        menulist: [], //菜单列表
        name: "",

        isCollapse: false, //是否折叠
        isFirstMenu: false, //是否第一级菜单
        activePath: "/minecourse" //链接高亮 激活状态
      };
    },

    created() {
      this.loadMenuList();
      if(window.sessionStorage.getItem("activePath")) {
        this.activePath = window.sessionStorage.getItem("activePath");
      }
      this.name = window.sessionStorage.getItem("name");
    },

    methods: {
      //根据角色加载菜单列表
      loadMenuList() {
        const role = window.sessionStorage.getItem("role");
        if (parseInt(role) === 2) {
          this.menulist = this.studentMenuList;
        }
      },

      //退出方法
      async logout() {
        await this.$http.get("logout");

        window.sessionStorage.clear();
        setTimeout(() => {

        }, 500);

        this.$router.push("/login");
      },

      //打开修改信息
      openDrawer() {
        this.loadPersonalInformation();
        this.showDrawer = true;
      },

      //加载个人信息
      async loadPersonalInformation() {

        const {data: res} = await this.$http.get("student/" + this.$store.state.user.id);

        if (res.code === 200) {
          this.DrawerForm = res.data.student;
        }
      },


      //修改密码对话框关闭事件
      updateDialogClosed() {
        //对话框关闭时，表单重置
        this.$refs.updatePwdRef.resetFields();
      },

      //修改密码
      async updatePassword() {
        const {data: res} = await this.$http.put("student",
            {
              id: this.$store.state.user.id,
              password: this.updateForm.password
            });
        //console.log(res);
        if (res.code === 200) {
          this.$message.success("密码修改成功");
          this.updateDialogVisible = false
        } else {
          this.$message.error("密码修改失败");
          this.updateDialogVisible = false
        }
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


  }
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

  /deep/ :focus {

    outline: 0;

  }

  .demo-drawer__footer {
    width: 100%;
    bottom: 0;
    left: 0;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: center;
    background-color: white;
  }


</style>