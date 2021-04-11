<template>
  <div class="dialog">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="指定分类">
        绝地卡盟
      </el-form-item>
      <el-form-item label="导出范围">
        <el-radio-group v-model="form.range">
          <el-radio :label="1">全部库存</el-radio>
          <el-radio :label="2">指定数量</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="导出数量" v-show="form.range === 2">
          <el-input-number v-model="form.count" :min="1"></el-input-number>
      </el-form-item>
      <el-form-item label="是否删除">
        <el-radio-group v-model="form.check">
          <el-radio :label="1">仅导出</el-radio>
          <el-radio :label="2">导出并删除</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="商品名称">
        <el-radio-group v-model="form.check">
          <el-radio :label="1">导出商品名</el-radio>
          <el-radio :label="2">不导出商品名</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="导出格式">
        <el-radio-group v-model="form.check">
          <el-radio :label="1">EXCEL</el-radio>
          <el-radio :label="2">TXT</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {},
    };
  },
};
</script>
<style scoped>
.dialog >>> .el-form {
  padding: 0;
}
</style>