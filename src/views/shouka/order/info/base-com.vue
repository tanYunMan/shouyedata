<template>
  <div  class="order-type order-type1">
    <div class="item">
      <el-alert title="订单信息" type="success" :closable="false"></el-alert>
      <ul>
        <li>
          <span class="label">订单编号：</span>
          <span class="val">20200819015030865882</span>
        </li>
        <li>
          <span class="label">提交时间：</span>
          <span class="val">2020-08-19 01:50:31</span>
        </li>
        <li>
          <span class="label">处理时间：</span>
          <span class="val">2020-08-19 01:50:31</span>
        </li>
        <li>
          <span class="label">订单处理耗时：</span>
          <span class="val">2020-08-19 01:50:31</span>
        </li>
        <li>
          <span class="label">订单状态：</span>
          <span class="val" style="color:#409EFF">处理完毕</span>
        </li>
      </ul>
    </div>
    <div class="item">
      <el-alert title="供货方" type="success" :closable="false"></el-alert>
      <ul>
        <li>
          <span class="label">订单供货方：</span>
          <span class="val">我是供货方</span>
        </li>
        <li>
          <span class="label">供货商编号：</span>
          <span class="val">124324534155</span>
        </li>
      </ul>
    </div>
    <div class="item">
      <el-alert title="商品信息" type="success" :closable="false"></el-alert>
      <ul>
        <li>
          <span class="label">商品名称：</span>
          <span class="val">site3一分钱商品</span>
        </li>
        <li>
          <span class="label">售价：</span>
          <span class="val">200元</span>
        </li>
      </ul>
    </div>
    <div class="item">
      <el-alert title="客户信息" type="success" :closable="false"></el-alert>
      <ul>
        <li>
          <span class="label">购买客户：</span>
          <span class="val">无事(10001)</span>
        </li>
        <li>
          <span class="label">客户详细：</span>
          <span class="val">哈哈哈</span>
        </li>
        <li>
          <span class="label">备注：</span>
          <span class="val">哈哈哈</span>
        </li>
      </ul>
    </div>
    <div class="item">
      <el-alert title="商品详细及结果" type="success" :closable="false"></el-alert>
      <ul>
        <li>
          <span class="label">卡号：</span>
          <span class="val">135</span>
        </li>
        <li>
          <span class="label">密码：</span>
          <span class="val">1212</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.order-type1 {
  .item {
    margin-top: 20px;
  }
  li {
    display: flex;
    padding: 8px 0;
    // align-items: center;
    .label {
      font-weight: bold;
      margin-right: 10px;
      width: 120px;
      text-align: right;
    }
    .val {
      flex: 1;
      font-size: 14px;
    }
  }
}
</style>