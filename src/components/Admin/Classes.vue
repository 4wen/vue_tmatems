<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>教务管理</el-breadcrumb-item>
      <el-breadcrumb-item>班级管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑导航区域结束 -->

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="5">
        <el-col :span="4">
          <el-select v-model="queryInfo.level"
                     placeholder="根据年级查询"
                     style="width: 100%"
                     clearable
          >
            <el-option
                    v-for="item in GradeOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    :disabled="item.disabled"
            />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-input placeholder="根据名字查找" clearable @clear="getClassesList" v-model="queryInfo.name">
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" icon="el-icon-search" @click="getClassesList">搜索</el-button>
        </el-col>

        <el-col :span="2" :offset=12>
          <el-button type="primary" @click="addDialogOpen">添加班级</el-button>
        </el-col>
      </el-row>

      <!-- 班级列表区域 -->
      <el-table
              :data="classesList"
              border
              stripe
      >
        <el-table-column type="index" label="#" align='center'/>
        <!-- 索引列 -->
        <el-table-column label="名称" prop="name" align='center'/>
        <el-table-column label="所属学院" prop="collegeName" align='center'/>
        <el-table-column label="入学时间(年)" prop="level" align='center'/>
        <el-table-column label="操作" width="120px" align='center'>
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip effect="dark" content="修改班级" placement="top" :enterable="false">
              <el-button
                      type="primary"
                      icon="el-icon-edit"
                      size="mini"
                      @click="showEditDialog(scope)"
              />
            </el-tooltip>

            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除班级" placement="top" :enterable="false">
              <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      @click="removeClassesById(scope.row.id,scope.row.name)"
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

    <!-- 修改班级的对话框 -->
    <el-dialog title="修改班级"
               :visible.sync="editDialogVisible"
               width="400px"
               @close="editDialogClosed">
      <el-form :model="editForm"
               :rules="editFormRules"
               ref="editFormRef"
               label-width="70px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="editForm.name"/>
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
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editClassesInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加班级对话框 -->
    <el-dialog title="添加班级"
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
        <el-form-item label="名称" prop="name">
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
      </el-form>

      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addClasses">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Classes",
    data() {
      return {
        //获取班级列表的参数对象
        queryInfo: {
          college: "",
          name: "",
          level: "",
          pagenum: 1, //当前页数
          pagesize: 10 //当前每页显示几条数据
        },

        //班级列表
        classesList: [],

        //是否根据学院查询，学院管理员不需要
        showCollegeFlag: true,

        loading: false,

        //待选择的学院
        CollegesOptions: [],

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
            name: '大四'
          }],

        //分页总条数
        total: 0,

        //修改班级对话框的 显示与隐藏
        editDialogVisible: false,

        //修改用户的表单对象
        editForm: {},


        //添加表单的验证规则对象
        editFormRules: {
          name: [
            {required: true, message: "请输入班级名称", trigger: "blur"},
          ],
          college: [{required: true, message: "请选择学院", trigger: "blur"}],
          level: [{required: true, message: "请选择年级", trigger: "blur"}]
        },


        //添加班级 对话框的 显示与隐藏
        addDialogVisible: false,

        //添加班级的表单对象
        addForm: {
          name: "",
          college: "",
          level: ""
        },

        //添加表单的验证规则对象
        addFormRules: {
          name: [
            {required: true, message: "请输入班级名称", trigger: "blur"},
          ],
          level: [{required: true, message: "请选择年级", trigger: "blur"}]
        }
      }
    },

    created() {
      this.getClassesList();
      this.queryInfo.college = window.sessionStorage.getItem("college");
      this.addForm.college = window.sessionStorage.getItem("college");

      const date = new Date();
      this.GradeOptions.forEach(function (value, key) {
        value.id = date.getFullYear() - value.id;
      });
      console.log(this.GradeOptions);



    },

    methods: {

      //获得班级列表
      async getClassesList() {
        const {data: res} = await this.$http.get("classes", {
          params: this.queryInfo
        });
        //console.log(res);
        if (res.code !== 200) {
          return this.$message.error("获取班级列表失败");
        }
        this.classesList = res.data.classess;
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
        this.getClassesList(); //重新调用获得用户列表方法
      },

      //监听页码值改变的事件
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage; //页码值改变
        this.getClassesList();
      },

      //根据ID删除班级
      async removeClassesById(id, name) {
        const confirmResult = await this.$confirm(
            "此操作将删除 " + name + ",是否继续?",
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

        const {data: res} = await this.$http.delete("classes/" + id);

        if (res.code !== 200) {
          return this.$message.error("删除班级失败！");
        }

        this.$message.success("删除班级成功！");
        this.getClassesList();
      },


      //打开修改班级弹窗
      async showEditDialog(scope) {
        this.editForm = scope.row;
        this.editDialogVisible = true;
      },


      // 监听修改班级对话框的关闭事件
      editDialogClosed() {
        // 重置表单
        this.$refs.editFormRef.resetFields();
      },

      //修改班级信息
      editClassesInfo() {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return; //预验证 未通过
          // 发起修改班级信息的数据请求
          const {data: res} = await this.$http.put(
              "classes",
              this.editForm
          );

          if (res.code !== 200) {
            return this.$message.error("修改班级信息失败！");
          }

          // 关闭对话框
          this.editDialogVisible = false;
          // 刷新数据列表
          this.getClassesList();
          // 提示修改成功
          this.$message.success("修改班级信息成功！");
        });
      },

      //打开 添加班级弹窗 加载学院信息
      addDialogOpen() {
        this.addDialogVisible = true;
        this.loadAllCollege();
      },

      //添加班级对话框关闭事件
      addDialogClosed() {
        //对话框关闭时，表单重置
        this.$refs.addFormRef.resetFields();
      },


      //添加班级
      async addClasses() {
        const {data: res} = await this.$http.post("/classes", this.addForm);
        if (res.code === 200) {
          this.$message.success(res.msg);
          this.addDialogVisible = false;
          this.getClassesList();
        } else {
          this.$message.error(res.msg);
        }
      }
    }

  }
</script>

<style scoped>

</style>