<template>
  <div class="container">
    <el-form ref="form" :model="form" label-width="180px">
      <el-form-item label="移动wap手机网站控制：">
        <el-radio-group v-model="form.t">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="2">关闭</el-radio>
        </el-radio-group>
        <span class="tips">使用手机浏览器访问网站,是否默认显示 wap手机网站页面</span>
      </el-form-item> 
      <el-form-item>
        <el-button type="primary">确认保存</el-button>
      </el-form-item>
      
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imageUrl:'',
      form:{
        t:'1'
      },
      form1: {

      }
    }
  },
  methods: {
  }
}
</script>
<style lang="scss">
.avatar-uploader {
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 180px;
    height: 60px;
    line-height: 60px;
    text-align: center;
  }
  .avatar {
    width: 180px;
    height: 60px;
    display: block;
  }
}
    
</style>
<style scoped lang="scss">
.container {
  .el-form {
    .title {

      padding:10px 10px;
      font-size:14px;
      margin-bottom:20px;
      font-weight: 700;
      background:#f8f8f8;
    }
    .el-input {
      width:300px;
    }
    .tips {
      color:#909399;
      font-size:12px;
      margin-left:10px;
    }
    .el-div-item {
      margin-bottom:20px;
      .label {
        color:#606266;
        margin:0 10px;
      }
    }
    
    
  }
  

}
</style>

