<template>
  <div class="info-body">
    <div class="complaint-header">
      <img class="clock" src="@/assets/icon/clock.png"></img>
      <div class="header-meta">
        <div class="meta-header">投诉沟通倒计时</div>
        <div class="meta-end">举证期已结束，请等待管理员进行裁决</div>
      </div>
    </div>
    <div class="info">
      <div class="info-header">投诉信息</div>
      <el-divider></el-divider>
      <div class="content">
        <div class="content-item">投诉编号：123</div>
        <div class="content-item">举报原因：非法商品</div>
        <div class="content-item">联系方式：6666666</div>
        <div class="content-item">投诉时间：2020-09-17 10:10:10</div>
        <div class="content-item">投诉状态：处理中</div>
        <div class="content-item">投诉结果：处理中</div>
      </div>
      <el-divider></el-divider>
    </div>
    <div class="chat-container">
      <div class="chat-item" v-for="item in chatList" :key="item.id">
        <div class="chat-meta">
          <div class="chat-type">
            <el-tag type="primary" size="mini" v-if="item.role===3">买家</el-tag>
            <el-tag type="danger" size="mini" v-if="item.role===1">管理员</el-tag>
            <el-tag type="success" size="mini" v-if="item.role===2">商家</el-tag>
          </div>
          <div class="chat-time">{{item.time}}</div>
        </div>
        <div class="content">
          <el-tag type="info">{{item.content}}</el-tag>
        </div>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="send-chat">
      <el-input v-model="complaintContent" placeholder="请输入聊天内容" type="textarea" :rows="8"></el-input>
    </div>
    <div class="upload-image">
      <el-button type="primary">上传图片</el-button>
    </div>
    <div class="send">
      <el-button type="primary" style="width: 100%">发送</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      complaintContent: '',
      chatList: [
        {id: 1, role: 3, time: '2020-09-17 10:57:10', content: '645541'},
        {id: 2, role: 1, time: '2020-09-18 10:57:10', content: '我们已经收到您的请求，并通知了商家，请耐心等待'},
        {id: 3, role: 2, time: '2020-09-19 10:57:10', content: '没啥毛病'},
        {id: 4, role: 1, time: '2020-09-20 10:57:10', content: '？？？？？'},
        {id: 5, role: 3, time: '2020-09-21 10:57:10', content: '退款'},
        {id: 6, role: 2, time: '2020-09-22 10:57:10', content: '不退'},
      ]
    }
  }
}
</script>
<style scoped>
.info-body {
  width: 80%;
  margin: auto;
}
.complaint-header {
  display: flex;
  flex-direction: row;
}
.header-meta {
  font-size: 14px;
  margin-left: 20px;
}
.meta-end {
  margin-top: 10px;
  color: #fe825a;
}

.info {
  margin-top: 20px;
}

.info-header {
  font-size: 22px;
  font-weight: bold;
}

.content-item {
  letter-spacing:2px;
  line-height: 26px;
  font-size: 16px;
}

.upload-image {
  margin-top: 15px;
}

.send {
  margin-top: 15px;
}

.chat-meta {
  display: flex;
  margin: 30px 0 15px 0;
  align-items: center;
}

.chat-time {
  margin-left: 10px;
}

.chat-container {
  max-height: 500px;
  overflow-y: scroll;
}


</style>