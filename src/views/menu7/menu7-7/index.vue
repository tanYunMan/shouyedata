<template>
  <div class="container menu7-5-container">
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="版本额度：">
        <span class="version-num" v-for="item in masterisiteQuota" :key="item.editionID">
          <span>{{item.edition.editionName}}：</span><span class="count">{{item.num}}</span>个
        </span>
      </el-form-item>
      <el-form-item label="额度类型：">
        <el-radio-group v-model="form.editionID" @change="getSitePrice">
          <el-radio
            :label="item.editionID"
            v-for="item in siteVersionList"
            :key="item.editionID"
          >{{item.editionName}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="额度：">
        <el-radio-group v-model="form.num">
          <el-radio :label="1">1个</el-radio>
          <el-radio :label="2">2个</el-radio>
          <el-radio :label="5">5个</el-radio>
          <el-radio :label="10">10个</el-radio>
          <el-radio :label="20">20个</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="单价：">
        <span style="color:red;font-weight:bold;">{{priceObj.price}}</span>
        <span class="tips">元</span>
      </el-form-item>
      <el-form-item label="总价：">
        <span style="color:red;font-weight:bold;">{{totalMoney}}</span>
        <span class="tips">元</span>
      </el-form-item>
      <el-form-item label>
        <el-button type="primary" @click="toBuy">确定购买</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
import {
  getLists,
  getDatas,
  postApplicationJson,
} from "@/api/price/price-1/common";
export default {
  data() {
    return {
      color: "#333",
      form: {},
      dialog1: false,
      dialog2: false,
      currentPage: 1,
      checkList: [],
      multipleSelection: [],
      masterisiteQuota: [], // 额度信息
      siteVersionList: [], // 站点版本
      priceObj: {}, // 站点价格
    };
  },
  computed: {
    totalMoney() {
      if (!this.priceObj.price || !this.form.num) {
        return 0;
      }
      return this.form.num * this.priceObj.price;
    },
  },
  components: {
    Tinymce,
  },
  created() {
    this.getVersionList();
    this.getMastersiteQuota();
  },
  methods: {
    toBuy() {
      this.$confirm(`是否确定购买，总价为${this.totalMoney}元`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "success",
      })
        .then(() => {
          getLists(
            this.form,
            "/platform/mastersiteQuota/buySiteQuotaForSite"
          ).then((res) => {
            if (res.code === 1001) {
              this.$message.success("购买成功");
              this.getMastersiteQuota();
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {});
      // 购买
    },
    getSitePrice(editionID) {
      getDatas(
        { editionID: editionID },
        "/platform/siteSitePrice/getSitePrice"
      ).then((res) => {
        this.priceObj = res.body;
      });
    },
    getMastersiteQuota() {
      // 获取站点额度信息
      getDatas({}, "/platform/mastersiteQuota/getMastersiteQuota").then((res) => {
        this.masterisiteQuota = res.body;
      });
    },
    getVersionList() {
      // 获取站点版本列表
      getDatas({ editionType: 2 }, "/platform/siteEdition/getList").then(
        (res) => {
          this.siteVersionList = res.body;
        }
      );
    },
  },
};
</script>
<style lang="scss">
.menu7-5-container {
  .dialog1 {
    .el-dialog__body {
      overflow: auto;
      max-height: 700px;
    }
    .el-input {
      width: 400px;
    }
    .tips {
      color: #909399;
      font-size: 12px;
      margin-left: 10px;
    }
  }
  .dialog2 {
    li {
      padding: 7px 0;
      display: flex;
      align-items: center;
      .label {
        width: 120px;
        text-align: right;
        margin-right: 10px;
      }
      a {
        color: #409eff;
      }
    }
  }
}
</style>
<style scoped lang="scss">
.container {
  padding: 20px;
  .tips {
    color: #909399;
    font-size: 12px;
    line-height: 20px;
    width: 400px;
    margin-left: 10px;
  }
  .tab-wrap {
    a {
      &.active {
        border-bottom: 2px solid #409eff;
      }
    }
  }
  .filter-wrap {
    margin-top: 20px;
  }
  .handle-wrap {
    // margin-top:20px;
    margin-bottom: 20px;
  }
}

.version-num {
  margin-right: 10px;
  color: #606266;
  .count {
    color: red;
  }
}
</style>

