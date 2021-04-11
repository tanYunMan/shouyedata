<template>
  <div class="container">
    <el-form ref="form" :model="form" label-width="180px">
      <div class="title">对接供货设置</div>
      <el-form-item label="对接客户默认级别：">
        <el-select v-model="form.type" placeholder="请选择">
          <el-option label="无事" value="1"></el-option>
          <el-option label="最高密价" value="2"></el-option>
          <el-option label="密价" value="3"></el-option>
          <el-option label="对接等级" value="4"></el-option>
          <el-option label="站长" value="5"></el-option>
          <el-option label="SVIP" value="6"></el-option>
          <el-option label="VIP3" value="7"></el-option>
          <el-option label="VIP2" value="8"></el-option>
          <el-option label="VIP1" value="9"></el-option>
          <el-option label="VIP" value="10"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="主站全网供货商品上限：">
        <span>10000（已使用：126）</span>
      </el-form-item>
      <el-form-item label="是否开通全网供货：">
        <el-radio-group v-model="form.t">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="2">关闭</el-radio>
        </el-radio-group>
      </el-form-item> 
      
      <div class="title">对接同步设置</div>
      <el-form-item label="全自动同步时间：">
        <el-checkbox-group v-model="checkList">
          <el-checkbox label="1">数据实时同步</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="全自动同步范围：">
        <el-checkbox-group v-model="checkList">
          <el-checkbox label="1">商品价格</el-checkbox>
          <el-checkbox label="2">商品状态</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="全自动同步包含：">
        <el-checkbox-group v-model="checkList">
          <el-checkbox label="1">全网通对接</el-checkbox>
          <el-checkbox label="2">SUP对接</el-checkbox>
          <el-checkbox label="2">平台间对接</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <div class="title">一键通(一键克隆功能)</div>
      <el-form-item label="一键通权限：">
        <el-radio-group v-model="form.t">
          <el-radio :label="1">开通</el-radio>
          <el-radio :label="2">关闭</el-radio>
        </el-radio-group>
      </el-form-item> 
      <el-form-item label="被对接数量：">
        <span>总共：0 已用：0</span>
        <el-button size="mini" type="primary" style="margin-left:20px;">查看</el-button>
      </el-form-item> 
      <el-form-item label="键通对接数量：">
        <span>可对接0个网站货源</span>
        <el-button size="mini" type="primary" style="margin-left:20px;">查看规则</el-button>
      </el-form-item> 

      <el-form-item>
        <el-button type="primary">确认保存</el-button>
      </el-form-item>
      
    </el-form>

    <el-dialog title="月最大销售金额" :visible.sync="dialog" width="30%">
      <el-form ref="form" :model="form1" label-width="120px">
        <el-form-item label="普及版：">
          <span>10(万元)</span>
        </el-form-item>  
        <el-form-item label="专业版：">
          <span>30(万元)</span>
        </el-form-item> 
        <el-form-item label="旗舰版：">
          <span>50(万元)</span>
        </el-form-item> 
        <el-form-item label="MA云版：">
          <span>100(万元)</span>
        </el-form-item>  
        <el-form-item label="至尊版：">
          <span>100(万元)</span>
        </el-form-item>  
        <el-form-item label="官方测试版本：">
          <span>100(万元)</span>
        </el-form-item>  
      </el-form>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">取 消</el-button>
        <el-button type="primary" @click="dialog = false">确 定</el-button>
      </span>
    </el-dialog>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialog:false,
      imageUrl:'',
      checkList:[],
      form:{
        t:'1'
      },
      form1: {

      }
    }
  },
  methods: {
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
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
  }
  .avatar {
    width: 60px;
    height: 60px;
    display: block;
  }
}
    
</style>
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

