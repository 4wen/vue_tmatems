<template>
  <div id="app">
    <!-- 路由占位符 -->
    <router-view/>
  </div>
</template>

<script>
  import jwt_decode from "jwt-decode";
export default {
  name: "app",
  created() {
    let token =  window.sessionStorage.getItem("token");
    const role = window.sessionStorage.getItem("role");
    if(token) {
      token = token.substring(7);
      const decode = jwt_decode(token);
      if(parseInt(role) === 2){
        this.$store.commit("getUser", decode.student);
      }else if(parseInt(role) === 3) {
        this.$store.commit("getUser", decode.teacher);
      }else {
        this.$store.commit("getUser", decode.admin);
      }

    }
    
  }
};
</script>

<style>
</style>
