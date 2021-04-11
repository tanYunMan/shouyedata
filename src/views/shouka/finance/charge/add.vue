<template>
  <div class="dialog">
    <el-form ref="form" :model="form" label-width="120px" :rules="rules">
      <el-form-item label="充值标识" prop="rechargeKey">
        <el-select
          v-model="form.rechargeKey"
          style="width:250px"
          size="small"
          placeholder="请选择充值标识"
          filterable
        >
          <el-option
            v-for="item in rechargeMode"
            :key="item.rechargeKey"
            :label="item.rechargeName"
            :value="item.rechargeKey"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="form.state">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="充值费率" prop="rechargeRate">
        <el-input-number
          style="width:250px"
          size="small"
          v-model="form.rechargeRate"
          controls-position="right"
          :min="0"
          :max="100"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="最低费用" prop="rechargeCost">
        <el-input-number
          style="width:250px"
          size="small"
          v-model="form.rechargeCost"
          controls-position="right"
          :precision="2"
          :step="0.01"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="充值属性">
        <div v-for="(item,index) in rateArr" :key="index" style="margin-bottom:10px;">
          <el-input v-model="item.key" placeholder="属性" style="width:30%" size="small" />&nbsp;：
          <el-input v-model="item.value" placeholder="属性值" style="width:30%" size="small" />
          <el-button type="danger" style="position:relative;" @click="reduceone(index)">删除</el-button>
        </div>
        <div v-if="rateArr && rateArr.length < 10">
          <el-button size="small" type="text" style="color:#67c23a" @click="addone()">新增 +</el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="save()">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rules: {
        rechargeKey: [
          { required: true, message: "请选择充值标识", trigger: "change" },
        ],
        rechargeRate: [
          { required: true, message: "请输入充值费率", trigger: "blur" },
        ],
        rechargeCost: [
          { required: true, message: "请输入最低费用", trigger: "blur" },
        ],
      },
      rechargeMode: [],
      rateArr: [{ key: "", value: "" }],
      form: {
        rechargeAttrID: "",
        attrJson: {},
        rechargeKey: "",
        state: 1,
        rechargeRate: 0,
        rechargeCost: 0,
      },
    };
  },
  methods: {
    save() {},

    addone() {
      this.rateArr.push({
        key: "",
        value: "",
      });
    },
    reduceone(index) {
      this.rateArr.splice(index, 1);
    },
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