<template>
  <div class="container">
    <el-form ref="form" :model="form" label-width="140px">
      <el-form-item label="后台页面风格：">
        <el-select v-model="form.backendStyle" placeholder="请选择">
          <el-option
            v-for="item in backendStyle"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客户端页面风格：">
        <el-select v-model="form.frontStyle" placeholder="请选择">
          <el-option
            v-for="item in frontStyle"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客户端内页风格：">
        <el-select v-model="form.insideStyle" placeholder="请选择">
          <el-option
            v-for="item in insideStyle"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发卡网页面风格：">
        <el-select v-model="form.fakaStyle" placeholder="请选择">
          <el-option
            v-for="item in fakaStyle"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="登陆后页面：" prop="goPage">
        <el-radio-group v-model="form.goPage">
          <el-radio :label="0">首页</el-radio>
          <el-radio :label="1">商品页</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item label="qq链接：">
        <el-input v-model="form.qqLink" style="width:500px"/>
      </el-form-item>
      <el-form-item label="qq群链接：">
        <el-input v-model="form.qunLink" style="width:500px" />
      </el-form-item>
      <el-form-item label="qq群是否自动弹出">
        <el-checkbox v-model="form.isQun" :true-label="1" :false-label="0" />
      </el-form-item>
      <!-- <el-form-item label="无手续费充值卡：">
        <el-input v-model="form.rechargeCardUrl" style="width:500px"/>
      </el-form-item>
      <el-form-item label="网盘地址：">
        <el-input v-model="form.panUrl" style="width:500px"/>
      </el-form-item>
      <el-form-item label="网盘密码：">
        <el-input v-model="form.panPwd" style="width:200px"/>
      </el-form-item> -->
      <el-form-item label="背景图片：">
        {{form.backImg}}
        <Upload :imgList="form.backImg" imgName="背景图片" v-on:listenTochildEvent="(data)=>showMessageFromChild('backImg', data)" v-if="imgLoading" />
      </el-form-item>

      <el-form-item label="背景视频：">
        <UploadVideo :imgList="form.backVideo" imgName="背景视频" v-on:listenTochildEvent="(data)=>showMessageFromChild('backVideo', data)" v-if="imgLoading" />
      </el-form-item>

      <el-form-item label="背景音乐：">
        <UploadAudio :imgList="form.backMusic" imgName="背景音乐" v-on:listenTochildEvent="(data)=>showMessageFromChild('backMusic', data)" v-if="imgLoading" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确认保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { styleSettings, updateStyleSettings } from '@/api/meun1/menu1-1/index'
import Upload from '@/components/Upload'
import UploadVideo from '@/components/Upload/video'
import UploadAudio from '@/components/Upload/audio'

export default {
  components: {
    Upload,
    UploadVideo,
    UploadAudio
  },
  data() {
    return {
      form:{backImg: ''},
      imgLoading: false,
      backendStyle: [
        {
          value:1,
          label:'默认风格'
        }
      ],
      frontStyle: [
        {
          value:1,
          label:'默认风格'
        },
        {
          value:2,
          label:'居中风格'
        },
      ],
      insideStyle: [
        {
          value:1,
          label:'默认风格'
        },
        {
          value:2,
          label:'居中风格'
        },
      ],
      fakaStyle: [
        {
          value:1,
          label:'默认风格'
        },
        {
          value:2,
          label:'绝地求生'
        },
        {
          value:3,
          label:'英雄联盟'
        },
        {
          value:4,
          label:'王者荣耀'
        },
        {
          value:5,
          label:'地下城与勇士'
        },
        {
          value:6,
          label:'守望先锋'
        },
      ],
  
    }
  },
  methods: {
      // 获取信息
    styleSettingsInfo() {
      styleSettings({}).then(res => {
        this.form = {...this.form, ...res.body}
        this.imgLoading = true
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },

    // 上传返回的信息
    showMessageFromChild(type, data){
      this.form = {
        ...this.form,
        [type]:data
      }
    },

    onSubmit() {
      updateStyleSettings(this.form).then(res => {
          if (res.code===1001){
            this.$message({
              message: res.msg,
              type: 'success',
            });
          } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error',
            });
          }
      }).catch(err => {

      })
    }
  },

  created(){
      this.styleSettingsInfo();
  },


}
</script>

<style scoped>

</style>

