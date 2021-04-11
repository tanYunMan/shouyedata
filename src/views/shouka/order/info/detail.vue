<template>
  <div>
    <el-table
      stripe
      :data="list"
      header-row-class-name="faka-table-header"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="systemNoticeTitle" label="订单号"></el-table-column>
      <el-table-column prop="systemNoticeTitle" label="交易类型"></el-table-column>
      <el-table-column prop="systemNoticeTitle" label="商户号"></el-table-column>
      <el-table-column prop="systemNoticeTitle" label="交易金额"></el-table-column>
      <el-table-column prop="systemNoticeTitle" label="交易前（元）"></el-table-column>
      <el-table-column prop="systemNoticeTitle" label="交易后（元）"></el-table-column>
      <el-table-column prop="systemNoticeTitle" label="交易日期"></el-table-column>
    </el-table>

  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      loading: false,
    };
  },
  methods: {
    search() {},
  },
};
</script>
