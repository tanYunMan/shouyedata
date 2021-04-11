<template>
    <div class="Fast">
        <div class="Fast-list" @click="goThing">
            <div class="Fast-list-top">
                <!-- <ship class="Fast-list-top-icon icon-ship" /> -->
                <svg-icon icon-class="ship" class="Fast-list-top-icon icon-ship"></svg-icon>
            </div>
            <div class="Fast-list-bottom">
                商品
            </div>
        </div>
        <div class="Fast-list" @click="goOrder">
            <div class="Fast-list-top">
                <!-- <refund class="Fast-list-top-icon icon-refund" /> -->
                <svg-icon icon-class="refund" class="Fast-list-top-icon icon-refund"></svg-icon>
            </div>
            <div class="Fast-list-bottom">
                订单
            </div>
        </div>
        <div class="Fast-list" @click='goComplaint'>
            <div class="Fast-list-top">
                <!-- <shelves class="Fast-list-top-icon icon-shelves" /> -->
                <svg-icon icon-class="shelves" class="Fast-list-top-icon icon-shelves"></svg-icon>
            </div>
            <div class="Fast-list-bottom">
                投诉
            </div>
        </div>
        <div class="Fast-list" @click='goUser'>
            <div class="Fast-list-top">
                <!-- <feedback class="Fast-list-top-icon icon-feedback"  /> -->
                <svg-icon icon-class="feedback" class="Fast-list-top-icon icon-feedback"></svg-icon>
            </div>
            <div class="Fast-list-bottom">
                用户
            </div>
        </div>
        <div class="Fast-list"  @click='meMoney'>
            <div class="Fast-list-top">
                <!-- <finance class="Fast-list-top-icon icon-finance" /> -->
                <svg-icon icon-class="finance" class="Fast-list-top-icon icon-finance"></svg-icon>
            </div>
            <div class="Fast-list-bottom">
                提现
            </div>
        </div>
        <div class="Fast-list" @click="getMoney">
            <div class="Fast-list-top">
                <!-- <analysis class="Fast-list-top-icon icon-analysis" /> -->
                <svg-icon icon-class="analysis" class="Fast-list-top-icon icon-analysis"></svg-icon>
            </div>
            <div class="Fast-list-bottom">
                加款
            </div>
        </div>
    </div>
</template>

<script>
import ship from '@/assets/icon/ship.svg'
import refund from '@/assets/icon/refund.svg'
import feedback from '@/assets/icon/feedback.svg'
import shelves from '@/assets/icon/shelves.svg'
import finance from '@/assets/icon/finance.svg'
import analysis from '@/assets/icon/analysis.svg'
export default {
    components:{
        ship,
        refund,
        feedback,
        shelves,
        finance,
        analysis
    },
    created(){
        
    },
    methods: {
        goThing(){
            this.$router.push({ path: '/menu3/2' })
        },
        goOrder(){
            this.$router.push({ path: '/menu8/6' })
        },
        goComplaint(){
            this.$router.push({ path: '/menu8/4' })
        },
        goUser(){
            this.$router.push({ path: '/menu6/2' })
        },
        meMoney(){
            this.$router.push({ path: '/menu10/8' })
        },
        getMoney(){
            this.$router.push({ path: '/menu10/4' })
        }
    },
}
</script>
<style scoped>
.Fast{
    margin-left:-70px;
    width: 120%;
    height: auto;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}
.Fast-list{
    margin-top:30px;
    width: 33%;
    height: 70px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    cursor: pointer;
    margin-bottom: 15px;
    border-radius: 5px;
}
/* .Fast-list:hover{
    background: #16B3FD;
    color: #ffffff;

}
.Fast-list:hover .Fast-list-top-icon{
    color: #ffffff !important;
}
.Fast-list:hover .Fast-list-bottom{
    color: #ffffff !important;
} */
.Fast-list-top{
    width: 100%;
    display: flex;
    justify-content: center;
}
.Fast-list-top-icon{
    width: 35px;
    height: 35px;
    fill: currentColor;
}
.Fast-list-bottom{
    font-size: 15px;
    color: #3F495E;
    text-align: center;
}
.icon-ship{
    color: #18FD6C;
}
.icon-refund{
    color: #F85E1F;
}
.icon-feedback{
    font-weight: bolder;
    color: #FE4B60;
}
.icon-shelves{
    color: #18A2FD;
}
.icon-finance{
   color: #09F8BA;   
}
.icon-analysis{
    color: #952BFD;
}
</style>