<template>
  <div class="container menu6-1-container">
    <div class="filter-wrap">
      <el-button type="primary" icon="el-icon-edit" @click="addLevel(null)">全网通站点</el-button>
    </div>
    <el-table border row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" >
       <el-table-column :show-overflow-tooltip="true" prop="siteID" label="编号"  ></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="siteAliasAddr" label="域名地址"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label3" label="注册默认级别" ></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="upgradeFee" label="升级费用"  ></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label10" label="操作"  fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="addLevel(scope.row)">编辑</el-button>
          <el-button type="text" size="mini" @click="delLevel(scope.row.levelID)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"  :page-sizes="[10, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>

    <!-- 新增级别 -->
    <el-dialog title="新增级别" :visible.sync="dialog1"  class="dialog1" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="formRules" label-width="140px">
        <el-form-item label="客户级别名称" prop="levelName">
          <el-input v-model="form.levelName" placeholder="请输入客户级别名称" ></el-input>
        </el-form-item>
        <el-form-item label="客户升级费用" prop="upgradeFee">
          <el-input v-model="form.upgradeFee" placeholder="请输入客户级别名称" ></el-input>
        </el-form-item>
        <!--<el-form-item label="客户级别类型：">
          <el-select v-model="form.type" placeholder="经销体系">
            <el-option label="经销体系" value="1"></el-option>
          </el-select>
        </el-form-item>-->
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
import { getSiteList,goSetLevel,delConfirmLevel } from '@/api/platform/site/index'
export default {
  data() {
    return {
      color:'#333',
      form:{},
      delDialog: false,
      dialog1:false,
      delConfirmLoading: false,
      delIds:'',
      currentPage:1,
      total:0,
      tableData: [],
      multipleSelection: [],
      queryParams:{
        pageNum:1,
        pageSize:10
      },
      formRules: {
        levelName: [
          { required: true, message: '请输入客户级别名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        upgradeFee: [
          { required: true, message: '请输入升级金额', trigger: 'blur' },
          {
            validator(rule, value, callback) {
              if (value<0) {
                callback(new Error('输入金额不能小于0'));return
              }
              var reg = /^-?\d{1,4}(?:\.\d{1,2})?$/
              if (reg.test(value)) {
                callback()
              } else {
                callback(new Error('请输入正确格式的金额'))
              }
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  components: {
    Tinymce
  },
  mounted() {
    this.getSiteList()
  },
  methods: {

    closeDilog(form) {
      this.dialog1 = false;
      this.$refs[form].resetFields() // 将form表单重置
    },

    // 获取用户等级列表
    getSiteList() {
      this.loading = true
      getSiteList(this.queryParams).then(res => {
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
      delConfirmLevel({id:this.delIds}).then(res => {
        if (res.code===1001){
            this.$notify({
              title: res.msg,
              type: 'success'
            })
            this.getSiteList()
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
        if (data) {
            this.form = {levelID:data.levelID,levelName:data.levelName,upgradeFee:data.upgradeFee}
        }
    },

    // 新增编辑
    goSetLevel(form){
      let url 
      if(this.form.levelID) {
        url = '/site/userLevel/update'
      } else {
        url = '/site/userLevel/add'
      }
      this.$refs[form].validate(async valid => {
        if (!valid) return null  // 如果验证失败就不往下继续执行
          goSetLevel(this.form,url).then(res => {
            if (res.code===1001){
                this.$message({
                  message: res.msg,
                  type: 'success',
                });
                this.getSiteList()
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
      this.getSiteList()
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getSiteList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  }
}
</script>
<style lang="scss">

.menu6-1-container {
  .dialog1 {
    .el-dialog__body {
      overflow: auto;
      max-height:700px;
    }
    .el-input {
      width:300px;
    }
  }
}
</style>
<style scoped lang="scss">
.container {
  padding:20px;
  .header {
    background-color: #f0f9eb;
    color: #67c23a;
    padding:20px;
    border-radius: 5px;
    font-size:13px;
    li {
      padding:3px 0;
    }
  }
  .filter-wrap {
    margin-top:20px;
    display: flex;
    flex-wrap: wrap;
  }
  .filter-wrap button {
    // float: right;
    // margin: 10px auto;
    margin-left: auto;
    margin-top: 10px;
    margin-bottom: 10px;

  }
  .handle-wrap {
    // margin-top:20px;
    margin-bottom:20px;
  }
  
}
</style>

