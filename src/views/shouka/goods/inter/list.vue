<template>
  <div>
    <div class="search-container">
      <el-form :inline="true" :model="searchForm" ref="searchForm">
        <el-form-item>
          <el-select v-model="searchForm.catalogFakaID" clearable placeholder="商品分类">
            <el-option label="全部" value=" "></el-option>
             <el-option v-for="(item, index) in catalogFakaList" :key="index" :label="item.catalogName" :value="item.catalogID">
             </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm.typeValue" placeholder="商品名称"></el-input>
        </el-form-item>
         <el-form-item>
           <el-select v-model="searchForm.isBreak" placeholder="是否断货">
            <el-option label="全部" value=" "></el-option>
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
           </el-select>
        </el-form-item>
        <el-form-item>
           <el-select v-model="searchForm.goodsState" placeholder="商品状态">
            <el-option label="全部" value=" "></el-option>
            <el-option label="上架" :value="1"></el-option>
            <el-option label="下架" :value="0"></el-option>
           </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="button-group">
       <!-- <el-button type="primary" icon="el-icon-plus" @click="toAdd">添加商品</el-button> -->
       <el-button type="danger" icon="el-icon-close" @click="del">批量删除</el-button>
    </div>
    <el-table
      stripe
      :data="list"
      header-row-class-name="faka-table-header"
      style="width: 100%"
      v-loading="loading"
      @selection-change="handleSelectionChange"
    >
     <el-table-column :show-overflow-tooltip="true" type="selection" align="center"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="catalogFaka.catalogName" label="商品分类" align="center" width="250"></el-table-column>
      <!-- <el-table-column prop="systemNoticeTitle" label="排序"></el-table-column> -->
      <el-table-column :show-overflow-tooltip="true" prop="goodsName" label="商品名称" align="center" width="250"></el-table-column>
      <el-table-column :show-overflow-tooltip="true"  label="成本价" align="center" width="80">
        <template slot-scope="scope">
          {{scope.row.goodsPrice==null?'暂无':scope.row.goodsPrice}}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true"  label="销售价" align="center" width="80">
         <template slot-scope="scope">
          {{scope.row.goodsValue==null?'暂无':scope.row.goodsValue}}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true"  label="对接价" align="center" width="80">
         <template slot-scope="scope">
          {{scope.row.supplyPrice==null?'暂无':scope.row.supplyPrice}}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="库存" align="center" width="100">
        <template slot-scope="scope">
          <span style="margin-right:10px">剩余：{{scope.row.cardNum || 0}}</span>
          <!-- <el-button type="text" size="mini" @click="showCart(scope.row)">查看</el-button> -->
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="卖出" align="center" width="100">
        <template slot-scope="scope">
           {{scope.row.saleCardNum==null?0:scope.row.saleCardNum}}张 <!--<el-button type="text" size="mini" style="margin-left:5px" @click="showHistoryCard(scope.row)">查看</el-button> -->
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true"  label="上下架" align="center" width="120">
        <template slot-scope="scope">
          <el-switch :active-value='1' :inactive-value='0' @change="updateGoodsState(scope.row)" v-model="scope.row.goodsState"></el-switch>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="updateTime" label="创建时间" align="center" width="200"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="操作" align="center" fixed="right" width="300">
        <template slot-scope="scope">
          <!-- <el-button type="text">链接</el-button> -->
          <!-- <el-button type="text" @click="importCard(scope.row)">加卡</el-button> -->
          <el-button type="text" @click="toUpdate(scope.row.goodsID)">编辑</el-button>
          <el-button type="text" @click="delGoods(scope.row.goodsID)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :page-sizes="[10, 20, 50]" :page-size="searchForm.pageSize" layout="total, sizes, prev, pager, next, jumper"
                   :total="total"></el-pagination>


    <!-- 删除 -->
    <el-dialog title="确认删除" :visible.sync="deleteDialog" width="30%">
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmDel" :loading="confirmDelLoading">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="商品链接：掘地求生"
      :visible.sync="linkDialog"
      width="40%">
      <link-com />
    </el-dialog>
    

     <!-- 导卡 -->
    <el-dialog title="导卡" :visible.sync="dialog3" width="50%" class="dialog3" @close="dialog3Close">
      <div class="step1" v-show="step == 1">
        <el-form ref="importCardForm" :model="importCardForm" label-width="140px" :rules="importCardRules">
          <el-form-item label="导卡的商品：">
            <el-input placeholder="请输入导卡商品名" v-model="importCardForm.goodsName" disabled=""></el-input>
          </el-form-item>
          <el-form-item label="点卡内容：" prop="textarea">
            <el-input type="textarea" :rows="4" placeholder="请输入点卡内容" v-model="importCardForm.textarea"></el-input>
            <div class="tips message_tips_box">
              <el-upload
                class="upload-demo upload_btn_txt"
                action="https://jsonplaceholder.typicode.com/posts/"
                :auto-upload="false"
                list-type="text"
                :on-change="writingFileTxt"
                :limit="1">
                <el-button type="text" size="mini">读取文件</el-button>
              </el-upload>
              <span>导入格式为：卡号+空格+密码，如：AAAAA BBBBB</span>
            </div>
            <!-- <div class="tips">实卡导入格式为：卡号+空格+密码+空格+(A1-A7)矩阵号(矩阵号用-号连接)，如：AAAAA BBBBB CC-DD-EE-FF-GG-HH-JJ</div> -->
          </el-form-item>
          <el-form-item label="供货商名称：">
            <el-input placeholder="请输入供货商名称" v-model="importCardForm.supplier"></el-input>
          </el-form-item>
          <el-form-item label="联系方式：">
            <el-input placeholder="请输入联系方式" v-model="importCardForm.contact"></el-input>
          </el-form-item>
          <el-form-item label="进货价格备注：">
            <el-input placeholder="请输入进货价格备注" style="width:203px" v-model="importCardForm.price"></el-input>
            <span style="margin-left:20px">元</span>
          </el-form-item>
          <el-form-item label="该卡截止有效日期：">
            <el-date-picker v-model="importCardForm.validDate" type="date" placeholder="选择日期"
                            value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <!-- <el-form-item label="判断点卡内容重复：">
            <el-switch v-model="form.d" active-color="#13ce66" inactive-color="#eee"></el-switch>
          </el-form-item> -->
          <el-form-item label="判断（库存）重复：">
            <el-switch v-model="importCardForm.isRepeatState" active-color="#13ce66" inactive-color="#eee"></el-switch>
          </el-form-item>
          <el-form-item label="是否优先销售：">
            <el-switch v-model="importCardForm.isFirstState" active-color="#13ce66" inactive-color="#eee"></el-switch>
          </el-form-item>
        </el-form>
        <div>
          <span slot="footer" class="dialog-footer" style="display:flex;justify-content:flex-end">
            <el-button @click="dialog3 = false">取 消</el-button>
            <el-button type="primary" @click="nextStep">下一步</el-button>
          </span>
        </div>
      </div>
      <div class="step2" v-show="step == 2">
        <el-form ref="form" :model="form" label-width="140px">
          <el-form-item label="导卡的商品：">
            <div>{{importCardForm.goodsName}}</div>
          </el-form-item>
          <el-form-item label="卡号与密码：">
            <el-table border row-key="id" :data="tableData2" style="width: 100%">
              <el-table-column :show-overflow-tooltip="true" prop="label1" label="卡号"></el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="label2" label="密码"></el-table-column>
              <!--  <el-table-column :show-overflow-tooltip="true" prop="label3" label="赠品/矩阵号" ></el-table-column> -->
            </el-table>
          </el-form-item>
          <el-form-item label="导入数量：">
            <div>{{tableData2.length}}</div>
          </el-form-item>
          <el-form-item label="供货商名称：">
            <div>{{importCardForm.supplier}}</div>
          </el-form-item>
          <el-form-item label="此处卡有效日期：">
            <div>{{importCardForm.validDate}}</div>
          </el-form-item>
        </el-form>
        <div>
          <span slot="footer" class="dialog-footer" style="display:flex;justify-content:flex-end">
            <el-button @click="step = 1">返 回</el-button>
            <el-button type="primary" @click="confirmImport" :loading="confirmImportLoading">确认导入</el-button>
          </span>
        </div>
      </div>
    </el-dialog>

    <!-- 库存查看 -->
    <el-dialog title="库存查看" :visible.sync="dialog4" width="70%">
      <div class="filter-wrap">
        <span>卡号：</span>
        <el-input placeholder="请输入要查找的卡号" class="search-input" v-model="kcQueryParams.cardNumber"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="kcQuery">搜索</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="delKcCard">批量删除</el-button>
        <el-button type="primary" icon="el-icon-document-checked" @click="copyCardNow">复制</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="copAandyDel">复制并删除</el-button>
      </div>
      <el-table border row-key="cardID" ref="multipleTable" :data="tableData4" style="width: 100%"
                @selection-change="kcHandleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266'}">
        <el-table-column :show-overflow-tooltip="true" type="selection"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="cardNumber" label="卡号" align="center"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="cardPws" label="卡密" align="center"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="label3" label="导入时间" align="center"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="validDate" label="到期时间" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.validDate | date}}</div>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="supplier" label="供货商" align="center"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="contact" label="联系方式" align="center"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="price" label="备注价格" align="center"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="label10" label="操作" align="center" width="250">
          <template slot-scope="scope">
            <el-button type="text" @click="kcDelSingle(scope.row)" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background @size-change="handleSizeChange1" @current-change="handleCurrentChange1"
                     :current-page="kcQueryParams.pageNum" :page-sizes="[10, 20, 30]" :page-size="kcQueryParams.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="kcTotal"></el-pagination>
    </el-dialog>

     <!-- 库存删除 -->
    <el-dialog title="确认删除" :visible.sync="dialog5" width="30%">
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog5 = false">取 消</el-button>
        <el-button type="primary" @click="kcConfirmDel" :loading="kcConfirmDelLoading">确 定</el-button>
      </span>
    </el-dialog>
    <textarea class="copy_input_btn" type="text" ref="copy_input" v-model="copyTxtData"></textarea>


    <!-- 卖出查看 -->
    <el-dialog title="卖出查看" :visible.sync="dialog6" width="70%">
      <div class="filter-wrap">
        <span>卡号：</span>
        <el-input placeholder="请输入要查找的卡号" class="search-input" v-model="saleQueryParams.cardNumber"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="saleQuery">搜索</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="delSaleCard">批量删除</el-button>
      </div>
      <el-table border row-key="cardID" ref="multipleTable" :data="tableData5" style="width: 100%"
                @selection-change="saleHandleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266'}">
        <el-table-column :show-overflow-tooltip="true" type="selection"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="cardNumber" label="卡号" align="center"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="cardPws" label="卡密" align="center"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="goodsName" label="商品名称" align="center"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建时间" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.validDate | date}}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column :show-overflow-tooltip="true" prop="supplier" label="供货商" align="center"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="contact" label="联系方式" align="center"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="price" label="备注价格" align="center"></el-table-column> -->
        <el-table-column :show-overflow-tooltip="true" prop="label10" label="操作" align="center" width="250">
          <template slot-scope="scope">
            <el-button type="text" @click="saleDelSingle(scope.row)" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background @size-change="handleSizeChange2" @current-change="handleCurrentChange2"
                     :current-page="saleQueryParams.pageNum" :page-sizes="[10, 20, 30]" :page-size="saleQueryParams.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="saleTotal"></el-pagination>
    </el-dialog>

    <!-- 卖出历史删除 -->
    <el-dialog title="确认删除" :visible.sync="dialog7" width="30%">
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog7 = false">取 消</el-button>
        <el-button type="primary" @click="saleConfirmDel" :loading="saleConfirmDelLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import clip from "@/utils/clipboard";
import daochu from '../daochu'
import Sortable from 'sortablejs'
import {
  getGoodsList,
  delGoods,
  confirmSetCatalog,
  updateAgentTypeBatch,
  addRecommendGoodsBatch,
  updateGoodsStateBatch,
  getCatalogTree,
  importCardApi,
  getCardList,
  getPriceList,
  addPrice,
  addPriceArr
} from '@/api/meun3/menu3-2/index'
import { getLists, getDatas, postApplicationJson } from '@/api/price/price-1/common'
import request from '@/utils/request'

export default {
  data() {
    return {
      list: [],
      catalogFakaList:[],
      multipleSelection:[],
      delIds:[],
      loading: false,
      deleteDialog:false,
      confirmDelLoading:false,
      linkDialog: false,
      exportDialog: false,
      total:0,
      searchForm: {
        pageNum:1,
        pageSize:20,
        goodsSource:4,
        goodsState:'',
        isBreak:'',
        typeValue:'',
        type:2,
        catalogFakaID:''
      },
      step:1,
      importCardForm: {
        cardVOList: [],
        goodsName: '',
        goodsID: '',
        isRepeatState: true,
        isFirstState: true,
        isRepeat: 1,
        isFirst: 1,
        supplier: '',
        price: '',
        validDate: '',
        textarea: '',
        contact: ''
      },
      importCardRules: {
        textarea: [{ required: true, message: '请输入点卡内容', trigger: 'blur' }]
      },

      dialog3: false,

      tableData2: [
        {
          label1: '123',
          label2: 'sdsdfsdf',
          label3: 'sdfsf-sdfs'
        }
      ],
      form: { d: true, textarea: '' },
      confirmImportLoading:false,

      dialog4:false,
      kcGoodsID: '',
      kcTotal: 0,
      kcQueryParams: {
        pageNum: 1,
        pageSize: 10
      },
      tableData4: [],
      kcDelIds:[],
      kcMultipleSelection:[],
      thisKcGoodsID:'',
      dialog5:false,
      kcConfirmDelLoading:false,
      copyTxtData:'',

      tableData5:[],
      saleDelIds:[],
      saleMultipleSelection:[],
      thisSaleGoodsID:'',
      saleGoodsID:'',
      dialog6:false,
      saleConfirmDelLoading:false,
      saleTotal: 0,
      saleQueryParams: {
        pageNum: 1,
        pageSize: 10
      },

      dialog7:false,
    };
  },
  components: {
    daochu
  },
  methods: {
    getList(){
      this.loading = true
      getGoodsList(this.searchForm).then(res => {
        if (res.code === 1001) {
          this.list = res.body.records
          this.total = res.body.total
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
      this.searchForm={
        pageNum:1,
        pageSize:20,
        goodsSource:4,
        goodsState:'',
        isBreak:'',
        typeValue:'',
        type:2,
        catalogFakaID:''
      }
    },
    getAllCatalogFaka(){
      request({
        url: '/goods/catalogFaka/list',
        method: 'get',
        data:{},
        transformRequest: request.transformRequest
      }).then(res=>{
        this.catalogFakaList = res.body
      })
    },
    search() {

    },
    toAdd() {
      this.$router.push('/goodsManager/add')
    },
    toLink(goodId) {
      this.linkDialog = true
    },
    toCard(goodId) {
      this.$router.push('/cardManager/cardAdd')
    },
    toUpdate(goodsID) {
      this.$router.push({
        path:'/goodsManager/interUpdate',
        query:{
          goodsID:goodsID
        },
      })
    },
    toDelete(goodId) {
    },
    toExport() {
      this.exportDialog = true
    },
     // 改变每页数量
    handleSizeChange(val) {
      this.searchForm.pageSize = val
      this.searchForm.pageNum = 1
      this.getList()
    },
    //改变当前页数
    handleCurrentChange(val){
      this.searchForm.pageNum = val
      this.getList()
    },

    //选择框的改变
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 批量删除前的准备
    del() {
      this.delIds = []
      this.multipleSelection.map(item => {
        this.delIds.push(item.goodsID)
      })
      if (this.delIds.length < 1) {
        this.$message({
          showClose: true,
          message: '请选择商品',
          type: 'error'
        })
        return
      }
      this.deleteDialog = true
    },

     // 确认批量删除
    confirmDel() {
      this.confirmDelLoading = true
      delGoods({ id: this.delIds }, '/goods/goods/deleteGoods').then(res => {
        if (res.code === 1001) {
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
          this.getList();
        } else {
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'error'
          })
        }
        this.confirmDelLoading = false
        this.deleteDialog = false
      }).catch(err => {
        this.confirmDelLoading = false
      })
    },


     // 删除单个商品调用的方法
    delGoods(id) {
      this.$confirm('此操作将删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        delGoods({ id: id }, '/goods/goods/deleteGoods').then(res => {
          if (res.code === 1001) {
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            })
            this.getList()
          } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            })
          }
        }).catch(err => {

        })

      }).catch(() => {
        this.$message.success('已取消删除')
      })
    },


    //更新状态
    updateGoodsState(row){
      updateGoodsStateBatch({
        ids:row.goodsID,
        goodsState:row.goodsState
      }).then(res => {
        if (res.code === 1001) {
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'error'
          })
        }
       
      }).catch(err => {
      })
    },

    // 导卡
    importCard(item) {
      this.dialog3 = true
      this.step = 1
      this.importCardForm.goodsName = item.goodsName
      this.importCardForm.goodsID = item.goodsID
      this.importCardForm.supplier = item.supplier
    },

    // 清空导卡表单
    dialog3Close() {
      this.importCardForm = {
        cardVOList: [],
        goodsName: '',
        goodsID: '',
        isRepeatState: true,
        isFirstState: true,
        isRepeat: 1,
        isFirst: 1,
        supplier: '',
        price: '',
        validDate: '',
        textarea: ''
      }
    },

    writingFileTxt (file) {
      console.log(file)
      let filedata = file.raw
      let file_reader = new FileReader();
      file_reader.onload = () => {
          this.dialog3 = true
          this.importCardForm.textarea = file_reader.result
      };
      file_reader.readAsText(filedata, 'UTF-8');
    },

    // 导卡下一步
    nextStep() {
      let arr = []
      let list = this.importCardForm.textarea.trim().split(/\n+/)
      this.importCardForm.cardVOList = []

      list.map((item, index) => {
        arr.push({})
        let subList = item.trim().split(/\s+/)
        subList.map((item1, index1) => {
          let s = 'label' + (index1 + 1)
          arr[index][s] = item1
        })
      })
      this.tableData2 = arr

      this.importCardForm.isRepeat = this.importCardForm.isRepeatState ? 1 : 0
      this.importCardForm.isFirst = this.importCardForm.isFirstState ? 1 : 0
      arr.map(item => {
        this.importCardForm.cardVOList.push({
          cardNumber: item.label1,
          cardPws: item.label2,
          supplier: this.importCardForm.supplier,
          price: this.importCardForm.price,
          validDate: this.importCardForm.validDate,
          contact: this.importCardForm.contact
        })
      })

      this.$refs['importCardForm'].validate((vaild) => {
        if (vaild) {
          this.step = 2
        }
      })
    },
    // 确认导入
    confirmImport() {
      this.confirmImportLoading = true
      importCardApi(this.importCardForm).then(res => {

        if (res.code == 1001) {
          this.dialog3 = false
          this.$message({
            showClose: true,
            message: '导入成功',
            type: 'success'
          })
          this.getList()
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'error'
          })
        }
        this.confirmImportLoading = false

      }).catch(err => {
        this.confirmImportLoading = false
      })
    },

     // 库存查看
    showCart(item) {
      this.dialog4 = true
      this.kcGoodsID = item.goodsID
      this.kcQueryParams = { ...this.kcQueryParams, goodsID: item.goodsID }
      if (this.kcQueryParams.goodsID) {
        this.getCardList()
      }
    },
    // 查看库存
    getCardList() {
      getCardList(this.kcQueryParams).then(res => {
        this.tableData4 = res.body.records
        this.kcTotal = res.body.total
       
      })
    },

     // 库存查询
    kcQuery() {
      this.getCardList()
      this.kcQueryParams={
        pageSize:10,
        pageNum:1,
        goodsID:this.kcGoodsID
      }
    },
    // 改变每页数量
    handleSizeChange1(val) {
      this.kcQueryParams.pageNum = val
      this.kcQueryParams.pageSize= 1
      this.getCardList()
    },
    // 翻页
    handleCurrentChange1(val) {
      this.kcQueryParams.pageNum = val
      this.getCardList()
    },

     //  删除秘卡
    delKcCard() {
      this.kcDelIds = []
      this.kcMultipleSelection.map(item => {
        this.kcDelIds.push(item.cardID)
        this.thisKcGoodsID = item.goodsID
      })
      if (this.kcDelIds.length < 1) {
        this.$message({
          showClose: true,
          message: '请选择秘卡',
          type: 'error'
        })
        return
      }
      this.dialog5 = true
    },
    //复制
    copyCardNow (again) {
      if (!this.kcMultipleSelection.length) {
        this.$message({
          showClose: true,
          message: '请选择秘卡',
          type: 'error'
        })
        return
      }
      
      let str = ''
      this.kcMultipleSelection.forEach(i => {
        let str_f = i.cardNumber ? i.cardNumber : ''
        let str_s = i.cardPws ? ' ' + i.cardPws : ''
        if (str === '') {
          str = str_f + str_s
        } else {
          str = str + '\n' + str_f + str_s
        }
        
      })
      this.copyTxtData = str
      let createInput = this.$refs.copy_input
      createInput.select()
      document.execCommand("Copy")
      console.log(str)
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
      if (again === true) {
        this.delKcCard()
      }
    },
    //复制并删除
    copAandyDel () {
      this.copyCardNow(true)
    },

    kcConfirmDel(){
      this.kcConfirmDelLoading = true
      delGoods({ id: this.kcDelIds }, '/goods/card/delete').then(res => {
        if (res.code === 1001) {
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
          let arr = { goodsID: this.thisKcGoodsID }
          this.showCart(arr)
          this.getList();
        } else {
          this.$message({
            showClose: true,
            message: '删除失败',
            type: 'error'
          })
        }
        this.kcConfirmDelLoading = false
        this.dialog5 = false
      }).catch(err => {
        this.kcConfirmDelLoading = false
      })
    },

    kcHandleSelectionChange(val){
      this.kcMultipleSelection = val
    },

    kcDelSingle(row){
      this.kcDelIds = row.cardID
      this.thisKcGoodsID = row.goodsID
      this.dialog5 = true
    },


     // 改变每页数量
    handleSizeChange2(val) {
      this.saleQueryParams.pageNum = val
      this.saleQueryParams.pageSize= 1
      this.getCardList()
    },
    // 翻页
    handleCurrentChange2(val) {
      this.saleQueryParams.pageNum = val
      this.getCardList()
    },

    //获取历史的密码分页数据
    getHistoryCard(){
      return request({
        url: '/goods/historyCard/page',
        method: 'post',
        data:this.saleQueryParams,
        transformRequest: request.transformRequest
      }).then(res=>{
        this.tableData5 = res.body.records
        this.saleTotal = res.body.total
      })
    },
    showHistoryCard(item){
      this.dialog6 = true
      this.saleGoodsID = item.goodsID
      this.saleQueryParams = { ...this.saleQueryParams, goodsID: item.goodsID }
      if (this.saleQueryParams.goodsID) {
        this.getHistoryCard()
      }
    },
    saleQuery(){
      this.getHistoryCard();
      this.saleQueryParams={
        pageSize:10,
        pageNum:1,
        goodsID:this.saleGoodsID
      }
    },
    saleHandleSelectionChange(val){
      this.saleMultipleSelection=val
    },

    delSaleCard(){
      this.saleDelIds = []
      this.saleMultipleSelection.map(item => {
        this.saleDelIds.push(item.historyCardID)
        this.thisSaleGoodsID = item.goodsID
      })
      if (this.saleDelIds.length < 1) {
        this.$message({
          showClose: true,
          message: '请选择秘卡',
          type: 'error'
        })
        return
      }
      this.dialog7 = true
    },

    saleConfirmDel(){
      this.saleConfirmDelLoading = true
      delGoods({ id: this.saleDelIds }, '/goods/historyCard/delete').then(res => {
        if (res.code === 1001) {
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
          let arr = { goodsID: this.thisSaleGoodsID }
          this.showHistoryCard(arr)
          this.getList();
        } else {
          this.$message({
            showClose: true,
            message: '删除失败',
            type: 'error'
          })
        }
        this.saleConfirmDelLoading = false
        this.dialog7 = false
      }).catch(err => {
        this.saleConfirmDelLoading = false
      })
    },

    saleDelSingle(row){
      this.saleDelIds = row.historyCardID
      this.thisSaleGoodsID = row.goodsID
      this.dialog7 = true
    },

  },

  filters:{
    date(val) {
      function dateFormat(time, fmStr) {
        /**
         * 时间格式化函数, 按照指定格式化字符串格式化传入时间
         *
         * @param {Date} time 需要格式化的时间
         * @param {String} fmStr 定义时间的格式
         *    yyyy: 代表四位数年份
         *      yy: 代表两位数年份
         *      mm: 代表月份(小于10时补0)
         *      dd: 代表日期(小于10时补0)
         *      hh: 代表小时(小于10时补0)
         *      hh: 代表小时(小于10时补0)
         *      MM: 代表分钟(小于10时补0)
         *      ss: 代表秒数(小于10时补0)
         *     SSS: 代表毫秒数
         *       w: 代表周几(数字)
         *       W: 代表周几(中文)
         *      ww: 代表周几(英文)
         * @returns {String} 返回格式化的时间
         */
        const weekCN = '日一二三四五六'
        const weekEN = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

        let year = time.getFullYear()
        let month = time.getMonth() + 1
        let day = time.getDate()
        let hours = time.getHours()
        let minutes = time.getMinutes()
        let seconds = time.getSeconds()
        let milliSeconds = time.getMilliseconds()
        let week = time.getDay()

        month = month >= 10 ? month : ('0' + month)
        day = day >= 10 ? day : ('0' + day)
        hours = hours >= 10 ? hours : ('0' + hours)
        minutes = minutes >= 10 ? minutes : ('0' + minutes)
        seconds = seconds >= 10 ? seconds : ('0' + seconds)

        if (fmStr.indexOf('yyyy') !== -1) {
          fmStr = fmStr.replace('yyyy', year)
        } else {
          fmStr = fmStr.replace('yy', (year + '').slice(2))
        }
        fmStr = fmStr.replace('mm', month)
        fmStr = fmStr.replace('dd', day)
        fmStr = fmStr.replace('hh', hours)
        fmStr = fmStr.replace('MM', minutes)
        fmStr = fmStr.replace('ss', seconds)
        fmStr = fmStr.replace('SSS', milliSeconds)
        fmStr = fmStr.replace('W', weekCN[time.getDay()])
        fmStr = fmStr.replace('ww', weekEN[time.getDay()])
        fmStr = fmStr.replace('w', week)

        return fmStr
      }

      return dateFormat(new Date(1580400000000), 'yyyy-mm-dd')
    }
  },

  mounted(){
    this.getList();
  },
  created(){
    this.getAllCatalogFaka();
  }
};
</script>

<style scoped>
.search-container .el-form {
  padding: 0;
}
.button-group {
  margin-bottom: 15px;
}

.copy_input_btn {
      z-index: -1;
      position: relative;
      opacity: 0;
      filter: opacity(0);
    }
</style>