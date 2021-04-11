<template>
  <div>
    <div class="search-container">
      <el-button type="primary" @click="toAdd">申请提现</el-button>
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
      title="申请提现"
      :visible.sync="addDialog"
      width="30%"
      >
      <add />
    </el-dialog>
    
  </div>
</template>

<script>
import add from './add'
export default {
  data() {
    return {
      list: [],
      loading: false,
      searchForm: {},
      addDialog: false
    };
  },
  components: {
    add
  },
  methods: {
    toAdd() {
      this.addDialog = true
    },
  },
};
</script>

<style scoped>
.search-container {
  padding: 0;
  margin-bottom: 15px;
}
</style>