<template>
  <div class="container menu2-1-container">
    <div class="filter-wrap">
      <el-button type="danger" @click="dels" >批量解锁</el-button>
    </div>
    <!-- 解锁 -->
    <el-dialog title="确认解除该账户的异常吗？" :visible.sync="delDialog" width="30%" > 
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialog = false">取 消</el-button>
        <el-button type="primary" @click="delConfirm" :loading="delConfirmLoading">确 定</el-button>
      </span>
    </el-dialog>
    <div class="recevie-wrap">
      <el-table border row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" >
         <el-table-column :show-overflow-tooltip="true" type="selection" > </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="userName" label="用户名"  ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="userTypeName" label="账户类型"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="abnormalTypeName" label="异常类型" ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="abnormalRemark" label="异常备注" ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="ip" label="异常IP" ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="login" label="登陆名称" ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="abnormalTime" label="异常时间" ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="del(scope.row.userID)">解锁</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
   
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { getList,getLists,getData,getDatas } from '@/api/price/price-1/common'
export default {
  data() {
    return {
      type:1,
      color:'#333',
      form:{},
      dialog1:false,
      delDialog: false,
      currentPage:1,
      tableData: [],
      total:0,
      multipleSelection: [],
      delIds:[],
      queryParams:{
        pageNum:1,
        pageSize:10
      },
      delConfirmLoading: false,
      addFormRules: []
    }
  },
  components: {
    Tinymce
  },
  mounted() {
    this.getList()
  },
  methods: {

    // 获取用户等级列表
    getList() {
      this.loading = true
      getLists(this.queryParams,'/user/abnormalUser/page').then(res => {
        if (res.code===1001){
          this.tableData = res.body.records
          this.total = res.body.total
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },


    // 解锁账户
    del(id) {
      this.delIds = [id]
      this.delDialog = true
    },
    // 批量解锁账户
    dels() {
      this.delIds = []
      this.multipleSelection.map(item => {
        this.delIds.push(item.userID)
      })
      if(this.multipleSelection.length > 0) {
        this.delDialog = true
      }else {
        this.$message({
          showClose: true,
          message: '请选择异常账户',
          type: 'error'
        });
      }
    },

    // 确认解锁
    delConfirm() {
      this.delConfirmLoading = true
      getDatas({id:this.delIds},'/user/abnormalUser/delete').then(res => {
        if (res.code===1001){
          this.$message({
            message: res.msg,
            type: 'success',
          });
          this.delIds = []
          this.getList()
        }else{
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'error',
          });
        }
        this.delDialog = false
        this.delConfirmLoading = false
      }).catch(err => {
        
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
  .tips {
    color:#909399;
    font-size:12px;
    line-height:20px;
    width:400px;
    margin-left:10px;
  }
  .tab-wrap {
    a {
      &.active {
        border-bottom:2px solid #409eff
      }
    }
  }
  .filter-wrap {
    margin-top:20px;
    display: flex;
    flex-wrap: wrap;
  }
  .handle-wrap {
    // margin-top:20px;
    margin-bottom:20px;
  }
  .handle-wrap-button{
    float: right;
    margin:30px auto;
  }
 }
.filter-wrap button {
    // float: right;
    // margin: 10px auto;
    margin-left: auto;
    margin-top: 10px;
    margin-bottom: 10px;

  }

</style>

