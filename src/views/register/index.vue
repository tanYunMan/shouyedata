<template>
  <div>
    <div class="cent_box">
        <h1 style="display:none">
      用户注册
      <p>买家无需注册账号</p>
    </h1>
    <main>
      <div class="required">
        <el-input v-model="form.login" type="text" placeholder="登录名">
          <i slot="prefix" class="el-input__icon el-icon-s-custom"></i>
        </el-input>
      </div>
      <div class="required">
        <el-input v-model="form.password" type="password" placeholder="密码">
          <i slot="prefix" class="el-input__icon el-icon-lock"></i>
        </el-input>
      </div>
      <div class="required">
        <el-input
          v-model="passwordRepeat"
          type="password"
          placeholder="确认密码"
        >
          <i slot="prefix" class="el-input__icon el-icon-finished"></i>
        </el-input>
      </div>
      <div class="required">
        <el-input v-model="form.phone" type="tel" placeholder="手机号码">
          <i slot="prefix" class="el-input__icon el-icon-phone"></i>
        </el-input>
      </div>
      <!-- <el-input v-model="form.siteName" type="tel" placeholder="网站名称">
        <i slot="prefix" class="el-input__icon el-icon-monitor"></i>
      </el-input> -->
      <el-input v-model="form.qq" type="tel" placeholder="QQ号">
        <i slot="prefix" class="el-input__icon el-icon-connection"></i>
      </el-input>
      <!-- <el-input
        v-model="form.longLink"
        type="tel"
        placeholder="发卡网链接（数字+字母组合）"
      >
        <i slot="prefix" class="el-input__icon el-icon-link"></i>
      </el-input> -->
      <!-- <el-input placeholder="卡盟域名前缀" v-model="form.domainPre">
        <i slot="prefix" class="el-input__icon el-icon-position"></i>
        <el-select
          slot="append"
          clearable
          v-model="form.domainID"
          placeholder="请选择卡盟域名"
        > -->
          <el-option
            v-for="item in domains"
            :key="item.domainID"
            :label="item.domainAddr"
            :value="item.domainID"
          ></el-option>
        </el-select>
      </el-input>

      <!-- <el-input v-model="form.contacts" type="text" placeholder="用户名">
        <i slot="prefix" class="el-input__icon el-icon-user-solid"></i>
      </el-input> -->
      <el-button class="reg-btn" @click="doRegister">注册</el-button>
      <div class="gologin" @click="toLogins">有账号，<a href="javascript:;">去登录</a></div>
    </main>
    </div>
    <div style="display:none" class="login_inset_box">
        <div class="img_backg"></div>
         <div class="header_top_logo">
            <img :src="loginLogo" />
        </div>
        <div class="footer_backg"></div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {getDatas} from '@/api/price/price-1/common'
export default {
  data() {
    return {
      form: {
        login: '',
        password: '',
        siteName: '',
        phone: '',
        qq: '',
        longLink: '',
        domainPre: '',
        domainID: ''
      },
      passwordRepeat: '',
      domains: '',
      loginLogo: ''
    }
  },
  created () {
      if (this.$route.query.jumpNow) {
          sessionStorage.setItem('jumpNow', 'true')
      }

      this.getPicture()
  },
  methods: {
      getkmNewwork () {
          getDatas({},'platform/site/get').then(res => {
            if (res.code === 1001) {
              this.domains = res.body
            } else {
              this.$message.error(res.message)
            }
          }).catch(err => {
              this.$message.error(err.message)
          })
      },
    doRegister() {
      if (!this.form.login) {
        return this.$message.error('请输入登录名')
      } else if (this.form.login.length < 4 || this.form.login.length > 20) {
        return this.$message.error('登录名长度在 4 到 20 个字符')
      } else if (!this.form.password) {
        return this.$message.error('请输入密码')
      } else if (
        this.form.password.length < 6 ||
        this.form.password.length > 20
      ) {
        return this.$message.error('密码长度在 6 到 20 个字符')
      } else if (!this.passwordRepeat) {
        return this.$message.error('请再次输入密码')
      } else if (!this.form.phone) {
        return this.$message.error('请输入手机号码')
      } else if (this.form.phone.length !== 11) {
        return this.$message.error('请输入正确手机号码')
      } else if (this.form.domainPre && !this.form.domainID) {
        return this.$message.error('请选择卡盟域名')
      } else if (!this.form.domainPre && this.form.domainID) {
        return this.$message.error('请填写卡盟域名前缀')
      }
      const loadingInstance = this.$loading({
          lock: true,
          text: '正在注册...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        getDatas({params: this.form}, '/platform/site/register').then(res => {
            if (res.code === 1001) {
              this.$message.success('用户注册成功，即将跳转登录页！')
              setTimeout(() => {
                location.href = this.site.domain
              }, 1000)
            } else if (res.msg) {
              loadingInstance.close()
              this.$message.error('注册失败')
            } else {
              loadingInstance.close()
              this.$message.error('用户注册失败，请稍后重试')
            }
        })
    },
    toLogins () {
        this.$router.go(-1)
    },
    getPicture() {
            getDatas({}, '/platform/platformBase/getByDomain').then(res => {
                if (res.code === 1001) {
                    this.loginLogo = res.body.logo
                } else {
                    this.loginLogo = 'http://zong.111ks.cn/Public/logo.png'
                }
            })
        },
  },
  beforeDestroy () {
    //   this.$store.dispatch('user/logout',).then((res) => {
    //       this.$router.push({
    //           path: '/register'
    //       })
    //   })
  }
}
</script>

<style lang="scss">
$--color-primary: #00b8b3;
$--font-path: '~element-ui/lib/theme-chalk/fonts';

.el-input--prefix .el-input__inner {
  padding-left: 40px;
}
.el-input-group__append .el-select .el-input input {
  padding: 0 25px 0 10px;
  width: 165px;
}
h1 {
    text-align: center;
  p {
    font-size: 14px;
    letter-spacing: 10px;
    text-align: center;
  }
}
main {
  width: 400px;
  margin: 0 auto;
  padding-top: 40px;
  .el-input + .el-input,
  .required + .el-input,
  .required + .required,
  .el-input + .required {
    margin-top: 20px;
  }
  .required {
    position: relative;
    &::before {
      content: '*';
      color: red;
      position: absolute;
      left: -15px;
      top: 10px;
    }
  }
  .el-input__icon {
    font-size: 20px;
    color: $--color-primary;
  }
  .reg-btn {
    margin-top: 30px;
    color: #fff;
    background: $--color-primary;
    width: 100%;
    display: block;
  }
  .gologin {
    text-align: center;
    font-size: 14px;
    color: #c1c1c1;
    margin-top: 30px;
    a {
      color: $--color-primary;
    }
  }
}

@media screen and (max-width: 650px) {
  section {
    padding-bottom: 20px !important;
  }
  main {
    width: 80%;
    padding-top: 0;
  }
  main .el-input + .el-input {
    margin-top: 15px;
  }
  .el-message-box {
    max-width: 80%;
  }
}

.login_inset_box {
    position: fixed;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        top: 0;
        left: 0;
        .img_backg {
            width: 100%;
            height: 235px;
            display: block;
            background: top center no-repeat url('../../assets/topbg.jpg');
        }
        .header_top_logo {
            max-width: 1200px;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            width: 100%;
            top: 15px;
            img {
                height: 36px;
                display: block;
            }
        }
        .footer_backg {
            flex: 1;
            background: #fff;
            width: 100%;
        }
}

@media screen and (max-width: 650px) {
        .login_inset_box {
            .img_backg {
                height: 180px;
            }
        }
}

.cent_box {
    position: relative;
    z-index: 3;
    h1 {
        height: 120px;
        margin-top: 115px;
        color: #fff;
        letter-spacing: 4px;
        font-size: 30px;
        text-align: center;
        font-weight: 400;
        margin-bottom: 0px;
        p {
            font-size: 14px;
            letter-spacing: 10px;
            margin: 0;
            line-height: 19px;
        }
    }
}
</style>
