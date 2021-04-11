<template>
  <div class="container menu2-1-container">
    <div class="filter-wrap">
      <span>查询关键字：</span>
      <el-input v-model="forms.keyword" placeholder="请输入关键字" style="width:200px"></el-input>
      <el-select v-model="forms.type" placeholder="请选择查询类型">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-search" @click="queryList">查询</el-button>
    </div>
    
    <div class="recevie-wrap">
      <el-table border row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" >
        <!--  <el-table-column :show-overflow-tooltip="true" type="selection" > </el-table-column> -->
         <el-table-column :show-overflow-tooltip="true" prop="userCode" label="员工编号"  ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="userName" label="员工登录名"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="状态">
          <template slot-scope="scope">
            <div>
              <el-button type="info" plain size="mini" v-show="scope.row.userState == 2" @click="updateState(scope.row)" :loading="stateLoading">禁用</el-button>
              <el-button type="primary" plain size="mini" style="margin-left:0" v-show="scope.row.userState == 1" @click="updateState(scope.row)" :loading="stateLoading">正常</el-button>
            </div>
          </template>
        </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="安全绑定服务器" width="500">
          <el-button-group>
            <el-button @click="TipsMessage" type="mini" size="mini">登录密码</el-button>
            <el-button @click="TipsMessage" size="mini">验证登录IP与操作IP</el-button>
            <el-button @click="TipsMessage" size="mini">交易密码</el-button>
          </el-button-group>
        </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="密码重置"f width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="ResetPassword(scope.row,1)" >登录密码</el-button>
            <el-button size="mini" @click="ResetPassword(scope.row,1)" >交易密码</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>






    <!-- 重置密码 -->
    <el-dialog :title="ResetInfo.title" :visible.sync="dialog1" class="dialog1" width="40%">
      <ul class="reset_ul">
        <li>
          <span class="label">员工编号：</span>
          <span class="val">{{ResetInfo.userCode || ''}}</span>
        </li>
        <li>
          <span class="label">员工名称：</span>
          <span class="val">{{ResetInfo.userName || ''}}</span>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog1 = false">取 消</el-button>
        <el-button type="primary" @click="SubmitReset" :loading="submitloading">确 定</el-button>
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
      type:1,
      color:'#333',
      stateLoading: false,
      form:{},
      forms:{},// 搜索条件
      submitloading: false,
      dialog1:false,
      currentPage:1,
      tableData: [],
      options: [
        {
          value: '1',
          label: '员工编号'
        },
        {
          value: '2',
          label: '员工名称'
        }
      ],
      queryParams:{
        pageNum:1,
        pageSize:10,
        userType:3,
      },
      total:0,
      multipleSelection: [],
      ResetInfo: {
        title: '重置登录密码',
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
    // 获取用户等级列表
    getList() {
      this.loading = true
      getLists(this.queryParams,'/user/user/pageSite').then(res => {
        if (res.code===1001){
          this.tableData = res.body.records
          this.total = res.body.total
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },


    //  提示语 
    TipsMessage (){
      this.$message({
        showClose: true,
        message: '功能暂未开放,请耐心等待~',
        type: 'error',
      });
    },

    // 查询列表
    queryList (){
      if(!this.forms.type){
        this.$message({
          showClose: true,
          message: '请选择查询类型',
          type: 'error',
        });
        return
      }

      if(!this.forms.keyword){
        this.$message({
          showClose: true,
          message: '请输入查询关键字',
          type: 'error',
        });
        return
      }

      this.queryParams = {
        pageNum:1,
        pageSize:10,
        userType:3,
      }
      if (this.forms.type === '1') {// 员工编号 
          this.queryParams = { ...this.queryParams,userCode:this.forms.keyword}
      } else if (this.forms.type === '2') {// 员工名称
          this.queryParams = { ...this.queryParams,userName:this.forms.keyword}
      }
      
      this.getList()
    },
    // 状态改变
    updateState(item) {
      this.stateLoading = true
      getLists({
        userID:[item.userID],
        userState:(item.userState == 1 ? 2 : 1)
      },'/user/user/updateUserState').then(res => {
        this.getList()
        this.stateLoading = false
      }).catch(err => {
        this.stateLoading = false
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

    // 重置密码
    ResetPassword (data,type) {
      if (type === 1) {
        this.ResetInfo = {
          title: '重置登录密码',
          userName: data.userName,
          userCode: data.userCode,
          userID: data.userID,
          type: type
        }
      } else {
        this.ResetInfo = {
          title: '重置交易密码',
          userName: data.userName,
          userCode: data.userCode,
          userID: data.userID,
          type: type
        }
      }
      this.dialog1 = true
    },

    // 提交重置密码
    SubmitReset (){
      this.submitloading = true
      let url
      if (this.ResetInfo.type === 1) {
        url = "/user/user/resetUserPassword"   // 重置登录密码
      } else {
        url = "/user/user/resetTransactionPassword"   // 重置登录密码
      }
      getLists({userID:this.ResetInfo.userID},url).then(res => {
        if (res.code===1001){
          this.$message({
            message: res.msg,
            type: 'success',
          });
          this.dialog1 = false
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'error',
          });
        }
        this.submitloading = false
      }).catch(err => {
        this.submitloading = false
      })

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
  }
  .handle-wrap {
    // margin-top:20px;
    margin-bottom:20px;
  }

  .reset_ul li {
    font-size:14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
  }
  .reset_ul li .label {
    font-weight: 600;
  }
  
}
</style>

