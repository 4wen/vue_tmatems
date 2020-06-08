<template>
  <!-- 登录表单开始 -->
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
    </el-form-item>
  </el-form>

  <!--表单结束  -->
</template>

<script>
import jwt_decode from "jwt-decode";
export default {
  data() {
    return {
      //登录表单数据
      loginFrom: {
        username: "",
        password: ""
      },
      //登录表单验证规则
      LoginRules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 4 到 10 个字符", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    //重置表单
    resetLoginForm() {
      this.$refs.LoginFormRef.resetFields();
    },

    //登录方法
    login() {
      //先做表单的预验证
      this.$refs.LoginFormRef.validate(async valid => {
        if (!valid) return; //预验证失败
        const { data: res } = await this.$http.post(
          "admin/login",
          this.loginFrom
        );
        //登录失败返回
        if (res.code !== 200)
          return this.$message.error("登录失败! " + res.msg);
        //先清空sessionStorage
        window.sessionStorage.clear();
        //登录成功 token存入sessionStorage
        window.sessionStorage.setItem("token", "Bearer "+res.data);
        //college存入vuex
        const decode = jwt_decode(res.data);
        this.$store.commit("getUser", decode.admin);
        //用户类型和名字存入sessionStorage
        window.sessionStorage.setItem("role", decode.role);
        window.sessionStorage.setItem("name",decode.admin.name);
        window.sessionStorage.setItem("college",decode.admin.college);
        this.$message.success(res.msg);
        // 通过编程式导航跳转到后台主页，路由地址是 /home
        this.$router.push("/home");
      });
    }
  }
};
</script>

<style lang="less" scoped>
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
</style>