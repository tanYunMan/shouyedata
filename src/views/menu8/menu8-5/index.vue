<template>
  <div class="container menu6-1-container">
    <div class="filter-wrap">
      <el-button type="primary" @click="addLevel(null)">新增投诉主题</el-button>
    </div>
    <el-table border row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" v-loading="loading">
       <el-table-column :show-overflow-tooltip="true" prop="themeID" label="编号"  ></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="themeName" label="投诉主题"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label10" label="操作"  fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="addLevel(scope.row)">编辑</el-button>
          <el-button type="text" size="mini" @click="delLevel(scope.row.themeID)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"  :page-sizes="[10, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>

    <!-- 新增域名/编辑 -->
    <el-dialog :title="addEdit" :visible.sync="dialog1"  class="dialog1" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="formRules" label-width="120px">
        <el-form-item label="投诉主题名称" prop="themeName">
        <el-col :span="8">
          <el-input v-model="form.themeName" placeholder="请输入投诉主题名称"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDilog('form')">取 消</el-button>
        <el-button type="primary" @click="goSetLevel('form')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除 -->
    <el-dialog title="确认删除" :visible.sync="delDialog" width="30%" > 
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialog = false">取 消</el-button>
        <el-button type="primary" @click="delConfirm" :loading="delConfirmLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { getList,getLists,getData,getDatas } from '@/api/price/price-1/common'
export default {
  data() {
    return {
      color:'#333',
      form:{},
      loading: true,
      addEdit:"新增投诉主题",
      delDialog:false,
      delConfirmLoading:false,
      dialog1:false,
      currentPage:1,
      checkList:[],
      total:0,
      queryParams:{
        pageNum:1,
        pageSize:10
      },
      tableData: [],
      multipleSelection: [],
      formRules: {
        themeName: [
          { required: true, message: '请输入投诉主题的名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    Tinymce
  },
  mounted() {
    this.getList()
  },
  methods: {

    closeDilog(form) {
      this.dialog1 = false;
      this.$refs[form].resetFields() // 将form表单重置
    },

    // 获取投诉主题列表
    getList() {
      this.loading = true
      getData(this.queryParams,'/order/complaintTheme/complaintThemePage').then(res => {
        if (res.code===1001){
          this.tableData = res.body.records
          this.total = res.body.total
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },

    // 删除
    delLevel(id) {
      this.delIds = id
      this.delDialog = true
    },
    delConfirm (){
      this.delConfirmLoading = true
      getDatas({ids:this.delIds},'/order/complaintTheme/deleteComplaintTheme').then(res => {
        if (res.code===1001){
            this.$notify({
              title: res.msg,
              type: 'success'
            })
            this.getList()
        } else {
            this.$notify.error({
              title: res.msg
            })
        }
        this.delDialog = false
        this.delConfirmLoading = false
      }).catch(err => {
        this.delDialog = false
        this.delConfirmLoading = false
      })
    },
    // 新增-编辑级别
    addLevel(data) {
        this.form = {}
        this.dialog1 = true
        this.addEdit = "新增投诉主题"
        if (data) {
          this.addEdit = "编辑投诉主题"
          this.form = {themeID:data.themeID,themeName:data.themeName}
        }
    },

    // 新增编辑
    goSetLevel(form){
      let url 
      if(this.form.themeID) {
        url = '/order/complaintTheme/updateComplaintTheme'
      } else {
        url = '/order/complaintTheme/saveComplaintTheme'
      }
      this.$refs[form].validate(async valid => {
        if (!valid) return null  // 如果验证失败就不往下继续执行
          getLists(this.form,url).then(res => {
            if (res.code===1001){
                this.$message({
                  message: res.msg,
                  type: 'success',
                });
                this.getList()
            } else {
              this.$message({
                showClose: true,
                message: res.msg,
                type: 'error',
              });
            }
            this.dialog1 = false
          }).catch(err => {
            this.dialog1 = false
          })
      })
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
    },
  }
}
</script>
<style lang="scss">
.menu8-4-container {
  .dialog1 {
    .el-dialog__body {
      overflow: auto;
      max-height:700px;
    }
    .el-input {
      // width:400px;
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
    .el-input,.el-select {
      width:150px;
    }
    button {
      float: right;
      margin: 10px auto;
    }
  }
  .handle-wrap {
    // margin-top:20px;
    margin-bottom:20px;
  }
  
}
</style>

