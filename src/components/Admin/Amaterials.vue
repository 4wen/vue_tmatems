<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/course'}">课程管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{cname}} 的教学材料</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑导航区域结束 -->

    <!-- 卡片视图区域 -->
    <el-card>
      <el-table
              :data="materialList"
              style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">

          </template>
        </el-table-column>
        <el-table-column type="index" label="#" align='center'/>
        <el-table-column
                label="文件"
                prop="name"
                align='center'>
        </el-table-column>
        <el-table-column
                label="上传时间"
                prop="time"
                align='center'>
        </el-table-column>
        <el-table-column
                label="详情"
                prop="remark"
                :show-overflow-tooltip="true" align='center'/>
        <el-table-column label="操作" width="60px" align='center'>
          <template slot-scope="scope">
            <!--删除教学材料按钮 -->
            <el-tooltip effect="dark" content="删除教学材料" placement="top" :enterable="false">
              <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      @click="deleteMaterial(scope.row.id,scope.row.url)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pagenum"
              :page-sizes="[1, 2, 5, 10]"
              :page-size="pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
      />
    </el-card>

  </div>
</template>

<script>
  export default {
    name: "Amaterials",
    data() {
      return {
        //课程名
        cname: "",

        //课程列表
        materialList: [],

        pagenum: 1, //当前页数
        pagesize: 10, //当前每页显示几条数据

        total: 0,

      }
    },

    created() {
      this.cname = window.sessionStorage.getItem("cname");
      this.getMaterialList();
    },

    methods: {

      //获得教学材料列表
      async getMaterialList() {
        const {data: res} = await this.$http.get("materials", {
          params: {
            cid: window.sessionStorage.getItem("cid"),
            pagenum: this.pagenum,
            pagesize: this.pagesize
          }
        });
        //console.log(res);
        if (res.code !== 200) {
          return this.$message.error("获取课程列表失败");
        }
        this.materialList = res.data.materials;
        this.total = res.data.total;
      },

      //监听pagesize 改变的事件
      handleSizeChange(newSize) {
        // console.log(newSize);
        this.pagesize = newSize; //每页显示页数改变
        this.getMaterialList(); //重新调用获得用户列表方法
      },

      //监听页码值改变的事件
      handleCurrentChange(newPage) {
        this.pagenum = newPage; //页码值改变
        this.getMaterialList();
      },

      //删除
      async deleteMaterial(id,url) {
        const confirmResult = await this.$confirm(
            "此操作将删除 教学材料, 是否继续?",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
        ).catch(err => err);

        // 如果用户确认删除，则返回值为字符串 confirm
        // 如果用户取消了删除，则返回值为字符串 cancel
        // console.log(confirmResult)

        if (confirmResult !== "confirm") {
          return this.$message.info("已取消删除");
        }

        const {data: res} = await this.$http.put("fileDelete",{
          id:id,
          url:url
        });

        if (res.code !== 200) {
          return this.$message.error("删除教学材料失败！");
        }

        this.$message.success("删除教学材料成功！");
        this.getMaterialList();
      }

    }

  }
</script>

<style scoped>

</style>