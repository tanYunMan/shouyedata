<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-close" to="/">
         <img :src="smallLogo" />
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
         <img :src="logo" />
      </router-link>
    </transition>
  </div>
</template>

<script>
import {
    getDatas
} from '@/api/price/price-1/common'
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: '销售系统-后台管理',
      logo: '',
      smallLogo: ''
    }
  },
  created() {
    this.getPicture()
  },
  methods: {
    
    getPicture() {
            getDatas({}, '/platform/platformBase/getByDomain').then(res => {
                if (res.code === 1001) {
                    this.logo = res.body.menuLogo
                    this.smallLogo = res.body.menuSmallLogo
                }
            })
        },
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 60px;
  line-height: 50px;
  background: #426dd8;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;
    padding: 12px 0;
    img{
      width: 90px;
    }

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
.sidebar-logo-close{
  padding: 14px 0;
  img{
    width: 28px;
  }
}
</style>
