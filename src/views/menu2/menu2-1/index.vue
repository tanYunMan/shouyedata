<template>
  <div class="container menu2-1-container">
    <div class="tab-wrap">
      <a to="sub1" class="active">首页公告</a>
      <!--<a to="sub1">行业动态</a>
      <a to="sub1">常见问题</a>
      <a to="sub1">帮助信息</a>
      <a to="sub1">最新动态</a>-->
    </div>
    <div class="filter-wrap">
      <el-button type="primary" @click="dialog1 = true">发布</el-button>
    </div>
    <div class="handle-wrap">
      <el-button-group>
        <el-button size="mini">显示</el-button>
        <el-button size="mini">隐藏</el-button>
        <el-button size="mini">删除</el-button>
      </el-button-group>
    </div>
    <el-table border row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" v-loading="loading">
       <el-table-column :show-overflow-tooltip="true" type="selection" > </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="systemNoticeTitle" label="公告标题"  ></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label2" label="公告类型"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="content" label="公告内容" ></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="createTime" label="添加时间"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label10" label="操作"  fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="getForm(scope.row)">修改</el-button>
          <el-button type="text" size="mini" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>

    <!-- 发布公告 -->
    <el-dialog title="发布公告" :visible.sync="dialog1" width="60%" class="dialog1" :close-on-click-modal="false">
      <el-form ref="form" :model="form" label-width="140px">
         <el-form-item label="公告类型：">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公告标题：">
          <el-input v-model="form.systemNoticeTitle" placeholder="请输入公告标题" style="float:left;"></el-input>
          <el-color-picker v-model="color" style="float:left;margin:0 20px"></el-color-picker>
          <!--<el-checkbox v-model="form.k">置顶</el-checkbox>-->
        </el-form-item>
        <el-form-item label="公告内容：">
          <tinymce v-model="form.content" :height="300" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog1 = false">取 消</el-button>
        <el-button type="primary" @click="publishNotice">发 布</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { getList,getLists,getData } from '@/api/price/price-1/common'
export default {
  data() {
    return {
      color:'#333',
      form:{},
      loading: true,
      dialog1:false,
      currentPage:1,
      tableData: [],
      total:0,
      queryParams:{
        pageNum:1,
        pageSize:10
      },
      options: [{
        value: '1',
        label: '登录前'
      }, {
        value: '2',
        label: '登录后'
      }],
      multipleSelection: []
    }
  },
  components: {
    Tinymce
  },
  mounted() {
    this.getList()
  },
  methods: {
    
    // 获取公告列表
    getList() {
      this.loading = true
      getLists(this.queryParams,'/site/systemNotice/page').then(res => {
        if (res.code===1001){
          this.tableData = res.body.records
          this.total = res.body.total
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },
    getForm(data){
      this.color = data.color
      this.form = {
        type:data.type,
        systemNoticeTitle: data.systemNoticeTitle,
        systemNoticeID: data.systemNoticeID,
        content: data.content
      }
    },
    // 发布或修改公共
    publishNotice(){
      console.log(this.form,78)
      if(!this.form.type) {
        this.$message({
          showClose: true,
          message: '请选择公告类型',
          type: 'error',
        });
      }else if (!this.form.systemNoticeTitle){
        this.$message({
          showClose: true,
          message: '请选择公告标题',
          type: 'error',
        });
      }else if (!this.form.content){
        this.$message({
          showClose: true,
          message: '请选择公告内容',
          type: 'error',
        });
      }else {
        this.form = {...this.form,color:this.color}
        let url = '/site/systemNotice/saveSystemNotice'
        getLists(this.form,url).then(res => {
          if (res.code===1001){
            this.$message({
              message: res.msg,
              type: 'success',
            });
            this.dialog1 = false
            this.form = {}
            this.color = '#333'
            this.getList()
          }else{
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error',
            });
          }
        }).catch(err => {
          
        })
      }
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
}
</script>
<style lang="scss">
.menu2-1-container {
  .dialog1 {
    .el-dialog__body {
      overflow: auto;
      max-height:700px;
    }
    .el-input {
      width:400px;
    }
  }
}
</style>
<style scoped lang="scss">
.container {
  padding:20px;
  .tab-wrap {
    a {
      &.active {
        border-bottom:2px solid #409eff
      }
    }
  }
  .filter-wrap {
    margin-top:20px;
  }
  .handle-wrap {
    // margin-top:20px;
    margin-bottom:20px;
  }
  
}
</style>

