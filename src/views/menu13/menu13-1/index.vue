<template>
  <div class="container menu7-5-container">
    <el-form :inline="true" class="" style="margin-top:10px;margin-bottom:10px;padding : 0 0">
       <el-form-item label="搜索条件：">
        <el-select v-model="serchForm.used" size="small" clearable>
          <el-option value="" label="使用状态">使用状态</el-option>
          <el-option value="1" label="已使用">已使用</el-option>
          <el-option value="0" label="未使用">未使用</el-option>
        </el-select>
      </el-form-item>
       <el-form-item >
        <el-select v-model="serchForm.state" size="small" clearable>
          <el-option value="" label="禁用状态">禁用状态</el-option>
          <el-option value="1" label="使用">使用</el-option>
          <el-option value="0" label="禁用">禁用</el-option>
        </el-select>
      </el-form-item>
       <el-form-item >
         <el-input style="width:350px" v-model="serchForm.cardNo" placeholder="请输入卡号" size="small"/>
      </el-form-item>
      <el-form-item >
        <el-input v-model="serchForm.user" placeholder="请输入用户" clearable size="small" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click.stop="search()">查询</el-button>
      </el-form-item>
      <el-form-item style="margin-right 3px">
        <el-button  type="primary" size="small" @click.stop="dialog = true">生成卡密</el-button>
      </el-form-item>
       <el-form-item style="margin-right 3px">
       <el-button type="danger" @click="update(0)" >批量禁用</el-button>
      </el-form-item>
      <el-form-item style="margin-right 3px">
       <el-button type="primary" @click="update(1)" >批量启用</el-button>
      </el-form-item>

       <el-form-item style="margin-right 3px">
       <el-button type="primary" @click="copyCard" >复制</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="dataList" style="width: 100%;margin-top:30px" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" border size="mini">
      <el-table-column :show-overflow-tooltip="true" type="selection" > </el-table-column>
      <el-table-column align="center" label="卡号" prop="cardNo" width="300px" />
      <el-table-column align="center" label="面值" prop="price" width="200px" />
      <el-table-column align="center" label="状态" prop="state" width="180px">
        <template slot-scope="scope">
          <span v-if="scope.row.state===0">禁用</span>
           <span v-if="scope.row.state===1">正常</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" prop="creatTime" width="220px">
      </el-table-column>
       <el-table-column align="center" label="是否使用" prop="used" width="180px">
        <template slot-scope="scope">
          <span v-if="scope.row.used===0">未使用</span>
          <span v-if="scope.row.used===1" style="color:red">已使用</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="使用时间" prop="useTime" width="120px" />
      <el-table-column align="center" label="使用者" prop="user" width="120px" />
      
      <el-table-column align="center" label="操作" width="200px" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click.stop="singleUpdate(0,scope.row.rechargeCardID)">禁用</el-button>
          <el-button size="mini" type="text" @click.stop="del(scope.row.rechargeCardID)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-box">
      <el-pagination :current-page="page" :page-sizes="PageSizes" :page-size="PageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>


        <!-- 生成卡密 -->
    <el-dialog title="设置用户密价" :visible.sync="dialog" @closed="closeDialog('addForm')" width="50%"  class="dialog6">
      <el-form ref="addForm" :rules="rules" :model="addForm" label-width="80px">
        <el-form-item label="面值：" prop="price">
          <el-input  v-model.lazy="addForm.price"  placeholder="请输入面值" style="float:left;width:400px" ></el-input>
        </el-form-item>
        <el-form-item label="数量：" prop="num">
          <el-input v-model.number="addForm.num" placeholder="请输入数量" style="float:left;width:400px"></el-input>
        </el-form-item>
      </el-form>
       <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog('addForm')">取 消</el-button>
        <el-button type="primary" @click="AddForm('addForm')">设 置</el-button>
      </span>
    </el-dialog>

    <!-- 禁止 -->
    <el-dialog title="确认禁用" :visible.sync="prohibitDialog" width="30%" >
      <span slot="footer" class="dialog-footer">
        <el-button @click="prohibitDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateConfirm(0)" :loading="prohibitConfirmLoading">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 启用 -->

    <el-dialog title="确认启用" :visible.sync="startDialog" width="30%" >
      <span slot="footer" class="dialog-footer">
        <el-button @click="startDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateConfirm(1)" :loading="startConfirmLoading">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除 -->
    <el-dialog title="确认删除" :visible.sync="delDialog" width="30%" >
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialog = false">取 消</el-button>
        <el-button type="primary" @click="delConfirm" :loading="delConfirmLoading">确 定</el-button>
      </span>
    </el-dialog>

    <textarea style='opacity: 0;position: absolute;' class="copy_input_btn" type="text" ref="copy_input" v-model="copyTxtData"></textarea>
 

  </div>
</template>

<script>
import {
  getLists,
  getDatas,
  postApplicationJson
} from '@/api/price/price-1/common'
import request from '@/utils/request';
export default {
  name: 'SiteList',
  data() {
     var priceVa = (rule, value, callback) => {
        let reg = /^[+]?(0|([1-9]\d*))(\.\d+)?$/g;
        if (value === '') {
            callback(new Error('请输入面值'));
        } else if (!reg.test(value)) {
            callback(new Error('请输入正确的面值'));
        } else {
            callback();
        }
    };
    return {
      copyTxtData:'',
      delID:'',
      delConfirmLoading:false,
      delDialog:false,
      startDialog:false,
      startConfirmLoading:false,
      prohibitDialog:false,
      prohibitConfirmLoading: false,
      updateIds:[],
      multipleSelection:[],
      dataList: [],
      total: 0,
      siteName: '',
      classValue: '',
      options: [],
      page: 1,
      size: 10,
      time: [],
      serchForm: {
        cardNo: '',
        used: '',
        state: '',
        user: '',
      },
      addForm:{
        price:null,
        num:null
      },
      dialog:false,
      
      form: {
        
      },
      rules: {
        price: [
          { required: true,validator:priceVa, trigger: 'blur' },
        ],
        num: [
          { required: true, message: '请输入数量', trigger: 'blur' },
          { type : 'number', min : 0, message :'请输入正确的数量' ,trigger:'blur'}
        ],
      },
      sysDomainList: [],
      sitePackageList: [],
      checking: null,
      lines: null,
      show: false,
      rowIDLines: '',
      rowIDTime: '',
      renewalType: null,
      timeShow: false,
     
      leveSitePackageList: null,
      leveVisible: false,
      rowIDLeve: '',
      leveSitePackageID: '',
      priceVisible: false,
      innerVisible: false,
      rowName: '',
      rowId: '',
      priceList: [],
      priceSize: 10,
      pricePage: 1,
      priceTotal: 0,
      priceForm: {
        siteAliasID: '',
        siteAliasAddr: '',
        siteID: '',
        name: '',
        card: '',
        phone: '',
        addr: ''
      }
    }
  },
  watch: {
  
  },
  created() {
    this.getList()
  },
  methods: {
    search() {
      this.page = 1
      this.getList()
    },
    
    getList(page, size) {
      const form = Object.assign({}, this.serchForm, {
        pageNum: page || 1,
        pageSize: size || 10
      })
      getLists(form, '/finance/rechargeCard/page').then((data) => {
        this.dataList = data.body.records
        this.page = data.body.current
        this.size = data.body.size
        this.total = data.body.total
      })
    },
  
    // 每页数量改变
    handleSizeChange(val) {
      this.size = val
      this.page = 1
      this.getList(this.page, this.size)
    },
    // 当前页面改变
    handleCurrentChange(val) {
      this.page = val
      this.getList(this.page, this.size)
    },

    closeDialog(form){
      this.dialog = false
      this.$refs[form].resetFields();
    },

    AddForm(form){
      request({
        url: '/finance/rechargeCard/create',
        method: 'post',
        data:this.addForm,
        transformRequest: request.transformRequest
      }).then(res=>{
        if(res.code === 1001){
           this.dialog = false;
           this.$refs[form].resetFields()
           this.$message({
            showClose: true,
            message: res.msg,
            type: 'success'
          });
          this.getList()
        }else{
           this.dialog = false;
           this.$refs[form].resetFields()
           this.$message({
            showClose: true,
            message: res.msg,
            type: 'error'
           })
           this.getList()
        }
      })
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

     // 批量禁止
    update(state) {
      this.updateIds = []
      this.multipleSelection.map(item => {
        this.updateIds.push(item.rechargeCardID)
      })
      if(this.multipleSelection.length > 0) {
        if(state == 0){
          this.prohibitDialog = true
        }else if(state == 1){
          this.startDialog = true
        }
      }else {
        this.$message({
          showClose: true,
          message: '请选择',
          type: 'error'
        });
      }

    },

   singleUpdate(state,rechargeCardID){
      this.updateIds = []
      this.updateIds.push(rechargeCardID)
      if(state == 0){
        this.prohibitDialog = true
      }else if(state == 1){
        this.startDialog = true
      }

    },

     // 确认更新
    updateConfirm(state) {
      if(state == 0){
        this.prohibitConfirmLoading = true
      }else if(state == 1){
        this.startConfirmLoading = true
      }
      request({
        url: '/finance/rechargeCard/updateState',
        method: 'post',
        data:{ids:this.updateIds,state:state},
        transformRequest: request.transformRequest
      }).then(res=>{
        if(state == 0){
          this.prohibitDialog = false
          this.prohibitConfirmLoading = false
        }else if(state == 1){
          this.startDialog = false;
          this.startConfirmLoading = false;
        }
        if(res.code === 1001){
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'success'
          });
        }else{
           this.$message({
            showClose: true,
            message:res.msg,
            type: 'error'
          });
        }
        this.getList();
      })
    },

    //删除
    del(rechargeCardID){
      this.delID = rechargeCardID;
      this.delDialog = true;
    },

    //确认删除
    delConfirm(){
      this.delConfirmLoading = true;
       request({
        url: '/finance/rechargeCard/delete',
        method: 'get',
        params:{id:this.delID},
        transformRequest: request.transformRequest
      }).then(res=>{
        
        this.delDialog = false;
        this.delConfirmLoading = false;
        if(res.code === 1001){
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'success'
          });
        }else{
           this.$message({
            showClose: true,
            message:res.msg,
            type: 'error'
          });
        }
        this.getList();
      })
    },

    copyCard(){
       if (!this.multipleSelection.length) {
          this.$message({
            showClose: true,
            message: '请选择',
            type: 'error'
          })
          return
        }
        
        let str = ''
        this.multipleSelection.forEach(i => {
          let str_i = i.cardNo

          str = str + '\n' + str_i

          
        })
        this.copyTxtData = str
        let createInput = this.$refs.copy_input
        console.log(createInput)
        createInput.select()
        document.execCommand("Copy")
        this.$message.success({
          showClose: true,
          message: '复制成功',
          type: 'success'
        })
        setTimeout(() => {
          let createInput = this.$refs.copy_input
          createInput.select()
          document.execCommand("Copy")
        }, 1000)
    }
  }
}
</script>

<style lang="scss">
.menu7-5-container {
  .dialog1 {
    .el-dialog__body {
      overflow: auto;
      max-height: 700px;
    }
    .tips {
      color: #909399;
      font-size: 12px;
      margin-left: 10px;
    }
  }
  .dialog2 {
    li {
      padding: 7px 0;
      display: flex;
      align-items: center;
      .label {
        width: 120px;
        text-align: right;
        margin-right: 10px;
      }
      a {
        color: #409eff;
      }
    }
  }
}
</style>
<style scoped lang="scss">
.container {
  padding: 20px;
  .tips {
    color: #909399;
    font-size: 12px;
    line-height: 20px;
    width: 400px;
    margin-left: 10px;
  }
  .tab-wrap {
    a {
      &.active {
        border-bottom: 2px solid #409eff;
      }
    }
  }
  .filter-wrap {
    margin-top: 20px;
  }
  .handle-wrap {
    // margin-top:20px;
    margin-bottom: 20px;
  }
}
</style>

