<template>
  <div class="container menu6-3-container">
    <div class="filter-wrap">
      <span>订单编号：</span>
      <el-input v-model="queryParams.orderCode" placeholder="请输入订单编号" style="width:200px;"></el-input>
      <span style="margin-left:10px">用户编号：</span>
      <el-input v-model="queryParams.localUserID" placeholder="请输入用户编号" style="width:200px;"></el-input>

      <span style="margin-left:10px">商户号：</span>
      <el-input v-model="queryParams.paySn" placeholder="请输入商户号" style="width:200px;"></el-input>

      <span style="margin-left:10px">变动类型：</span>
      <el-select v-model="queryParams.transactionType" placeholder="请选择" clearable @clear="setValueNull()">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
 
      <el-date-picker style="width:400px;" value-format="yyyy-MM-dd" format="yyyy-MM-dd" @change="dataSearch" v-model="queryTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
      <el-button type="primary" icon="el-icon-search" @click="queryFormList" :loading="loading">查询</el-button>
    </div>
    <el-table border row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266','text-align':'center'}" v-loading="loading" size="mini" :cell-style="{'text-align':'center'}">
       <el-table-column :show-overflow-tooltip="true" prop="localUserID" label="客户编号"  ></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="userName" label="客户名称"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="transactionTypeName" label="交易类型" ></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="money" label="交易金额"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="beforeMoney" label="变化前（元）"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="endMoney" label="变化后（元）"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="createTime" label="交易日期"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label10" label="操作"  fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="infoMoney(scope.row)">详情</el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>


    <!-- 详情 -->
    <el-dialog :title="thisDataInfo.userName + '--详情信息'" :visible.sync="dialog1"  class="dialog1">
      <el-form ref="thisDataInfo" :model="thisDataInfo" label-width="140px">
        <el-form-item label="客户编号" v-if="thisDataInfo.localUserID" >
          <el-input v-model="thisDataInfo.localUserID" placeholder="这里是客户编号" ></el-input>
        </el-form-item>
        <el-form-item label="客户名称" v-if="thisDataInfo.userName" >
          <el-input v-model="thisDataInfo.userName" placeholder="这里是客户名称" ></el-input>
        </el-form-item>
        <el-form-item label="商户号" v-if="thisDataInfo.paySn" >
          <el-input v-model="thisDataInfo.paySn" placeholder="这里是商户号" ></el-input>
        </el-form-item>
        <el-form-item label="订单编号" v-if="thisDataInfo.orderID" >
          <el-input v-model="thisDataInfo.orderID" placeholder="这里是订单编号" ></el-input>
        </el-form-item>
      </el-form>
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
      options: [{
        value: 1,
        label: '订单扣款'
      }, {
        value: 2,
        label: '订单退款'
      }, {
        value: 3,
        label: '充值到账'
      }, {
        value: 4,
        label: '前台加款'
      }, {
        value: 5,
        label: '前台减款'
      }, {
        value: 6,
        label: '管理员加款'
      }, {
        value: 7,
        label: '管理员减款'
      }],
      value: '',
      loading: false,
      dialog1:false,
      thisDataInfo:{}, //当前查看的数据
      currentPage:1,
      orderType:1,
      queryTime:[],//查询时间
      tableData: [
        {
          label1:'1',
          label2:'名称',
          label3:'0.0',
          label5:'自动发货',
          label6:'目录',
          label7:'99',
          label8:'10'
        },
      ],
      total:0,
      multipleSelection: [],
      queryParams:{
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
    // 获取用户等级列表
    getList() {
      this.loading = true
      getLists(this.queryParams,'/finance/userMoneyDetail/detailPage').then(res => {
        if (res.code===1001){
          this.tableData = res.body.records
          this.total = res.body.total
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },

    // 处理时间改变
    dataSearch(){
      console.log(this.queryTime,6)
      if(this.queryTime){
        this.queryParams = {
          ...this.queryParams,
          beginTime:this.queryTime[0] + ' 00:00:00',
          endTime:this.queryTime[1]+ ' 23:59:59'
        }
      }else{
        delete this.queryParams.beginTime
        delete this.queryParams.endTime
      }
    },

    // 查看详情
    infoMoney(data){
      this.dialog1 = true
      this.thisDataInfo = data
    },

    // 清空筛查条件
    setValueNull(){
      delete this.queryParams.transactionType
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

