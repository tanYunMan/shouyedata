<template>
  <div class="container menu2-1-container">
    <div class="filter-wrap">
      <span>查询关键字：</span>
      <el-input v-model="form.d" placeholder="请输入关键字" style="width:200px"></el-input>
      <el-select v-model="form.type" placeholder="客户编号">
        <el-option label="客户编号" value="1"></el-option>
        <el-option label="用户名" value="2"></el-option>
        <el-option label="公司名称" value="3"></el-option>
        <el-option label="上级编号(直属上级)" value="3"></el-option>
      </el-select>
      <el-select v-model="form.type" placeholder="全部级别">
        <el-option label="全部级别" value="1"></el-option>
        <el-option label="无事" value="2"></el-option>
        <el-option label="最高密价" value="3"></el-option>
        <el-option label="密价" value="3"></el-option>
        <el-option label="对接等级" value="3"></el-option>
        <el-option label="站长" value="3"></el-option>
        <el-option label="SVIP" value="3"></el-option>
        <el-option label="VIP3" value="3"></el-option>
        <el-option label="VIP2" value="3"></el-option>
        <el-option label="VIP1" value="3"></el-option>
        <el-option label="VIP" value="3"></el-option>
      </el-select>
      
      <el-button type="primary" icon="el-icon-search">查询</el-button>
    </div>
    <div class="recevie-wrap">
      <el-table border row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266','text-align':'center'}" v-loading="loading" size="mini" :cell-style="{'text-align':'center'}">
        <!--  <el-table-column :show-overflow-tooltip="true" type="selection" > </el-table-column> -->
         <el-table-column :show-overflow-tooltip="true" prop="localUserID" label="客户编号"  ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="userName" label="用户名"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="money" label="余额" ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="frozenMoney" label="冻结" ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="bondMoney" label="已消费" ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="saleMoney" label="未转入" ></el-table-column>
      </el-table>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>

  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { getLists,getDatas } from '@/api/price/price-1/common'
export default {
  data() {
    return {
      type:1,
      color:'#333',
      form:{},
      dialog1:false,
      currentPage:1,
      loading: true,
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
      queryParams:{
        pageNum:1,
        pageSize:10
      },
      total:0,
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
    // 获取用户等级列表
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
    .el-input,.el-select {
    }
  }
  .handle-wrap {
    // margin-top:20px;
    margin-bottom:20px;
  }
  
}
</style>

