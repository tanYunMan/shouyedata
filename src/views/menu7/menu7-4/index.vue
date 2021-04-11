<template>
  <div class="container menu7-4-container">

    <el-form ref="form" :model="form" label-width="140px">
      <el-form-item label="短信接收人类型：">
        <el-radio-group v-model="form.t">
          <el-radio :label="1">指定用户</el-radio>
          <el-radio :label="2">指定级别</el-radio>
          <el-radio :label="3">全部发送</el-radio>
          <el-radio :label="4">指定权限</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="短信接收人：">
        <el-input v-model="form.name" placeholder="请输入短信接收人" style="width:400px;"></el-input>
        <span class="tips">多个客户编号中间请用半角逗号隔开</span>
      </el-form-item>
      <el-form-item label="短信主题：">
        <el-input v-model="form.name" placeholder="请输入短信主题" style="width:400px;"></el-input>
      </el-form-item>
      <el-form-item label="短信内容：">
        <el-input type="textarea" v-model="form.name" :rows="5" placeholder="请输入短信内容" style="width:400px;"></el-input>
        
      </el-form-item>
      <el-form-item label="强制用户查看：">
        <el-radio-group v-model="form.t">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="2">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" >确 定</el-button>
      </el-form-item>
    </el-form>
      
    </span>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
export default {
  data() {
    return {
      type:1,
      color:'#333',
      form:{},
      dialog1:false,
      currentPage:1,
      tableData: [
        {
          label1:'1',
          label2:'名称',
          label3:'0.0',
          label5:'自动发货',
          label6:'目录',
          label7:'99',
          label8:'10'
        },
      ],
      multipleSelection: []
    }
  },
  components: {
    Tinymce
  },
  methods: {
    handleSizeChange(val) {
      console.log(val)
    },
    handleCurrentChange(val) {
      console.log(val)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  }
}
</script>
<style lang="scss">
.menu2-1-container {
  .dialog1 {
    .el-dialog__body {
      overflow: auto;
      max-height:700px;
    }
    .el-input {
      width:400px;
    }
  }
}

</style>
<style scoped lang="scss">
.container {
  padding:20px;
  .tips {
    color:#909399;
    font-size:12px;
    line-height:20px;
    width:400px;
    margin-left:10px;
  }
  .tab-wrap {
    a {
      &.active {
        border-bottom:2px solid #409eff
      }
    }
  }
  .filter-wrap {
    margin-top:20px;
  }
  .handle-wrap {
    // margin-top:20px;
    margin-bottom:20px;
  }
  
}
</style>

