<template>
  <div class="upload-info">
    <div>
      <el-upload
        class="avatar-uploader"
          :action="domain"
          :data="QiniuData"
          :limit="1"
          :on-remove="handleRemove"
          :on-error="uploadError"
          :on-success="uploadSuccess"
          :before-remove="beforeRemove"
          :before-upload="beforeAvatarUpload"
          multiple
          :on-exceed="handleExceed"
          :file-list="fileList">
        <audio v-if="uploadPicUrl"
               v-bind:src="uploadPicUrl"
               class="avatar"
               controls="controls">
          您的浏览器不支持音频播放
        </audio>
<!--        <img v-if="uploadPicUrl" :src="uploadPicUrl" class="avatar">-->
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>
  </div>
</template>

<script>
import { getDatas } from '@/api/price/price-1/common'
export default {
  props:["imgList",'imgName'],
  data() {
    return {
      loading: false,
      QiniuData: {
        key: "", //视频名字处理
        token: "" ,//七牛云token
        data:{}
      },
      domain: "http://upload-z2.qiniup.com", // 七牛云的上传地址（华东区）
      qiniuaddr: "http://qiniu.xinkashou.com", // 七牛云的视频外链地址 七牛云空间的外链地址
      uploadPicUrl: "", //提交到后台视频地址
      fileList: []
    };
  },
  mounted() {
    this.getQiniuToken();
  },
  created() {
    this.uploadPicUrl = this.imgList ? this.imgList : ''

    if (this.imgList) {
      this.fileList = [{status: "success",name: this.imgName ? this.imgName+'.mp3' : 'thisImg.mp3',size: 63624,percentage: 100,uid: 1593691580290}]
    }
  },
  methods: {
    handleRemove(file, fileList) {
      this.uploadPicUrl = "";
    },
    handleExceed(files, fileList) {

      this.$message.warning(
        `只允许上传一个音频`
      );
    },
    beforeAvatarUpload(file) {   //视频上传之前的方法
       const isLt2M = file.size / 1024 / 1024 < 1000;

      if (['audio/mpeg', 'audio/ogg', 'audio/mp3', 'audio/mp4'].indexOf(file.type) == -1) {
         this.$message.error("上传音频只能是 mp3、mp4、ogg、mpeg 格式!");
         return false;
       }
       if (!isLt2M) {
         this.$message.error("上传音频大小不能超过 1G!");
         return false;
       }


      let keyName = Date.parse(new Date()).toString()+Number.parseInt(Math.random()*1000, 10)+'.mp3'


      this.QiniuData.data = file;
      this.QiniuData.key = keyName;//`${file.name}`;
    },
    uploadSuccess(response, file, fileList) {  //视频上传成功的方法
      this.uploadPicUrl = `${this.qiniuaddr}/${response.key}`;
      //console.log(this.uploadPicUrl,111)
      this.$emit("listenTochildEvent",this.uploadPicUrl);
    },
    uploadError(err, file, fileList) {    //视频上传失败时调用
      this.$message({
        message: "上传出错，请重试！",
        type: "error",
        center: true
      });
    },
    beforeRemove(file, fileList) {
      // return this.$confirm(`确定移除 ${ file.name }？`);
      this.$emit("listenTochildEvent",'');
    },
    //提交数据到后台
    handleSubmit() {

    },
    //请求后台拿七牛云token
    async getQiniuToken() {  //token
      getDatas({},'/platform/qiniu/getToken').then(res => {
        if (res.code===1001){

          this.QiniuData = {
            token: res.body.token,//七牛云token
            key: res.body.name
          }
        }
      }).catch(err => {

      })
    },
  }
};
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 110px !important;
    height: 110px !important;
    line-height: 110px !important;
    text-align: center;
  }
  .avatar {
    width: 110px !important;
    height: 110px !important;
    display: block;
  }
  .el-upload-list{
    width: 220px;
  }
  .el-upload{
    height: 110px;
  }
</style>
