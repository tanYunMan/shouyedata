<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
      </div>
      <div class="top" v-if="adminTypeStatus === 1 || adminTypeStatus === 0">
        <el-button-group>
          <el-button type="primary"  size="mini" @click="goOrder">订单({{Order}})</el-button>
          <el-button type="warning"  size="mini" @click="gomenu84">投诉({{Complaint}})</el-button>
          <el-button type="danger"  size="mini" @click="goGoods">断货({{Goods}})</el-button>
        </el-button-group>
      </div>
      <div class="top" v-else>
        <el-button-group>
          <el-button type="primary"  size="mini" @click="goOrderfk">订单({{Order}})</el-button>
          <el-button type="warning"  size="mini" @click="gomenu84fk">投诉({{Complaint}})</el-button>
          <el-button type="danger"  size="mini" @click="goGoodsfk">断货({{Goods}})</el-button>
        </el-button-group>
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { getLists,getDatas } from '@/api/price/price-1/common'

export default {
  name: 'Layout',
  data () {
    return {
      adminTypeStatus: 0
    }
  },
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  data() {
    return { 
      Order:0,
      Complaint:0,
      Goods:0,
    }
  },
  created () {
    let type = (sessionStorage.getItem('menuType')) * 1
    this.adminTypeStatus = type
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  mounted() {
    this.getDatas()
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    // 跳转断货页面
    goGoods() {
      this.$router.push({ path:'/topNav/outOfStock'})
    },
    // 跳转订单页面
    goOrder() {
      this.$router.push({ path:'/menu8/1'})
    },
    // 跳转投诉页面
    gomenu84() {
      this.$router.push({ path:'/menu8/4'})
    },
    // 跳转断货页面(发卡)
    goGoodsfk() {
      this.$router.push({ path:'/goodsManager/goods',
      query: {
        typeJump: 'navJump'
      }})
    },
    // 跳转订单页面(发卡)
    goOrderfk() {
      this.$router.push({ path:'/orderManager/allOrder',
      query: {
        typeJump: 'navJump'
      }})
    },
    // 跳转投诉页面(发卡)
    gomenu84fk() {
      this.$router.push({ path:'/complaint/complaint',
      query: {
        typeJump: 'navJump'
      }})
    },

    // 获取nav数字
    getDatas(){
      getDatas({type: this.adminTypeStatus},'/order/orderStatistice/getTotalNum').then(res => {
        if (res.code===1001){
            this.Order = res.body.Order;
            this.Complaint = res.body.Complaint;
            this.Goods = res.body.Goods;
        }
      }).catch(err => {
        
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    .top {
      // padding:10px 20px 7px 20px;
      padding:0 20px;
      border-bottom:5px solid #eee;
      height:50px;
      line-height:40px;
    }
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
