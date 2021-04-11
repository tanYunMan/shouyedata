<template>
  <div class="container menu6-1-container">
    <el-table
      :header-cell-style="{background:'#f5f5f5',color:'#606266','text-align':'center'}"
      size="mini"
      :cell-style="{'text-align':'center'}"
      border
      style="width: 100%"
      v-loading="isLoading"
      :data="tableData"
    >
      <el-table-column prop="userID" label="用户编号"></el-table-column>
      <el-table-column prop="money" label="金额"></el-table-column>
      <el-table-column prop="applyTime" label="申请时间"></el-table-column>
      <el-table-column prop="fee" label="手续费"></el-table-column>
      <el-table-column prop="statu" label="状态">
        <template slot-scope="{row}">
          <el-tag type="info" size="mini" v-if="row.statu === 1">待审核</el-tag>
          <el-tag type="success" size="mini" v-if="row.statu === 2">成功</el-tag>
          <el-tag type="danger" size="mini" v-if="row.statu === 3">失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button v-if="row.statu === 1" type="text" size="mini" @click="toVerify(row)">审核</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[10, 20, 30]"
      :page-size="query.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="query.totalCount"
    ></el-pagination>

    <el-dialog title="审核" :visible.sync="verifyDialog" width="30%">
      <span>
        <el-row :gutter="20">
          <el-form label-width="80px">
            <el-col :span="12" :offset="0">
              <el-form-item label="用户编号">{{sale.localUserID}}</el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item label="用户ID">{{sale.userID}}</el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item label="申请金额">{{sale.money}}</el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item label="申请时间">{{sale.applyTime}}</el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </span>
      <span slot="footer">
        <el-button type="primary" @click="verifySale(2)">审核通过</el-button>
        <el-button type="danger" @click="verifySale(3)">不通过</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getLists,
  getDatas,
  postApplicationJson,
} from "@/api/price/price-1/common";
import Tinymce from "@/components/Tinymce";
export default {
  data() {
    return {
      isLoading: true,
      tableData: [],
      query: {
        pageSize: 20,
        pageNum: 1,
        totalCount: 0,
      },
      verifyDialog: false,
      sale: {},
    };
  },
  components: {
    Tinymce,
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 获取列表
    getList() {
      this.isLoading = true;
      getLists(this.query, "/finance/saleMoneyApply/page")
        .then((res) => {
          if (res.code === 1001) {
            this.tableData = res.body.records;
            this.tableData.totalCount = res.body.total;
          }
          this.isLoading = false;
        })
        .catch((err) => {
          this.isLoading = false;
        });
    },
    verifySale(state) {
      getLists({result: state, saleMoneyApplyID: this.sale.saleMoneyApplyID}, '/finance/saleMoneyApply/audit').then(res=>{
        if(res.code === 1001) {
          this.$message.success('操作成功')
          this.verifyDialog = false
          this.getList()
        }
      })
    },
    toVerify(row) {
      this.sale = row;
      this.verifyDialog = true;
    },
    handleSizeChange(val) {
      this.query.pageNum = 1;
      this.query.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.query.pageNum = val;
      this.getList();
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  .filter-wrap {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
  }
  .filter-wrap button {
    margin-left: auto;
    margin-top: 10px;
    margin-bottom: 10px;

    // float: right;
    // margin: 10px auto;
  }
  .handle-wrap {
    // margin-top:20px;
    margin-bottom: 20px;
  }
}
</style>