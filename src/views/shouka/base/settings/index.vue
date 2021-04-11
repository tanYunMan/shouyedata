<template>
  <div>
    <el-card shadow="never">
      <!-- <el-col :span="12"> -->
        <div class="form-div">
          <div class="header">商户基本信息</div>
          <div class="content">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
              <el-form-item class="item" label="店铺名称" prop="fakaName">
                <el-input class="myInput" v-model="form.fakaName"></el-input>
              </el-form-item>
              <el-form-item class="item" label="店铺公告">
                <el-input class="myInput" v-model="form.fakaNotice"></el-input>
              </el-form-item>
               <el-form-item class="item" label="店铺QQ">
                <el-input class="myInput" v-model="form.fakaQq"></el-input>
              </el-form-item>
                <el-form-item class="item" label="店铺微信">
                <el-input class="myInput" v-model="form.fakaWx"></el-input>
              </el-form-item>
              <el-form-item class="item" label="手机号码">
                <el-input class="myInput" v-model="form.mobilePhone"></el-input>
              </el-form-item>
              <el-form-item class="item">
                <el-button  type="primary">获取验证码</el-button>
              </el-form-item>
              <el-form-item class="item" label="短信验证码">
                <el-input class="myInput"></el-input>
                <div class="danger-text">修改手机号需验证旧手机号码，新增或不修改，此项留空，验证码错误时，手机号码不会修改</div>
              </el-form-item>
              <el-form-item class="item" label="费率承担方">
                <el-radio-group v-model="form.payExpensesType">
                  <el-radio :label="1">客户</el-radio>
                  <el-radio :label="2">商家</el-radio>
                </el-radio-group>
              </el-form-item>
               <el-form-item class="item" label="提现方式">
                <el-radio-group v-model="form.cashMethoType"  placeholder="提现方式">
                  <el-radio :label="1" >手动</el-radio>
                  <el-radio :label="2" >自动</el-radio>
                </el-radio-group>
                <div v-if="form.cashMethoType == 2" class="danger-text">注:自动提现可能会造成余额不足无法购买对接商品</div>
              </el-form-item>
              <el-form-item class="item" label="对接码">
                <el-input class="myInput" v-model="form.longLink"  disabled="disabled" style="width:700px"></el-input>
                <el-button type="primary" @click="copyText('longDuiJie')" style="margin-left: 15px" >复制</el-button>
                <el-button type="primary" @click="resetLong" style="margin-left: 15px" >重置</el-button>
                <div class="danger-text">重置对接码之后商铺链接也会随之变化</div>
              </el-form-item>
              <el-form-item style="margin-bottom:0px !important" class="item" label="库存展示方式">
                <el-radio-group v-model="form.showType"  placeholder="库存展示方式">
                  <el-radio :label="1" >实际库存</el-radio>
                  <el-radio :label="2" >范围库存</el-radio>
                </el-radio-group>
              </el-form-item>
              <div style="margin-left:120px" v-if="form.showType == 2">
                <div>100≤库存 ,显示:非常多</div>
                <div>50 ≤库存&lt;100 ,显示:很多</div>
                <div>10 ≤库存&lt;50 ,显示:一般</div>
                <div>0 &lt;库存≤10 ,显示:不足</div>
              </div>
             
              <el-form-item>
                <el-button type="primary" @click="onSubmit" :loading="loading">确认保存</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      <!-- </el-col> -->
    </el-card>
     <textarea style='opacity: 0;position: absolute;' class="copy_input_btn" type="text" ref="longDuiJie" v-model="form.longLink"></textarea>
  </div>
</template>

<script>
import VueQr from "vue-qr";
import { getList, getLists, getDatas } from '@/api/price/price-1/common'
import request from '@/utils/request'
export default {
  data() {
    return {
      form: {
        payExpensesType: 1
      },
      loading:false,
      rules:{
        fakaName:[
          { required: true, message: '请输入店铺名称', trigger: 'blur' },
        ]
      }
    };
  },
  components: {
    VueQr,
  },
  methods: {
    getFakeData(){
      return request({
        url: "site/fakaSet/get",
        method: 'get',
      }).then(res=>{
        this.form= res.body||{payExpensesType: 1}
      })
    },
    onSubmit(){
      this.$refs['form'].validate((valid)=>{
        if(valid){
          this.loading =true
          return request({
            url: "site/fakaSet/update",
            method: 'post',
            data:this.form,
            transformRequest: request.transformRequest
          }).then(res => {
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
            },800)
          }).catch(err => {
            this.loading = false
          })
        }
      })
    },

     copyText(type){
       let createInput = this.$refs[type]
        console.log(createInput)
        createInput.select()
        document.execCommand("Copy")
        this.$message.success({
          showClose: true,
          message: '复制成功',
          type: 'success'
        })
        setTimeout(() => {
          let createInput = this.$refs[type]
          createInput.select()
          document.execCommand("Copy")
        }, 1000)
    },
     resetLong(){
        return request({
        url: "/site/fakaSet/resetLongLink",
        method: 'post',
      }).then(res=>{
        if (res.code===1001){
          this.$message({
            message: res.msg,
            type: 'success',
          });
          this.getFakeData()
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
  },

  mounted() {
     this.getFakeData()
  },
};
</script>

<style scoped>
.form-div {
  padding: 20px 100px;
}
.form-div .header {
  font-size: 18px;
  margin-bottom: 20px;
}

.form-div .content {
  width: 70%;
}

.form-div .el-form {
  padding: 0;
}

.danger-text {
  color: red;
}

.el-input.is-disabled ::v-deep .el-input__inner {
  color: #606266;
}

.myInput>>>.el-input__inner {
    padding: 2px;
    font-size: 13px;
    height: 35px;
}

.el-form-item {
    margin-bottom: 17px !important;
}
</style>