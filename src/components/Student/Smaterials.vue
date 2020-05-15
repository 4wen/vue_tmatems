<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/minecourse'}">我的课程</el-breadcrumb-item>
      <el-breadcrumb-item>{{cname}} 的教学材料</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑导航区域结束 -->

    <!-- 卡片视图区域 -->
    <el-card>
      <el-table
              :data="materialList"
              style="width: 100%">
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
            <!-- 下载教学材料按钮 -->
            <el-tooltip effect="dark" content="下载教学材料" placement="top" :enterable="false">
              <el-button
                      type="primary"
                      icon="el-icon-download"
                      size="mini"
                      @click="fileDownload(scope.row.url)"
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

      //下载教学材料
      fileDownload(url) {
        window.open("http://192.168.89.131/"+url);
      }

    }

  }
</script>

<style scoped>

</style>