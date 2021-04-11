<template>
  <div>
    <div class="container">
      <div class="item">
        <div class="header">1、商品购买地址</div>
        <div class="content">
          <div class="content-url">
            <el-link type="primary" :underline="false">http://www.baidu.com</el-link>
            <el-button type="primary" style="margin-left: 15px" @click="copyUrl($event)">复制链接</el-button>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="header">2、短网址</div>
        <div class="content">
          <div class="content-url">
            <el-link type="primary" :underline="false">http://u0k.cn/beqiyk</el-link>
            <el-button type="primary" style="margin-left: 15px" @click="copyShortUrl($event)">复制链接</el-button>
          </div>
        </div>
      </div>
        <div class="item">
          <el-button type="primary">关闭连接</el-button>
          <el-button type="primary">重置连接</el-button>
        </div>
      <div class="item">
        <div class="header">3、二维码地址</div>
        <div class="content">
          <vue-qr :text="qrCode" :size="300"></vue-qr>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import clip from "@/utils/clipboard";
import VueQr from "vue-qr";
export default {
  data() {
    return {
      logList: [],
      searchForm: {},
      qrCode: "http://www.baidu.com",
    };
  },
  components: {
    VueQr,
  },
  methods: {
    search() {},
    copyUrl(event) {
      clip("http://www.baidu.com", event);
    },
    copyShortUrl(event) {
      clip("http://u0k.cn/beqiyk", event);
    },
  },
};
</script>

<style scoped>
.item {
  margin-bottom: 20px;
}
.header {
  margin-bottom: 10px;
  font-size: 18px;
}

.content-url {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
  font-size: 16px;
}
.info {
  font-size: 14px;
}
</style>