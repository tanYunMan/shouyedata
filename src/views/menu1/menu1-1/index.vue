<template>
  <div class="container">
    <div class="tab-wrap">
      <router-link to="sub1">基本信息</router-link>
      <!--<router-link to="sub2">风格设置</router-link>-->
      <router-link to="sub3">广告图片</router-link>
      <!--<router-link to="sub4">友情链接</router-link>-->
      <!--<router-link to="sub5">在线客服</router-link>-->
      <!--<router-link to="sub6">统计代码</router-link>-->
      <router-link to="sub7">发卡网设置</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  methods: {
    
  }
}
</script>

<style scoped lang="scss">
.container {
  
  
}
</style>

