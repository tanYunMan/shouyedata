<template>
  <div class="container menu6-4-container">
    <el-form ref="form" :model="form" label-width="140px">
      <el-form-item label="下级客户编号：">
        <el-input v-model="form.userIDs" placeholder="请输入下级客户编号" style="width:300px"></el-input>
        <span class="tips">(多个编号之间用半角,隔开)</span>
      </el-form-item>
      <el-form-item label="上级客户编号：">
        <el-input v-model="form.parentID" placeholder="请输入上级客户编号" style="width:300px"></el-input>
        <span class="tips">(取消绑定可以不输入上级编号)</span>
      </el-form-item>
      <!-- <el-form-item label="操作类型：">
        <el-radio-group v-model="form.t">
          <el-radio :label="1">绑定</el-radio>
          <el-radio :label="2">取消绑定</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item label="">
        <el-button type="primary" @click="confirmHandle" :loading="loading">确 定</el-button>
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
      loading:false,
    }
  },
  methods: {
      // 确认操作
      confirmHandle(){
        this.loading = true
        getLists(this.form,'/user/user/updateUserParent').then(res => {
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
            this.loading = false
          }).catch(err => {
            this.loading = false
          })
      }
  }
}
</script>
<style lang="scss">
.menu2-1-container {
  .dialog1 {
    .el-dialog__body {
      overflow: auto;
      max-height:700px;
    }
    .el-input {
      width:400px;
    }
  }
}
</style>
<style scoped lang="scss">
.container {
  padding:20px;
  .tab-wrap {
    a {
      &.active {
        border-bottom:2px solid #409eff
      }
    }
  }
  .filter-wrap {
    margin-top:20px;
  }
  .handle-wrap {
    // margin-top:20px;
    margin-bottom:20px;
  }
  
}
</style>

