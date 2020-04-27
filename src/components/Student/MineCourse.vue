<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>我的课程</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑导航区域结束 -->
    <el-card>
      <el-table
              :data="courseData"
              style="width: 100%">
        <el-table-column
                label="课程 ID"
                prop="cid"
                style="width: 10px">
        </el-table-column>
        <el-table-column
                label="课程名称"
                prop="name"
                style="width: 30px">
        </el-table-column>
        <el-table-column
                label="所属学院"
                prop="collegeName"
                style="width: 30px">
        </el-table-column>
        <el-table-column
                label="任课教师"
                prop="teacherName"
                style="width: 30px">
        </el-table-column>
        <el-table-column
                label="课程描述"
                prop="remark"
                :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="操作" width="60px" align='center'>
          <template slot-scope="scope">
            <!-- 查看教学材料按钮 -->
            <el-tooltip effect="dark" content="查看教学材料" placement="top" :enterable="false">
              <el-button
                      type="primary"
                      icon="el-icon-circle-check"
                      size="mini"
                      @click=""
              />
            </el-tooltip>
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
    <!--卡片视图结束-->

  </div>
</template>

<script>
  export default {
    name: "MineCourse",
    data() {
      return {
        //课程列表
        courseData: [],

        //查询的参数对象
        queryInfo: {
          pagenum: 1, //当前页数
          pagesize: 10 //当前每页显示几条数据
        },

        total: 0,

      }
    },
    created() {
      this.getCourseList();
    },
    methods: {

      //获得课程列表
      async getCourseList() {
        const {data: res} = await this.$http.get("scourse/" + this.$store.state.user.id,
            this.queryInfo);
        //console.log(res);
        if (res.code !== 200) {
          return this.$message.error("获取课程列表失败");
        } else {
          this.courseData = res.data.courses;
          this.total = res.data.total;
        }

      },

      //监听pagesize 改变的事件
      handleSizeChange(newSize) {
        // console.log(newSize);
        this.pagesize = newSize; //每页显示页数改变
        this.getCourseList(); //重新调用获得用户列表方法
      },

      //监听页码值改变的事件
      handleCurrentChange(newPage) {
        this.pagenum = newPage; //页码值改变
        this.getCourseList();
      },
    }

  }
</script>

<style scoped>

</style>