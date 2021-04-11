<template>
  <div class="container">
    <el-form ref="form" :model="form" label-width="180px">
      <el-form-item label="卡密商品默认报警数：">
          <el-input-number v-model="form.alarmNum" controls-position="right" :min="0" :precision="0"></el-input-number>
      </el-form-item> 

      <el-form-item label="展示方式：">
        <el-select v-model="form.goodsNumShowType" placeholder="请选择展示方式" style="width:200px" @change="changeVal">
          <el-option
            v-for="item in showList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
      </el-select>
      </el-form-item> 

      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="loading">确认保存</el-button>
      </el-form-item>
      
    </el-form>
  </div>
</template>

<script>
import { getSystemSettings, systemSetUpdate } from '@/api/meun1/menu1-1/systemSettings'
export default {
  data() {
    return {
      dialog: false,
      imageUrl: '',
      form: {},
      loading: false,
      showList:[{id:1,name:'实际数量'},{id:2,name:'范围'}],
    }
  },
  methods: {
    // 获取系统设置的相关数据
    getSystemSettings() {
      getSystemSettings().then(res => {
        this.form = res.body || {}
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },

    changeVal(val){
      this.isShow = val
    },

    // 提交数据
    onSubmit() {
      if(this.form.alarmNum===null && this.form.goodsNumShowType===null){
        return null
      }
      this.loading = true
      systemSetUpdate(this.form).then(res => {
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

      }).catch(err => {
        this.loading = false
      })
    }
  },
  created() {
    this.getSystemSettings()
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

