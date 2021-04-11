<template>
    <div class="container">
        <div class="header">
            <div class="logo">
                <img :src="logo.src" alt="logo">
            </div>
            <div class="menu">
                <div class="menuItem" v-for="(item,index) in menu" :key="index">
                    <a :href='item.src'>{{item.title}}</a>
                </div>
            </div>
            <div class="login">
                <a @click="switchPage('登录')" href="">登录</a>
                |
                <a @click="switchPage('注册')" href="">注册</a>
            </div>
        </div>
        <div class="mainContent">
            <div class="mainContent_one" :style="{backgroundColor:mainOne.bgStyle}">
                <div class="mainContent_one_content"  :style="{backgroundColor:mainOne.bgSrc?'':lightblue,backgroundImage:mainOne.bgSrc}">
                    <div class="left">
                        <div>
                            <p class="title">{{mainOne.title}}</p>
                            <p class="content">{{mainOne.content}}</p>
                        </div>
                        <button @click="skip">{{mainOne.button}}</button>
                    </div>
                    <div class="right">
                        <img :src="mainOne.imageSrc" alt="" srcset="">
                    </div>
                </div>
            </div>
            <div class="mainContent_two_to_seven" v-for="(item,index) in mainTwoSeven" :key='index' :style="{backgroundColor:item.bgStyle}">
                <div v-if="item.imagePosition == 'left'" class="mainContent_left_content">
                    <img :src="item.imageSrc" alt="">
                    <div class="right">
                        <p class="title">{{item.title}}</p>
                        <p class="content">{{item.content}}</p>
                    </div>
                </div>
                <div v-if="item.imagePosition == 'right'" class="mainContent_right_content">
                    <div class="left">
                       <p class="title">{{item.title}}</p>
                        <p class="content">{{item.content}}</p>
                    </div>
                    <img :src="item.imageSrc" alt="">
                </div>
            </div>
            <div class="mainContent_eight" :style="{backgroundColor:mainEight.bgStyle}">
                <div class="mainContent_eight_content"  :style="{backgroundImage:mainEight.bgSrc}">
                    <div class="title">
                        {{mainEight.title}}
                    </div>
                    <div class="content">
                        <img v-for="(item,index) in mainEight.imageSrc" :key='index' src="" alt="">
                    </div>
                </div>
            </div>
            <div class="mainContent_nine" :style="{backgroundColor:mainNine.bgStyle}">
                <div class="mainContent_nine_content"  :style="{backgroundImage:mainNine.bgSrc}">
                    <div>
                        <p class="title">
                            {{mainNine.title}}
                        </p>
                    </div>
                    <button>{{mainNine.buttonContent}}</button>
                </div>
            </div>
        </div>
        <div class="flooter">
            <div class="top">
                <div v-for="(item,index) in flooterList" :key='index' class="bottonMenu">
                    <div v-for="(items,indexs) in item" :key='indexs' class="bottomMenuContent">
                        <a v-if="items.src" href="">{{items.name}}</a>
                        <p v-else>{{items.name}}</p>
                    </div>
                </div>
                <div class="wx">
                    <img :src="flooterWX.src" alt="">
                    <p>{{flooterWX.title}}</p>
                </div>
            </div>
            <div class="bottom">
                <div class="left">
                    <p>{{flooterCopyRight.content}}</p>
                    <p>{{flooterCopyRight.records}}</p>
                </div>
                <div class="right">
                    <img :src="identification" alt="">
                </div>
            </div>
        </div>
        <!-- 留言框 -->
        <div id='messageBox' class="messageBox">
            <div class="head">
                <p>请您留言</p>
                <span v-if="showStatus" @click="showHide" class="icon_fang"></span>
                <span v-else @click="showHide" class="icon_chang"></span>
            </div>
            <div class="form" v-if="showStatus">
                <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin-left:-100px;">
                    <el-form-item label="" prop="desc" style="margin:10px">
                        <el-input type="textarea" placeholder="请在此输入留言内容，我们会尽快与您联系。（必填）" v-model="ruleForm.desc"></el-input>
                    </el-form-item>
                    <el-form-item label=""  prop="pass" style="margin:10px">
                        <el-input type="password" placeholder="姓名" v-model="ruleForm.pass" autocomplete="off">
                            <template slot="prepend"><span class="headImg"></span></template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="" prop="checkPass" style="margin:10px">
                        <el-input type="password" placeholder="电话（必填）" v-model="ruleForm.checkPass" autocomplete="off">
                            <template slot="prepend"><span class="Iphon"></span></template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="" prop="age" style="margin:10px">
                        <el-input v-model.number="ruleForm.age" placeholder="邮箱">
                            <template slot="prepend"><span class="email"></span></template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="" prop="place" style="margin:10px">
                        <el-input v-model.number="ruleForm.place" placeholder="地址">
                            <template slot="prepend"><span class="place"></span></template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">发送</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <!-- 咨询 -->
        <div @click="consult" class="consult"></div>
    </div>
</template>
<script>
import {
    getDatas, loginAdminType,textImgList
} from '@/api/price/price-1/common'
export default {
    name:'homePage',
    data(){
        var checkAge = (rule, value, callback) => {
            
        };
        var validatePass = (rule, value, callback) => {
            
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
            callback(new Error('电话不能为空'));
            } else {
            callback();
            }
        };
        var checkDesc = (rule, value, callback) => {
            if (value === '') {
            callback(new Error('留言内容不可为空'));
            } else {
            callback();
            }
        };
        return{
            showStatus:false,
            ruleForm: {
                pass: '',
                checkPass: '',
                age: '',
                place:'',
                desc:''
            },
            rules: {
            // pass: [
            //     { validator: validatePass, trigger: 'blur' }
            // ],
            checkPass: [
                { validator: validatePass2, trigger: 'blur' }
            ],
            // age: [
            //     { validator: checkAge, trigger: 'blur' }
            // ],
            desc: [
                { validator: checkDesc, trigger: 'blur' }
            ]
            },
            logo:{
                content:'卡讯云',
                src:require('../../assets/logo.png')
            },
            menu:[
                {title:'首页',src:''},
                {title:'常见问题',src:''},
                {title:'订单查询',src:''},
                {title:'企业资质',src:''},
            ],
            mainOne:{
                title:'全新发货体验',
                bgSrc:require('../../assets/logo.png'),
                button:'立即入驻',
                content:'致力于解决虚拟商品的快捷寄售服务代理系统，商品管理、订单记录、收益统计、渠道分析...全响应式界面，简易操作，一站式寄售卡，为您稳定服务',
                imageSrc:'',
                bgStyle:'gray'
            },
            mainTwoSeven:[
                {
                    imagePosition:'left',
                    content:'卡讯云发货平台重新设计了商户的购买页面，后台管理，简洁高效，让客户浏览商品下单，一目了然，再多商品都能干净清爽，商户后台简单易操作，初次使用的商户都能马上学会使用。简洁的菜单让商户和用户获得更高的下单体验，从而增加系销量。',
                    title:'个性化店铺&优秀的设计',
                    imageSrc:'',
                    bgStyle:'white'
                },
                {
                    imagePosition:'right',
                    content:'卡讯云提供了多种的手续费方案，买家提供手续费等方案，所有支付通道都是直接和支付服务商申请，去掉中间代理商手续费， 所有可以给商户提供极低的手续费，低廉的手续费让更多虚拟产品商户能拥有自己的发货店铺。',
                    title:'费率超低&免手续费',
                    imageSrc:'',
                    bgStyle:'#f5fafc'
                },
                {
                    imagePosition:'right',
                    content:'卡讯云发货致力于解决虚拟产品商家的各种使用场景，代充功能可以更好的帮助商户提供充值服务，支持批量导出充值订单，给充值型商户一个良好的使用体验。',
                    title:'商户代充模式&充值业务',
                    imageSrc:'',
                    bgStyle:'#f5fafc'
                },
                {
                    imagePosition:'left',
                    content:'卡讯云发货为商户购买页面提供更优质的客服系统，商户帮助商户全系统解答各类售前咨询和售后咨询，减少商户沟通成本，提升用户购卡体验。',
                    title:'客服机器人&智能回复',
                    imageSrc:'',
                    bgStyle:'white'
                },
                {
                    imagePosition:'right',
                    content:'商户营业额隔日即可提现，保障商户的资金安全，资金停留时间不超过12小时，卡讯云发货采用支付宝提现，微信提现，银行卡等多种提现方式，满足商户所需。',
                    title:'资金保障&快速提现',
                    imageSrc:'',
                    bgStyle:'#f5fafc'
                },
                {
                    imagePosition:'left',
                    content:'卡讯云发货采用群集服务器，防御高，故障率低，无论用户身在何处，均能获得流畅安全可靠的体验。专业运维人员24小时看护，为你的店铺保驾护航。',
                    title:'技术安全&技术积累',
                    imageSrc:'',
                    bgStyle:'white'
                },
            ],
            mainEight:{
                title:'多种支付方式支持',
                imageSrc:[
                    {src:''},
                    {src:''},
                    {src:''},
                    {src:''}
                ],
                bgSrc:'',
                bgStyle:'gray'
            },
            mainNine:{
                title:'现在注册，立享自动发货新体验',
                buttonContent:'立即注册',
                bgSrc:'',
                bgStyle:'gray'
            },
            flooterList:[
                [
                    {name:'服务'},
                    {name:'常见问题',src:''},
                    {name:'平台公告',src:''},
                    {name:'更新日志',src:''},
                ],
                [
                    {name:'关于'},
                    {name:'关于我们',src:''},
                    {name:'使用协议',src:''},
                    {name:'隐私政策',src:''},
                ],
                [
                    {name:'订单'},
                    {name:'订单投诉',src:''},
                    {name:'订单查询',src:''},
                    {name:'友情链接：发货平台',src:''},
                ],
                [
                    {name:'联系我们'},
                    {name:'官方邮件：ningbohao@163.com'},
                    {name:'办公时间：周一至周五 9:00-21:30'}
                ],
                
            ],
            flooterWX:{
                title:'产品咨询微信',
                src:''
            },
            flooterCopyRight:{
                content:'Copyright © 2018-2021 宁波卡讯网络科技有限公司版权所有 All Rights Reserved.',
                records:'浙ICP备18028473号-1',
            },
            identification:''
        }
    },
    created() {
        textImgList({},'/web/platform/imageText/list').then(res => {
            console.log(res)
        })
    },
    mounted() {
        //window.addEventListener('scroll', this.handleScroll, true);  // 监听（绑定）滚轮滚动事件
    },
    methods: {
        switchPage(data){
            this.$router.push({path: '/login'})
            if(data =='登录'){
                sessionStorage.setItem('status','登录')
            }else{
                sessionStorage.setItem('status','注册')
            }
        },
        skip(){
            this.$router.push({path: '/login'})
        },
        consult(){
            this.showStatus = true;
            var doc = document.getElementById('messageBox');
            doc.style.height = '399px';
            doc.style.bottom = '50vh';
            doc.style.left = '50vw'
        },
        showHide(){
            this.showStatus = !this.showStatus;
            var doc = document.getElementById('messageBox');
            if(this.showStatus){
                doc.style.height = '399px'
            }else{
                doc.style.height = '35px'
                doc.style.bottom = '0px';
                doc.style.left = '0px'
            }
            
            
        },
        handleScroll (e) {
            this.scrollTop = e.target.scrollTop;
            var doc = document.getElementById('messageBox');
            console.log(doc)
            doc.style.bottom = '0px'
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                alert('submit!');
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    },
}
</script>
<style scoped  lang="scss">
*{
    margin: 0px;
    padding: 0px;
}
.title{
    background-color: transparent;
    border:0px solid transparent;
}
button:focus{
    border:1px solid transparent;
    border-radius: 40;
}
.container{
    border: 1px solid purple;
    padding:0px !important;
    .header{
        border: 1px solid red;
        display: flex;
        line-height: 80px;
        height: 80px;
        justify-content: space-between;
        width: 45%;
        margin: 0 auto;
        .logo{
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .logo img{
            width:114px;
            height: 39px;
        }
        .menu{
            border: 1px solid yellow;
            display: flex;
            .menuItem{
                margin: 0px 30px;
            }
        }
        .login{
            border: 1px solid blue;
        }
    }
    .mainContent{
        width: 100%;
        .mainContent_one{
            width: 100%;
            height:650px;
            border: 1px solid green;
            display: flex;
            align-content: center;
            justify-content: center;
            .mainContent_one_content{
                width: 75%;
                border: 1px solid red;
                display: flex;
                justify-content: center;
                .left{
                    color: white;
                    width: 420px;
                    border: 1px solid blue;
                    margin-top: 200px;
                    .title{
                        font-size: 48px;
                        background-color: transparent;
                        border:0px solid transparent;
                        font-weight: normal;
                        margin-bottom: 20px;
                    }
                    .content{
                        font-size: 20px;
                        font-weight: bold;
                        line-height: 40px;
                    }
                    button{
                        font-size: 30px;
                        width: 240px;
                        height: 70px;
                        border-radius: 40px;
                        border: 1px solid white;
                        color:rgb(54, 66, 238);
                        margin-top:80px;
                    }
                }
                .right{
                    margin-top: 200px;
                    img{
                        width: 500px;
                        height: 400px;
                        border: 1px solid red;
                    }
                }
            }
            
        }
        .mainContent_two_to_seven{
            height: 570px;
            display: flex;
            justify-content: center;
            align-content: center;
            .mainContent_left_content{
                border: 1px solid red;
                display: flex;
                justify-content: center;
                align-items: center;
                img{
                    width: 530px;
                    height: 330px;
                    border: 1px solid green;
                }
                .right{
                    width: 530px;
                    display: flex;
                    align-items: center;
                    border: 1px solid blue;
                    margin-left: 100px;
                    flex-direction: column;
                    align-items: flex-start;
                    .title{
                        font-size: 30px;
                        color: #000;
                        text-align: left;
                        background-color: transparent;
                        border:0px solid transparent;
                    }
                    .content{
                        font-size: 14px;
                        color: #282B31;
                        line-height: 28px;
                        margin-top: 35px;
                    }
                }
            }
            .mainContent_right_content{
                border: 1px solid red;
                display: flex;
                justify-content: center;
                align-items: center;
                img{
                    width: 530px;
                    height: 330px;
                    border: 1px solid green;
                }
                .left{
                    width: 530px;
                    display: flex;
                    align-items: center;
                    border: 1px solid blue;
                    margin-right: 100px;
                    flex-direction: column;
                    align-items: flex-start;
                    .title{
                        font-size: 30px;
                        color: #000;
                        background-color: transparent;
                        border:0px solid transparent;
                    }
                    .content{
                        font-size: 14px;
                        color: #282B31;
                        line-height: 28px;
                        margin-top: 35px;
                    }
                }
            }
        }
        .mainContent_eight{
            width: 100%;
            height: 480px;
            display: flex;
            justify-content: center;
            .mainContent_eight_content{
                width: 75%;
                border: 1px solid red;
                display: flex;
                justify-content: center;
                flex-direction: column;
                align-items: center;
                .title{
                    width: 100%;
                    font-weight: bold;
                    color: #000;
                    font-size: 30px;
                    line-height: 42px;
                    text-align: center;
                }
                .content{
                    width: 100%;
                    height: 90px;
                    padding-top: 80px;
                    display: flex;
                    justify-content: center;
                    img{
                        margin: 0px 10px;
                        width: 260px;
                        height: 90px;
                        border:1px solid green;
                    }
                }
            }
        }
        .mainContent_nine{
            width: 100%;
            height: 260px;
            display: flex;
            justify-content: center;
            .mainContent_nine_content{
                width: 75%;
                border: 1px solid red;
                display: flex;
                justify-content: center;
                flex-direction: column;
                align-items: center;
                .title{
                    font-size: 30px;
                    line-height: 42px;
                    color: #fff;
                    font-weight: bold;
                    text-align: center;
                    padding-top: 68px;
                }
                button{
                    font-size: 22px;
                    width: 214px;
                    height: 54px;
                    border-radius: 40px;
                    border: 1px solid white;
                    color:rgb(54, 66, 238);
                    margin-top:40px;
                }
            }
        }
    }
    .flooter{
        height: 316px;
        width: 100%;
        background-color: black;
        display: flex;
        justify-content: center;
        font-size: 14px;
        color: #fff;
        flex-direction: column;
        align-items: center;
        .top{
            display: flex;
            width: 50%;
            border: 1px solid purple;
            .bottonMenu{
                .bottomMenuContent{
                    a{
                        margin: 10px 120px 10px 0px;
                    }
                    p{
                        margin: 10px 120px 10px 0px;
                    }
                }
            }
            .wx{
                display: flex;
                justify-content: center;
                flex-direction: column;
                align-items: center;
            }
            img{
                width: 100px;
                height: 100px;
                border: 1px solid red;
            }
        }
        .bottom{
            display: flex;
            width: 50%;
            border-top: 1px solid lightgray;
            .right img{
                width: 200px;
                height: 69px;
                border: 1px solid green;
                margin-left: 100px;
            }
            .left{
                display: flex;
                p{
                    margin: 20px 40px 0px 0px;
                }
            }
        }
    }
    .messageBox{
        width: 240px;
        height: 35px;
        position:fixed;
        z-index: 10;
        bottom: 0px;
        .head{
            width: 100%;
            height: 35px;
            background-color: #00aef3;
            border-top-right-radius: 15px;
            color: #fff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .icon_fang{
                background-image: url('../../assets/fang.png');
                width: 34px;
                height: 30px;
                display:inline-block;
                background-size: contain;
                background-repeat: no-repeat;
            }
            .icon_chang{
                background-image: url('../../assets/chang.png');
                width: 34px;
                height: 30px;
                display:inline-block;
                background-size: contain;
                background-repeat: no-repeat;
            }
        }
        .form{
            background-color: cadetblue;
            height: 364px;
            width: 240px;
            position: absolute;
            z-index: 10;
            bottom: 0px;
            ::v-deep .el-input-group__prepend{
                padding-left: 10px;
                padding-right: 10px;
            }
            ::v-deep .el-form-item__content .el-input-group{
                margin-top:10px
            }
            .place,.headImg,.Iphon,.email{
                width: 24px;
                height: 20px;
                background-size: contain;
                background-repeat: no-repeat;
                display: inline-block;
            }
            .place{
                background-image: url('../../assets/地标.png');
                background-size: contain;
                background-repeat: no-repeat;
            }
            .headImg{
                background-image: url('../../assets/人.png');
            }
            .Iphon{
                background-image: url('../../assets/Iphon.png');
            }
            .email{
                background-image: url('../../assets/邮件.png');
            }
        }
    }
    .consult{
        position: fixed;
        bottom:50vh;
        right: 0px;
        background-image: url('../../assets/consult.png');
        background-repeat: no-repeat;
        background-size: contain;
        width: 135px;
        height: 50px;
    }
}
</style>
