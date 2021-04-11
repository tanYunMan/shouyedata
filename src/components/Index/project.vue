<template>
    <!-- <el-row :gutter="10" class="project">
        <el-col :xs="12" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="project-list">
                <div class="project-list-left"> -->
                    <!-- <uni class="project-list-left-icon" /> -->
                    <!-- <svg-icon icon-class="u"  class="project-list-left-icon"></svg-icon>
                </div>
                <div class="project-list-right">
                    <count-to :startVal='startVal' :endVal='47' :duration='3000'></count-to>
                    star
                </div>
            </div>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="project-list">
                <div class="project-list-left"> -->
                    <!-- <react class="project-list-left-icon" /> -->
                    <!-- <svg-icon icon-class="react"  class="project-list-left-icon"></svg-icon>
                </div>
                <div class="project-list-right">
                    <count-to :startVal='startVal' :endVal='17' :duration='3000'></count-to>
                    star
                </div>
            </div>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="project-list">
                <div class="project-list-left"> -->
                    <!-- <nodejs class="project-list-left-icon" /> -->
                    <!-- <svg-icon icon-class="nodejs"  class="project-list-left-icon"></svg-icon>
                </div>
                <div class="project-list-right">
                    <count-to :startVal='startVal' :endVal='10' :duration='3000'></count-to>
                    star
                </div>
            </div>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="project-list">
                <div class="project-list-left"> -->
                    <!-- <vues class="project-list-left-icon" /> -->
                    <!-- <svg-icon icon-class="vue"  class="project-list-left-icon"></svg-icon>
                </div>
                <div class="project-list-right">
                    <count-to :startVal='startVal' :endVal='11' :duration='3000'></count-to>
                    star
                </div>
            </div>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="project-list">
                <div class="project-list-left"> -->
                    <!-- <vues class="project-list-left-icon" /> -->
                    <!-- <svg-icon icon-class="vue"  class="project-list-left-icon"></svg-icon>
                </div>
                <div class="project-list-right">
                    <count-to :startVal='startVal' :endVal='7' :duration='3000'></count-to>
                    star
                </div>
            </div>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="project-list">
                <div class="project-list-left"> -->
                    <!-- <apps class="project-list-left-icon" /> -->
                    <!-- <svg-icon icon-class="app"  class="project-list-left-icon"></svg-icon>
                </div>
                <div class="project-list-right">
                    <count-to :startVal='startVal' :endVal='3' :duration='3000'></count-to>
                    star
                </div>
            </div>
        </el-col>
    </el-row> -->
    <div>
        <div class="dashboard-container">
          <!-- <div class="section section2" style="width:100%;border:1px solid #eaeaea"> -->
            <!-- <div class="title">今日统计</div> -->
            <div class="record-warp" style="padding:0">
                <div class="item" style="margin:0 0 20px 10px;width: calc(25% - 10px);" v-for="(item,index) in records" :key="index">
                    <div class="content" style="width:100%">
                        <div style="marginRight:30px">
                          <img :src="item.icon" />
                        </div>
                        <div id="info">
                          <p id="name">{{item.name}}</p>
                          <p id='infoContent'>{{item.num}} {{item.tips}}</p>
                        </div> 
                    </div>
                </div>
            </div>
          <!-- </div> -->
        </div>
    </div>
</template>

<script>
import apps from '../../assets/icon/app.svg'
import nodejs from '../../assets/icon/nodejs.svg'
import react from '../../assets/icon/react.svg'
import vues from '../../assets/icon/vue.svg'
import uni from '../../assets/icon/u.svg'
import countTo from 'vue-count-to';
export default {
    data(){
        return {
            records:[
                {
                    icon:require('../../assets/icon/充值.png'),
                    name:'充值金额',
                    num:'0',
                    tips:'元'
                },
                {
                    icon:require('../../assets/icon/金额.png'),
                    name:'销售金额',
                    num:'0',
                    tips:'元'
                },
                {
                    icon:require('../../assets/icon/手续费.png'),
                    name:'手续费',
                    num:'0',
                    tips:'元'
                },
                {
                    icon:require('../../assets/icon/订单.png'),
                    name:'直销订单',
                    num:'0',
                    tips:'个'
                },
                {
                    icon:require('../../assets/icon/对接订单.png'),
                    name:'对接订单',
                    num:'0',
                    tips:'个'
                },
                {
                    icon:require('../../assets/icon/投诉订单.png'),
                    name:'投诉订单',
                    num:'0',
                    tips:'个'
                },
                {
                    icon:require('../../assets/icon/用户.png'),
                    name:'注册用户',
                    num:'0',
                    tips:'个'
                },
                {
                    icon:require('../../assets/icon/平台.png'),
                    name:'搭建子站',
                    num:'0',
                    tips:'个'
                }
            ],
            startVal: 0,
            endVal: 10,
        }
    },
    components:{
        apps,
        nodejs,
        react,
        vues,
        uni,
        countTo
    }
}
</script>

<style  lang="scss" scoped>
#info{
    width:140px;
    display: flex;
    justify-content: center;
    align-items: center;
}
#name{
    color:white;
    margin-right:10px;
    font-size:18px;
    font-weight:bold;
    margin-top:5px
}
#infoContent{
    color:white;
    font-weight:bold;
    font-size: 23px;
    margin-top:10px;
}
@media only screen and (min-width: 1200px){
    // #name{
    //     color:white;
    //     margin-right:10px;
    //     font-size:8px;
    //     font-weight:bold;
    //     margin-top:5px
    // }
    // #infoContent{
    //     color:white;
    //     font-weight:bold;
    //     font-size: 13px;
    //     margin-top:10px;
    // }
}
.dashboard-container {
  display:flex;
  .item{
      background-image: url('../../assets/image/vue.png');
      background-size: cover;
  }
  .el-left-div-content{
    width: calc(50% - 10px);
    border: 1px solid #eaeaea;
    .title{
      margin-bottom: 5px;
    }
    span{
      color: #888;
      font-size: 13px;
    }
  }
  .el-right-div-content{
    width: calc(50% - 10px);
    margin: 0 0 0 20px;
    border: 1px solid #eaeaea;
    li{
      margin: 5px 0;
      padding: 3px 0!important;
    }
    .label{
      font-weight: normal!important;
    }
  }

//   padding:20px 20px 0 20px;
  .title {
    display:flex;
    justify-content: space-between;
    .more {
      font-weight: normal;
    }
  }
  ul {
      margin:0;
      padding:0;
    }
  
  .section1 {
    
    li {
      font-size:13px;
      padding:5px 0;
      cursor: pointer;
      display:flex;
      justify-content: space-between;
      padding:5px 80px;
      margin:0;
      a {
        font-size:12px;
      }
      .date {
        color:#999;
      }
    }
  }
  .section2 {
    li {
      display:flex;
      font-size:13px;
      color:#888;
      padding:5px 0;
      align-items: center;
      .label {
        width:140px;
        text-align: right;
        
      }
    }
  }
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
  

}





.project{
    width: 100%;
    height: auto;
}
.project-list{
    width: 100%;
    height: 108px;
    /* background: #f7f7f7; */
    border-radius: 5px;
    cursor: pointer;
    padding: 14px;
    box-sizing: border-box;
    background: url('../../assets/image/vue.png');
    background-size: 100% 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
}
.project-list-left{
    padding: 16px;
    box-sizing: border-box;
    width: 80px;
    height: 80px;
    border-radius: 5px;
}
.project-list-left:hover{
    background: #E84D67;
}
.project-list-left:hover .project-list-left-icon{
    color: #ffffff;
}
.project-list-left-icon{
    width: 48px;
    height: 48px;
    fill: currentColor; 
    color: #ffffff;
    
}
.project-list-right{
    flex: 1;
    color: #EA4E68;
    font-weight: bolder;
    font-size: 30px;
    line-height: 80px;
    text-align: right;
    color: #ffffff;
}
</style>