<template>
  <div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>公告详情</span>
        </div>
        <div class="el-title-notice" :style="{'color':dataInfo.color}">{{dataInfo.title}}</div>
        <div class="el-divider-notice">{{dataInfo.createTime}}</div>
        <div class="el-content-notice" v-html='dataInfo.content'></div>
      </el-card>
  </div>
</template>

<script>
import { getLists,getDatas } from '@/api/price/price-1/common'

export default {
  name: 'notice',
  data() {
    return {
      status:false,
      isWidth: false,
      id: '',
      dataInfo: {}
    }
  },
  created(){
    var w=document.documentElement?document.documentElement.clientWidth:document.body.clientWidth;//先获取窗口宽度
    if(w<750){
      this.isWidth = true
    }
    this.getLists()
  },
  mounted() {
    if (this.$route.params && this.$route.params.id) {
      this.id = this.$route.params.id,
      this.getLists();
    }
  },
  methods: {

    // 获取公告详情信息
    getLists(){
      getDatas({id: this.id},'/platform/updateNotice/get').then(res => {
        if (res.code===1001){
          this.dataInfo = res.body ? res.body : {}
        }
      }).catch(err => {
      })
    },



  },
}
</script>

<style lang="scss" scoped>
  .box-card{
    width: 80%;
    margin: 30px auto;
    min-height: calc(100vh - 250px);
  }
  .el-title-notice{
    text-align: center;
    font-size: 24px;
    font-weight: bold;
  }
  .el-divider-notice{
    width: 94%;
    border-top: 1px dashed;
    margin: 14px auto;
    line-height: 40px;
    text-align: center;
  }
  .el-content-notice{
    width: 94%;
    margin: 0 auto;
  }
</style>
