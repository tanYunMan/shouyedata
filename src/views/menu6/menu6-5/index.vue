<template>
  <div class="container menu6-3-container">
    <div class="filter-wrap">
      <span style="margin-left:10px">客户编号：</span>
      <el-input v-model="queryParams.localUserID" placeholder="请输入用户编号" style="width:200px;"></el-input>

      <span style="margin-left:10px">客户名称：</span>
      <el-input v-model="queryParams.userName" placeholder="请输入用户名称" style="width:200px;"></el-input>



      <el-button style="margin-left:20px" type="primary" icon="el-icon-search" @click="queryFormList" :loading="loading">查询</el-button>
    </div>
    <el-table border row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266','text-align':'center'}" v-loading="loading" size="mini" :cell-style="{'text-align':'center'}">
       <el-table-column :show-overflow-tooltip="true" prop="localUserID" label="客户编号"  ></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="userName" label="客户名称"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="money" label="客户余额" ></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="oldMoney" label="消费金额"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="frozenMoney" label="冻结资金"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="saleMoney" label="未转余额"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label10" label="操作"  fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="infoMoney(scope.row)">查看明细</el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>


    <!-- 详情 -->
    <el-dialog :title="thisDataInfo.userName + '--客户明细'" :visible.sync="dialog1"  class="wl-dialog-style dialog1">
        <el-table border row-key="id" ref="multipleTable" :data="tableDataUser" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266','text-align':'center'}" v-loading="loading" size="mini" :cell-style="{'text-align':'center'}">
         <el-table-column :show-overflow-tooltip="true" prop="localUserID" label="客户编号" width="80"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="userName" label="客户名称"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="transactionTypeName" label="交易类型" ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="money" label="交易金额" width="100"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="beforeMoney" label="变化前（元）" width="100"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="endMoney" label="变化后（元）" width="100"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="createTime" label="交易日期"></el-table-column>
      </el-table>
      <el-pagination background @size-change="handleSizeChanges" @current-change="handleCurrentChanges" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="this.queryParamsUser.total || 0"> </el-pagination>
    </el-dialog>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { getList,getLists,getData } from '@/api/price/price-1/common'
export default {
  data() {
    return {
      form:{},
      loading: false,
      dialog1:false,
      thisDataInfo:{}, //当前查看的数据
      currentPage:1,
      orderType:1,
      queryTime:[],//查询时间
      tableData: [],
      tableDataUser: [],// 客户资金明细
      total:0,
      multipleSelection: [],
      queryParams:{
        pageNum:1,
        pageSize:20
      },
      queryParamsUser:{
        pageNum:1,
        pageSize:20
      },

    }
  },
  components: {
    Tinymce
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 获取用户余额
    getList() {
      this.loading = true
      getLists(this.queryParams,'/finance/userMoney/moneyPage').then(res => {
        if (res.code===1001){
          this.tableData = res.body.records
          this.total = res.body.total
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },


    // 获取客户资金明细
    getUserList() {
      this.loading = true
      getLists(this.queryParams,'/finance/userMoneyDetail/detailPage').then(res => {
        if (res.code===1001){
          this.tableDataUser = res.body.records
          this.queryParamsUser.total = res.body.total
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },

    // 查看详情
    infoMoney(data){
      this.dialog1 = true
      
      this.thisDataInfo = {
        userName:data.userName || data.localUserID || '所属(' + data.platformName + ')'
      }
      this.queryParams.userID = data.userID
      this.queryParamsUser = {
        userID:data.userID
      }
      
      this.getUserList()
    },

    // 查询
    queryFormList(){
      this.getList()
    },

    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getList()
    },

    // 客户资金明细
    handleSizeChanges(val) {
      this.queryParamsUser.pageSize = val
      this.queryParams.pageSize = val
      this.getUserList()
    },
    handleCurrentChanges(val) {
      this.queryParamsUser.pageNum = val
      this.queryParams.pageNum = val
      this.getUserList()
    },


    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  }
}
</script>
<style lang="scss">
.menu6-3-container {
  .tips {
    color:#909399;
    font-size:12px;
    line-height:20px;
    width:400px;
    margin-left:10px;
  }
  .dialog1 {
    .el-dialog__body {
      overflow: auto;
      max-height:700px;
    }
    
    .el-input {
      width:400px;
    }
    .el-pagination {
      .el-input {
        width:50px;
      }
    }
    .order-type1 {
      .item {
        margin-top:20px;
      }
      li {
        display:flex;
        padding:8px 0;
        // align-items: center;
        .label {
          font-weight: bold;
          margin-right:10px;
          width:120px;
          text-align: right;
        }
        .val {
          flex:1;
          font-size:14px;

        }
      }
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

