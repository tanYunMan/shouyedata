<template>
  <div class="container">
    <el-form ref="form" :model="form" label-width="140px" class="wl-form-margin-bottom">
      <el-form-item label="前台业务电话：">
        <el-input v-model="form.frontWorkPhone" placeholder="请输入前台业务电话"></el-input>
      </el-form-item>
      <el-form-item label="前台业务QQ：">
        <el-input v-model="form.frontWorkQQ" placeholder="请输入前台业务QQ"></el-input>
        <span class="tips">多个QQ使用半角逗号隔开；若是企业qq，qq号前加前缀q，如666666,q888888</span>
      </el-form-item>
      <el-form-item label="前台客服电话：">
        <el-input v-model="form.frontServicePhone" placeholder="请输入前台客服电话"></el-input>
      </el-form-item>
      <el-form-item label="前台客服QQ：">
        <el-input v-model="form.frontServiceQQ" placeholder="请输入前台客服QQ"></el-input>
        <span class="tips">多个QQ使用半角逗号隔开；若是企业qq，qq号前加前缀q，如666666,q888888</span>
      </el-form-item>
      <el-form-item label="前台加款电话：">
        <el-input v-model="form.frontMoneyPhone" placeholder="请输入前台加款电话"></el-input>
      </el-form-item>
      <el-form-item label="前台加款QQ：">
        <el-input v-model="form.frontMoneyQQ" placeholder="请输入前台加款QQ"></el-input>
        <span class="tips">多个QQ使用半角逗号隔开；若是企业qq，qq号前加前缀q，如666666,q888888</span>
      </el-form-item>
      <el-form-item label="前台投诉QQ：">
        <el-input v-model="form.frontComplaintQQ" placeholder="请输入前台加款QQ"></el-input>
        <span class="tips">可以不填，填的话只能填一个</span>
      </el-form-item>
      <el-form-item label="前台工作时间：">
        <el-input v-model="form.workTIme" placeholder="请输入前台工作时间"></el-input>
        <span class="tips">例：18:00-23:00</span>
      </el-form-item>
      <el-form-item label="QQ群：">
        <el-input v-model="form.qQun" placeholder="请输入QQ群号"></el-input>
        <span class="tips">QQ客服</span>
      </el-form-item>
      <el-form-item label="微信号：">
        <el-input v-model="form.weChat" placeholder="请输入微信号"></el-input>
        <span class="tips">微信客服</span>
      </el-form-item>
      <el-form-item label="微信图片：">
        <Upload :imgList="form.weChatImg" imgName="官方微信二维码" v-on:listenTochildEvent="showMessageFromChild" v-if="imgLoading" />
        <span class="tips">官方微信二维码</span>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="loading">确认保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getCustomerService, addCustomerService } from '@/api/meun1/menu1-1/index'
import Upload from '@/components/Upload'
export default {
  data() {
    return {
      imageUrl: '',
      form: {},
      loading: false,
      imgLoading: false
    }
  },
  components: {
    Upload
  },
  methods: {
    // 上传图片返回的信息
    showMessageFromChild(data){
        this.form = {
            ...this.form,
            weChatImg:data
        }
    },
    // 获取客服信息
    getCustomerService() {
      getCustomerService().then(res => {
        this.form = res.body || {}
        this.loading = false
        this.imgLoading = true
      }).catch(err => {
        this.loading = false
      })
    },
    onSubmit() {
      if(this.form.frontComplaintQQ===null && this.form.frontMoneyPhone===null  && this.form.frontMoneyQQ===null && this.form.frontServicePhone===null && this.form.frontServiceQQ===null && this.form.frontWorkPhone===null && this.form.frontWorkQQ===null && this.form.qQun===null && this.form.weChat===null && this.form.weChatImg===null && this.form.workTIme===null){
        return false
      }
      this.loading = true
      addCustomerService(this.form).then(res => {
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
  created() {
    this.getCustomerService()
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
    height: 180px;
    line-height: 180px;
    text-align: center;
  }
  .avatar {
    width: 180px;
    height: 180px;
    display: block;
  }
}
.avatar-uploader1 {
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 225px;
    height: 250px;
    line-height: 250px;
    text-align: center;
  }
  .avatar {
    width: 225px;
    height: 250px;
    display: block;
  }
}
</style>
<style scoped lang="scss">
.container {
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
</style>

