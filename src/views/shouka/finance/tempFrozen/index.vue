<template>
  <div class="container menu8-1-container">
    <div class="filter-wrap">
      <span>订单号：</span>
      <el-input v-model="queryParams.orderCode" placeholder="请输入订单号" style="width:200px;"></el-input>

      <el-date-picker v-model="selectDatetime" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" @change="dataSearch" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"> </el-date-picker>

      <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
    </div>
    <el-table border row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" >
       <el-table-column :show-overflow-tooltip="true" prop="orderCode" label="订单号" width="200" ></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="money" label="金额" width="300"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="beforeMoney" label="交易前" width="80"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="endMoney" label="交易后"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="createTime" label="时间"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="state" label="状态">
          <template slot-scope="scope">
              <span :style="orderStateColor(scope.row.state)">{{orderState(scope.row.state)}}</span>
          </template>
      </el-table-column>
      
    </el-table>
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>

    
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { getList,getLists,getData,getDatas } from '@/api/price/price-1/common'
export default {
  data() {
    return {
      color:'#333',
      form:{
        tui:1,
        tui1:1
      },
      selectDatetime:'',//搜索选择的日期
      dialog1:false,
      loading: false,
      currentPage:1,
      orderType:1,
      total:0,
      tableData: [],
      tableMoneyData: [],//资金详情
      tableRefundData: [],//退款详情
      tableSiteMoneyData: [],//商务资金明细
      goodsType: [],
      queryParams:{
        pageNum:1,
        pageSize:10,
      },
      multipleSelection: [],
      dataInfo:{
        baseInfo:{}
      }  // 订单详情
    }
  },
  components: {
    Tinymce
  },
  mounted() {
    this.getList()
    this.goodsTypeList()
  },
  methods: {
    
    
    // 订单状态--颜色
    orderStateColor(type) {
        switch(type){
        
          case 1:
            return 'color:green'
            break;
          case 2:
            return 'color:blue'
            break;
          case 3:
            return 'color:red'
            break;
         
          default:
            return 'color:#909399'
        }
    },

    

    // 订单状态
    orderState(type) {
        switch(type){

          case 1:
            return '销售冻结'
            break;
          case 2:
            return '投诉冻结'
            break;
          case 3:
            return '永久冻结'
            break;
          default:
            return '未知'
        }
    },


    // 获取列表
    getList() {
      this.loading = true
      getLists(this.queryParams,'/finance/tempFrozenMoneyDetail/page').then(res => {
          console.log(res)
        if (res.code===1001){
          this.tableData = res.body.records
          this.total = res.body.total
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },

     

    dataSearch() {
      this.getListByDataTime();
    },
    async initData(data) {
      //获取当前时间
      var now   = new Date();
      var monthn = now.getMonth()+1;
      var yearn  = now.getFullYear();
      var dayn = now.getDate();
      var h = now.getHours();
      var m =now.getMinutes();
      var s = now.getSeconds();
      this.selectDatetime = yearn+"-"+monthn+"-"+dayn+" "+h+":"+m+":"+s;

      this.selectUser = parseInt(sessionStorage.getItem("userid"));
      this.getListByDataTime();
    },
    async getListByDataTime(data) {

    },

   
    // 查询
    query() {
      if(this.selectDatetime){
          this.queryParams = {...this.queryParams,beginTime:this.selectDatetime[0],endTime:this.selectDatetime[1]}
      }else{
          this.queryParams = {...this.queryParams,beginTime:'',endTime:''}
      }
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
    searchTime (index) {
      const arr = []
      if (index === 1) {
        arr[0] = this.$moment().subtract(index, "days").format("YYYY-MM-DD")+" 00:00:00"
        arr[1] = this.$moment().format("YYYY-MM-DD")+" 00:00:00"
        this.selectDatetime = arr
      } else {
        arr[0] = this.$moment().subtract(index, "days").format("YYYY-MM-DD")+" 00:00:00"
        arr[1] = this.$moment().format("YYYY-MM-DD")+" 00:00:00"
        this.selectDatetime = arr
      }
      this.query()
    }
  }
}
</script>
<style lang="scss">
.el-hidden-tc {
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
  width: 100%;
  border: none;
}
.el-class-number .el-input .el-input__inner{
  width: 130px;
}

.menu8-1-container {
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
    .el-input,.el-select {
      width:130px;
    }
  }
  .handle-wrap {
    // margin-top:20px;
    margin-bottom:20px;
  }
  
}
</style>

