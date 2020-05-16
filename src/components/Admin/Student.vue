<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>学生管理</el-breadcrumb-item>
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
                     @change="loadClassesOptions"
                     v-if="showCollegeFlag"
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
          <el-select v-model="queryInfo.classes"
                     placeholder="请选择年级"
                     style="width: 100%"
                     clearable
          >
            <el-option
                    v-for="item in ClassesOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    :disabled="item.disabled"
            />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-input placeholder="根据名字查找" clearable @clear="getStudentList" v-model="queryInfo.name">
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" icon="el-icon-search" @click="getStudentList">搜索</el-button>
        </el-col>

        <el-col :span="2" :offset="this.offset">
          <el-button type="danger"  @click="multiDelete">批量删除</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table
              :data="studentList"
              border
              stripe
              header-align="center"
              @selection-change="handleSelectionChange"
      >
        <el-table-column type="index" label="#" align='center'/>
        <!-- 索引列 -->
        <el-table-column
                type="selection"
                width="55">
        </el-table-column>
        <el-table-column label="姓名" prop="name" align='center'/>
        <el-table-column label="性别" prop="sex" align='center'>
          <template slot-scope="scope" align='center'>
            <el-tag v-if="scope.row.sex === 1">男</el-tag>
            <el-tag type="success" v-else>女</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="学院" prop="collegeName" align='center'/>
        <el-table-column label="年级" prop="level" align='center'>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === 1">大一</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === 2">大二</el-tag>
            <el-tag type="warning" v-else-if="scope.row.level === 3">大三</el-tag>
            <el-tag type="danger" v-else>大四</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="班级" prop="classesName" align='center'/>
        <el-table-column label="操作" width="180px" align='center'>
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip effect="dark" content="修改学生" placement="top" :enterable="false">
              <el-button
                      type="primary"
                      icon="el-icon-edit"
                      size="mini"
                      @click="showEditDialog(scope)"
              />
            </el-tooltip>

            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除学生" placement="top" :enterable="false">
              <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      @click="removeUserById(scope.row.id,scope.row.name)"
              />
            </el-tooltip>
            <!-- 重置密码按钮 -->
            <el-tooltip effect="dark" content="重置密码" placement="top" :enterable="false">
              <el-button
                      type="info"
                      icon="el-icon-setting"
                      size="mini"
                      @click="resetPassword(scope.row.id,scope.row.name)"
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

    <!-- 修改学生的对话框 -->
    <el-dialog title="修改学生"
               :visible.sync="editDialogVisible"
               width="400px"
               @close="editDialogClosed">
      <el-form :model="editForm"
               :rules="editFormRules"
               ref="editFormRef"
               label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name"/>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="editForm.sex"
                     placeholder="选择性别"
                     style="width: 100%"
          >
            <el-option
                    v-for="item in SexOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="学院" prop="college">
          <el-select v-model="editForm.college"
                     placeholder="选择学院"
                     style="width: 100%"
                     @change="EditLoadClassesOptions"
          >
            <el-option
                    v-for="item in CollegesOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="班级" prop="classes">
          <el-select v-model="editForm.classes"
                     placeholder="选择年级"
                     style="width: 100%"
          >
            <el-option
                    v-for="item in ClassesOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Student",

    data() {
      return {
        //获取学生列表的参数对象
        queryInfo: {
          name: "",
          college: "",
          classes: "",
          pagenum: 1, //当前页数
          pagesize: 10 //当前每页显示几条数据
        },

        //学生列表
        studentList: [],

        //当前管理员的学院
        showCollegeFlag: true,

        loading: false,

        //待选择的学院
        CollegesOptions: [],

        //待选择的班级
        ClassesOptions: [{
          id: 1,
          name: '请先选择学院',
          disabled: true
        }],

        //分页总条数
        total: 0,

        //修改用户对话框的 显示与隐藏
        editDialogVisible: false,

        //修改用户的表单对象
        editForm: {},

        //性别选择框
        SexOptions: [
          {
            id: 1,
            name: '男',
          },
          {
            id: 2,
            name: '女',
          }
        ],

        //添加表单的验证规则对象
        editFormRules: {
          name: [
            {required: true, message: "请输入姓名", trigger: "blur"},
            {
              pattern: /^[\u4E00-\u9FA5]+$/,
              message: "姓名只能为中文"
            }
          ],
          sex: [{required: true, message: "请选择性别", trigger: "blur"}],
          college: [{required: true, message: "请选择学院", trigger: "blur"}],
          classes: [{required: true, message: "请选择班级", trigger: "blur"}]
        },


        //批量删除的id
        multipleSelection: [],

        offset:"",
      }
    },

    created() {
      this.getStudentList();
      //判断是超级管理员还是学院管理员
      const college = window.sessionStorage.getItem("college");

      if (parseInt(college) === 0) {
        this.offset = 8;
        this.loadAllCollege();
      } else {
        this.offset = 12;
        this.showCollegeFlag = false;
        this.queryInfo.college = college;
        this.loadAllClasses(college);
      }

    },

    methods: {

      //获得学生列表
      async getStudentList() {
        const {data: res} = await this.$http.get("student", {
          params: this.queryInfo
        });
        //console.log(res);
        if (res.code !== 200) {
          return this.$message.error("获取学生列表失败");
        }
        this.studentList = res.data.students;
        this.total = res.data.total;
      },

      //加载所有学院
      async loadAllCollege() {
        const {data: res} = await this.$http.get("/loadAllCollege");
        if (res.code === 200) {
          this.CollegesOptions = res.data;
        }
      },

      //根据学院加载班级
      async loadAllClasses(id) {
        const college = window.sessionStorage.getItem("college");
        if(parseInt(college)!==0) {
          id = college;
        }
        const {data: res} = await this.$http.get("/loadAllClasses/" + id);
        if (res.code === 200) {
          this.ClassesOptions = res.data;
        }
      },

      //加载选择班级
      loadClassesOptions(id) {
        console.log(!id);
        if (!id) {
          this.queryInfo.classes = "";
          this.ClassesOptions = {
            id: 1,
            name: '请先选择学院',
            disabled: true
          }
        } else {
          this.loadAllClasses(id);
        }

      },

      //监听pagesize 改变的事件
      handleSizeChange(newSize) {
        // console.log(newSize);
        this.queryInfo.pagesize = newSize; //每页显示页数改变
        this.getStudentList(); //重新调用获得用户列表方法
      },

      //监听页码值改变的事件
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage; //页码值改变
        this.getStudentList();
      },

      //根据ID删除学生
      async removeUserById(id,name) {
        const confirmResult = await this.$confirm(
            "此操作将删除 [ "+name+" ], 是否继续?",
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

        const {data: res} = await this.$http.delete("student/" + id);

        if (res.code !== 200) {
          return this.$message.error("删除学生失败！");
        }

        this.$message.success("删除学生成功！");
        this.getStudentList();
      },

      //重置学生密码
      async resetPassword(id,name) {
        const confirmResult = await this.$confirm(
            "此操作将重置 [ "+name+" ] 的密码, 是否继续?",
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
          return this.$message.info("已取消操作");
        }

        const {data: res} = await this.$http.put("student/resetPassword" ,
            {
              id:id,
              password:"123456"
            });

        if (res.code !== 200) {
          return this.$message.error("重置密码失败！");
        }

        this.$message.success("重置密码成功！");
      },

      //打开修改学生弹窗
      async showEditDialog(scope) {

        this.editForm = scope.row;

        //在打开弹窗之前 初始化 学院的选择
        this.loadAllCollege();
        //在打开弹窗之前 初始化 班级的选择
        this.loadAllClasses(this.editForm.college);

        //打开修改学生弹窗
        this.editDialogVisible = true;
      },

      //修改弹窗中 重新选择学院，清空班级选择
      EditLoadClassesOptions(id) {
        this.editForm.classes = "";
        this.loadAllClasses(id);
      },

      // 监听修改学生对话框的关闭事件
      editDialogClosed() {
        // 重置表单
        this.$refs.editFormRef.resetFields();
        console.log(123);
      },

      //修改学生信息
      editUserInfo() {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return; //预验证 未通过
          // 发起修改学生信息的数据请求
          const {data: res} = await this.$http.put(
              "student",
              this.editForm
          );

          if (res.code !== 200) {
            return this.$message.error("更新学生信息失败！");
          }

          // 关闭对话框
          this.editDialogVisible = false;
          // 刷新数据列表
          this.getStudentList();
          // 提示修改成功
          this.$message.success("更新学生信息成功！");
        });
      },

      //批量删除处理
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      //批量删除学生
      async multiDelete() {
        if (this.multipleSelection.length === 0) {
          return this.$message.info("请先选择要删除的学生");
        }
        const confirmResult = await this.$confirm(
            "此操作将批量删除选中的学生, 是否继续?",
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
        const {data: res} = await this.$http.put("student/multiDelete", params);

        if (res.code !== 200) {
          return this.$message.error("删除学生失败！");
        }

        this.$message.success("删除学生成功！");
        this.getStudentList();
      }
    }
  }
</script>

<style scoped>

</style>