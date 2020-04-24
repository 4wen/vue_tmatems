<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统设置</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑导航区域结束 -->

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 列表区域 -->
      <el-table
              :data="permissionList"
              border
              stripe
              height="480"
      >
        <!-- 索引列 -->
        <el-table-column label="权限ID" prop="id" width="100px" align='center'/>
        <el-table-column label="权限名称" prop="name" align='center'/>
        <el-table-column label="授权码" prop="percode" align='center'/>
        <el-table-column label="是否可用" prop="available" align='center'>
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.available === 0">不可用</el-tag>
            <el-tag type="success" v-else-if="scope.row.available === 1">可用</el-tag>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[1, 2, 5, 10]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
      />

    </el-card>
    <!-- 卡片视图区域结束 -->
  </div>
</template>

<script>
  export default {
    name: "Permission",
    data() {

      return {

        //权限列表
        permissionList: [],

        queryInfo: {
          pagenum: 1, //当前页数
          pagesize: 10 //当前每页显示几条数据
        },

        //分页总条数
        total: 0,
      }
    },

    created() {
      this.getPermissionList();
    },
    methods: {

      //获得角色列表
      async getPermissionList() {
        const {data: res} = await this.$http.get("permission",{
          params:this.queryInfo
        });
        //console.log(res);
        if (res.code !== 200) {
          return this.$message.error("获取权限列表失败");
        }
        this.total = res.data.total;
        this.permissionList = res.data.permissions;
      },

      //监听pagesize 改变的事件
      handleSizeChange(newSize) {
        // console.log(newSize);
        this.queryInfo.pagesize = newSize; //每页显示页数改变
        this.getPermissionList(); //重新调用获得用户列表方法
      },

      //监听页码值改变的事件
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage; //页码值改变
        this.getPermissionList();
      },

    }
  }
</script>

<style scoped>

</style>