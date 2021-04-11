<template>
  <div class="container">
    <el-form ref="form" :model="form" label-width="140px">
      <el-form-item label="提示标题：">
        <el-input v-model="form.title" placeholder="请输入提示标题" style="max-width:260px;"></el-input>
      </el-form-item>
      <el-form-item label="提示内容：">
        <div class="textarea_box">
          <el-input
            type="textarea"
            :rows="8"
            placeholder="请输入提示内容"
            v-model="form.content">
          </el-input>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确认保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getLists,getDatas } from '@/api/price/price-1/common'
export default {
  data() {
    return {
      form:{},
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    
    // 获取登录提示
    getList() {
      getDatas({},'/site/loginTips/get').then(res => {
        if (res.code===1001){
          if (res.body) {
            this.form = res.body
          }
        }
      }).catch(err => {
        
      })
    },

    onSubmit() {
      getLists(this.form,'/site/loginTips/update').then(res => {
        if (res.code===1001){
          this.$message({
            message: res.msg,
            type: 'success',
          });
        }else{
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'error',
          });
        }
      }).catch(err => {
        
      })
    }
  }

}
</script>

<style scoped>
  .textarea_box {
    max-width: 260px;
  }

  .el-textarea__inner {
    min-height: 40px;
  }
</style>

