<template>
  <div class="container menu2-1-container">
    <div class="tab-wrap">
      <a to="sub1" :class="{'active':type == 1}" @click="goTab(1)">提现申请记录</a>
      <a to="sub1" :class="{'active':type == 2}" @click="goTab(2)">提现方式处理</a>
      <a to="sub1" :class="{'active':type == 3}" @click="goTab(3)">提现申请费率设置</a>
    </div>
    <div class="filter-wrap" v-show="type == 1 || type == 2">
      <span>查询关键字：</span>
      <el-input v-show="type == 2" v-model="queryParams.cashAccount" placeholder="请输入提现账户" style="width:200px" class="search-input"></el-input>
      <el-input v-show="type == 1" v-model="queryParams.cashNumber" placeholder="请输入提现单号" style="width:200px" class="search-input"></el-input>
      <el-input v-show="type == 2" v-model="queryParams.cashName" placeholder="请输入提现名称" style="width:200px" class="search-input"></el-input>
      <el-select v-show="type == 2" v-model="queryParams.cashMethodState" placeholder="请选择提现状态" style="width:200px" clearable @clear="setValueNull(1)">
          <el-option
            v-for="item in cashMethodStateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
      </el-select>

      <el-select v-show="type == 2" v-model="queryParams.cashTypeID" placeholder="请选择提现类型" style="width:200px" clearable @clear="setValueNull(2)">
          <el-option
            v-for="item in cashTypeListData"
            :key="item.cashTypeID"
            :label="item.cashTypeName"
            :value="item.cashTypeID">
          </el-option>
      </el-select>

      <el-select v-show="type == 1" v-model="queryParams.cashMethodID" placeholder="请选择提现类型" style="width:200px" clearable @clear="setValueNull(2)">
          <el-option
            v-for="item in cashTypeListData"
            :key="item.cashTypeID"
            :label="item.cashTypeName"
            :value="item.cashTypeID">
          </el-option>
      </el-select>

      <el-date-picker v-show="type == 1" style="width:430px" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" @change="dataSearch" v-model="queryTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
      <el-button type="primary" @click="queryFormList" icon="el-icon-search">查询</el-button>
    </div>
    <div class="recevie-wrap" v-show="type == 1">
      <el-table border row-key="cashID" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266','text-align':'center'}" v-loading="loading" size="mini" :cell-style="{'text-align':'center'}">
         <el-table-column :show-overflow-tooltip="true" type="selection" > </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="userName" label="申请人"  ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="askDate" label="申请时间"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="cashNumber" label="提现单号" ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="cashMethodID" label="提现类型" >
          <template slot-scope="scope">
            <span>{{scope.row.cashMethodID===1?'支付宝':'微信'}}</span>
          </template>
        </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="money" label="提现金额" ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="fee" label="手续费" ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="dealUserID" label="处理人" ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="dealDate" label="处理时间" ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="test6" label="审核申请" align="center">
          <template slot-scope="scope">
            <el-button type="warning" plain size="mini" style="margin-left:0" v-show="scope.row.cashState == 1" @click="toExamineButton(scope.row)">审核中</el-button>
            <el-button type="primary" plain size="mini" style="margin-left:0" v-show="scope.row.cashState == 2" @click="toExamineButton(scope.row)">提现中</el-button>
            <el-button type="success" plain size="mini" style="margin-left:0" v-show="scope.row.cashState == 3" @click="toExamineButton(scope.row)">提现完成</el-button>
            <el-button type="danger" plain size="mini" style="margin-left:0" v-show="scope.row.cashState == 4" @click="toExamineButton(scope.row)">审核失败</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
    <div class="recevie-wrap" v-show="type == 2">
      <el-table border row-key="index" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266','text-align':'center'}"  v-loading="loading" size="mini" :cell-style="{'text-align':'center'}">
         <el-table-column :show-overflow-tooltip="true" type="selection" > </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="userName" label="客户信息"  ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="cashSubmitDate" label="提交时间"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="cashName" label="提现账户姓名" ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="cashAccount" label="提现账户号" ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="siteName" label="站点名称" ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label3" label="处理人" ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="dealDate" label="处理时间" ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="test6" label="审核申请" align="center">
          <template slot-scope="scope">
            <el-button type="warning" plain size="mini" style="margin-left:0" v-show="scope.row.cashMethodState == 1" @click="cashMethodButton(scope.row)">审核中</el-button>
            <el-button type="success" plain size="mini" style="margin-left:0" v-show="scope.row.cashMethodState == 2" @click="cashMethodButton(scope.row)">审核通过</el-button>
            <el-button type="danger" plain size="mini" style="margin-left:0" v-show="scope.row.cashMethodState == 3" @click="cashMethodButton(scope.row)">审核失败</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
    <div v-show="type == 3">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="设置类型：">
          <el-radio-group v-model="form.managerType">
            <el-radio :label="3">主站默认</el-radio>
            <el-radio :label="2">平台</el-radio>
            <el-radio :label="1">管理</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="'自定义'+(index+1)+'：'" v-for="(item,index) in form.list" :key="index">
            <el-input-number v-if="item.rateTypeName!=='百分比'" :min="0" controls-position="right" v-model="item.startMoney" style="width:100px;"></el-input-number>
            <el-input-number v-if="item.rateTypeName==='百分比'" :min="0.01" :max="1.00" :precision="2" :step="0.01" controls-position="right" v-model="item.startMoney" style="width:100px;"></el-input-number> 
            <span class="tips" style="margin-right:10px;">—</span>
            <el-input-number controls-position="right" v-if="item.rateTypeName!=='百分比'" :min="0" v-model="item.endMoney" style="width:100px;"></el-input-number>
            <el-input-number controls-position="right" v-if="item.rateTypeName==='百分比'" :min="0.01" :max="1.00" :precision="2" :step="0.01" v-model="item.endMoney" style="width:100px;"></el-input-number>
            <span class="tips" style="margin-right:10px;">—</span>
            <el-select @change="selectChanged" v-model="item.rateTypeName" placeholder="请选择收费类型" style="width:150px;">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <span class="tips" style="margin-right:10px;">--费率为</span> 
            <el-input-number controls-position="right" :min="0.01" :max="1.00" :precision="2" :step="0.01" v-model="item.rateNum" style="width:100px;"></el-input-number>
            <span class="tips" style="margin-right:10px;">%</span> 
            <el-button type="danger" size="mini" @click="del(item,index)">删除</el-button>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="confirmForm" :loading="delConfirmLoading">确 定</el-button>
          <el-button type="warning" @click="add">插入新规则</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 详情 -->
    <el-dialog title="支付明细" :visible.sync="dialog1" class="dialog1">
      <el-form ref="form" :model="form" label-width="140px">
        <el-form-item label="付款人：">
          <div>(10545)</div>
        </el-form-item>
        <el-form-item label="支付方式：">
          <div>微信支付</div>
        </el-form-item>
        <el-form-item label="提交时间：">
          <div>2019-11-21 10:46</div>
        </el-form-item>
        <el-form-item label="商户订单号：">
          <div>WXPAY201911214810151148</div>
        </el-form-item>
        <el-form-item label="交易订单号：">
          <div>2019112110464297135</div>
        </el-form-item>
        <el-form-item label="支付金额：">
          <div>15.750</div>
        </el-form-item>
        <el-form-item label="支付手续费：">
          <div>0.750</div>
        </el-form-item>
        <el-form-item label="支付状态：">
          <div>支付成功</div>
        </el-form-item>
        <el-form-item label="返回或处理备注：">
          <div>在线支付成功</div>
        </el-form-item>
        <el-form-item label="结束时间：">
          <div>2019-11-21 10:46</div>
        </el-form-item>
      </el-form>
    </el-dialog>


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

    <!-- 提现方式审核 -->
    <el-dialog title="提现方式--审核" :visible.sync="methodStateDialog" >
      <el-form ref="methodStateForm" :model="methodStateForm" label-width="120px">
        <el-form-item label="审核状态：">
          <el-radio-group v-model="methodStateForm.cashMethodState">
            <el-radio :label="1">审核中</el-radio>
            <el-radio :label="2">审核完成</el-radio>
            <el-radio :label="3">审核失败</el-radio>
          </el-radio-group>
        </el-form-item> 
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="methodStateDialog = false">取 消</el-button>
        <el-button type="primary" @click="cashMethodConfirm" :loading="loading">确 定</el-button>
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
      form:{
        list:[],
        managerType:3
      },
      toExamineForm:{},
      methodStateForm:{},
      queryTime:[],//查询时间
      delConfirmLoading: false,
      toExamineDialog: false,//提现申请  审核
      methodStateDialog: false, //提现方式 审核
      options: [{
          value: '1',
          label: '百分比'
        }, {
          value: '2',
          label: '固定金额'
      }],
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
      multipleSelection: []
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

    // 审核  提现方式
    cashMethodButton(data) {
      this.methodStateDialog = true
      this.methodStateForm = {
        cashMethodState:data.cashMethodState,
        userID:data.userID
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

    // 确认审核  提现方式
    cashMethodConfirm() {
      this.loading = true

      getLists(this.methodStateForm,'/finance/cashMethod/cashMethodExamine').then(res => {
        if(res.code===1001){
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'success',
          });
          this.getCashMethodList();
          this.methodStateDialog = false
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

    // 清空筛查条件
    setValueNull(val){
      if(val === 1){
        this.queryParams = {
          ...this.queryParams,
          cashMethodState: ''
        }
      }else if(val === 2){
        if(this.type===1){
          delete this.queryParams.cashMethodID
        }else{
          delete this.queryParams.cashTypeID
        }
      }
    },

    // 查询
    queryFormList(){
      if(this.type===2){
        this.getCashMethodList();
      }else{
        this.getCashList();
      }
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
      }else if (this.type===2){
        this.getCashMethodList();
      }
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      if (this.type===1) {
        this.getCashList();
      }else if (this.type===2){
        this.getCashMethodList();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    add() {
      let newData = {startMoney:'',endMoney:'',rateNum:'',rateType:'',rateTypeName:''}
      this.form.list.push(newData)
    },
    del(data,indexs) {
      if(data.cashRateID){
        getDatas({id:[data.cashRateID]},'/finance/cashRate/delete').then(res => {
          if(res.code===1001){
            let newData = []
            this.form.list.map(function(item,index) {
                console.log(item,index)
                if(index!==indexs){
                  newData.push(item)
                }
            })
            this.form.list = newData
            this.$message({
              message: res.msg,
              type: 'success',
            });
          }else{
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error',
            });
          }
        }).catch(err => {
          
        })
      }else{
        let newData = []
        this.form.list.map(function(item,index) {
            console.log(item,index)
            if(index!==indexs){
              newData.push(item)
            }
        })
        this.form.list = newData
      }
    },

    // 收费类型改变
    selectChanged(){
      this.form.list.map(item => {
        item.rateTypeName = item.rateTypeName === '1' || item.rateTypeName === '百分比' ? '百分比' : '固定金额'
      })
    },

    // 设置费率
    confirmForm(){
      let _this = this
      if(this.form.list.length===0){
          _this.$message({
            showClose: true,
            message: '请设置提现申请费率',
            type: 'error',
          });
          return
      }
      let newDataList = []

      let flag = true
      _this.form.list.map(function(item,index){
        let newData = []
        if(!item.startMoney){
          _this.$message({
            showClose: true,
            message: '自定义第'+(index+1)+'条，未填写开始金额',
            type: 'error',
          });
          flag = false
          return
        }else if(!item.endMoney){
          _this.$message({
            showClose: true,
            message: '自定义第'+(index+1)+'条，未填写结束金额',
            type: 'error',
          });
          flag = false
          return
        }else if(!item.rateTypeName){
          _this.$message({
            showClose: true,
            message: '自定义第'+(index+1)+'条，未填写收费类型',
            type: 'error',
          });
          flag = false
          return
        }else if(!item.rateNum){
          _this.$message({
            showClose: true,
            message: '自定义第'+(index+1)+'条，未填写费率',
            type: 'error',
          });
          flag = false
          return
        }else{
            if(item.startMoney>=item.endMoney) {
              _this.$message({
                showClose: true,
                message: '自定义第'+(index+1)+'条，结束金额必须大于开始金额',
                type: 'error',
              });
              flag = false
              return
            }
            _this.form.list.map(item => {
                newData.push({startMoney:item.startMoney,endMoney:item.endMoney,rateType:item.rateTypeName === '百分比' ? 1 : 2,managerType:_this.form.managerType,cashRateID:item.cashRateID?item.cashRateID:'',rateNum:item.rateNum})
            })
        }
        newDataList = newData
      })
      
      if(!flag){
        return
      }
      _this.delConfirmLoading = true
      postApplicationJson(newDataList,'/finance/cashRate/saveCashRateBatch').then(res => {
        if (res.code===1001){
            this.$message({
              message: res.msg,
              type: 'success',
            });
            this.getListCashRate()
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'error',
          });
        }
        _this.delConfirmLoading = false
      }).catch(err => {
        _this.delConfirmLoading = false
      })
    },

    // tab跳转窗口
    goTab(type) {
      this.loading = true
      this.type = type
      this.queryParams = {
        pageNum:1,
        pageSize:10
      }
      if (type===1) {
        this.getCashList();
      }else if (type===2){
        this.getCashMethodList();
      }else{
        this.getListCashRate();
      }
    },

    // 获取提现费率
    getListCashRate() {
      getDatas({},'/finance/cashRate/listCashRate').then(res => {
        if(res.code===1001){
          if(res.body.length > 0) {
            res.body.map(item => {
              item.rateTypeName = item === 1 ? '百分比' : '固定金额'
            })
            this.form = {
              list:res.body,
              managerType: res.body[0].managerType
            }
          }else{
            this.form = {
              list:[{startMoney:'',endMoney:'',rateNum:'',rateType:'',rateTypeName:''}],
              managerType: Number(sessionStorage.getItem("userType")) || 3
            }
          }
        }
      }).catch(err => {
        
      })
    },


    // 提现记录列表
    getCashList() {
      getLists(this.queryParams,'/finance/cash/cashPage').then(res => {
        if(res.code===1001){
          this.total = res.body.total
          this.tableData = res.body.records
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },

    //  提现方式列表
    getCashMethodList() {
      getLists(this.queryParams,'/finance/cashMethod/cashMethodPage').then(res => {
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
    }
  },
  created() {
    this.getCashList();
    this.cashTypeList();
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

