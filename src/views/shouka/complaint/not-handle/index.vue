<template>
  <div>
    <div class="search-container">
      <el-form :inline="true" :model="searchForm" >
        <el-form-item>
          <el-select v-model="searchForm.readState" placeholder="处理状态">
            <el-option label="未处理" :value="2"></el-option>
          </el-select>
          <el-select v-model="searchForm.readState" clearable placeholder="投诉类型">
            <el-option label="无效卡密" :value="1"></el-option>
            <el-option label="虚假商品" :value="2"></el-option>
            <el-option label="非法商品" :value="3"></el-option>
            <el-option label="侵权商品" :value="4"></el-option>
            <el-option label="不能购买" :value="5"></el-option>
            <el-option label="恐怖色情" :value="6"></el-option>
            <el-option label="其他投诉" :value="7"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      stripe
      :data="list"
      header-row-class-name="faka-table-header"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="systemNoticeTitle" label="ID"></el-table-column>
      <el-table-column prop="systemNoticeTitle" label="发起提现时间"></el-table-column>
      <el-table-column prop="systemNoticeTitle" label="提现金额"></el-table-column>
      <el-table-column prop="systemNoticeTitle" label="手续费"></el-table-column>
      <el-table-column prop="systemNoticeTitle" label="实际到账"></el-table-column>
      <el-table-column prop="systemNoticeTitle" label="结算状态"></el-table-column>
      <el-table-column prop="systemNoticeTitle" label="结算时间"></el-table-column>
    </el-table>

    <el-dialog
      title="沟通处理"
      :visible.sync="infoDialog"
      width="70%"
      >
      <info />
    </el-dialog>
    
  </div>
</template>

<script>
import info from '../info'
export default {
  data() {
    return {
      list: [],
      loading: false,
      searchForm: {},
      infoDialog: false
    };
  },
  components: {
    info
  },
  methods: {
    toHandle() {
      this.infoDialog = true
    },
    search() {

    }
  },
};
</script>

<style scoped>
.search-container .el-form {
  padding: 0;
}
</style>