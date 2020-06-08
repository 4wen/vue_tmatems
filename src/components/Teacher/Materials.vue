<template>
  <div>

    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/tcourse' }">我的课程</el-breadcrumb-item>
      <el-breadcrumb-item>{{cname}} 的教学材料</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑导航区域结束 -->

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="5">
        <el-col :span="2" :offset="22">
          <el-button type="primary" @click="addDialogOpen">添加教学材料</el-button>
        </el-col>
      </el-row>

      <el-table
              :data="materialList"
              style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="comment-body" v-for="i in props.row.mcommentList">
              <p class="author">{{i.name}}</p>
              <p class="comment">{{i.content}}</p>
              <p class="time">
                <span class="data">评论时间:</span>
                {{i.time}}
              </p>
            </div>

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
                label="已下载人数"
                prop="number"
                align='center'>
        </el-table-column>
        <el-table-column
                label="详情"
                prop="remark"
                :show-overflow-tooltip="true" align='center'/>
        <el-table-column label="操作" width="60px" align='center'>
          <template slot-scope="scope">
            <!-- 修改教学材料按钮 -->
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


    <!-- 添加教学材料对话框 -->
    <el-dialog title="添加教学材料"
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
              label-position="top"
      >
        <el-form-item label="材料说明:" prop="name">
          <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入材料说明"
                  v-model="addForm.remark">
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-upload
                  class="upload-demo"
                  ref="upload"
                  action=""
                  :limit="limit"
                  :http-request="uploadFile"
                  :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;"
                       size="small" type="success"
                       @click="submitUpload">上传到服务器</el-button>
            <div slot="tip" class="el-upload__tip">一次只能上传1个文件，且不超过50Mb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addMaterials">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
  export default {
    name: "Materials",
    data() {
      return {
        //课程名
        cname: "",

        //课程列表
        materialList: [],

        pagenum: 1, //当前页数
        pagesize: 10, //当前每页显示几条数据

        total: 0,

        //上传文件限制数
        limit: 1,

        addDialogVisible: false,

        //添加教学材料的表单对象
        addForm: {
          cid: "",
          name: "",
          remark: "",
          url: ""
        },

        //添加表单的验证规则对象
        addFormRules: {}
      }
    },

    created() {
      this.cname = window.sessionStorage.getItem("cname");
      this.addForm.cid = window.sessionStorage.getItem("cid");
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

      //打开 添加教学材料弹窗
      addDialogOpen() {
        this.addDialogVisible = true;
      },

      //添加对话框关闭事件
      addDialogClosed() {
        //对话框关闭时，表单重置
        this.$refs.addFormRef.resetFields();
      },

      //确认上传
      submitUpload() {
        this.$refs.upload.submit();
      },
      // 文件上传
      async uploadFile(params) {
        const _file = params.file;
        this.addForm.name = _file.name;

        let file = new FormData();
        file.append('file', params.file);

        const {data: res} = await this.$http.post("fileUpload", file);

        if (res.code === 200) {
          this.$message.success(res.msg);
          this.addForm.url = res.data.fileId;
        } else {
          this.$message.error(res.msg);
        }
      },


      //添加教学文件
      async addMaterials() {

        const {data: res} = await this.$http.post("materials", this.addForm);

        if (res.code === 200) {
          this.$message.success(res.msg);
          this.addDialogVisible = false;
          this.getMaterialList();
        } else {
          this.$message.error(res.msg);
        }
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

<style lang="less" scoped>
  .comment-body {
    margin-top: 5px;
    border: 0.5px solid #CAE1FF;
    border-radius: 10px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 5px 0 rgba(0, 0, 0, 0.19);
  }

  .author {
    padding-left: 5px;
    color: #6CA6CD;
    font-size: 16px;
  }

  .comment {
    padding-left: 25px;
  }

  .time {
    padding-left: 5px;
    font-size: 12px;
    color: #9FB6CD;
  }
</style>