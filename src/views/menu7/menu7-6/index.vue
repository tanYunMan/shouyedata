<template>
  <div class="container menu7-5-container">
    <el-alert
      show-icon
      title="分站销售额排名(前100名)"
      type="success"
      style="margin-bottom:10px;"
      :closable="false"
    ></el-alert>

    <div class="filter-wrap">
      <span>查询条件：</span>
      <el-date-picker
        v-model="page.t"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <el-button type="primary" icon="el-icon-search">查询</el-button>
    </div>

    <el-table
      border
      row-key="id"
      ref="multipleTable"
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      :header-cell-style="{background:'#f5f5f5',color:'#606266'}"
    >
      <el-table-column :show-overflow-tooltip="true" type="selection"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="siteName" label="站点名称"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="siteDomain" label="域名"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="money" label="价格(元)"></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="label9"
        label="操作"
        align="center"
        width="250"
      >
        <template slot-scope="scope">
          <el-button type="text" size="mini">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.pageNum"
      :page-sizes="[10, 20, 30]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total"
    ></el-pagination>
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
import {
  getLists,
  getDatas,
  postApplicationJson,
} from "@/api/price/price-1/common";
export default {
  data() {
    return {
      color: "#333",
      dialog1: false,
      dialog2: false,
      currentPage: 1,
      page: {
        pageNum: 1,
        pageSize: 20,
      },
      checkList: [],
      tableData: [
      ],
      multipleSelection: [],
    };
  },
  components: {
    Tinymce,
  },
  created(){
    this.getList()
  },
  methods: {
    handleSizeChange(val) {
      this.page.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.page.pageNum = val
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getList() {
      getDatas(this.page, "/platform/sitePackageSize/getSubSiteSale").then(
        (res) => {
          this.tableData = res.body.records;
          this.page.total = res.body.total;
        }
      );
    },
  },
};
</script>
<style lang="scss">
.menu7-5-container {
  .dialog1 {
    .el-dialog__body {
      overflow: auto;
      max-height: 700px;
    }
    .el-input {
      width: 400px;
    }
    .tips {
      color: #909399;
      font-size: 12px;
      margin-left: 10px;
    }
  }
  .dialog2 {
    li {
      padding: 7px 0;
      display: flex;
      align-items: center;
      .label {
        width: 120px;
        text-align: right;
        margin-right: 10px;
      }
      a {
        color: #409eff;
      }
    }
  }
}
</style>
<style scoped lang="scss">
.container {
  padding: 20px;
  .tips {
    color: #909399;
    font-size: 12px;
    line-height: 20px;
    width: 400px;
    margin-left: 10px;
  }
  .tab-wrap {
    a {
      &.active {
        border-bottom: 2px solid #409eff;
      }
    }
  }
  .filter-wrap {
    margin-top: 20px;
  }
  .handle-wrap {
    // margin-top:20px;
    margin-bottom: 20px;
  }
}
</style>

