<template>
  <div class="login_container">
    <div class="login_box">
      <div class="title">教学评估材料管理系统</div>
      <!-- 登录表单开始 -->
      <el-tabs v-model="activeName" @tab-click="handleClick" class="tabs">
        <el-tab-pane label="学生" name="first">
          <el-form
                  :model="loginFrom"
                  :rules="LoginRules"
                  ref="LoginFormRef"
                  label-width="0px"
                  class="login_form"
          >
            <el-form-item prop="username">
              <el-input v-model="loginFrom.username" prefix-icon="el-icon-user"
                        placeholder="用户名"/>
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                      type="password"
                      v-model="loginFrom.password"
                      auto-complete="off"
                      prefix-icon="el-icon-lock"
                      placeholder="密码"
              />
            </el-form-item>

            <el-form-item class="btns">
              <el-button type="primary" @click="login">登录</el-button>
              <el-button type="info" @click="resetLoginForm">重置</el-button>
              <span @click="addDialogOpen"><el-link type="primary">没有账号? 点击马上注册</el-link></span>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="教师" name="second">
          <teacherLogin/>
        </el-tab-pane>
        <el-tab-pane label="管理员" name="thired">
          <adminLogin/>
        </el-tab-pane>
      </el-tabs>
      <!--表单结束  -->
    </div>

    <!-- 注册对话框 -->
    <el-dialog title="学生注册" :visible.sync="addDialogVisible" width="40%" @close="addDialogClosed">
      <!-- 主体部分 -->
      <el-form
              :model="addForm"
              status-icon
              :rules="addFormRules"
              ref="addFormRef"
              label-width="70px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name" clearable/>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" clearable/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password" clearable/>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="addForm.checkPass" auto-complete="off" clearable/>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="addForm.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="学院" prop="college">
          <el-select
                  v-model="addForm.college"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入学院"
                  :remote-method="remoteMethod"
                  :loading="loading"
                  @change="initClassesOptions"
          >
            <el-option
                    v-for="item in CollegesOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="年级" prop="classes">
          <el-select v-model="addForm.classes" placeholder="请选择年级">
            <el-option
                    v-for="item in ClassesOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import teacherLogin from "./TeacherLogin.vue";
  import AdminLogin from "./AdminLogin.vue";
  import jwt_decode from "jwt-decode";

  export default {
    data() {
      //自定义验证 用户名是否在数据库中存在
      const validateUsername = (rule, value, callback) => {
        if (!value) {
          return callback(new Error("用户名不能为空"));
        }
        this.validateStudent(value).then(res => {
          //console.log(res)
          if (res.code === 200) {
            if (res.data === 1) {
              callback(new Error("该用户名已经存在"));
            } else {
              callback();
            }
          } else {
            //接口出现异常
            callback(new Error("接口出现异常"));
          }
        });
      };

      //自定义验证 确认密码
      const validatePass = (rule, value, callback) => {
        if (this.addForm.checkPass !== "") {
          this.$refs.LoginFormRef.validateField("checkPass");
        }
        callback();
      };
      const validatePass2 = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请再次输入密码"));
        } else if (value !== this.addForm.password) {
          callback(new Error("两次输入密码不一致!"));
        } else {
          callback();
        }
      };
      return {
        //tab名字
        activeName: "first",
        //登录表单数据
        loginFrom: {
          username: "",
          password: ""
        },
        //登录表单验证规则
        LoginRules: {
          username: [
            {required: true, message: "请输入账号", trigger: "blur"},
            {min: 2, max: 10, message: "长度在 4 到 10 个字符", trigger: "blur"}
          ],
          password: [{required: true, message: "请输入密码", trigger: "blur"}]
        },

        //学生注册对话框的 显示与隐藏
        addDialogVisible: false,

        //学生注册的表单对象
        addForm: {
          name: "",
          username: "",
          password: "",
          checkPass: "",
          sex: "",
          college: "",
          classes: ""
        },

        //待选择的学院
        CollegesOptions: [],
        //待选择的班级
        ClassesOptions: [],

        loading: false,

        //学校学院
        colleges: [],

        //添加表单的验证规则对象
        addFormRules: {
          name: [
            {required: true, message: "请输入姓名", trigger: "blur"},
            {
              pattern: /^[\u4E00-\u9FA5]+$/,
              message: "姓名只能为中文"
            }
          ],
          username: [
            {required: true, message: "请输入用户名", trigger: "blur"},
            {
              min: 3,
              max: 10,
              message: "用户名长度在4~10个字符之间",
              trigger: "blur"
            },
            {
              pattern: /[0-9a-zA-Z]{4,10}/,
              message: "用户名必须是由4-10位数字和字母组合"
            },
            {validator: validateUsername, trigger: "blur"}
          ],
          password: [
            {required: true, message: "请输入密码", trigger: "blur"},
            {validator: validatePass, trigger: "blur"},
            {
              pattern: /^(\w){6,20}$/,
              message: "只能输入6-20个字母、数字、下划线的组合"
            }
          ],
          checkPass: [{validator: validatePass2, trigger: "blur"}],
          sex: [{required: true, message: "请选择性别", trigger: "blur"}],
          college: [{required: true, message: "请选择学院", trigger: "blur"}],
          classes: [{required: true, message: "请选择班级", trigger: "blur"}]
        }
      };
    },
    methods: {
      //选项卡切换
      handleClick(tab, event) {
        //console.log(tab,event)
      },

      //重置表单
      resetLoginForm() {
        this.$refs.LoginFormRef.resetFields();
      },
      login(key) {
        //1.先做表单的预验证
        this.$refs.LoginFormRef.validate(async valid => {
          if (!valid) return; //预验证失败
          const {data: res} = await this.$http.post(
              "student/login",
              this.loginFrom
          );

          if (res.code !== 200)
            return this.$message.error("登录失败! " + res.msg);
          //先清空
          window.sessionStorage.clear();
          //登录成功 token存入sessionStorage
          window.sessionStorage.setItem("token", "Bearer " + res.data);

          //college存入vuex
          const decode = jwt_decode(res.data);
          this.$store.commit("getUserCollegeId", decode.student.college)
          this.$message.success(res.msg);

          //用户类型和名字存入sessionStorage
          window.sessionStorage.setItem("role", decode.role)
          window.sessionStorage.getItem("name", decode.student.name)

          // 通过编程式导航跳转到后台主页，路由地址是 /home
          this.$router.push("/home");

        });
      },

      //学生注册对话框打开
      addDialogOpen() {
        this.addDialogVisible = true;
        this.loadAllCollege();
      },
      //学生注册对话框关闭事件
      addDialogClosed() {
        //对话框关闭时，表单重置
        this.$refs.addFormRef.resetFields();
      },

      //去数据库查询是否存在用户名
      async validateStudent(username) {
        const {data: res} = await this.$http.get("/registered/" + username);
        return res;
      },

      //加载所有学院
      async loadAllCollege() {
        const {data: res} = await this.$http.get("/loadAllCollege");
        if (res.code === 200) {
          this.colleges = res.data;
        }
      },
      //根据学院加载班级
      async loadAllClasses(id) {
        const {data: res} = await this.$http.get("/loadAllClasses/" + id);
        if (res.code === 200) {
          this.ClassesOptions = res.data;
        }
      },

      //初始化班级选择框
      initClassesOptions(id) {
        this.loadAllClasses(id);
      },

      //select选择框 处理选择学院
      remoteMethod(query) {
        if (query !== "") {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.CollegesOptions = this.colleges.filter(item => {
              return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
            });
          }, 100);
        } else {
          this.CollegesOptions = [];
        }
      },
      //注册学生
      async addUser() {
        const {data: res} = await this.$http.post("/registered/", this.addForm);
        if (res.code === 200) {
          this.$message.success(res.msg);
          this.addDialogVisible = false;
        } else {
          this.$message.error(res.msg);
        }
      }
    },
    components: {
      teacherLogin,
      AdminLogin
    },
    mounted() {
    }
  };
</script>

<style lang="less" scoped>
  .login_container {
    background: url("../../assets/background.jpg") no-repeat;
    background-size: cover;
    height: 100%;
  }

  .login_box {
    width: 450px;
    height: 350px;
    background-color: #fff;
    border-radius: 15px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .title {
    text-align: center;
    font-size: 30px;
    padding: 0 15px;
    margin: 10px 0 20px 0;
  }

  .el-tabsitem {
    text-align: center;
    width: 60px;
    margin: 20px;
  }

  .login_form {
    bottom: 0;
    width: 100%;
    padding: 0 30px 0 30px;
    box-sizing: border-box;
  }

  .btns {
    display: flex;
    justify-content: flex-end;
  }

  span {
    display: block;
    align-content: center;
    color: blue;
    font-size: 12px;
  }
</style>

<style lang="less">
  .el-tabs__item {
    padding: 0 5px !important;
    font-size: 12px !important;
  }

  .el-tabs__nav-scroll {
    padding-left: 30px !important;
  }

  .el-tabs__nav-wrap::after {
    background-color: #fff !important;
  }
</style>