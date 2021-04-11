<template>
  <div :class="isWidth ? 'el-mobile-true container' : 'container'">
    <el-form ref="form" :model="form" :label-width="isWidth? '170px' : '200px'">
      <el-form-item label="首页底部特殊脚本：">
        <el-input :rows="6" type="textarea" v-model="form.specialCode" placeholder="请输入首页底部特殊脚本"></el-input>
        <span class="tips">可填写第三方统计或广告代码</span>
      </el-form-item> 
      <el-form-item label="首页底部左侧特殊脚本：">
        <el-input :rows="6" type="textarea" v-model="form.leftSpecialCode" placeholder="请输入首页底部左侧特殊脚本"></el-input>
        <span class="tips">可填写第三方统计或广告代码</span>
      </el-form-item> 
      <el-form-item label="首页底部右侧特殊脚本：">
        <el-input :rows="6" type="textarea" v-model="form.rightSpecialCode" placeholder="请输入首页底部右侧特殊脚本"></el-input>
        <span class="tips">可填写第三方统计或广告代码</span>
      </el-form-item> 
      <el-form-item label="内页特殊脚本：">
        <el-input :rows="6" type="textarea" v-model="form.insideSpecialCode" placeholder="请输入内页特殊脚本"></el-input>
        <span class="tips">可填写第三方统计或广告代码</span>
      </el-form-item> 
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="loading">确认保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getDecorationCode, addDecorationCode } from '@/api/meun1/menu1-1/index'
export default {
  data() {
    return {
      imageUrl:'',
      form:{
      },
      loading: false,
      isWidth: false
    }
  },
  methods: {
    // 获取统计代码
    getDecorationCode() {
      getDecorationCode().then(res => {
        this.form = res.body || {}
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },

    // 编辑统计代码
    onSubmit() {
      if(this.form.insideSpecialCode===null && this.form.leftSpecialCode===null && this.form.rightSpecialCode===null && this.form.specialCode===null){
        return null
      }
      this.loading = true
      addDecorationCode(this.form).then(res => {
        if (res.code === 1001) {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'success',
          });
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'error'
          });
        }
        setTimeout(()=>{
          this.loading = false
        },1500)
      })
    }
  },
  created(){
    this.getDecorationCode();

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
      .el-form .el-textarea{
        width: 310px !important;
      }
  }  
</style>
<style scoped lang="scss">
.container {
  .el-form {
    .el-input{
      width:300px;
    }
    .el-textarea {
      width:500px;
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

