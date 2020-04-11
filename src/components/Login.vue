<template>
  <div class="login_container">
    <div class="login_box">
      <div class="title">教学评估材料管理系统</div>

      <!-- 登录表单开始 -->
      <el-tabs v-model="activeName" @tab-click="handleClick" class="tabs">
        <el-tab-pane label="学生登录" name="first">
          <el-form
            :model="loginFrom"
            :rules="LoginRules"
            ref="LoginFormRef"
            label-width="0px"
            class="login_form"
          >
            <el-form-item prop="username">
              <el-input v-model="loginFrom.username" prefix-icon="el-icon-user" placeholder="用户名"></el-input>
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                type="password"
                v-model="loginFrom.password"
                auto-complete="off"
                prefix-icon="el-icon-lock"
                placeholder="密码"
              ></el-input>
            </el-form-item>

            <el-form-item class="btns">
              <el-button type="primary" @click="login">登录</el-button>
              <el-button type="info" @click="resetLoginForm">重置</el-button>
              <span @click="addDialogVisible = true">没有账号? 点击马上注册</span>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="教师登录" name="second">教师登录</el-tab-pane>
        <el-tab-pane label="管理员登录" name="thired">管理员登录</el-tab-pane>
      </el-tabs>
      <!--表单结束  -->
    </div>

    <!-- 注册对话框 -->
    <el-dialog title="学生注册" :visible.sync="addDialogVisible" width="30%" @close="addDialogClosed">
      <!-- 主体部分 -->
      <el-form
        :model="addForm"
        status-icon
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="addForm.checkPass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="addForm.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="学院" prop="college">
          <el-autocomplete
            v-model="addForm.college"
            :fetch-suggestions="querySearchAsync"
            placeholder="学院"
            @select="handleSelect"
          ></el-autocomplete>
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
export default {
  data() {
    //表单自定义验证
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.loginFrom.checkPass !== "") {
          this.$refs.LoginFormRef.validateField("checkPass");
        }
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
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" }]
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
        level: "",
        classes: ""
      },
      //学校学院
      colleges: [],
      //添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名长度在3~10个字符之间",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "密码长度在6~15个字符之间",
            trigger: "blur"
          }
        ]
      },

      //注册方法
      addUser() {}
    };
  },
  methods: {
    //选项卡切换
    handleClick(tab, event) {},

    //重置表单
    resetLoginForm() {
      this.$refs.LoginFormRef.resetFields();
    },
    login() {
      console.log(1)
      //1.先做表单的预验证
      this.$refs.LoginFormRef.validate(async valid => {
       
        if(!valid) return; //预验证失败
        const {data: res} = await this.$http.post("student/login",this.loginFrom);
        console.log(res)
         if (res.code !== 200) return this.$message.error("登录失败! "+res.msg);
         this.$message.success(res.msg);
         window.sessionStorage.setItem("token",res.data);
      })

    },

    //学生注册对话框关闭事件
    addDialogClosed() {
      //对话框关闭时，表单重置
      this.$refs.addFormRef.resetFields();
    },

    //学生注册是显示学院
    querySearchAsync(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createStateFilter(queryString))
        : restaurants;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 3000 * Math.random());
    },
    createStateFilter(queryString) {
      return state => {
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    //学院显示出来
    handleSelect(item) {
      console.log(item);
    }
  }
};
</script>

<style lang="less" scoped>
.login_container {
  background: url("~@/assets/background.jpg") no-repeat;
  background-size: cover;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 340px;
  background-color: #fff;
  border-radius: 5px;
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
</style>