<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑导航区域结束 -->

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="5">
        <el-col :span="4">
          <el-select v-model="queryInfo.college"
                     placeholder="根据学院查询"
                     style="width: 100%"
                     clearable
                     v-if="isSuperAdmin"
          >
            <el-option
                    v-for="item in CollegesOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    :disabled="item.disabled"
            />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="queryInfo.level"
                     placeholder="请选择年级"
                     style="width: 100%"
                     clearable
          >
            <el-option
                    v-for="item in GradeOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
            />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-input placeholder="根据名字查找" clearable @clear="getCourseList" v-model="queryInfo.name">
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" icon="el-icon-search" @click="getCourseList">搜索</el-button>
        </el-col>

        <el-col :span="2" :offset="this.offset">
          <el-button type="danger" @click="multiDelete">批量删除</el-button>
        </el-col>

        <el-col :span="2">
          <el-button type="primary" @click="addDialogOpen" v-if="!isSuperAdmin">添加课程</el-button>
        </el-col>
      </el-row>

      <!-- 课程列表区域 -->
      <el-table
              :data="courseList"
              border
              stripe
              highlight-current-row
              @selection-change="handleSelectionChange"
      >
        <el-table-column type="index" label="#" align='center'/>
        <!-- 索引列 -->
        <el-table-column
                type="selection"
                width="55">
        </el-table-column>
        <el-table-column label="课程ID" prop="id" align='center'/>
        <el-table-column label="课程名" prop="name" align='center'/>
        <el-table-column label="所属学院" prop="collegeName" align='center'/>
        <el-table-column label="年级" prop="level" align='center'>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === 1">大一</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === 2">大二</el-tag>
            <el-tag type="warning" v-else-if="scope.row.level === 3">大三</el-tag>
            <el-tag type="danger" v-else>大四</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="任课教师" prop="teacherName" align='center'/>
        <el-table-column label="课程描述" prop="remark" :show-overflow-tooltip="true" width="400" align='center'/>
        <el-table-column label="操作" :width="isSuperAdmin ? '60px' : '180px'" align='center'>
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip effect="dark" content="修改课程" placement="top" :enterable="false">
              <el-button
                      type="primary"
                      icon="el-icon-edit"
                      size="mini"
                      @click="showEditDialog(scope)"
                      v-if="!isSuperAdmin"
              />
            </el-tooltip>

            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除课程" placement="top" :enterable="false">
              <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      @click="removeUserById(scope.row.id,scope.row.name)"
              />
            </el-tooltip>

            <!-- 开启教评按钮 -->
            <el-tooltip effect="dark" content="开启课堂评论" placement="top" :enterable="false">
              <el-button
                      type="warning"
                      icon="el-icon-setting"
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
    <!-- 卡片视图区域结束 -->

    <!-- 修改课程的对话框 -->
    <el-dialog title="修改课程"
               :visible.sync="editDialogVisible"
               width="400px"
               @close="editDialogClosed">
      <el-form :model="editForm"
               :rules="editFormRules"
               ref="editFormRef"
               label-width="70px">
        <el-form-item label="课程名" prop="name">
          <el-input v-model="editForm.name"/>
        </el-form-item>
        <el-form-item label="年级" prop="level">
          <el-select v-model="editForm.level"
                     placeholder="选择年级"
                     style="width: 100%"
          >
            <el-option
                    v-for="item in GradeOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="任课教师" prop="teacher">
          <el-select v-model="editForm.teacher"
                     placeholder="选择任课教师"
                     style="width: 100%"
          >
            <el-option
                    v-for="item in TeacherOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课程描述" prop="remark">
          <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入课程描述"
                  v-model="editForm.remark">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCourseInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加课程对话框 -->
    <el-dialog title="添加课程"
               :visible.sync="addDialogVisible"
               width="450px"
               @close="addDialogClosed">
      <!-- 主体部分 -->
      <el-form
              :model="addForm"
              status-icon
              :rules="addFormRules"
              ref="addFormRef"
              label-width="90px"
      >
        <el-form-item label="课程名" prop="name">
          <el-input v-model="addForm.name" clearable/>
        </el-form-item>
        <el-form-item label="年级" prop="level">
          <el-select v-model="addForm.level"
                     placeholder="选择年级"
                     style="width: 100%"
          >
            <el-option
                    v-for="item in GradeOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="任课教师" prop="teacher">
          <el-select v-model="addForm.teacher"
                     placeholder="选择任课教师"
                     style="width: 100%"
          >
            <el-option
                    v-for="item in TeacherOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课程描述" prop="remark">
          <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入课程描述"
                  v-model="addForm.remark">
          </el-input>
        </el-form-item>
      </el-form>

      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCourse">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Course",
    data() {
      return {
        //获取课程列表的参数对象
        queryInfo: {
          name: "",
          college: "",
          level: "",
          pagenum: 1, //当前页数
          pagesize: 10 //当前每页显示几条数据
        },

        //课程列表
        courseList: [],

        //是否超级管理员
        isSuperAdmin: true,

        //待选择的学院
        CollegesOptions: [],

        //分页总条数
        total: 0,

        //修改课程对话框的 显示与隐藏
        editDialogVisible: false,

        //修改课程的表单对象
        editForm: {},

        //待选择的教师
        TeacherOptions: [],

        //待选择的年级
        GradeOptions: [
          {
            id: 1,
            name: '大一',
          },
          {
            id: 2,
            name: '大二',
          },
          {
            id: 3,
            name: '大三',
          }, {
            id: 4,
            name: '大四',
          }],

        //修改表单的验证规则对象
        editFormRules: {
          name: [
          ],
          sex: [{required: true, message: "请选择性别", trigger: "blur"}],
          college: [{required: true, message: "请选择学院", trigger: "blur"}],
          title: [{required: true, message: "请选择职称", trigger: "blur"}]
        },

        //批量删除的id
        multipleSelection: [],

        offset: "",

        //添加课程 对话框的 显示与隐藏
        addDialogVisible: false,

        //添加课程的表单对象
        addForm: {
          name: "",
          college: "",
          level: "",
          teacher: "",
          remark: ""
        },

        //添加表单的验证规则对象
        addFormRules: {
          name: [{required: true, message: "请输入课程名", trigger: "blur"}],
          level: [{required: true, message: "请选择年级", trigger: "blur"}],
          teacher: [{required: true, message: "请选择任课教师", trigger: "blur"}],
          remark: [{required: true, message: "请填写课程描述", trigger: "blur"}]
        }
      }
    },

    created() {
      //判断是超级管理员还是学院管理员
      const college = window.sessionStorage.getItem("college");

      if (parseInt(college) === 0) {
        this.offset = 8;
        this.loadAllCollege();
      } else {
        this.offset = 10;
        this.isSuperAdmin = false;
        this.queryInfo.college = college;
        this.addForm.college = college;
      }

      this.getCourseList();
    },

    methods: {

      //获得课程列表
      async getCourseList() {
        const {data: res} = await this.$http.get("course", {
          params: this.queryInfo
        });
        //console.log(res);
        if (res.code !== 200) {
          return this.$message.error("获取课程列表失败");
        }
        this.courseList = res.data.courses;
        this.total = res.data.total;
      },


      //加载所有学院
      async loadAllCollege() {
        const {data: res} = await this.$http.get("/loadAllCollege");
        if (res.code === 200) {
          this.CollegesOptions = res.data;
        }
      },

      //监听pagesize 改变的事件
      handleSizeChange(newSize) {
        // console.log(newSize);
        this.queryInfo.pagesize = newSize; //每页显示页数改变
        this.getCourseList(); //重新调用获得用户列表方法
      },

      //监听页码值改变的事件
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage; //页码值改变
        this.getCourseList();
      },

      //根据ID删除课程
      async removeUserById(id, name) {
        const confirmResult = await this.$confirm(
            "此操作将删除 " + name + " 课程, 是否继续?",
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

        const {data: res} = await this.$http.delete("course/" + id);

        if (res.code !== 200) {
          return this.$message.error("删除课程失败！");
        }

        this.$message.success("删除课程成功！");
        this.getCourseList();
      },


      //打开修改课程弹窗
      async showEditDialog(scope) {
        this.editForm = scope.row;
        this.editDialogVisible = true;
        this.loadTeacher();
      },

      //打开修改课程窗口时 加载教师列表
      async loadTeacher() {
        const {data: res} = await this.$http.get("teacher/byCollege/" + this.queryInfo.college);
        if (res.code === 200) {
          this.TeacherOptions = res.data.teachers;
        }
      },

      // 监听修改课程对话框的关闭事件
      editDialogClosed() {
        // 重置表单
        this.$refs.editFormRef.resetFields();
      },

      //修改课程信息
      editCourseInfo() {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return; //预验证 未通过
          // 发起修改课程信息的数据请求
          const {data: res} = await this.$http.put(
              "course",
              this.editForm
          );

          if (res.code !== 200) {
            return this.$message.error("修改课程信息失败！");
          }

          // 关闭对话框
          this.editDialogVisible = false;
          // 刷新数据列表
          this.getCourseList();
          // 提示修改成功
          this.$message.success("修改课程信息成功！");
        });
      },

      //批量删除处理
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      //批量删除课程
      async multiDelete() {
        if (this.multipleSelection.length === 0) {
          return this.$message.info("请先选择要删除的课程");
        }
        const confirmResult = await this.$confirm(
            "此操作将批量删除选中的课程, 是否继续?",
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

        let params = [];
        this.multipleSelection.forEach(function (item) {
          //拿到批量删除的id数组
          params.push(item.id);
        });
        const {data: res} = await this.$http.put("course/multiDelete", params);

        if (res.code !== 200) {
          return this.$message.error("删除课程失败！");
        }

        this.$message.success("删除课程成功！");
        this.getCourseList();
      },

      //打开 添加课程弹窗 加载教师信息
      addDialogOpen() {
        this.addDialogVisible = true;
        this.loadTeacher();
      },

      //添加课程对话框关闭事件
      addDialogClosed() {
        //对话框关闭时，表单重置
        this.$refs.addFormRef.resetFields();
      },

      //添加课程
      async addCourse() {
        const {data: res} = await this.$http.post("/course", this.addForm);
        if (res.code === 200) {
          this.$message.success(res.msg);
          this.addDialogVisible = false;
          this.getCourseList();
        } else {
          this.$message.error(res.msg);
        }
      }
    }


  }
</script>

<style scoped>

</style>