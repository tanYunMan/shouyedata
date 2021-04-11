<template>
  <div class="container container-good">
    <div class="filter-wrap">

      <span style="padding-left:20px">用户编号：</span>
      <el-input placeholder="请输入用户编号" size="mini" v-model="tableDataInfo.localUserID" class="search-input"></el-input>
      <span style="padding-left:20px">用户名称：</span>
      <el-input placeholder="请输入用户名称" size="mini" v-model="tableDataInfo.userName" class="search-input"></el-input>
      <span>商品名称：</span>
      <el-input placeholder="请输入商品名称" size="mini" v-model="tableDataInfo.goodsName" class="search-input"></el-input>
      <!-- <span style="padding-left:20px">密价类型：</span> -->
      <!-- <el-select v-model="tableDataInfo.type" size="mini" placeholder="密价类型">
        <el-option label="用户密价" value="1"></el-option>
        <el-option label="站点密价" value="2"></el-option>
      </el-select> -->
      <el-button style="margin-left:20px" type="primary" icon="el-icon-search" @click="findList" :loading="buttonLoading">查询</el-button>
      <el-button type="danger" icon="el-icon-edit" @click="addSecretPrice">新增密价</el-button>
    </div>
    <el-table border row-key="id" ref="multipleTable" :data="tableData" v-loading="loading" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" >
       <el-table-column :show-overflow-tooltip="true" prop="secretPriceID" label="编号" align="center" ></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="goodsID" label="商品编号" align="center"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="goodsName" label="商品名称" align="center"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="price" label="商品价格" align="center"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="localUserID" label="用户编号" align="center"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="userName" label="用户名称" align="center"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label7" label="操作" align="center">
        <template slot-scope="scope">
          <!-- <el-button type="text" size="mini" @click="getUserList(scope.row)">设置用户密价</el-button>
          <el-button type="text" size="mini" @click="getSiteList(scope.row)">设置站点密价</el-button> -->
          <el-button type="text" size="mini" @click="_del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="tableDataInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableDataInfo.total"> </el-pagination>

    <!-- 设置用户密价 -->
    <el-dialog title="设置用户密价" :visible.sync="dialog1" @closed="closeDilog('addForm')" width="50%"  class="dialog6">
      <el-form ref="addForm" :rules="addCatalogFormRules" :model="addForm" label-width="160px">
        <el-form-item label="商品名称：" prop="goodsName">
          <el-input v-model="backGoodsData.goodsName"  placeholder="请选择商品" style="float:left" disabled="disabled"></el-input>
          <el-button type="primary" style="margin-left:20px" @click="dialog3=true">选 择</el-button>
        </el-form-item>
        <el-form-item label="用户名称：" prop="userName">
          <el-input v-model="backUserData.userName" placeholder="请选择用户" style="float:left" disabled="disabled"></el-input>
          <el-button type="primary" style="margin-left:20px" @click="dialog4=true">选 择</el-button>
        </el-form-item>
        <el-form-item label="密价：" prop="price">
          <el-input type="number" v-model.number="addForm.price" min='0'  placeholder="请输入密价：" style="float:left"></el-input>
        </el-form-item>
      </el-form>
       <span slot="footer" class="dialog-footer">
        <el-button @click="closeDilog('addForm')">取 消</el-button>
        <el-button type="primary" @click="AddForm('addForm')">设 置</el-button>
      </span>
    </el-dialog>

     <!-- 选择商品 -->
    <el-dialog title="选择商品" :visible.sync="dialog3"  width="50%" class="dialog6" @closed="closeGoodsDialog">
       <div class="filter-wrap">
        <span>商品名称：</span>
        <el-input placeholder="请输入商品名称" size="mini" v-model="goodsQueryParams.typeValue" class="search-input"></el-input>
        <el-button style="margin-left:20px" type="primary" icon="el-icon-search" @click="findGoodsList" :loading="buttonLoading">查询</el-button>
      </div>
      <el-table border row-key="id"  :data="goodsDataInfo" v-loading="loading" style="width: 100%"  :header-cell-style="{background:'#f5f5f5',color:'#606266'}" >
          <el-table-column :show-overflow-tooltip="true" prop="goodsID" label="编号" align="center" ></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="goodsName" label="商品名称"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="goodsPrice" label="商品价格" ></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="label7" label="操作" align="center" >
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="backGoods(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="goodsQueryParams.pageNum" :page-sizes="[10, 20, 30]" :page-size="goodsQueryParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="goodsDataTotal"> </el-pagination>
    </el-dialog>


     <!-- 选择用户 -->
    <el-dialog title="选择用户" :visible.sync="dialog4"  width="70%" class="dialog6" @closed="closeUserDialog">
      <div class="filter-wrap">
        <span>用户编号：</span>
        <el-input placeholder="请输入用户编号" size="mini" v-model="userQueryParams.localUserID" class="search-input"></el-input>
         <span>用户名称：</span>
        <el-input placeholder="请输入用户名称" size="mini" v-model="userQueryParams.userName" class="search-input"></el-input>
        <el-button style="margin-left:20px" type="primary" icon="el-icon-search" @click="findUserList" :loading="buttonLoading">查询</el-button>
      </div>
       <el-table border row-key="id" ref="multipleTable" :data="userDataInfo" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266','text-align':'center'}" v-loading="loading" size="mini" :cell-style="{'text-align':'center'}">
         <el-table-column :show-overflow-tooltip="true" prop="localUserID" label="编号"  ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="userName" label="用户名"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="userLevelName" label="客户级别">
          <template slot-scope="scope">
            <a type="primary" plain size="mini" style="color:#409EFF" v-show="scope.row.userLevelName" >{{scope.row.userLevelName}}</a>
          </template>
        </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="money" label="余额"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="oldMoney" label="已消费"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="userState" label="状态">
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.userState == 1" size="mini" >开通</el-button>
            <el-button type="text" size="mini" v-if="scope.row.userState == 2">禁用</el-button>
          </template>
        </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="QQ">
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.isQq===0" size="mini" style="color:#F56C6C" >未绑定</el-button>
            <el-button type="text" v-else size="mini" >解绑</el-button>
          </template>
        </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="微信">
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.isWx===0" size="mini" style="color:#F56C6C" >未绑定</el-button>
            <el-button type="text" v-else size="mini">解绑</el-button>
          </template>
        </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="财务">
          <template>
            <el-button size="mini" icon="el-icon-goods"></el-button>
            <el-button type="info" icon="el-icon-view" size="mini" ></el-button>
          </template>
        </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="操作"  fixed="right" width="250">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="backUser(scope.row)">选 择</el-button>
          </template>
        </el-table-column>

      </el-table>
      <el-pagination background @size-change="userHandleSizeChange" @current-change="userHandleCurrentChange" :current-page="userQueryParams.pageNum" :page-sizes="[10, 20, 30]" :page-size="userQueryParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="userDataTotal"> </el-pagination>
    </el-dialog>
    
    <!-- 设置站点密价 -->
    <el-dialog title="设置站点密价" :visible.sync="dialog2" width="70%" class="dialog6">
      <div class="title">{{thisData.goodsName}}</div>
      <div class="filter-wrap">
        <span>站点编号：</span>
        <el-input v-model="tableSite.siteID" placeholder="请输入站点编号" class="search-input"></el-input>
        <span>站点名称：</span>
        <el-input v-model="tableSite.siteName" placeholder="请输入站点名称" class="search-input"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="clickFind(2),buttonLoading=true" :loading="buttonLoading">查询</el-button>
      </div>
      <el-table border row-key="id" ref="multipleTable" v-loading="loading" :data="tableData3" style="width: 100%" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" >
         <el-table-column :show-overflow-tooltip="true" prop="siteID" label="站点编号" align="center"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="siteName" label="站点名称" align="center"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="contacts" label="联系人" align="center"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="domainPre" label="站点前缀" align="center"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label7" label="操作" align="center" width="400">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.secretPrice" controls-position="right" size="mini" :min="0" :precision="2"  />
            <el-button type="text" size="mini" @click="secretSitePrice(scope.row)">设置</el-button>
            <!-- <el-button size="mini" disabled="">清空</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background @size-change="handleSizeChangeSite" @current-change="handleCurrentChangeSite" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="tableSite.total"> </el-pagination>
    </el-dialog>

    <!-- 删除 -->
    <el-dialog title="确认要删除此密价吗？" :visible.sync="delDialog" width="30%" > 
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialog = false">取 消</el-button>
        <el-button type="primary" @click="delList" :loading="delConfirmLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
import { getList,saveSecretPrice} from '@/api/meun3/menu3-6/index'
import { getLists,getDatas } from '@/api/price/price-1/common'
import { getUserList} from '@/api/meun6/menu6-1/index'
  import {getGoodsList} from '@/api/meun3/menu3-2/index'
export default {
  data() {
    return {
       addCatalogFormRules: {
        goodsName: [
          { required: true, message: '请选择商品'}
        ],
        userName: [
          { required: true, message: '请选择用户'}
        ],
        price:[
          {required:true ,message : '请输入秘价',trigger:'blur'},
          {type:'number', min:0 , message:'请输入正确的秘价', trigger : 'blur'}
        ]
      },
      addForm:{
        goodsName:'',
        userName:'',
        price:null
      },
      userQueryParams: {
        pageNum: 1,// 当前页数
        pageSize: 10, //每页条数
      },
      goodsQueryParams:{
        pageNum: 1,// 当前页数
        pageSize: 10, //每页条数
        typeValue:'',  //商品名称
        type:'2'
      },
      userDataInfo:[],
      goodsDataInfo:[],
      userDataTotal:0,
      goodsDataTotal:0,
      day:true,
      color:'#333',
      step:1,
      form:{},
      dialog1:false,
      dialog2:false,
      dialog3:false,
      dialog4:false,
      buttonLoading: false,
      delDialog: false,
      delConfirmLoading: false,
      delId:'',
      tableData: [],
      tableData2:[],
      tableData3:[],
      multipleSelection: [],
      currentPage: 1,
      loading: false,
      tableDataInfo: {
        pageNum: 1,// 当前页数
        pageSize: 20, //每页条数
        total: 0, //数据总共条数
      },
      tableUser: {
        pageNum: 1,// 当前页数
        pageSize: 20, //每页条数
        total: 0, //数据总共条数
      },
      tableSite: {
        pageNum: 1,// 当前页数
        pageSize: 20, //每页条数
        total: 0, //数据总共条数
        goodsID:'', //用于排除已设置密价的站点
      },
      thisData:[], // 当前商品信息，
      goodsList:[],  //商品数据
      userList:[], ///用户数据
      backGoodsData:{
        goodsID:'',
        goodsName:'',
      },
      backUserData:{
        localUserID:'',
        userName:'',
        userID:''
      }
    }
  },
  mounted() {
    this.getList();
    this.findGoodsList();
    this.findUserList();
  },
  methods: {
    handleSizeChange(val) {
      this.tableDataInfo = {
        ...this.tableDataInfo,
        pageNum: 1,
        pageSize: val,
      }
      this.getList()
    },
    handleCurrentChange(val) {
      this.tableDataInfo = {
        ...this.tableDataInfo,
        pageNum: val
      }
      this.getList()
    },


    //密价用户列表
    handleSizeChangeUser(val) {
      this.tableUser = {
        ...this.tableUser,
        pageSize: val
      }
      this.getUserList(this.thisData)
    },
    handleCurrentChangeUser(val) {
      this.tableUser = {
        ...this.tableUser,
        pageNum: val
      }
      this.getUserList(this.thisData)
    },

    //密价站长列表
    handleSizeChangeSite(val) {
      this.tableSite = {
        ...this.tableSite,
        pageSize: val
      }
      this.getSiteList(this.thisData)
    },
    handleCurrentChangeSite(val) {
      this.tableSite = {
        ...this.tableSite,
        pageNum: val
      }
      this.getSiteList(this.thisData)
    },




    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 新增密价
    addSecretPrice(){
      this.dialog1= true
    },

    // 查询
    clickFind(val){
      if(val===1){
        this.getUserList(this.thisData)

      }else{
        this.getSiteList(this.thisData)

      }
    },


    // 获取用户并设置密价
    getUserList(data) {
      this.dialog1 = true
      this.thisData =data
      this.loading = true
      getLists(this.tableUser,'/user/user/secretUser').then(res => {
        if (res.code===1001){
          this.tableData2 = res.body.records
          this.tableUser = {
            ...this.tableUser,
            pageNum: res.body.current,
            pageSize: res.body.size,
            total: res.body.total 
          }
        }
        this.loading = false
        this.buttonLoading = false
      }).catch(err => {
        this.loading = false
        this.buttonLoading = false
      })
    },

    // 获取站点并设置密价
    getSiteList(data) {
      this.dialog2 = true
      this.thisData =data
      this.loading = true
      this.tableSite={...this.tableSite,goodsID:data.goodsID}
      getLists(this.tableSite,'/platform/site/secretSite').then(res => {
        if (res.code===1001){
          this.tableData3 = res.body.records
          this.tableSite = {
            ...this.tableSite,
            pageNum: res.body.current,
            pageSize: res.body.size,
            total: res.body.total 
          }
        }
        this.loading = false
        this.buttonLoading = false
      }).catch(err => {
        this.loading = false
        this.buttonLoading = false
      })
    },


    // 设置用户密价
    secretUserPrice(data) {
      if(!data.secretPrice){
        this.$message({
          showClose: true,
          message: '密价不能为空',
          type: 'error'
        });
      }else{
        let payload = {
          goodsID: this.thisData.goodsID,
          localUserID: data.localUserID,
          price: data.secretPrice
        }
        getLists({...payload},'/goods/secretPrice/saveSecretPrice').then(res => {
          if (res.code===1001){
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'success'
            });
            this.getUserList(this.thisData)
            this.getList()
          }else{
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            });
          }
        }).catch(err => {
          
        })
      }
    },

    // 设置站点密价
    secretSitePrice(data) {
      if(!data.secretPrice){
        this.$message({
          showClose: true,
          message: '密价不能为空',
          type: 'error'
        });
      }else{
        let payload = {
          goodsID: this.thisData.goodsID,
          secretSiteID: data.siteID,
          price: data.secretPrice
        }
        getLists({...payload},'/goods/secretPrice/saveSiteSecretPrice').then(res => {
          if (res.code===1001){
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'success'
            });
            this.getSiteList(this.thisData)
            this.getList()
          }else{
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            });
          }
        }).catch(err => {
          
        })
      }
    },

    // 查询密价列表
    getList() {
      getList(this.tableDataInfo).then(res => {
        console.log(this.tableDataInfo)
        this.tableData = res.body.records
        this.tableDataInfo = {
          ...this.tableDataInfo,
          pageNum: res.body.current,
          pageSize: res.body.size,
          total: res.body.total 
        }
        this.loading = false
        setTimeout(()=>{
          this.buttonLoading = false
        },1500)
      }).catch(err => {
        this.loading = false
        setTimeout(()=>{
          this.buttonLoading = false
        },1500)
      })
    },

    // 点击查询密价列表
    findList(){
      this.tableDataInfo.pageNum = 1
      this.buttonLoading = true
      this.getList()
    },

    _del(data){
        this.delDialog=true
        this.delId=data.secretPriceID
    },

    // 删除密价
    delList() {
      this.delConfirmLoading = true
      getDatas({id:this.delId},'/goods/secretPrice/delete').then(res => {
          if (res.code===1001){
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'success'
            });
            this.getList()
          }else{
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            });
          }
          this.delDialog=false
          this.delConfirmLoading = false
        }).catch(err => {
          
        })
    },
    AddForm(form){
      this.$refs[form].validate((valid) =>{
        if(valid){
          this.dialog1 = false;
          delete this.addForm.userName;
          delete this.addForm.goodsName;
          this.addForm.userID = this.backUserData.userID;
          this.addForm.goodsID = this.backGoodsData.goodsID
          saveSecretPrice(this.addForm).then(res =>{
            if(res.code === 1001){
               this.$message({
                showClose: true,
                message: res.msg,
                type: 'success'
               });
               this.getList();
            }else{
               this.$message({
                showClose: true,
                message: res.msg,
                type: 'error'
               });
               this.getList()
            }
          })

          this.addForm = {
            price:'',
            userName:'',
            goodsName:''
          }
        }
      })
      this.addForm = {
            price:'',
            userName:'',
            goodsName:''
      }
      //同时将用户与商品的回填数据清空
      this.backGoodsData={
        goodsID:'',
        goodsName:'',
      },
      this.backUserData={
        localUserID:'',
        userName:'',
        userID:''
      }
    },
    closeDilog(form){
      this.dialog1 = false;
      this.$refs[form].resetFields() // 将form表单重置
       //同时将用户与商品的回填数据清空
      this.backGoodsData={
        goodsID:'',
        goodsName:'',
      },
      this.backUserData={
        localUserID:'',
        userName:'',
        userID:''
      }
    },
     // 获取商品列表
    findGoodsList() {
      console.log(this.goodsQueryParams)
        this.loading = true
        getGoodsList(this.goodsQueryParams).then(res => {
          if (res.code === 1001) {
            this.goodsDataInfo = res.body.records
            this.goodsDataTotal = res.body.total
          }
          this.loading = false
        }).catch(err => {
          this.loading = false
        })
    },

    goodsHandleSizeChange(val) {
        this.goodsQueryParams.pageSize = val
        this.findGoodsList();
      },
    goodsHandleCurrentChange(val) {
        this.goodsQueryParams.pageNum = val
        this.findGoodsList();
      },

    findUserList(){
      this.loading = true
      getUserList(this.userQueryParams).then(res => {
        console.log(res)
        res.body.records.forEach(function (item) {
          item.visible = false
        })
       this.userDataInfo = res.body.records;
       this.userDataTotal = res.body.total;
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },

    userHandleSizeChange(val) {
        this.userQueryParams.pageSize = val
        this.findUserList();
      },
    userHandleCurrentChange(val) {
        this.userQueryParams.pageNum = val
        this.findUserList();
      },

    backGoods(row){
      this.dialog3 = false;
      //将商品名称的筛选条件清空
      this.goodsQueryParams = {
        pageNum:1,
        pageSize:10,
        typeValue:'',
        type:'2'
      }

      this.backGoodsData.goodsID = row.goodsID;
      this.backGoodsData.goodsName = row.goodsName;
      this.addForm.goodsName = row.goodsName;


    },

    backUser(row){
      this.dialog4 = false;
      this.userQueryParams = {
          
        pageNum: 1,// 当前页数
        pageSize: 10, //每页条数
        localUserID:'',
        userName:'',
      }

      this.backUserData.localUserID = row.localUserID;
      this.backUserData.userName = row.userName;
      this.backUserData.userID = row.userID;
      this.addForm.userName = row.userName;

    },

    closeGoodsDialog(){
      //将商品名称的筛选条件清空
      this.goodsQueryParams = {
        pageNum:1,
        pageSize:10,
        typeValue:'',
        type:'2'
      }
    },
    
    closeUserDialog(){
      //将商品名称的筛选条件清空
      this.userQueryParams = {
        pageNum: 1,// 当前页数
        pageSize: 20, //每页条数
        localUserID:'',
        userName:'',
      }
    }
  }
}
</script>

<style lang="scss" scoped>

  .el-color-picker {
    float:left;
    margin-left:20px;
  }
.container {
  .go-btn {
    border:1px solid #ccc;
    font-weight: bold;
    font-size:13px;
    padding:1px 5px;
    border-radius: 3px;
    display:inline-block;
    color:#409EFF;
    cursor: pointer;
    transition:.3s;
    .go-btn.no {
      color:#909399;
    }
  }

  .go-btn:hover {
    transition:.3s;
    border:1px solid #409EFF;
  }
  .tips {
    color:#909399;
    font-size:12px;
    line-height:20px;
    width:400px;
  }
  padding:20px;
  .filter-wrap {
    .search-input {
      width:200px;
    }
    .handle-wrap {
      margin-top:20px;
    }
  }
  .el-form {
    padding:0;
    .el-input,.el-textarea {
      width:400px;
    }
  }
}
</style>

