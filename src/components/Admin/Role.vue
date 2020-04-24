<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统设置</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑导航区域结束 -->

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 列表区域 -->
      <el-table
              :data="roleList"
              border
              stripe
      >
        <!-- 索引列 -->
        <el-table-column label="角色ID" prop="id" width="100px" align='center'/>
        <el-table-column label="角色名称" prop="name" align='center'/>
        <el-table-column label="备注" prop="remark" align='center'/>
        <el-table-column label="是否可用" prop="available" align='center'>
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.available === 0">不可用</el-tag>
            <el-tag type="success" v-else-if="scope.row.available === 1">可用</el-tag>
          </template>
        </el-table-column>

      </el-table>

    </el-card>
    <!-- 卡片视图区域结束 -->

  </div>
</template>

<script>
  export default {
    name: "Role",
    data() {

      return {

        //角色列表
        roleList: [],
      }
    },

    created() {
      this.getRoleList();
    },
    methods: {

      //获得角色列表
      async getRoleList() {
        const {data: res} = await this.$http.get("role");
        //console.log(res);
        if (res.code !== 200) {
          return this.$message.error("获取角色列表失败");
        }
        this.roleList = res.data.roles;
      },

    }
  }
</script>

<style scoped>

</style>