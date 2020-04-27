<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>教务管理</el-breadcrumb-item>
      <el-breadcrumb-item>学院管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑导航区域结束 -->

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="5">
        <el-col :span="4">
          <el-input placeholder="根据名字查找" clearable @clear="getCollegeList" v-model="queryInfo.name">
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" icon="el-icon-search" @click="getCollegeList">搜索</el-button>
        </el-col>

        <el-col :span="2" :offset="14">
          <el-button type="primary" @click="addClassesDialogOpen">添加班级</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="addDialogVisible = true">添加学院</el-button>
        </el-col>

      </el-row>

      <!-- 学院列表区域 -->
      <el-table
              :data="collegeList"
              border
              stripe
      >
        <el-table-column type="index" label="#" align='center'/>
        <!-- 学院展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, i1) in scope.row.gradeList"
                    :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="2">
                <el-tag>{{item1.name}}</el-tag>
                <i class="el-icon-caret-right"/>
              </el-col>

              <el-col :span="22">
                <el-tag v-for="(item2, i2) in item1.classesList"
                        :key="item2.id" type="success" closable @close="deleteClasses(item2.id,item2.name)">{{item2.name}}
                </el-tag>
              </el-col>
            </el-row>

            <!--             <pre>-->
            <!--              {{scope.row}}-->
            <!--            </pre>-->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column label="名称" prop="name" align='center'/>
        <el-table-column label="操作" width="120px" align='center'>
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip effect="dark" content="修改学院" placement="top" :enterable="false">
              <el-button
                      type="primary"
                      icon="el-icon-edit"
                      size="mini"
                      :disabled="scope.row.college === 0"
                      @click="updateCollege(scope)"
              />
            </el-tooltip>

            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="禁止删除学院" placement="top" :enterable="false">
              <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      disabled
                      @click="removeUserById(scope.row.id,scope.row.name)"
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

    <!-- 修改学院的对话框 -->
    <el-dialog title="修改学院"
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
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加学院对话框 -->
    <el-dialog title="添加学院"
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
      </el-form>

      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCollege">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加班级对话框 -->
    <el-dialog title="添加班级"
               :visible.sync="addClassesDialogVisible"
               width="400px"
               @close="addClassesDialogClosed">
      <!-- 主体部分 -->
      <el-form
              :model="addClassesForm"
              status-icon
              :rules="addClassesFormRules"
              ref="addClassesFormRef"
              label-width="70px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="addClassesForm.name" clearable/>
        </el-form-item>
        <el-form-item label="学院" prop="college">
          <el-select v-model="addClassesForm.college"
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
        <el-form-item label="年级" prop="level">
          <el-select v-model="addClassesForm.level"
                     placeholder="请选择年级"
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
        <el-button @click="addClassesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addClasses">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "College",
    data() {
      return {
        //获取学院列表的参数对象
        queryInfo: {
          name: "",
          pagenum: 1, //当前页数
          pagesize: 10 //当前每页显示几条数据
        },

        //管理员列表
        collegeList: [],

        loading: false,


        //分页总条数
        total: 0,

        //修改学院对话框的 显示与隐藏
        editDialogVisible: false,

        //修改学院的表单对象
        editForm: {},


        //修改表单的验证规则对象
        editFormRules: {
          name: [
            {required: true, message: "请输入学院", trigger: "blur"},
            {
              pattern: /^[\u4E00-\u9FA5]+$/,
              message: "请输入中文"
            }
          ]
        },


        //添加学院 对话框的 显示与隐藏
        addDialogVisible: false,

        //添加学院的表单对象
        addForm: {
          name: "",
        },

        //添加表单的验证规则对象
        addFormRules: {
          name: [
            {required: true, message: "请输入学院", trigger: "blur"},
            {
              pattern: /^[\u4E00-\u9FA5]+$/,
              message: "请输入中文"
            }
          ]
        },

        //添加班级 对话框的 显示与隐藏
        addClassesDialogVisible: false,

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
            name: '大四',
          }],

        //添加班级的表单对象
        addClassesForm: {
          name: "",
          college: "",
          level: ""
        },

        //添加班级表单的验证规则对象
        addClassesFormRules: {
          name: [
            {required: true, message: "请输入班级", trigger: "blur"},
          ],
          college: [{required: true, message: "请选择学院", trigger: "blur"}],
          level: [{required: true, message: "请选择年级", trigger: "blur"}]
        }
      }
    },

    created() {
      this.getCollegeList();
    },

    methods: {

      //获得学院列表
      async getCollegeList() {
        const {data: res} = await this.$http.get("college", {
          params: this.queryInfo
        });
        //console.log(res);
        if (res.code !== 200) {
          return this.$message.error("获取管理员列表失败");
        }
        this.collegeList = res.data.colleges;
        this.total = res.data.total;
      },


      //监听pagesize 改变的事件
      handleSizeChange(newSize) {
        // console.log(newSize);
        this.queryInfo.pagesize = newSize; //每页显示页数改变
        this.getCollegeList(); //重新调用获得用户列表方法
      },

      //监听页码值改变的事件
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage; //页码值改变
        this.getCollegeList();
      },

      //根据ID删除学院
      async removeUserById(id, name) {
        const confirmResult = await this.$confirm(
            "此操作将删除 " + name + " 是否继续?",
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

        const {data: res} = await this.$http.delete("college/" + id);

        if (res.code !== 200) {
          return this.$message.error("删除学院失败！");
        }

        this.$message.success("删除学院成功！");
        this.getCollegeList();
      },


      // 监听修改学院对话框的 关闭事件
      editDialogClosed() {
        // 重置表单
        this.$refs.editFormRef.resetFields();
      },

      updateCollege(scope) {
        this.editForm = scope.row;
        this.editDialogVisible = true;
      },

      //修改学院信息
      editUserInfo() {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return; //预验证 未通过
          // 发起修改学院信息的数据请求
          const {data: res} = await this.$http.put(
              "college",
              this.editForm
          );

          if (res.code !== 200) {
            return this.$message.error("修改学院信息失败！");
          }

          // 关闭对话框
          this.editDialogVisible = false;
          // 刷新数据列表
          this.getCollegeList();
          // 提示修改成功
          this.$message.success("修改学院信息成功！");
        });
      },


      //添加学院对话框关闭事件
      addDialogClosed() {
        //对话框关闭时，表单重置
        this.$refs.addFormRef.resetFields();
      },

      //去数据库查询是否存在学院名
      async validateStudent(username) {
        const {data: res} = await this.$http.get("/college/" + username);
        return res;
      },

      //添加学院
      async addCollege() {
        const {data: res} = await this.$http.post("/college", this.addForm);
        if (res.code === 200) {
          this.$message.success(res.msg);
          this.addDialogVisible = false;
          this.getCollegeList();
        } else {
          this.$message.error(res.msg);
        }
      },

      //加载所有学院
      async loadAllCollege() {
        const {data: res} = await this.$http.get("/loadAllCollege");
        if (res.code === 200) {
          this.CollegesOptions = res.data;
        }
      },

      //添加班级弹窗 打开事件
      addClassesDialogOpen() {
        this.loadAllCollege();
        this.addClassesDialogVisible = true;
      },

      //添加教师对话框关闭事件
      addClassesDialogClosed() {
        //对话框关闭时，表单重置
        this.$refs.addClassesFormRef.resetFields();
      },

      //添加班级
      async addClasses() {
        const date = new Date();
        const {data: res} = await this.$http.post("/classes",
            {
              name: this.addClassesForm.name,
              college: this.addClassesForm.college,
              level: date.getFullYear() - this.addClassesForm.level
            })
        ;
        if (res.code === 200) {
          this.$message.success(res.msg);
          this.addClassesDialogVisible = false;
          this.getCollegeList();
        } else {
          this.$message.error(res.msg);
        }
      },

      //删除班级
      //根据ID删除教师
      async deleteClasses(id, name) {
        const confirmResult = await this.$confirm(
            "此操作将删除 " + name + " ,是否继续?",
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
        this.getCollegeList();
      },

    }

  }
</script>

<style lang="less" scoped>
  .el-tag {
    margin: 7px;
  }

  .bdtop {
    border-top: 1px solid #eee;
  }

  .bdbottom {
    border-bottom: 1px solid #eee;
  }

  .vcenter {
    display: flex;
    align-items: center;
  }
</style>