<template>
  <div class="container menu2-1-container">
    <div class="filter-wrap">
      <span>操作人：</span>
      <el-input size="small" v-model="queryParams.operUserID" placeholder="请输入操作人编号" style="width:200px"></el-input>

      <span style="padding-left:20px">客户编号：</span>
      <el-input size="small" v-model="queryParams.toUserID" placeholder="请输入客户编号" style="width:200px"></el-input>


      <span style="padding-left:20px">操作类型：</span>
      <el-select size="small" v-model="queryParams.operType" placeholder="请选择" clearable>
        <el-option
          v-for="item in operTypeList"
          :key="item.key"
          :label="item.text"
          :value="item.key">
        </el-option>
      </el-select>

      <span style="padding-left:20px">操作时间：</span>
      <el-date-picker size="small" style="width:400px" value-format="yyyy-MM-dd" format="yyyy-MM-dd" v-model="queryTime" @change="dataSearch"  type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
      <el-button type="primary" icon="el-icon-search" @click="getListFind">查询</el-button>
    </div>
    <div class="recevie-wrap">
      <el-table border row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266','text-align':'center'}" v-loading="loading" :cell-style="{'text-align':'center'}">
        <!--  <el-table-column :show-overflow-tooltip="true" type="selection" > </el-table-column> -->
         <el-table-column :show-overflow-tooltip="true" prop="operUserName" label="操作人"  ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="operUserID" label="操作编号"  ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="operTime" label="操作时间"  ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="toUserName" label="客户名称"  ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="toUserID" label="客户编号"  ></el-table-column>


         <el-table-column :show-overflow-tooltip="true" prop="operTypeName" label="操作类型"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="money" label="操作金额" ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="beforeMoney" label="操作前" ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="endMoney" label="操作后" ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="remark" label="备注"></el-table-column>
      </el-table>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>

    <!-- 备注 -->
    <el-dialog title="修改加/扣款备注" :visible.sync="dialog1" class="dialog1">
      <el-form ref="form" :model="form" label-width="140px">
        <el-form-item label="加/扣款客户：">
          <div>体面(10072)</div>
        </el-form-item>
        <el-form-item label="加/扣款备注：">
          <el-input type="textarea" :rows="5" placeholder="请输入加/扣款备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog1 = false">取 消</el-button>
        <el-button type="primary" @click="dialog1 = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { getList,getLists,getDatas } from '@/api/price/price-1/common'
export default {
  data() {
    return {
      form:{},
      dialog1:false,
      currentPage:1,
      tableData: [],
      total:0,
      queryParams:{
        pageNum:1,
        pageSize:10
      },
      loading: true,
      multipleSelection: [],
      operTypeList: [],//加扣款操作类型
      queryTime:[],
    }
  },
  components: {
    Tinymce
  },
  methods: {
    // 获取加扣款类型
    getOperTypeList(){
      getDatas({},'/finance/operMoney/getOperTypeList').then(res => {
        if (res.code===1001){
          this.operTypeList = res.body
        }
      }).catch(err => {
        
      })
    },

    // 处理时间改变
    dataSearch(val){
      if(this.queryTime){
        this.queryParams = {
          ...this.queryParams,
          operTimeStart:this.queryTime[0] + ' 00:00:00',
          operTimeEnd:this.queryTime[1]+ ' 23:59:59'
        }
      }else{
        delete this.queryParams.operTimeStart
        delete this.queryParams.operTimeEnd
      }
      this.getList()
    },

    getListFind(){
        this.loading = true
        this.queryParams.pageNum = 1
        this.getList()
    },

    
    // 用户支付记录列表
    getList() {
      getLists(this.queryParams,'/finance/operMoney/operPage').then(res => {
        this.tableData = res.body.records
        this.total = res.body.total
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.queryParams.pageNum = 1
      this.getList();
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
  created() {
    this.getList();
    this.getOperTypeList();
  },
}
</script>

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
      width:130px;
    }
  }
  .handle-wrap {
    // margin-top:20px;
    margin-bottom:20px;
  }
  
}
</style>

