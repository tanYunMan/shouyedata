<template>
  <div class="app-container container">
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="充值费率" label-width="120px" prop="rechargeRate">
        <el-input-number
          v-model="form.rechargeRate"
          style="width:150px"
          size="small"
          controls-position="right"
          :min="0"
          :max="100"
        />&nbsp;%
      </el-form-item>
      <el-form-item label="最低费用" label-width="120px" prop="rechargeCost">
        <el-input-number
          v-model="form.rechargeCost"
          style="width:150px"
          size="small"
          controls-position="right"
          :precision="2"
          :step="0.01"
          :min="0"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          style="margin-left:120px;"
          type="primary"
          @click="saveRate('form')"
          :loading="loading"
        >立即保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  getLists,
  getDatas,
  postApplicationJson,
} from "@/api/price/price-1/common";
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
      form: {
        rechargeRate: 0,
        rechargeCost: 0,
      },
      loading: false, // 按钮
    };
  },
  mounted() {
    this._rate();
  },
  methods: {
    _rate() {
      getDatas({}, "/finance/rechargeRate/get")
        .then((res) => {
          if (res.code == 1001 && res.body) {
            this.form.rechargeRate = res.body.rechargeRate;
            this.form.rechargeCost = res.body.rechargeCost;
          }
        })
        .catch((err) => {});
    },
    saveRate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.form.rechargeRate) {
            this.$message.error("请输入充值费率");
            return;
          }
          if (!this.form.rechargeCost) {
            this.$message.error("请输入最低费用");
            return;
          }
          this.loading = true;
          getLists({ ...this.form }, "/finance/rechargeRate/add")
            .then((res) => {
              if (res.code == 1001) {
                this.$message({
                  message: "操作成功！",
                  type: "success",
                });
              } else {
                this.$message({
                  message: res.msg,
                  type: "error",
                });
              }
              setTimeout(() => {
                this.loading = false;
              }, 1200);
            })
            .catch((err) => {});
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>