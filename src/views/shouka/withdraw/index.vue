<template>
  <div class="container menu2-1-container">
    <div class="tab-wrap">
      <a to="sub1" :class="{'active':type == 1}" @click="goTab(1)">提现申请记录</a>
      <a to="sub1" :class="{'active':type == 2}" @click="goTab(2)">提现方式处理</a>
    </div>
    <div class="filter-wrap" v-show="type == 1">
      <span>查询关键字：</span>
      <el-input v-model="queryParams.cashNumber" placeholder="请输入提现单号" style="width:200px" class="search-input"></el-input>
 
      <el-select v-model="queryParams.cashMethodID" placeholder="请选择提现类型" style="width:200px" clearable @clear="setValueNull(1)">
          <el-option
            v-for="item in cashTypeListData"
            :key="item.cashTypeID"
            :label="item.cashTypeName"
            :value="item.cashTypeID">
          </el-option>
      </el-select>

      <el-date-picker style="width:430px" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" @change="dataSearch" v-model="queryTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
      <el-button type="primary" @click="queryFormList" icon="el-icon-search">查询</el-button>
      <el-button type="success" @click="withdrawalMoney" icon="el-icon-share">申请提现</el-button>
    </div>
    <div class="recevie-wrap" v-show="type == 1">
      <el-table border row-key="cashID" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266','text-align':'center'}" v-loading="loading" size="mini" :cell-style="{'text-align':'center'}">
         <el-table-column :show-overflow-tooltip="true" type="selection" > </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="askDate" label="申请时间"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="cashNumber" label="提现单号" ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="cashMethodID" label="提现类型" >
          <template slot-scope="scope">
            <span v-if="scope.row.cashMethodVO">{{scope.row.cashMethodVO.cashTypeID===1?'支付宝': scope.row.cashMethodVO.cashTypeID===2 ? '微信' : '其他'}}</span>
          </template>
        </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="cashMethodID" label="账户名" >
          <template slot-scope="scope">
            <span v-if="scope.row.cashMethodVO">{{scope.row.cashMethodVO.cashName}}</span>
          </template>
        </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="money" label="提现金额" ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="fee" label="手续费" ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="dealUserID" label="处理人" ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="dealDate" label="处理时间" ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="test6" label="审核申请" align="center">
          <template slot-scope="scope">
            <el-button type="warning" plain size="mini" style="margin-left:0" v-show="scope.row.cashState == 1">审核中</el-button>
            <el-button type="primary" plain size="mini" style="margin-left:0" v-show="scope.row.cashState == 2">提现中</el-button>
            <el-button type="success" plain size="mini" style="margin-left:0" v-show="scope.row.cashState == 3">提现完成</el-button>
            <el-button type="danger" plain size="mini" style="margin-left:0" v-show="scope.row.cashState == 4">审核失败</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>




    <div class="recevie-wrap" v-show="type == 2">
      <el-form ref="form" :model="form" :rules="rules" label-width="140px" class="demo-ruleForm">
        <el-form-item label="提现账户：" prop="cashAccount">
          <el-input v-model="form.cashAccount" placeholder="请输入提现账户" type="text" style="float:left;width:400px" :disabled="loading"></el-input>
        </el-form-item>

        <el-form-item label="提现账户姓名：" prop="cashName">
          <el-input v-model="form.cashName" placeholder="请输入提现账户姓名" type="text" style="float:left;width:400px" :disabled="loading"></el-input>
        </el-form-item>

        <el-form-item label="提现类型：" prop="cashTypeID">
          <el-select v-model="form.cashTypeID" placeholder="请选择提现类型" style="width:200px" :disabled="loading">
            <el-option
              v-for="item in cashTypeListData"
              :key="item.cashTypeID"
              :label="item.cashTypeName"
              :value="item.cashTypeID">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="审核状态：" prop="resource">
          <el-radio-group v-model="form.cashMethodState">
            <el-radio :label= 1 disabled>审核中</el-radio>
            <el-radio :label= 2 disabled>审核通过</el-radio>
            <el-radio :label= 3 disabled>审核失败</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="">
          <el-button type="primary" @click="submit('form')" :loading="loading">{{form.cashMethodState ? "修改审核" : "发 起 审 核"}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    




    <!-- 审核提现 -->
    <el-dialog title="提现申请--审核" :visible.sync="toExamineDialog" >
      <el-form ref="toExamineForm" :model="toExamineForm" label-width="120px">
        <el-form-item label="审核状态：">
          <el-radio-group v-model="toExamineForm.cashState">
            <el-radio :label="1">审核中</el-radio>
            <el-radio :label="2">提现中</el-radio>
            <el-radio :label="3">提现完成</el-radio>
            <el-radio :label="4">审核失败</el-radio>
          </el-radio-group>
        </el-form-item> 
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="toExamineDialog = false">取 消</el-button>
        <el-button type="primary" @click="toExamineConfirm" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>


    <!-- 申请提现 -->
    <el-dialog title="申请提现" :visible.sync="withdrawalDialog" >
      <el-form ref="thisMoneyForm" :model="thisMoneyForm" label-width="30%">
        <el-form-item label="保证金：">
          <el-input-number v-model="thisMoneyData.bondMoney" :disabled="true" :precision="2" controls-position="right"></el-input-number><span style="margin-left:14px">元</span>
        </el-form-item> 
        <el-form-item label="冻结资金：">
          <el-input-number v-model="thisMoneyData.frozenMoney" :disabled="true" :precision="2" controls-position="right"></el-input-number><span style="margin-left:14px">元</span>
        </el-form-item> 
        <el-form-item label="可提现金额：">
          <el-input-number v-model="thisMoneyData.money" :disabled="true" :precision="2" controls-position="right"></el-input-number><span style="margin-left:14px">元</span>
        </el-form-item> 
        <el-form-item label="提现金额：">
          <el-input-number v-model="thisMoneyForm.money" :min="0.01" :max="thisMoneyData.money" :precision="2" controls-position="right" @change="handleChange"></el-input-number><span style="margin-left:14px">元</span>
        </el-form-item> 
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="withdrawalDialog = false">取 消</el-button>
        <el-button type="primary" @click="withdrawalConfirm" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { getList,getLists,getData,getDatas,postApplicationJson } from '@/api/price/price-1/common'
export default {
  data() {
    return {
      type:1,
      color:'#333',
      form:{},
      toExamineForm:{},
      thisMoneyForm:{},
      methodStateForm:{},
      queryTime:[],//查询时间
      delConfirmLoading: false,
      toExamineDialog: false,//提现申请  审核
      withdrawalDialog: false,
      cashMethodStateOptions: [{
          value: 1,
          label: '审核中'
        }, {
          value: 2,
          label: '审核通过'
      }, {
          value: 3,
          label: '审核失败'
      }],
      dialog1:false,
      cashTypeListData:[],
      currentPage:1,
      tableData: [],
      total:0,
      queryParams:{
        pageNum:1,
        pageSize:10
      },
      loading: false,
      multipleSelection: [],
      thisMoneyData:{
        bondMoney: 0,
        frozenMoney: 0,
        money: 0
      },
      rules: {
        cashAccount: [
          { required: true, message: '请输入提现账户', trigger: 'blur' },
        ],
        cashName: [
          { required: true, message: '请输入提现账户姓名', trigger: 'blur' },
        ],
        cashTypeID: [
          { required: true, message: '请现在提现类型', trigger: 'blur' },
        ],
      }
    }
  },
  components: {
    Tinymce
  },
  methods: {

    // 审核   提现申请
    toExamineButton(data) {
      this.toExamineDialog = true
      this.toExamineForm = {
        cashState:data.cashState,
        cashID:data.cashID
      }
    },


    // 确认申请  提现
    toExamineConfirm() {
      this.loading = true

      getLists(this.toExamineForm,'/finance/cash/cashExamine').then(res => {
        if(res.code===1001){
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'success',
          });
          this.getCashList();
          this.toExamineDialog = false
        }else{
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'error'
          });
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },

    // 
    withdrawalMoney(){
      this.withdrawalDialog = true
    },



    // 清空筛查条件
    setValueNull(val){
      if(val === 1){
        delete this.queryParams.cashMethodID
      }
    },

    // 查询
    queryFormList(){
        this.getCashList();
    },

    // 处理时间改变
    dataSearch(){
      if(this.queryTime){
        this.queryParams = {
          ...this.queryParams,
          askDateStart:this.queryTime[0],
          askDateEnd:this.queryTime[1]
        }
      }else{
        delete this.queryParams.askDateStart
        delete this.queryParams.askDateEnd
      }
    },



    handleSizeChange(val) {
      this.queryParams.pageSize = val
      if (this.type===1) {
        this.getCashList();
      }
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      if (this.type===1) {
        this.getCashList();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // tab跳转窗口
    goTab(type) {
      this.loading = false
      this.type = type
      this.queryParams = {
        pageNum:1,
        pageSize:10
      }
      if (type===1) {
        this.getCashList();
      }else{
        this.getCashMethod();
      }
    },



    // 获取提现方式的详情信息
    getCashMethod() {
      getDatas({},'/finance/cashMethod/get').then(res => {
        if(res.code===1001){
          this.form = {
            cashAccount: res.body.cashAccount,
            cashName: res.body.cashName,
            cashTypeID: res.body.cashTypeID,
            cashMethodState: res.body.cashMethodState
          }
        }
        console.log(this.form)
      }).catch(err => {
        
      })
    },

    // 提现记录列表
    getCashList() {
      getLists(this.queryParams,'/finance/cash/myCashPage').then(res => {
        if(res.code===1001){
          this.total = res.body.total
          this.tableData = res.body.records
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },


    // 获取提现类型
    cashTypeList(){
      getDatas({},'/finance/cashType/list').then(res => {
          if(res.code === 1001){
              this.cashTypeListData = res.body
          }
      }).catch(err => {

      })
    },

    // 申请金额 变化
    handleChange(val){
      
    },

    // 确认  申请提现
    withdrawalConfirm(){
      if(!this.thisMoneyForm.money || this.thisMoneyForm.money == 0){
          this.$message({
            showClose: true,
            message: '请输入正确的提现金额',
            type: 'error',
          });
      }else{
        this.loading = true
        getLists(this.thisMoneyForm,'/finance/cash/add').then(res => {
          if(res.code===1001){
            this.$message({
              message: res.msg,
              type: 'success',
            });
            this.thisMoney();
            this.getCashList();
            this.withdrawalDialog = false
          }else{
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error',
            });
          }
          this.loading = false
        }).catch(err => {
          this.loading = false
        })
      }
    },

    // 获取当前登录者的余额信息
    thisMoney(){
      getDatas({},'/finance/siteMoney/getCurrentMoney').then(res => {
          if(res.code === 1001){
              this.thisMoneyData = res.body
          }
      }).catch(err => {

      })
    },

    // 新增提现方式
    submit(form){
      this.$refs[form].validate(async valid => {
        if (!valid) return null  // 如果验证失败就不往下继续执行
        
        getLists(this.form,"/finance/cashMethod/add").then(res => {
            if(res.code === 1001){
              this.$message({
                message: res.msg,
                type: 'success',
              });
              this.getCashMethod()
            }else{
              this.$message({
                showClose: true,
                message: res.msg,
                type: 'error',
              });
            }
        }).catch(err => {

        })
      });
    },
    
    
  },
  created() {
    this.getCashList();
    this.cashTypeList();
    this.thisMoney();
  },
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
    margin-top:10px!important;
    .el-input,.el-select {
      width:130px;
    }
  }
  .handle-wrap {
    // margin-top:20px;
    margin-bottom:20px;
  }
  
}
</style>

