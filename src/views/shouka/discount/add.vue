<template>
  <div class="dialog">
    <el-card shadow="never">
      <el-form class="add-form" ref="form" :model="addForm" label-width="120px">
        <el-form-item label="选择商品分类">
          <el-select v-model="addForm.readState" style="width: 100%" clearable placeholder="商品分类">
            <el-option label="卡盟加款机器人" :value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="折扣类型">
          <el-radio-group v-model="addForm.range">
            <el-radio :label="1">元</el-radio>
            <el-radio :label="2">%</el-radio>
          </el-radio-group>
          <div class="info-text">批发的商户请选择“百分比”的折扣面额，单商品的建议选择“元”的面额。</div>
        </el-form-item>
        <el-form-item label="折扣面额">
          <el-input v-model="addForm.content" clearable />
        </el-form-item>
        <el-form-item label="生成数量">
          <el-input-number :min="1" :max="200" v-model="addForm.content" />
        </el-form-item>

        <el-form-item label="有效期（天）">
          <el-select v-model="addForm.readState" style="width: 100%" clearable placeholder="商品分类">
            <el-option label="1天" :value="1"></el-option>
            <el-option label="2天" :value="2"></el-option>
            <el-option label="3天" :value="3"></el-option>
            <el-option label="4天" :value="4"></el-option>
            <el-option label="5天" :value="5"></el-option>
            <el-option label="6天" :value="6"></el-option>
            <el-option label="7天" :value="7"></el-option>
            <el-option label="8天" :value="8"></el-option>
            <el-option label="8天" :value="9"></el-option>
            <el-option label="10天" :value="10"></el-option>
            <el-option label="15天" :value="15"></el-option>
            <el-option label="30天" :value="30"></el-option>
            <el-option label="60天" :value="60"></el-option>
            <el-option label="100天" :value="100"></el-option>
          </el-select>
          <div class="info-text">过期优惠券系统将自动清理。</div>
        </el-form-item>

        <el-form-item label="备注信息">
          <el-input v-model="addForm.content" clearable type="textarea" :rows="6" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary">确定</el-button>
        </el-form-item>
      </el-form>
    </el-card>
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
.add-form {
  width: 500px;
}
</style>