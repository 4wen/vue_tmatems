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
        <el-table-column type="expand">
          <template slot-scope="props">

            <div class="comment-head">
              <el-input
                      placeholder="请输入评论。。。"
                      v-model="comment"
                      clearable>
              </el-input>
              <div class="comment-btn">
                <el-button
                        type="primary"
                        @click="addMcomment(props.row.id)">提交
                </el-button>
              </div>
            </div>

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

        comment: "",
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
        window.open("http://192.168.89.131/" + url);
      },

      //添加教学材料评论
      async addMcomment(mid) {
        if (this.comment === "") {
          return this.$message.error("输入评论不能为空！");
        }
        const {data: res} = await this.$http.post("mcomment", {
          uid: this.$store.state.user.id,
          mid: mid,
          content: this.comment
        });

        if (res.code !== 200) {
          //输入框重置
          this.comment = "";
          return this.$message.error("添加失败");

        } else {
          //输入框重置
          this.comment = "";
          return this.$message.success("添加成功");
        }
      }
    }

  }
</script>

<style lang="less" scoped>

  .comment-head {
    text-align: right;
    border: 0.5px solid #CAE1FF;
    border-radius: 10px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.19);
    padding: 5px;
    margin-bottom: 20px;
  }

  .comment-btn {
    margin: 5px auto 0px auto;
  }


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