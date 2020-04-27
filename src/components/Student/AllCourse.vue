<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>学生选课</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑导航区域结束 -->

    <!--卡片视图-->
    <el-card>

      <el-table
              :data="courseData"
              style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="课程名称：">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="所属学院：">
                <span>{{ props.row.collegeName }}</span>
              </el-form-item>
              <el-form-item label="课程 ID：">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="任课教师：">
                <span>{{ props.row.teacherName }}</span>
              </el-form-item>
              <el-form-item label="课程描述：">
                <span>{{ props.row.remark }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
                label="课程 ID"
                prop="id">
        </el-table-column>
        <el-table-column
                label="课程名称"
                prop="name">
        </el-table-column>
        <el-table-column
                label="课程描述"
                prop="remark"
                :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="操作" width="60px" align='center'>
          <template slot-scope="scope">
            <!-- 选课按钮 -->
            <el-tooltip effect="dark" content="选择课程" placement="top" :enterable="false">
              <el-button
                      :type="pickedList.indexOf(scope.row.id) > -1 ?'info':'primary'"
                      icon="el-icon-circle-check"
                      size="mini"
                      :disabled="pickedList.indexOf(scope.row.id) > -1"
                      @click="pickCourse(scope)"
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
    <!--卡片视图结束-->
  </div>
</template>

<script>
  export default {
    name: "AllCourse",
    data() {
      return {
        //课程列表
        courseData: [],
        pagenum: 1,
        pagesize: 10,
        total: 0,

        //学生已选课程
        pickedList: [],

        pickCourseFrom: {
          cid: 0,
          uid: ""
        },
      }
    },
    created() {
      this.getCourseList();
      this.getPicked();


    },

    methods: {
      //获得课程列表
      async getCourseList() {
        const date = new Date();
        const {data: res} = await this.$http.get("course",
            {
              params: {
                college: window.sessionStorage.getItem("college"),
                level: date.getFullYear() - parseInt(window.sessionStorage.getItem("level")),
                pagenum: this.pagenum,
                pagesize: this.pagesize
              }
            });
        //console.log(res);
        if (res.code !== 200) {
          return this.$message.error("获取课程列表失败");
        }
        this.courseData = res.data.courses;
        this.total = res.data.total;
      },

      //获取已选课程
      async getPicked() {
        const {data: res} = await this.$http.get("getpicked/" + this.$store.state.user.id);
        //console.log(res);
        if (res.code !== 200) {
          return this.$message.error("查询失败");
        }else {
          this.pickedList = res.data.picked;
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

      //学生选课
      async pickCourse(scope) {
        this.pickCourseFrom.cid = scope.row.id;
        this.pickCourseFrom.uid = this.$store.state.user.id;

        const {data: res} = await this.$http.post("pickcourse", this.pickCourseFrom);
        //console.log(res);
        if (res.code !== 200) {
          return this.$message.error("选课失败");
        } else {
          this.$message.success("选课成功");
        }

      },

    }

  }
</script>

<style lang="less" scoped>
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>