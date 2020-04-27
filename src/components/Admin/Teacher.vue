<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>教师管理</el-breadcrumb-item>
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
          <el-select v-model="queryInfo.title"
                     placeholder="根据职称查询"
                     style="width: 100%"
                     clearable
          >
            <el-option
                    v-for="item in TitleOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    :disabled="item.disabled"
            />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-input placeholder="根据名字查找" clearable @clear="getTeacherList" v-model="queryInfo.name">
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" icon="el-icon-search" @click="getTeacherList">搜索</el-button>
        </el-col>

        <el-col :span="2" :offset="this.offset">
          <el-button type="danger" @click="multiDelete">批量删除</el-button>
        </el-col>

        <el-col :span="2">
          <el-button type="primary" @click="addDialogOpen">添加教师</el-button>
        </el-col>
      </el-row>

      <!-- 教师列表区域 -->
      <el-table
              :data="teacherList"
              border
              stripe
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
          <template slot-scope="scope">
            <el-tag v-if="scope.row.sex === 1">男</el-tag>
            <el-tag type="success" v-else>女</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="学院" prop="collegeName" align='center'/>
        <el-table-column label="职称" prop="title" align='center'>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.title === 0">讲师</el-tag>
            <el-tag type="success" v-else-if="scope.row.title === 1">副教授</el-tag>
            <el-tag type="warning" v-else>教授</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px" align='center'>
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip effect="dark" content="修改教师" placement="top" :enterable="false">
              <el-button
                      type="primary"
                      icon="el-icon-edit"
                      size="mini"
                      @click="showEditDialog(scope)"
              />
            </el-tooltip>

            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除教师" placement="top" :enterable="false">
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
                      type="danger"
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

    <!-- 修改教师的对话框 -->
    <el-dialog title="修改教师"
               :visible.sync="editDialogVisible"
               width="400px"
               @close="editDialogClosed">
      <el-form :model="editForm"
               :rules="editFormRules"
               ref="editFormRef"
               label-width="70px">
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
          >
            <el-option
                    v-for="item in CollegesOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="职称" prop="title">
          <el-select v-model="editForm.title"
                     placeholder="选择年级"
                     style="width: 100%"
          >
            <el-option
                    v-for="item in TitleOptions"
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

    <!-- 添加教师对话框 -->
    <el-dialog title="添加教师"
               :visible.sync="addDialogVisible"
               width="400px"
               @close="addDialogClosed">
      <!-- 主体部分 -->
      <el-form
              :model="addForm"
              status-icon
              :rules="addFormRules"
              ref="addFormRef"
              label-width="70px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name" clearable/>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" clearable/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password" clearable/>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="addForm.checkPass" auto-complete="off" clearable/>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="addForm.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="学院" prop="college">
          <el-select v-model="addForm.college"
                     placeholder="请选择学院"
                     style="width: 100%"
                     clearable
          >
            <el-option
                    v-for="item in CollegesOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="职称" prop="title">
          <el-select v-model="addForm.title"
                     placeholder="请选择职称"
                     style="width: 100%"
          >
            <el-option
                    v-for="item in TitleOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Teacher",
    data() {
      //自定义验证 用户名是否在数据库中存在
      const validateUsername = (rule, value, callback) => {
        if (!value) {
          return callback(new Error("用户名不能为空"));
        }
        this.validateStudent(value).then(res => {
          //console.log(res)
          if (res.code === 200) {
            if (res.data === 1) {
              callback(new Error("该用户名已经存在"));
            } else {
              callback();
            }
          } else {
            //接口出现异常
            callback(new Error("接口出现异常"));
          }
        });
      };

      //自定义验证 确认密码
      const validatePass = (rule, value, callback) => {
        if (this.addForm.checkPass !== "") {
          this.$refs.LoginFormRef.validateField("checkPass");
        }
        callback();
      };
      const validatePass2 = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请再次输入密码"));
        } else if (value !== this.addForm.password) {
          callback(new Error("两次输入密码不一致!"));
        } else {
          callback();
        }
      };
      return {
        //获取教师列表的参数对象
        queryInfo: {
          name: "",
          college: "",
          title: "",
          pagenum: 1, //当前页数
          pagesize: 10 //当前每页显示几条数据
        },

        //教师列表
        teacherList: [],

        //是否根据学院查询，学院管理员不需要
        showCollegeFlag: true,

        loading: false,

        //待选择的学院
        CollegesOptions: [],

        //待选择的教师职称
        TitleOptions: [
          {
            id: 0,
            name: '讲师',
          },
          {
            id: 1,
            name: '副教授',
          },
          {
            id: 2,
            name: '教授',
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
          title: [{required: true, message: "请选择职称", trigger: "blur"}]
        },

        //批量删除的id
        multipleSelection: [],

        offset: "",

        //添加教师 对话框的 显示与隐藏
        addDialogVisible: false,

        //添加教师的表单对象
        addForm: {
          name: "",
          username: "",
          password: "",
          checkPass: "",
          sex: "",
          college: "",
          title: ""
        },

        //添加表单的验证规则对象
        addFormRules: {
          name: [
            {required: true, message: "请输入姓名", trigger: "blur"},
            {
              pattern: /^[\u4E00-\u9FA5]+$/,
              message: "姓名只能为中文"
            }
          ],
          username: [
            {required: true, message: "请输入用户名", trigger: "blur"},
            {
              min: 3,
              max: 10,
              message: "用户名长度在4~10个字符之间",
              trigger: "blur"
            },
            {
              pattern: /[0-9a-zA-Z]{4,10}/,
              message: "用户名必须是由4-10位数字和字母组合"
            },
            {validator: validateUsername, trigger: "blur"}
          ],
          password: [
            {required: true, message: "请输入密码", trigger: "blur"},
            {validator: validatePass, trigger: "blur"},
            {
              pattern: /^(\w){6,20}$/,
              message: "只能输入6-20个字母、数字、下划线的组合"
            }
          ],
          checkPass: [{validator: validatePass2, trigger: "blur"}],
          sex: [{required: true, message: "请选择性别", trigger: "blur"}],
          college: [{required: true, message: "请选择学院", trigger: "blur"}],
          title: [{required: true, message: "请选择职称", trigger: "blur"}]
        }
      }
    },

    created() {
      //判断是超级管理员还是学院管理员
      const college = window.sessionStorage.getItem("college");

      if (parseInt(college) === 0) {
        this.offset = 6;
        this.loadAllCollege();
      } else {
        this.offset = 10;
        this.showCollegeFlag = false;
        this.queryInfo.college = college;
      }

      this.getTeacherList();
    },

    methods: {

      //获得教师列表
      async getTeacherList() {
        const {data: res} = await this.$http.get("teacher", {
          params: this.queryInfo
        });
        //console.log(res);
        if (res.code !== 200) {
          return this.$message.error("获取教师列表失败");
        }
        this.teacherList = res.data.teachers;
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
        this.getTeacherList(); //重新调用获得用户列表方法
      },

      //监听页码值改变的事件
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage; //页码值改变
        this.getTeacherList();
      },

      //根据ID删除教师
      async removeUserById(id, name) {
        const confirmResult = await this.$confirm(
            "此操作将删除 " + name + " 教师, 是否继续?",
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

        const {data: res} = await this.$http.delete("teacher/" + id);

        if (res.code !== 200) {
          return this.$message.error("删除教师失败！");
        }

        this.$message.success("删除教师成功！");
        this.getTeacherList();
      },

      //重置教师密码
      async resetPassword(id, name) {
        const confirmResult = await this.$confirm(
            "此操作将重置 [ " + name + " ] 的密码, 是否继续?",
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

        const {data: res} = await this.$http.put("teacher/resetPassword",
            {
              id: id,
              password: "123456"
            });

        if (res.code !== 200) {
          return this.$message.error("重置密码失败！");
        }

        this.$message.success("重置密码成功！");
      },

      //打开修改教师弹窗
      async showEditDialog(scope) {
        this.editForm = scope.row;
        this.editDialogVisible = true;
      },


      // 监听修改教师对话框的关闭事件
      editDialogClosed() {
        // 重置表单
        this.$refs.editFormRef.resetFields();
      },

      //修改教师信息
      editUserInfo() {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return; //预验证 未通过
          // 发起修改教师信息的数据请求
          const {data: res} = await this.$http.put(
              "teacher",
              this.editForm
          );

          if (res.code !== 200) {
            return this.$message.error("修改教师信息失败！");
          }

          // 关闭对话框
          this.editDialogVisible = false;
          // 刷新数据列表
          this.getTeacherList();
          // 提示修改成功
          this.$message.success("修改教师信息成功！");
        });
      },

      //批量删除处理
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      //批量删除教师
      async multiDelete() {
        if (this.multipleSelection.length === 0) {
          return this.$message.info("请先选择要删除的教师");
        }
        const confirmResult = await this.$confirm(
            "此操作将批量删除选中的教师, 是否继续?",
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
        const {data: res} = await this.$http.put("teacher/multiDelete", params);

        if (res.code !== 200) {
          return this.$message.error("删除教师失败！");
        }

        this.$message.success("删除教师成功！");
        this.getTeacherList();
      },

      //打开 添加教师弹窗 加载学院信息
      addDialogOpen() {
        this.addDialogVisible=true;
        this.loadAllCollege();
      },

      //添加教师对话框关闭事件
      addDialogClosed() {
        //对话框关闭时，表单重置
        this.$refs.addFormRef.resetFields();
      },

      //去数据库查询是否存在用户名
      async validateStudent(username) {
        const {data: res} = await this.$http.get("/teacher/byUsername/" + username);
        return res;
      },

      //添加教师
      async addUser() {
        const {data: res} = await this.$http.post("/teacher", this.addForm);
        if (res.code === 200) {
          this.$message.success(res.msg);
          this.addDialogVisible = false;
          this.getTeacherList();
        } else {
          this.$message.error(res.msg);
        }
      }
    }


  }
</script>

<style scoped>

</style>