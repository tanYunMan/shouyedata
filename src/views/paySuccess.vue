<template>
  <div class="wl-paySuccess-page">
    <el-card class="box-card">
        <div style="padding:20px;padding-left:42%;border-bottom:1px solid #909399;">
            <el-button type="primary" @click="goPage(1)" :loading="loading">回到首页</el-button>
            <el-button type="success" @click="goPage(2)" :loading="loading">充值记录</el-button>
            <el-button type="primary" @click="goPage(3)" :loading="loading">对接商品</el-button>
            <el-button type="warning" @click="goPage(4)" :loading="loading">推荐商品</el-button>
            <el-button type="danger" @click="goPage(5)" :loading="loading">目录管理</el-button>
            <el-button type="info" @click="goPage(6)" :loading="loading">推荐目录</el-button>
        </div>
        <el-row>
            <el-col :span="10">
                <div class="wl-img-success">
                    <img :src="paySuccessImg" class="user-avatar">支付成功
                </div>
                <div>
                  <el-form ref="thisMoneyForm" :model="thisMoneyForm" label-width="30%">
                        <el-form-item label-width="10%">
                          <span>尊敬的客户：{{form.userName || '--'}} 您好！</span>
                        </el-form-item>

                        <el-form-item label="充值金额：">
                          <span>{{form.money || '--'}}元</span>
                        </el-form-item>

                        <el-form-item label="支付金额：">
                          <span>{{form.payMoney || '--'}}元</span>
                        </el-form-item>

                        <el-form-item label="支付方式：">
                          <span>{{form.rechargeName || '--'}}</span>
                        </el-form-item> 
                        
                        <el-form-item label="交易单号：">
                          <span>{{form.tradeSn || '--'}}</span>
                        </el-form-item> 

                      </el-form>
                </div>
            </el-col>
            <el-col :span="14">
                <div class="wl-recharge-div">
                    <p class="wl-again-recharge-p">再充一笔</p>
                      <el-form ref="thisMoneyForm" :model="thisMoneyForm" label-width="30%">
                        <el-form-item label="充值金额：">
                          <el-input-number v-model="thisMoneyForm.money" :min="0" :precision="2" controls-position="right"></el-input-number><span style="margin-left:14px">元</span>
                        </el-form-item> 
                        
                        <el-form-item label="充值方式：">
                          <div style="max-width:600px">
                              <span class="el-forClientlist" v-for="(item,index) in forClientlist" :key="index" :style="{'border':item.select?'1px solid red':'none'}" @click="clickIndex(index)">
                                <img style="width:100%;height:100%;" :src="item.rechargeImg" class="user-avatar" :alt="item.rechargeName" :title="item.rechargeName">
                              </span>
                          </div>
                        </el-form-item>   
                        <el-form-item>
                          <el-button type="primary" @click="rechargeConfirm" :loading="loading">立即充值</el-button>
                        </el-form-item>

                      </el-form>
                </div>
            </el-col>
        </el-row>
    </el-card>
  </div>
</template>

<script>

import { getLists,getDatas } from '@/api/price/price-1/common'
import { paySubmit } from '@/utils/auth'
export default {
  name: 'paySuccess',
  data(){
    return{
      thisMoneyForm: {
        money: 0,
        rechargeModeID: null
      },
      forClientlist:[],
      loading: false,
      paySuccessImg: 'p2.png',
      queryParams: {
        paySn:'',
        tradeSn:''
      },
      form:{}
    }
  },
  created() {
      this.getListForClient()
      this.queryParams={
        paySn:this.$route.query.out_trade_no,
        tradeSn:this.$route.query.trade_no
      }
      this.getMoneyInfo()
  },
  methods: {
    // 充值按钮
    clickIndex(key) {
      this.forClientlist.map((item,index)=>{
          if(key==index){
            item.select = true
            
            this.$set(this.forClientlist,index,item)

            this.thisMoneyForm.rechargeModeID = item.rechargeModeID
          }else{
            item.select = false
          }
      })
    },
    //获取充值方式
    getListForClient() {
      this.loading = true
      getDatas({rechargeType: 1},'/finance/rechargeMode/getListForClient').then(res => {
          if(res.code === 1001){
              //console.log(res,55)
              this.forClientlist = res.body
          }else{
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            });
          }
          this.loading = false
      }).catch(err => {
          this.loading = false
      })
    },

    // 获取支付详情
    getMoneyInfo(){
      if(!this.queryParams.paySn || !this.queryParams.tradeSn){
          this.$message({
            showClose: true,
            message: '支付信息不存在！',
            type: 'error'
          });return false
      }

      getDatas({...this.queryParams},'/finance/rechargeRecord/queryPayStateFk').then(res => {
          if(res.code === 1001 && res.body){
              this.form = res.body
              console.log(this.form,777)
          }else{
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            });
          }
          this.loading = false
      }).catch(err => {
          
      })
    },
    // 确认充值
    rechargeConfirm(){
      this.loading = true
      if(this.thisMoneyForm.money == 0){
        this.$message({
          showClose: true,
          message: '请输入正确充值的金额',
          type: 'error'
        });this.loading = false;return false
      }else if(this.thisMoneyForm.money > 100000){
        this.$message({
          showClose: true,
          message: '充值金额超过最大充值金额100000',
          type: 'error'
        });this.loading = false;return false
      }else if(!this.thisMoneyForm.rechargeModeID){
        this.$message({
          showClose: true,
          message: '请选择充值支付方式',
          type: 'error'
        });this.loading = false;return false
      }
      getLists(this.thisMoneyForm,'/finance/rechargeRecord/addRecharge').then(res => {
          if(res.code === 1001){
              this.loading = false
              paySubmit(res.body)
              //window.open(res.body.postUrl,"_blank")
              setTimeout(()=>{
                  this.rechargeDialog = false
                  this.loading = false
              },3000)
          }else{
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            });
          }
          this.loading = false
      }).catch(err => {
          this.loading = false
      })
    },


    // 跳转
    goPage(val){
      if(val==1){
          this.$router.push({path:'/'})
      }else if(val==2){
          this.$router.push({path:`/menu10/1`})
      }else if(val==3){
          this.$router.push({path:`/menu3/4`})
      }else if(val==4){
          this.$router.push({path:`/menu3/9`})
      }else if(val==5){
          this.$router.push({path:`/menu3/1`})
      }else{
          this.$router.push({path:`/menu3/8`})
      }
    },
  }
}
</script>

<style lang="scss" scoped>
    .el-forClientlist{
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
      margin:10px;
      cursor: pointer;
      display: block;
      width: 130px;
      height: 55px;
      float:left;
      padding: 1px
    }
    .box-card{
        max-width: 1200px;
        margin: 0 auto;
        padding-top:200px;
    }
    .wl-recharge-div{
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
      border-radius: 2px;
    }
    .wl-again-recharge-p{
      padding: 20px 0 0 70px;
    }
    .wl-img-success{
      height:100px;
      display:flex;
      line-height:100px;
    }
</style>
