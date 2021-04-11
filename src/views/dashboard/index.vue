<template>
    <div class="index">
        <!-- 头部 -->
        <div class="index-head">
            <div class="index-head-title">
                工作台
            </div>
            <el-row style="display: flex;justify-content: center;align-items: center;">
                <el-col  :span="8">
                    <div class="index-head-centent-left">
                        <el-avatar style="margin-right: 10px;" :size="56" :src="circleUrl"></el-avatar>
                        <div class="index-head-centent-left-text">
                            <p>早上好,admin,祝你新的一天工作愉快</p>
                            <!-- <p>今天小雨转阴天,21~27°,天凉,注意加衣</p> -->
                            <p>运行周期：{{outTime}}</p>
                        </div>
                    </div>
                </el-col>
                <el-col  :span="8" style="display: flex;justify-content: center;">
                    <div>
                        <ul>
                            <li v-for="(item,i) in LoginSiteInfo" :key=i style="margin:10px 0px;display:flex;align-items: flex-start;color: #888;font-size:14px">
                                <span class="label" style="font-size: 14px;font-weight: 600;margin-top:6px">{{item.key=='卡网地址'?'主站域名':item.key=='店铺链接'?'发卡域名':item.key}}：</span>
                                <div style="margin-top:6px;display:flex">
                                    <span style="margin-left:10px;" v-bind:class="[item.key=='站点版本'?'styleFont':'','val']"  v-for="(items,is) in item.value"  :key=is >{{items}}</span>
                                    <span v-if="item.key=='站点版本'" class="dayMess" style="margin:0 15px;lineHeight:25px;fontSize:16px;color:red">{{getDateDiff(outTime.split('至')[0],new Date().toLocaleDateString().replaceAll('/','-'))}}&nbsp&nbsp天</span>
                                    <img style="width:25px;height:25px;cursor: pointer;" v-if="item.key=='站点版本'" :src="imgSrc" />
                                    <!-- <span v-if="item.key=='站点版本'" style="backgroundImage:{{imgSrc}}"><img :src="imgSrc" /></span> -->
                                </div>
                                <div v-if="item.key == '主站信息'" style="margin-left:50px;margin-top:1px;">
                                    <span> <el-button class="mybutton" style="text-decoration:underline;" size="mini" type="text" @click.stop="syncProduct" :disabled="isDisabled">同步商品</el-button></span>
                                    <!-- <a id='syncProduct' style="color:#409EFF;text-decoration:underline;" size="mini" type="text" @click.stop="syncProduct" :disabled="isDisabled">同步商品</a> -->
                                </div>
                            </li>
                            <li style="margin:10px 0px;display:flex;align-items: flex-start;color: #888;font-size:14px">
                                <span class="label" style="font-size: 14px;font-weight: 600;margin-top:6px">搭建客服：</span>
                                <div style="margin-top:6px;">
                                    <span style="margin-left:10px;" class="val" >新卡售-总监&nbsp&nbsp QQ318059129</span>
                                </div>
                                <div style="margin-left:50px;margin-top:1px;"  @mouseenter="showQQ=false" @mouseout="showQQ=true">
                                    <span class="QQStyle" style="cursor: pointer;"> <a class="styleA" :style="{'border':showQQ?'1px solid rgb(136, 136, 136)':'1px solid red'}" target=blank href='tencent://message/?uin=318059129&Site=工具啦&Menu=yes'>
                                        <img  @mouseenter="showQQ=false" @mouseout="showQQ=true" v-if="showQQ" border="0" style="width: 25px;height: 25px;" :SRC='QQOne' alt="点击这里给我发消息">
                                        <img  @mouseenter="showQQ=false" @mouseout="showQQ=true" v-if="!showQQ" border="0" style="width: 25px;height: 25px;" :SRC='QQTwo' alt="点击这里给我发消息">
                                        <span  @mouseenter="showQQ=false" @mouseout="showQQ=true" class="contentMess" :style="{'color':showQQ?'rgb(136, 136, 136)':'red'}">点击联系</span>
                                    </a></span>
                                    <!-- <span> <el-button class="mybutton" style="text-decoration:underline;" size="mini" type="text" @click.stop="syncProduct" >同步商品</el-button></span> -->
                                    <!-- <a id='syncProduct' style="color:#409EFF;text-decoration:underline;" size="mini" type="text" @click.stop="syncProduct" :disabled="isDisabled">同步商品</a> -->
                                </div>
                            </li>
                        </ul>
                    </div>
                </el-col>
                <el-col  :span="8">
                    <div class="index-head-centent-right">
                        <div class="index-head-centent-right-list" style="marginTop:20px">
                            <div class="index-head-centent-right-list-icon" @click="rechargeMoney">
                                <!-- <daiban style="color: #FD7F07; background: #FBEEE1;" class="index-head-centent-right-list-icon-is"  /> -->
                                <!-- <svg-icon icon-class="daiban"  style="color: #FD7F07; background: #FBEEE1;" class="index-head-centent-right-list-icon-is"></svg-icon>  -->
                                账户余额：<p style="color:red;margin:0">{{thisMoneyData.money}}</p>
                            </div>
                            <!-- <div class="index-head-centent-right-list-text">
                                3 &nbsp;&nbsp;/&nbsp;&nbsp; 26
                            </div> -->
                        </div>
                        <div class="index-head-centent-right-list">
                            <div class="index-head-centent-right-list-icon" @click="rechargeMoney">
                                <!-- <github style="color: #2294FC; background: #DDEDFD;" class="index-head-centent-right-list-icon-is"  />  -->
                                <!-- <svg-icon icon-class="github" style="color: #2294FC; background: #DDEDFD;" class="index-head-centent-right-list-icon-is"></svg-icon>  -->
                                <el-button type="primary" plain> 充值</el-button>
                               
                            </div>
                            <!-- <div class="index-head-centent-right-list-text">
                                7
                            </div> -->
                        </div>
                        <div class="index-head-centent-right-list" style="margin-left:0px">
                            <div class="index-head-centent-right-list-icon" @click="meMoney">
                                <!-- <daiban class="index-head-centent-right-list-icon-is"  /> 代办事项 -->
                                <!-- <svg-icon icon-class="daiban" class="index-head-centent-right-list-icon-is" />  代办事项 -->
                                <el-button plain> 提现</el-button>
                            </div>
                            <!-- <div class="index-head-centent-right-list-text">
                                3 &nbsp;&nbsp;/&nbsp;&nbsp; 26
                            </div> -->
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!-- 图标 -->
        <div class="index-centent">
            <el-row :gutter="20">
                <el-col :xs="24" :sm="24" :md="24" :lg="16" :xl="16">
                    <!-- 项目 -->
                    <div class="grid-content">
                        <div class="index-centent-title">
                            <div class="index-centent-title-left">
                                <!-- <sort class="index-centent-title-left-icon" /> -->
                                <svg-icon icon-class="sort" class="index-centent-title-left-icon"></svg-icon>
                                今日统计
                            </div>
                            <div class="index-centent-title-right">
                                <!-- 全部项目 -->
                            </div>
                        </div>
                        <div class="index-centent-box">
                            <Project />
                        </div>
                    </div>
                    <!-- 动态 -->
                    <div class="grid-content">
                        <div class="index-centent-title">
                            <div class="index-centent-title-left">
                                <!-- <dynamic class="index-centent-title-left-icontwo" /> -->
                                <svg-icon icon-class="dynamic" class="index-centent-title-left-icontwo"></svg-icon>
                                订单信息
                            </div>
                            <div class="index-centent-title-right" @click="goOrder">
                                全部订单
                            </div>
                        </div>
                        <div class="index-centent-box">
                            <DynamicBox />
                        </div>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
                    <div class="grid-content">
                        <div class="index-centent-title">
                            <div class="index-centent-title-left">
                                <!-- <operating class="index-centent-title-left-iconthree" /> -->
                                <svg-icon icon-class="operating" class="index-centent-title-left-iconthree"></svg-icon>
                                快捷操作
                            </div>
                            <div class="index-centent-title-right">
                                <!-- 全部动态 -->
                            </div>
                        </div>
                         <div class="index-centent-box">
                            <Fast />
                        </div>
                    </div>
                    <div class="grid-content">
                        <div class="index-centent-title">
                            <div class="index-centent-title-left">
                                <!-- <group class="index-centent-title-left-iconfour" /> -->
                                <svg-icon icon-class="group" class="index-centent-title-left-iconfour"></svg-icon>
                                    系统公告
                            </div>
                            <div class="index-centent-title-right">
                                <!-- 全部动态 -->
                            </div>
                        </div>
                         <div class="index-centent-box">
                            <Colleague />
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>

        <!-- 申请提现 -->
        <el-dialog title="余额充值" class="recharge-warp" :visible.sync="rechargeDialog">
            <el-form ref="thisMoneyForm" :model="thisMoneyForm" label-width="30%">
                <el-form-item label="充值金额：">
                    <el-input-number v-model="thisMoneyForm.money" :min="0" :precision="2" controls-position="right" />
                    <span style="margin-left:14px">元</span>
                </el-form-item>

                <el-form-item label="充值方式：">
                    <div style="max-width:600px">
                        <span v-for="(item,index) in forClientlist" :key="index" class="el-forClientlist" :style="{'border':item.select?'1px solid red':'none'}" @click="clickIndex(index)">
                        <img style="width:100%;height:100%;" :src="item.rechargeImg" class="user-avatar" :alt="item.rechargeName" :title="item.rechargeName">
                        </span>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="rechargeDialog = false">取 消</el-button>
                <el-button type="primary" :loading="loading" @click="rechargeConfirm">充 值</el-button>
            </span>
            <el-dialog width="240px" title="扫码支付" :visible.sync="payDialog" append-to-body>
                <vue-qr :text="qrCode" :size="200" />
            </el-dialog>
        </el-dialog>
    </div>
</template>

<script>
import daiban from '@/assets/icon/daiban.svg'
import github from '@/assets/icon/github.svg'
import sort from '@/assets/icon/sort.svg'
import dynamic from '@/assets/icon/dynamic.svg'
import operating from '@/assets/icon/operating.svg'
import group from '@/assets/icon/group.svg'
import Project from '@/components/Index/project' // 项目
import DynamicBox from '@/components/Index/dynamicBox' //动态
import Fast from '../../components/Index/fast' //快捷操作
import Colleague from '../../components/Index/colleague'
import { getLists,getDatas } from '@/api/price/price-1/common'
import { paySubmit } from '@/utils/auth'
export default {
    data(){
        return {
            circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
            LoginSiteInfo:[],
            thisMoneyData:'',
            rechargeDialog: false,
            thisMoneyForm: {
                money: 0,
                rechargeModeID: null
            },
            forClientlist: [], // 充值方式
            payDialog: false, // 支付弹窗
            qrCode: '', // 二维码地址
            loading: false,
            outTime:'',
            imgSrc:require('../../assets/icon/升级.png'),
            QQSrc:require('../../assets/icon/QQ.png'),
            QQOne:require('../../assets/icon/qq01.png'),
            QQTwo:require('../../assets/icon/qq02.png'),
            showQQ:true,
            records:[
                {
                    num:0
                },
                {
                    num:0
                },
                {
                    num:0
                },
                {
                    num:0
                },
                {
                    num:0
                },
                {
                    num:0
                },
                {
                    num:0
                },
                {
                    num:0
                },
            ]
        }
    },
    components:{
        daiban,
        github,
        sort,
        dynamic,
        operating,
        group,
        Project,
        DynamicBox,
        Fast,
        Colleague
    },
    created(){
        this.getLoginSite()
        this.thisMoney()
        // 获取账户金额
        this.thisMoney()

        // 获取提现方式
        this.getListForClient()
        //获取当日订单数
        this.getOrderToday()
        //获取当日销售金额
        this.getOrderMoneyToday()
        //获取当日充值金额
        this.getPayMoneyToday()
        //获取当日手续费
        this.getMoneyServiceToday()
        //获取当日注册用户
        this.getRegToday()
        //获取当日投诉数
        this.getComplaintToday()
        //获取当日搭建子站数
        this.getSiteToday()
    },
    methods: {
        //获取当日订单数
        getOrderToday(){
          //直销
          getDatas({saleType:1},'/order/order/orderToday').then(res => {
            if (res.code===1001){
              this.records[3].num = res.body
            }
          }).catch(err => {
          }),
          //对接
          getDatas({saleType:2},'/order/order/orderToday').then(res => {
            if (res.code===1001){
              this.records[4].num = res.body
            }
          }).catch(err => {
          })
        },
        //获取当日销售金额
        getOrderMoneyToday(){
          getDatas({},'/order/order/orderMoneyToday').then(res => {
            if (res.code===1001){
               this.records[1].num = res.body
            }
          }).catch(err => {
          })
        },
        //获取当日充值金额
        getPayMoneyToday(){
          getDatas({},'/finance/moneyStatistics/moneyRechargeToday').then(res => {
            if (res.code===1001){
              this.records[0].num = res.body
            }
          }).catch(err => {
          })
        },
        //获取当日手续费
        getMoneyServiceToday(){
          getDatas({},'/finance/moneyStatistics/moneyServiceToday').then(res => {
            if (res.code===1001){
              this.records[2].num = res.body
            }
          }).catch(err => {
          })
        },

        //获取当日注册用户
        getRegToday(){
          getDatas({},'/user/user/regToday').then(res => {
            if (res.code===1001){
              this.records[6].num = res.body
            }
          }).catch(err => {
          })
        },

        //获取当日投诉数
        getComplaintToday(){
          getDatas({},'/order/complaint/complaintToday').then(res => {
            if (res.code===1001){
              this.records[5].num = res.body
            }
          }).catch(err => {
          })
        },

        //获取当日搭建子站数
        getSiteToday(){
          getDatas({},'/platform/siteStatistics/siteToday').then(res => {
            if (res.code===1001){
              this.records[7].num = res.body
            }
          }).catch(err => {
          })
        },

        getDateDiff(startDate,endDate) 
        { 
            var startTime = new Date(Date.parse(startDate.replace(/-/g,   "/" ))).getTime();    
            var endTime = new Date(Date.parse(endDate.replace(/-/g,   "/" ))).getTime();    
            var dates = Math.abs((startTime - endTime))/(1000*60*60*24);    
            return  dates;   
        },
        meMoney(){
            this.$router.push({ path: '/menu10/8' })
        },
        // 商户信息
        getLoginSite(){
            getDatas({},'/platform/site/getLoginSite').then(res => {
                    if (res.code===1001){
                        res.body.forEach(el => {
                            if(el.key=='站点版本' || el.key=='卡网地址' || el.key=='店铺链接' ){
                                this.LoginSiteInfo.push(el)
                            }
                            if(el.key=='运营周期'){
                                this.outTime = el.value[0]
                            }
                        });
                    }
                }).catch(err => {
            })
        },
        goOrder(){
            this.$router.push({ path: '/menu8/6' })
        },
        // 获取当前登录者的余额信息
        thisMoney() {
            getDatas({}, '/finance/siteMoney/getCurrentMoney').then((res) => {
                    if (res.code === 1001) {
                        this.thisMoneyData = res.body
                    }
                }).catch((err) => {

                 })
        },
        // 充值--登陆者余额
        rechargeMoney() {
            this.rechargeDialog = true
        },
        // 充值按钮
        clickIndex(key) {
            this.forClientlist.map((item, index) => {
                if (key == index) {
                    item.select = true

                    this.$set(this.forClientlist, index, item)

                    this.thisMoneyForm.rechargeModeID = item.rechargeModeID
                } else {
                    item.select = false
                }
            })
        },
        // 获取充值方式
        getListForClient() {
            this.loading = true
            getDatas({ rechargeType: 1 }, '/finance/rechargeMode/getListForClient')
                .then((res) => {
                if (res.code === 1001) {
                    // console.log(res,55)
                    this.forClientlist = res.body
                } else {
                    this.$message({
                    showClose: true,
                    message: res.msg,
                    type: 'error'
                    })
                }
                this.loading = false
                })
                .catch((err) => {
                this.loading = false
                })
        },
        // 确认充值
        rechargeConfirm() {
            this.loading = true
            if (this.thisMoneyForm.money == 0) {
                this.$message({
                showClose: true,
                message: '请输入正确充值的金额',
                type: 'error'
                })
                this.loading = false
                return false
            } else if (this.thisMoneyForm.money > 100000) {
                this.$message({
                showClose: true,
                message: '充值金额超过最大充值金额100000',
                type: 'error'
                })
                this.loading = false
                return false
            } else if (!this.thisMoneyForm.rechargeModeID) {
                this.$message({
                showClose: true,
                message: '请选择充值支付方式',
                type: 'error'
                })
                this.loading = false
                return false
            }
            getLists(this.thisMoneyForm, '/finance/rechargeRecord/addRecharge')
                .then((res) => {
                if (res.code === 1001) {
                    this.loading = false
                    const qrCode = res.body.qr_code
                    if (qrCode) {
                    // 有二维码，当面付
                    this.qrCode = qrCode
                    this.outTradeNo = res.body.out_trade_no
                    this.payDialog = true
                    // 在这里轮询
                    this.payInterval = setInterval(() => {
                        getDatas(
                        { paySn: this.outTradeNo },
                        '/finance/rechargeRecord/queryPayStateFk'
                        ).then((payRes) => {
                        if (payRes.body.payState == 2) {
                            this.$notify({
                            title: '支付成功',
                            message: '您的支付已经成功，请查看账户余额'
                            })
                            this.payDialog = false
                            this.qrCode = ''
                            this.outTradeNo = ''
                            clearInterval(this.payInterval)
                            this.thisMoney()
                        }
                        if (payRes.body.payState == 1) {
                            this.$message.error('支付失败 ，请重新支付')
                            this.payDialog = false
                            this.qrCode = ''
                            this.outTradeNo = ''
                            clearInterval(this.payInterval)
                        }
                        })
                        if (this.payIntervalCount > 60) {
                        this.$message.error('支付订单已超时 ，请重新支付')
                        this.payDialog = false
                        this.qrCode = ''
                        this.outTradeNo = ''
                        clearInterval(this.payInterval)
                        }
                        this.payIntervalCount++
                    }, 3000)
                    } else {
                    paySubmit(res.body)
                    // window.open(res.body.postUrl,"_blank")
                    }
                    setTimeout(() => {
                    this.rechargeDialog = false
                    this.loading = false
                    }, 3000)
                } else {
                    this.$message({
                    showClose: true,
                    message: res.msg,
                    type: 'error'
                    })
                }
                    this.loading = false
                })
                .catch((err) => {
                    this.loading = false
                })
            },
    }
}
</script>

<style scoped>
.styleA{
    display: flex;
    align-items: center;
    justify-content: center;
}
.contentMess{
    display: inline-block;
    margin-top: 5px;
}
.dayMess{
    margin:0 15px;
    line-height:25px;
    font-size:16px;
    color:red
}
.QQStyle{
    width: 90px;
    height: 30px;
    display: inline-block;
    /* background-image: url('../../assets/icon/QQ.png'); */
    /* background-size: cover; */
}
::v-deep .el-button{
    font-size:16px;
    font-weight:bold;
}
.styleFont{
    border: 1px solid red;
    background-color: red;
    color: white;
    font-weight: bold;
    padding: 1px;
}
.user-avatar {
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: inline-block;
}
.el-forClientlist {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  margin: 10px;
  cursor: pointer;
  display: block;
  width: 130px;
  height: 55px;
  float: left;
  padding: 1px;
}
.index{
    width: 100%;
    min-height: 100%;
}
.index-head{
    background-color: white;
    width: 100%;
    /* height: 133px; */
    padding: 16px 32px 0 32px;
    box-sizing: border-box;
    /* background: rgba(255, 255, 255, .7); */
    border-bottom: 1px solid #dcdfe6;
}
.index-head-title{
    width: 100%;
    height: 30px;
    line-height: 30px;
    font-size: 20px;
    color: #292929;
    margin-bottom: 16px;
}
.index-head-centent-left{
    width: 100%;
    height: 70px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.index-head-centent-left-text{
    /* height: 56px; */
}
.index-head-centent-left-text p:nth-child(1){
    margin-bottom: 7px;
    font-size: 20px;
    color: #292929;
    letter-spacing:0.1em;

}
.index-head-centent-left-text p:nth-child(2){
    font-size: 12px;
    color: #999999;
    letter-spacing:0.1em;
}
.index-head-centent-left-text p:nth-child(3){
    font-size: 12px;
    color: #999999;
    letter-spacing:0.1em;
}
.index-head-centent-right{
    width: 100%;
    height: 70px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}
.index-head-centent-right-list{
    height: 56px;
    cursor: pointer;
    margin-left: 20px;
}
.index-head-centent-right-list-icon{
    font-size: 14px;
    display: flex;
    margin-bottom: 5px;
    color: #808695;
    font-size: 16px;
    font-weight: bold;
    margin-left: 20px;
}
.index-head-centent-right-list-icon-is{
    width: 14px;
    height: 14px;
    fill: currentColor;
    margin-right: 5px;
    /* padding: 5px; */
    border-radius: 12px;
}

.index-head-centent-right-list-text{
    height: 28px;
    line-height: 28px;
    font-weight: bold;
    text-align: right;
    font-size: 20px;
}
.index-centent{
    background-color: white;
    width: 100%;
    min-height: 100%;
    padding: 25px;
    box-sizing: border-box;
   

}


.el-col {
    border-radius: 4px;
}
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    background: #ffffff;
    width: 100%;
    margin-bottom: 25px;
  }
.index-centent-title{
    width: 100%;
    height: 52px;
    border-bottom: 1px solid #dcdfe6;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 0 15px;
    box-sizing: border-box;
    justify-content:space-between;
    font-size: 14px;
}
.index-centent-title-left{
    display: flex;
    justify-content: flex-start;
    font-size: 14px;
    /* border-radius: 11px;
    overflow: hidden; */
}
.index-centent-title-left-icon{
    width: 12px;
    height: 12px;
    font-size: 12px;
    color: #1890FF;
    /* padding: 5px; */
    background: #E6F3FE;
    /* border-radius: 11px; */
    fill: currentColor;
    margin-right: 10px;
}
.index-centent-title-left-icontwo{
    width: 12px;
    height: 12px;
    font-size: 12px;
    color: #F371FA;
    /* padding: 5px; */
    background: #FDF4FD;
    /* border-radius: 11px; */
    fill: currentColor;
    margin-right: 10px;
}
.index-centent-title-left-iconthree{
    width: 12px;
    height: 12px;
    font-size: 12px;
    color: #FC1D1D;
    /* padding: 5px; */
    background: #FDF4FD;
    /* border-radius: 11px; */
    fill: currentColor;
    margin-right: 10px;
}
.index-centent-title-left-iconfour{
    width: 12px;
    height: 12px;
    font-size: 12px;
    color: #18B2FA;
    /* padding: 5px; */
    background: #FDF4FD;
    /* border-radius: 11px; */
    fill: currentColor;
    margin-right: 10px;
}
.index-centent-title-right{
    color: #3CA0FD;
    cursor: pointer;
}
.index-centent-box{
    width: 100%;
    padding: 15px 15px 0;
    box-sizing: border-box;
}
</style>