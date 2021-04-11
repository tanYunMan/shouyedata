<template>
  <div :class="isWidth ? 'el-mobile-true container' : 'container'">
    <el-form ref="form" :model="form" :label-width="isWidth? '120px' : '200px'">
      <el-form-item label="状态：">
        <el-radio-group v-model="form.fakaState">
          <el-radio :label="1">正常</el-radio>
          <el-radio :label="0">关闭</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="商铺链接：">
        <el-input placeholder="请输入链接标识" v-model="form.longLink" class="input-with">
          <template slot="prepend">{{form.fkDomain}}/links/</template>
        </el-input>
        <span class="tips">链接：{{form.fkDomain}}/links/<span class="identification-span">后面的</span></span>
      </el-form-item>

      <el-form-item label="商品名称：" >
        <el-input v-model="form.fakaName" placeholder="请输入商品名称"></el-input>
      </el-form-item>

      <el-form-item label="商品公告：" >
        <el-input type="textarea" :rows="3" placeholder="请输入商品公告" v-model="form.fakaNotice" style="width:300px"></el-input>
      </el-form-item>

      <el-form-item label="联系QQ：" >
        <el-input v-model="form.fakaQq" placeholder="请输入商品名称"></el-input>
      </el-form-item>

      <el-form-item label="联系微信：" >
        <el-input v-model="form.fakaWx" placeholder="请输入商品名称"></el-input>
      </el-form-item>

      <el-form-item class="el-mobile-button-tr">
        <el-button type="primary" @click="onSubmit">确认保存</el-button>
        <el-button type="primary" @click="onReset" plain>重置链接</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style>
  .input-with {
    width: 400px !important;
  }
  .identification-span{
    font-size:14px;
    color: red;
    margin-left: 10px;
  }
</style>
<script>
import { getList,getLists,getData } from '@/api/price/price-1/common'
export default {
  data() {
    return {
      dialog: false,
      visible: false,
      thisData: [],
      form: {},
      isWidth: false,
    }
  },
  methods: {
    // 获取用户等级列表
    getCardInfo() {
      getData('','/site/fakaSet/get').then(res => {
        if (res.code===1001){
          this.form = res.body
        }
      }).catch(err => {
        
      })
    },

    // 保存设置
    onSubmit (){
      getLists(this.form,'/site/fakaSet/update').then(res => {
        if (res.code===1001){
          this.$message({
            message: res.msg,
            type: 'success',
          });
        } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error',
          });
        }
      }).catch(err => {
        
      })
    },

    // 重置链接
    onReset (){
      getData('','/site/fakaSet/resetShort').then(res => {
        if (res.code===1001){
          this.$message({
            message: res.msg,
            type: 'success',
          });
          this.getCardInfo()
        } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error',
          });
        }
      }).catch(err => {
        
      })
    }
  },
  created() {
    this.getCardInfo()
    var w=document.documentElement?document.documentElement.clientWidth:document.body.clientWidth;//先获取窗口宽度
    if(w<750){
      this.isWidth = true
    }
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
  .el-mobile-true{  
    .el-form .el-form-item__content{
      margin-left: 0px !important;
    }
    .el-input {
      width: 300px !important;
      margin-left: 38px;
    }
    .el-textarea{
      width: 300px !important;
      margin-left: 38px;
    }
    .tips{
      margin-left: 38px !important;
    }
    .el-mobile-button-tr{
      margin-left: 70px;
    }
  }
</style>
<style scoped lang="scss">
  .delete{
    position: fixed;
    left: 44%;
    top: 30%;
  }
  .container {
    padding:0 20px;
    .el-table {
      margin-top:20px;
    }
    .filter {
      float: right;
      margin: 20px 0;
    }
    .el-form {
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

  .el-mobile-true{
    .el-form{
      padding:10px 0;
    }
    padding: 0;
  }
</style>

