<template>
  <div class="container">
    <el-form ref="form" :model="form" label-width="180px">
      <el-form-item label="我的头像：">
        <Upload :imgList="form.headImg" imgName="我的头像" v-on:listenTochildEvent="showMessageFromChild" v-if="imgLoading" />
        <span class="tips">图片尺寸：60*60</span>
      </el-form-item>
      <!-- <el-form-item label="平台系统域名：">
        <el-input placeholder="请输入平台系统域名" v-model="form.domainName"></el-input>
      </el-form-item> -->
      <el-form-item label="商户名称：">
        <el-input placeholder="请输入商户名称" v-model="form.merchantName"></el-input>
      </el-form-item>
      <el-form-item label="商户联系QQ：">
        <el-input placeholder="请输入商户联系QQ" v-model="form.qq"></el-input>
      </el-form-item>
      <el-form-item label="商户联系电话：">
        <el-input placeholder="请输入商户联系电话" v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="对接客户默认级别：">
        <el-select v-model="form.levelID" placeholder="请选择等级价格组" style="width:200px" clearable @clear="setValueNull(1)">
          <el-option
            v-for="item in userLevelList"
            :key="item.levelID"
            :label="item.levelName"
            :value="item.levelID">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述：">
        <el-input type="textarea" rows="5" v-model="form.remark"  placeholder="请输入描述"></el-input>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="loading">确认保存</el-button>
      </el-form-item>
      
    </el-form>
  </div>
</template>

<script>
import { getShopSettings, shopSettingsUpdate } from '@/api/meun1/menu1-1/shopSettings'
import Upload from '@/components/Upload'
import { getLists,getDatas,postApplicationJson } from '@/api/price/price-1/common'
export default {
  data() {
    return {
      dialog: false,
      imageUrl: '',
      form: {},
      form1: {},
      loading: false,
      imgLoading: false,
      userLevelList: []
    }
  },
  components: {
    Upload
  },
  methods: {
    // 上传图片返回的信息
    showMessageFromChild(data){
        this.form = {
            ...this.form,
            headImg:data
        }
    },
    // 获取商户设置信息
    getShopSettings() {
      getShopSettings().then(res => {
        this.form = res.body || {}
        this.imgLoading = true
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },
    onSubmit() {
      if(this.form.domainName===null && this.form.headImg===null && this.form.merchantName===null && this.form.phone===null && this.form.qq===null && this.form.remark===null){
        return null
      }
      this.loading = true
      shopSettingsUpdate(this.form).then(res => {
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
        },1500)
      }).catch(err => {

      })
    },

    // 获取等级列表
    getPriceGroupList (){
      getLists({},'/site/userLevel/page').then(res => {
        if (res.code===1001){
          this.userLevelList = res.body.records
        }
      }).catch(err => {
      })
    },
    setValueNull(val){
      delete this.form.levelID
    }
  },
  created() {
    this.getShopSettings()
    this.getPriceGroupList()
  }
}
</script>
<style scoped lang="scss">
.container {
  .el-form {
    .el-input {
      width:300px;
    }
    .el-textarea {
      width:500px;
    }
    .tips {
      color:#909399;
      font-size:12px;
      margin-left:10px;
    }
    .el-div-item {
      margin-bottom:20px;
      .label {
        color:#606266;
        margin:0 10px;
      }
    }   
  }
}
</style>

