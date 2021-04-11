<template>
  <div class="container">
    
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
  .tab-wrap {
    border-bottom:1px solid #ddd;
    a {
      display:inline-block;
      padding:5px;
      margin:0 5px;
      &.router-link-active {
        border-bottom: 2px solid #409eff;
      }
    }
  }
  
}
</style>

