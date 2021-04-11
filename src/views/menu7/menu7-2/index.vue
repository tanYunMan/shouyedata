<template>
  <div class="container menu7-3-container">
    <div class="filter-wrap">
      <span>查询关键字：</span>
      <el-input v-model="form.d" placeholder="请输入关键字" style="width:200px;"></el-input>
      <el-select v-model="form.type" placeholder="客户编号">
        <el-option label="客户编号" value="1"></el-option>
      </el-select>
      <el-select v-model="form.type" placeholder="全部交易类型">
        <el-option label="全部交易类型" value="1"></el-option>
        <el-option label="额度购买" value="1"></el-option>
        <el-option label="子站架设" value="1"></el-option>
        <el-option label="额度划拨" value="1"></el-option>
        <el-option label="额度扣除" value="1"></el-option>
        <el-option label="额度转让" value="1"></el-option>
      </el-select>
      <el-select v-model="form.type" placeholder="全部类型">
        <el-option label="全部类型" value="1"></el-option>
        <el-option label="普及版子站" value="1"></el-option>
        <el-option label="专业版子站" value="1"></el-option>
        <el-option label="旗舰版" value="1"></el-option>
        <el-option label="APP终端版" value="1"></el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-search">查询</el-button>
    </div>
    <el-table border row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" >
      <!--  <el-table-column :show-overflow-tooltip="true" type="selection" > </el-table-column> -->
       <el-table-column :show-overflow-tooltip="true" prop="label1" label="交易日期"  ></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label2" label="客户"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label3" label="交易类型" ></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label10" label="变动类型"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label10" label="扣款金额"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label10" label="交易数目"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label10" label="版本"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label10" label="备注"></el-table-column>
    </el-table>
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="400"> </el-pagination>
    
    
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
export default {
  data() {
    return {
      type:1,
      color:'#333',
      form:{},
      dialog1:false,
      currentPage:1,
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
      multipleSelection: []
    }
  },
  components: {
    Tinymce
  },
  methods: {
    handleSizeChange(val) {
      console.log(val)
    },
    handleCurrentChange(val) {
      console.log(val)
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

