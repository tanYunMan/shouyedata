<template>
  <div class="container menu6-1-container">
    <div class="filter-wrap">
      <el-button type="primary" @click="addLevel(null)">新增站点域名</el-button>
    </div>
    <el-table border row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266','text-align':'center'}" size="mini" :cell-style="{'text-align':'center'}">
      <el-table-column prop="siteAliasAddr" label="域名地址"  ></el-table-column>
      <el-table-column prop="siteID" label="站点编号"  ></el-table-column>
      <el-table-column prop="name" label="备案人名称"></el-table-column>
      <el-table-column prop="card" label="备案人身份证"></el-table-column>
      <el-table-column prop="phone" label="备案人电话"></el-table-column>
      <el-table-column prop="addr" label="备案人地址"></el-table-column>
      <el-table-column prop="label10" label="操作"  fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="addLevel(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="delLevel(scope.row.siteAliasID)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"  :page-sizes="[10, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>

    <!-- 新增价格组/编辑 -->
    <el-dialog :title="addEdit" :visible.sync="dialog1" class="wl-dialog-style" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="formRules" label-width="140px">
        <el-form-item label="域名地址" prop="siteAliasAddr">
          <el-input v-model="form.siteAliasAddr" placeholder="请输入域名地址" style="max-width:350px"></el-input>
        </el-form-item>
        <el-form-item label="备案人名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入备案人名称" style="max-width:350px"></el-input>
        </el-form-item>
        <el-form-item label="备案人身份证" prop="card">
          <el-input v-model="form.card" placeholder="请输入备案人身份证" style="max-width:350px"></el-input>
        </el-form-item>
        <el-form-item label="备案人电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入备案人电话" style="max-width:350px"></el-input>
        </el-form-item>
        <el-form-item label="备案人地址" prop="addr">
          <el-input v-model="form.addr" placeholder="请输入备案人地址" style="max-width:350px"></el-input>
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
import { getList,goSetLevel,deleteData } from '@/api/price/price-1/index'
import { getLists,getDatas,postApplicationJson, getData } from '@/api/price/price-1/common'
export default {
  data() {
    return {
      color:'#333',
      addEdit: '新增站点域名',
      form:{},
      delDialog: false,
      setPriceDialog: false,
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
      userLevel:[],   // 用户级别
      userLevelList:[],   // 用户级别--使用
      formRules: {
        siteAliasAddr: [
          { required: true, message: '请输入域名地址', trigger: 'blur' },
        //   { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        card: [
          { max: 18, min: 18, message: '身份证长度为18位', trigger: 'blur' }
        ],
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

    // 获取站点域名列表
    getList() {
      this.loading = true
      getLists(this.queryParams, '/platform/siteAlias/page').then(res => {
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
      getData({id:this.delIds}, '/platform/siteAlias/delete').then(res => {
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
        this.addEdit = "新增站点域名"
        if (data) {
          this.addEdit = "编辑站点域名"
          this.form = {
              siteAliasID:data.siteAliasID,
              siteAliasAddr:data.siteAliasAddr,
              name:data.name,
              card:data.card,
              siteID:data.siteID,
              phone:data.phone,
              addr:data.addr,
            }
        }
    },

    // 新增编辑
    goSetLevel(form){
      let url 
      if(this.form.siteAliasID) {
        url = '/platform/siteAlias/update'
      } else {
        url = '/platform/siteAlias/add'
      }
      this.$refs[form].validate(async valid => {
        if (!valid) return null  // 如果验证失败就不往下继续执行
          goSetLevel(this.form,url).then(res => {
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







    // 确认定价操作
  

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
<style scoped lang="scss">
.container {
  
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