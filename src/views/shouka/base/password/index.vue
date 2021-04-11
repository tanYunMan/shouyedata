<template>
  <div>
    <el-card shadow="never">
      <div class="form-div">
        <el-form ref="pwdForm" :model="pwdForm" :rules="pwdRules" label-width="120px">
          <el-form-item prop="oldPassword" label="旧密码">
            <el-input v-model="pwdForm.oldPassword" type="password" placeholder="请输入原密码"></el-input>
          </el-form-item>
          <el-form-item prop="password" label="新密码">
            <el-input v-model="pwdForm.password" type="password" placeholder="请输入新密码"></el-input>
          </el-form-item>
          <el-form-item prop="repassword" label="确认密码">
            <el-input v-model="pwdForm.repassword" type="password" placeholder="请输入确认密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="loading" @click="changePWd()">确 认 修 改</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getLists } from '@/api/price/price-1/common'
export default {
  data() {
     var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.pwdForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      loading:false,
      pwdForm: {},
      pwdRules: {
        oldPassword: [{
          required: true,
          message: '请输入原密码',
          trigger: 'blur'
        }, {
          min: 6,
          message: '长度至少 6 个字符'
        }],
        password: [{
          required: true,
          message: '请输入新密码',
          trigger: 'blur'
        }, {
          min: 6,
          message: '长度至少 6 个字符'
        }],
        repassword: [{
          required: true,
          validator: validatePass2,
          trigger: 'blur'
        }]
      },
    };
  },
  methods: {
     changePWd() {
      const {
        password,
        oldPassword
      } = this.pwdForm
      this.loading = true
      getLists({
        password,
        oldPassword
      }, '/user/user/updateUserPassword').then(res => {
        this.loading = false
        if (res.code === 1001) {
          this.pwdForm = {}
          this.pwdDialog = false
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'success'
          })
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'error'
          })
        }
      }).catch(err => {
        this.loading = false
      })
    },
  },
};
</script>

<style scoped>
.form-div {
  width: 600px;
}
</style>