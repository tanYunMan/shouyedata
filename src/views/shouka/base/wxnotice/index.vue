<template>
  <div>
    <div class="search-container">
      <el-card shadow="never">
        <div class="left">
          <div class="header">绑定后，您可获得微信通知。微信公众号上提示绑定成功，刷新本页面</div>
          <div class="bind-container">
            <div class="bind-header">绑定微信</div>
            <div class="qrCode">
              <vue-qr :text="qrCode" :size="200"></vue-qr>
            </div>
          </div>
        </div>
        <div class="right"></div>
      </el-card>
    </div>
  </div>
</template>

<script>
import VueQr from "vue-qr";
export default {
  data() {
    return {
      searchForm: {},
      qrCode: "http://www.baidu.com",
    };
  },
  components: {
    VueQr,
  },
  methods: {},
};
</script>

<style scoped>
.left {
  width: 45%;
}
.header {
  margin-bottom: 30px;
}

.bind-container {
  width: 50%;
}
.bind-header {
  text-align: center;
}
.qrCode {
  text-align: center;
}
</style>