<template>
  <div class="dialog">
    <el-form class="add-form" ref="form" :model="addForm" label-width="120px">
      <el-form-item label="退款类型">
        <el-radio-group v-model="addForm.proxy">
          <el-radio :label="1">全退</el-radio>
          <el-radio :label="2">按张退</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <el-button type="primary">确定处理</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      addForm: {
        discounts: [],
      },
    };
  },
  methods: {},
};
</script>