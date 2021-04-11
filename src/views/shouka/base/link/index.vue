<template>
  <div>
    <el-card shadow="never">
      <div class="container">
       
        <div class="item">
          <div class="header">1、店铺开启或关闭</div>
          <div class="content">
            <div class="content-url">
              <div class="inf">用户访问店铺购卡页面则变成店铺关闭提示页面</div>
              <el-button v-if="form.fakaState === 1" @click="updateState(0)" type="primary" style="margin-left: 15px">关闭店铺</el-button>
              <el-button v-else-if="form.fakaState === 0" @click="updateState(1)" type="primary" style="margin-left: 15px">开启店铺</el-button>
            </div>
          </div>
        </div>
        <div class="item">
           <div class="header">2、商铺链接</div>
           <div class="content">
             <el-link :href="'http://'+form.fkDomain+'/links/'+form.longLink" target="_blank" style="color:#409EFF">http://{{form.fkDomain}}/links/{{form.longLink}}</el-link>
             <el-button type="primary" @click="copyText('longLink')" style="margin-left: 15px" >复制链接</el-button>
             <el-button type="primary" @click="resetLong" style="margin-left: 15px" >重置链接</el-button>
           </div>
        </div>
        
        <!-- <div class="item">
          <div class="header">3、短网址</div>
          <div class="content">
             <el-link :href="form.shortLink" target="_blank" style="color:#409EFF">{{form.shortLink}}</el-link>
             <el-button type="primary" @click="copyText('shortLink')" style="margin-left: 15px" >复制链接</el-button>

            <el-button type="primary" @click="resetShort" style="margin-left: 15px" >重置链接</el-button>
          </div>
        </div> -->
        <!-- <div class="item">
          <div class="header">4、子域名</div>
          <div class="content">
            <el-input placeholder="请输入子域名" v-model="form.domain" class="input-with" style="width:500px">
              
            </el-input>
             <el-button type="primary" style="margin-left:15px" :loading="loading" @click="update">保存</el-button>
          </div>
        </div> -->
        <div class="item">
         
          
        </div>
       
      </div>
    </el-card>

    <textarea style='opacity: 0;position: absolute;' class="copy_input_btn" type="text" ref="longLink" v-model="longLink"></textarea>
    <textarea style='opacity: 0;position: absolute;' class="copy_input_btn" type="text" ref="shortLink" v-model="shortLink"></textarea>
    <textarea style='opacity: 0;position: absolute;' class="copy_input_btn" type="text" ref="longDuiJie" v-model="form.longLink"></textarea>
  </div>
</template>

<script>
import clip from '@/utils/clipboard'
import VueQr from "vue-qr";
import request from '@/utils/request'
export default {
  data() {
    return {
      logList: [],
      searchForm: {},
      form:{},
      loading:false,
      qrCode: "http://www.baidu.com",
      longLink:'',
      shortLink:''

    };
  },
  components: {
    VueQr,
  },
  methods: {
    getFakeData(){
      return request({
        url: "site/fakaSet/get",
        method: 'get',
      }).then(res=>{
        this.form= res.body||{}
        this.longLink = this.form.fkDomain+'/links/'+this.form.longLink
        this.shortLink = this.form.shortLink
      })
    },
    updateState(state){
       return request({
        url: "site/fakaSet/updateState",
        method: 'post',
        data:{fakaState:state},
        transformRequest: request.transformRequest
      }).then(res=>{
        if(res.code === 1001){
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'success',
          });
          this.form.fakaState = state
        }else{
           this.$message({
            showClose: true,
            message: res.msg,
            type: 'error',
          });
        }
      })
    },
    resetShort(){
        return request({
        url: "site/fakaSet/resetShort",
        method: 'get',
      }).then(res=>{
        if (res.code===1001){
          this.$message({
            message: res.msg,
            type: 'success',
          });
          this.getFakeData()
        } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error',
          });
        }
      }).catch(err => {
        
      })
    },
    resetLong(){
        return request({
        url: "/site/fakaSet/resetLongLink",
        method: 'post',
      }).then(res=>{
        if (res.code===1001){
          this.$message({
            message: res.msg,
            type: 'success',
          });
          this.getFakeData()
        } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error',
          });
        }
      }).catch(err => {
        
      })
    },
    update(){
      //如果输入的子域名不为空的话，则需要对子域名进行校验
      if(this.form.domain != null && this.form.domain != '' ){
        var reg2 = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}/
        if(!reg2.test(this.form.domain)){
           this.$message({
              showClose: true,
              message: '请输入正确的子域名',
              type: 'error',
            });
            return;
        }
      }
      this.loading = true
      return request({
        url: "site/fakaSet/updateLink",
        method: 'post',
        data:{domain:this.form.domain},
        transformRequest: request.transformRequest
      }).then(res => {
        if (res.code === 1001) {
          this.$message({
              showClose: true,
              message: res.msg,
              type: 'success',
            });
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'error'
          });
        }
        setTimeout(()=>{
          this.loading = false
        },800)
      }).catch(err => {
        this.loading = false
      })
    },
    copyText(type){
       let createInput = this.$refs[type]
        console.log(createInput)
        createInput.select()
        document.execCommand("Copy")
        this.$message.success({
          showClose: true,
          message: '复制成功',
          type: 'success'
        })
        setTimeout(() => {
          let createInput = this.$refs[type]
          createInput.select()
          document.execCommand("Copy")
        }, 1000)
    }
  },
  created() {
    this.getFakeData();
  },
};
</script>

<style scoped>
.item {
  margin-bottom: 20px;
}
.header {
  margin-bottom: 10px;
  font-size: 18px;
}

.content-url {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
  font-size: 16px;
}
.info {
  font-size: 14px;
}

.danger-text {
  color: red;
  font-size: 10px;
  margin-top: 5px;
}

.el-input.is-disabled ::v-deep .el-input__inner {
  color: #606266;
}

</style>