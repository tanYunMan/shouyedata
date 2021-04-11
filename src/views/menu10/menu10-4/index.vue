<template>
  <div class="container menu7-4-container">

    <el-form ref="form" :model="form" label-width="140px">
      <el-form-item label="加款方式：">
        <div style="color:red">平台给客户加/扣款</div>
      </el-form-item>
      <el-form-item label="管理员账户余额：">
        <span style="color:red">{{form.userMoney || '0'}}</span> <span>元</span>
      </el-form-item>
      <el-form-item label="客户编号：">
        <el-input v-model="form.userID" placeholder="请输入客户编号" style="width:400px;"></el-input>
      </el-form-item>
      <el-form-item label="操作金额：">
          <el-input-number v-model="form.money" placeholder="请输入操作金额" controls-position="right" :min="0" :max="form.userMoney" :precision="2" :step="1"></el-input-number><span class="tips">元</span>
      </el-form-item>
      <el-form-item label="确认金额：">
          <el-input-number v-model="form.moneys" placeholder="请输入操作金额" controls-position="right" :min="0" :max="form.userMoney" :precision="2" :step="1"></el-input-number><span class="tips">元</span>
      </el-form-item>
        <el-form-item label="操作类型：">
          <el-select v-model="form.transactionType" placeholder="请选择">
            <el-option
              v-for="item in operTypeList"
              :key="item.key"
              :label="item.text"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
      <el-form-item label="相关备注：">
        <el-input type="textarea" v-model="form.remark" :rows="5" placeholder="请输入相关备注" style="width:400px;"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="addAndDeductData" :loading="confirmLoading">确 定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { getLists,getDatas } from '@/api/price/price-1/common'
export default {
  data() {
    return {
      type:1,
      color:'#333',
      form:{},
      dialog1:false,
      currentPage:1,
      operTypeList: [],//加扣款操作类型
      confirmLoading: false,
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

    // 获取当前用户的余额
    thisUserMoney(){
      getDatas({},'/finance/userMoney/getNowUserMoney').then(res => {
        if (res.code===1001){
          if(res.body && res.body.money){
            this.form = {
              ...this.form,
              userMoney:res.body.money
            }
          }
        }
      }).catch(err => {
        
      })
    },

    // 点击  加扣款操作
    addAndDeductData(){
      if(this.form.money==undefined || this.form.money!==this.form.moneys){
        this.$message({
          showClose: true,
          message: '请重新确认操作金额',
          type: 'error',
        });
        return
      }
      this.confirmLoading = true
      getLists(this.form,'/finance/userMoney/changeUserMoney').then(res => {
        if(res.code === 1001){
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'success',
          });
          this.form = {}
          this.thisUserMoney()
        }else{
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'error',
          });
        }
        this.confirmLoading = false
      }).catch(err => {
        
      })
    },

    // 获取加扣款类型
    getOperTypeList(){
      getDatas({},'/finance/operMoney/getOperTypeList').then(res => {
        if (res.code===1001){
          this.operTypeList = res.body
        }
      }).catch(err => {
        
      })
    }
  },
  created(){
      this.thisUserMoney()
      this.getOperTypeList();//获取加扣款操作类型
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

