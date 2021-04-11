<template>
  <div class="container">
    <el-form ref="form" :model="form" label-width="180px">
      <el-form-item label="基础手续费率：">
        <span>3％手续费，最低手续费0.10元</span>
      </el-form-item>
      <el-form-item label="手续费付费：" prop="payExpensesType" :rules="[{ required: true, message: '请选择手续费支付方式', trigger: 'blur' }]">
        <el-radio-group v-model="form.payExpensesType">
          <el-radio :label="1">客户(购买方)</el-radio>
          <el-radio :label="2">站长(销售方)</el-radio>
        </el-radio-group>
      </el-form-item> 

      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')" :loading="loading">确认保存</el-button>
      </el-form-item>
      
    </el-form>
    
  </div>
</template>

<script>
import { getPaymentChannel, addPaymentChannel } from '@/api/meun1/menu1-1/shopSettings'
export default {
  data() {
    return {
      dialog:false,
      form:{
        payExpensesType: 1
      },
      loading: false
    }
  },
  methods: {
    // 获取支付通道信息
    getPaymentChannel() {
      getPaymentChannel().then(res => {
        this.form = res.body ? res.body : {payExpensesType:1}
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true
            addPaymentChannel(this.form).then(res => {
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
                },1000)
            }).catch(err => {

            })
          } else {
            return false;
          }
        });
      
    }

  },
  created() {
    this.getPaymentChannel()
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
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
  }
  .avatar {
    width: 60px;
    height: 60px;
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

