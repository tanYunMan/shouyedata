<template>
  <div class="dialog">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="今日可提现次数">
        <el-input value="5" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="可提现金额">
        <el-input value="100" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="手续费">
        <el-input value="0元" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="提现金额">
        <el-input v-model="form.money"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">申请提现</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {}
    }
  }
};
</script>
<style scoped>
.dialog >>> .el-form {
  padding: 0;
}
</style>