<template>
  <div class="dialog">
    <el-form class="add-form" ref="form" :model="addForm" label-width="120px">
      <el-form-item label="分类名称">
        <el-input v-model="addForm.content" clearable />
      </el-form-item>
      <el-form-item label="客服QQ">
        <el-input v-model="addForm.content" clearable />
      </el-form-item>
      <el-form-item label="网址">
        <el-input v-model="addForm.content" clearable />
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="addForm.content" clearable />
      </el-form-item>

      <el-form-item label="页面风格">
        <el-select v-model="addForm.readState" style="width: 100%" clearable placeholder="页面风格">
          <el-option label="蓝色商务" :value="1"></el-option>
        </el-select>
        <div class="info-text">过期优惠券系统将自动清理。</div>
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
      addForm: {},
    };
  },
};
</script>
<style scoped>
.dialog >>> .el-form {
  padding: 0;
}
</style>