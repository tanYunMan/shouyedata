<template>
  <div class="dialog">
    <el-tabs v-model="activeName">
      <el-tab-pane label="订单基本信息" name="base">
        <base-com />
      </el-tab-pane>
      <el-tab-pane label="订单处理" name="handle">
        <handle />
      </el-tab-pane>
      <el-tab-pane label="金额明细" name="detail">
        <detail />
      </el-tab-pane>
      <el-tab-pane label="商务资金明细" name="companyDetail">
        <company-detail />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import baseCom from "./base-com";
import handle from "./handle";
import detail from "./detail";
import companyDetail from "./company-detail";
export default {
  data() {
    return {
      activeName: "base",
    };
  },
  components: {
    baseCom,
    handle,
    detail,
    companyDetail,
  },
  methods: {},
};
</script>