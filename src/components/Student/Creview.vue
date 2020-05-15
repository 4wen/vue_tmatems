<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>课堂评论</el-breadcrumb-item>
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
            <!-- 评论按钮 -->
            <el-tooltip effect="dark" :content="scope.row.isreview ===0?'评论':'已评论'" placement="top" :enterable="false">
              <el-button
                      :type="scope.row.isreview ===0?'primary':'info'"
                      icon="el-icon-circle-check"
                      size="mini"
                      @click="scope.row.isreview ===0?showReviewDialog(scope.row.cid):''"
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

    <!-- 教评 的对话框 -->
    <el-dialog title="教评"
               :visible.sync="reviewDialogVisible"
               width="500px"
               @close="reviewDialogClosed">
      <el-form :model="reviewForm"
               :rules="reviewFormRules"
               ref="reviewFormRef"
               label-width="70px"
               :label-position="labelPosition">
        <el-form-item v-for="item in questions" :label="item.question">
          <el-rate
                  v-model="item.rate"
                  show-text
                  :texts="texts"
          >
          </el-rate>
        </el-form-item>


        <el-form-item label="对任课教师的建议与意见" prop="suggest">
          <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入建议与意见"
                  v-model="reviewForm.suggest">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reviewDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addReview">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "Ccomment",
    data() {
      return {
        //课程列表
        courseData: [],

        pagenum: 1, //当前页数
        pagesize: 10, //当前每页显示几条数据

        total: 0,

        labelPosition: 'top',

        //教评 对话框的 显示与隐藏
        reviewDialogVisible: false,

        //教评问题
        questions: [],


        texts: ['很差', '差', '一般', '良好', '优秀'],

        //添加课程的表单对象
        reviewForm: {
          cid: "",
          question1: "",
          question2: "",
          question3: "",
          question4: "",
          question5: "",
          suggest: ""
        },

        //添加表单的验证规则对象
        reviewFormRules: {
          suggest: [{required: true, message: "请填写课程描述", trigger: "blur"},
            {min: 30, message: "长度最少30个字符", trigger: "blur"}]
        }

      }
    },
    created() {
      this.getCourseList();
    },
    methods: {

      //获得课程列表
      async getCourseList() {
        const {data: res} = await this.$http.get("isokscourse/" +
            this.$store.state.user.id + "/" +
            this.pagenum + "/" +
            this.pagesize);
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

      //打开 评教对话框
      showReviewDialog(cid) {
        this.reviewForm.cid = cid;
        //加载教评问题
        this.loadQuestion();
      },

      //关闭评教对话框
      reviewDialogClosed() {
        //对话框关闭时，表单重置
        this.$refs.reviewFormRef.resetFields();
      },

      //加载教评问题
      async loadQuestion() {
        const {data: res} = await this.$http.get("getquestion");
        //console.log(res);
        if (res.code !== 200) {
          return this.$message.error("操作失败");
        } else {
          this.questions = res.data.questions;
          //打开对话框
          this.reviewDialogVisible = true;
        }
      },

      //添加教评
      async addReview() {
        this.reviewForm.question1 = this.questions[0].rate;
        this.reviewForm.question2 = this.questions[1].rate;
        this.reviewForm.question3 = this.questions[2].rate;
        this.reviewForm.question4 = this.questions[3].rate;
        this.reviewForm.question5 = this.questions[4].rate;

        const {data: res} = await this.$http.post("/ccomment", this.reviewForm);
        if (res.code === 200) {
          this.$message.success(res.msg);
          this.reviewDialogVisible = false;
          this.getCourseList();
        } else {
          this.$message.error(res.msg);
          this.reviewDialogVisible = false;
        }
      },

    }

  }
</script>

<style scoped>

</style>