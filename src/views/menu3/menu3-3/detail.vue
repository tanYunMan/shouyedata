<template>
  <div class="container">
    
    <el-form ref="form" :model="form" label-width="140px">
      <div class="title">商品信息</div>
      <el-form-item label="商品名称：">
        <el-input v-model="form.name" placeholder="请输入商品名称" style="float:left"></el-input>
        <colorPicker v-model="color"></colorPicker>
        <el-checkbox v-model="form.k" style="margin-left:20px">粗体</el-checkbox>
        <el-checkbox v-model="form.k">最热商品</el-checkbox>
      </el-form-item>
      <el-form-item label="商品面值：">
        <el-input v-model="form.name" placeholder="请输入商品面值"></el-input>
        <span style="margin-left:20px;">元</span>
      </el-form-item>
      <el-form-item label="质保天数：">
        <el-switch v-model="day" active-color="#13ce66" inactive-color="#eee"></el-switch>
        <span v-if="day">
          <el-input v-model="form.name" placeholder="请输入质保天数" style="width:150px;margin:0 15px;" v-if="day"></el-input>
          <span class="tips">输入范围：0买家不可申请售后，1-365天，此时间段内买家可申请售后</span>
        </span>
        <span v-else class="tips">售出后买家不可申请售后</span>
      </el-form-item>
      <el-form-item label="商品类型：">
        <el-radio-group v-model="form.t">
          <el-radio :label="1">自动发货</el-radio>
          <el-radio :label="2">商家发货</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- <el-form-item label="充值模板：">
        <el-select v-model="form.type" placeholder="请选择">
          <el-option label="模板一" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="充值时间：">
        <el-input placeholder="请输入充值时间" style="width:150px;"></el-input>
        <el-select v-model="form.type" placeholder="请选择">
          <el-option label="小时" value="1"></el-option>
        </el-select>
        <span class="tips" style="margin-left:20px;">超出此时间系统将自动退单</span>
      </el-form-item> -->
      <el-form-item label="商品图片：">
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false">
          <img v-if="form.t" :src="form.y" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <span class="tips">图片尺寸：180*180</span>
      </el-form-item>
      <el-form-item label="商品介绍：">
        <el-input placeholder="请输入商品介绍" type="textarea" :rows="5" style="400px;"></el-input>
        <!-- <tinymce v-model="content" :height="300" /> -->
       <!--  <span class="tips" style="margin-left:20px;">超出此时间系统将自动退单</span> -->
      </el-form-item>
      <el-form-item label="注意事项：">
        <el-input placeholder="请输入注意事项" type="textarea" :rows="5" style="400px;"></el-input>
        <span class="tips" style="margin-left:20px;">买家下单时需要确认阅读此信息才可购买，300字内</span>
      </el-form-item>
      <el-form-item label="充值网址：">
        <el-input v-model="form.name" placeholder="请输入充值网址"></el-input>
        <span class="tips" style="margin-left:20px;">充卡的网址，非卡密可不填写，只有卡密商品才显示</span>
      </el-form-item>
      <el-form-item label="购买数量限制：">
        <el-input style="width:100px;"></el-input> — <el-input style="width:100px;"></el-input>
        <span class="tips" style="margin-left:20px;">请填写大于等于1的整数</span>
      </el-form-item>
      <el-form-item label="单人购买次数：">
        <el-input style="width:100px;"></el-input>
        <span class="tips" style="margin-left:20px;">请填写大于等于1的整数</span>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary">修改商品</el-button>
      </el-form-item>
    </el-form>
    
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'

export default {
  data() {
    return {
      day:true,
      color:'#333',
      form:{},
      content:'1'
    }
  },
  components: {
    Tinymce
  }
}
</script>
<style lang="scss">
.avatar-uploader {
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 180px;
    height: 180px;
    line-height: 180px;
    text-align: center;
  }
  .avatar {
    width: 180px;
    height: 180px;
    display: block;
  }
}
    
</style>
<style lang="scss" scoped>
  
.container {
  .tips {
    color:#909399;
    font-size:12px;
    line-height:20px;
    width:400px;
  }
  .el-input {
    width:300px;
  }
  .el-textarea {
    width:600px;
  }
  .el-color-picker {
    float:left;
    margin-left:20px;
  }
}
</style>

