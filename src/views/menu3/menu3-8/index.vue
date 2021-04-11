<template>
  <div class="container">
    <div class="filter-wrap">
      <el-button type="primary" @click="addDialog = true,color = '#333'">添加推荐目录</el-button>
      <el-button type="danger" @click="dels">批量删除</el-button>
    </div>
    <el-table row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#eef1f6',color:'#606266','text-align':'center'}" v-loading="loading" size="mini" :cell-style="{'text-align':'center'}">
       <el-table-column :show-overflow-tooltip="true" type="selection" > </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="catalogRecommendID" label="目录编号" align="center"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="catalogRecommendName" label="目录名称"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="test9" label="子集商品" align="center">
        <template slot-scope="scope">
          <span style="color:#409EFF;cursor: pointer;" @click="getChild(scope.row,scope.$index)">获取商品</span>
        </template>
      </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="color" label="颜色" align="center"> </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="sort" label="序号" align="center"> </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="test5" label="状态" align="center">
        <template slot-scope="scope">
          <div>
            <el-button type="info" plain size="mini" v-show="scope.row.state == 0" @click="updateState(scope.row)" :loading="stateLoading">隐藏</el-button>
            <el-button type="primary" plain size="mini" style="margin-left:0" v-show="scope.row.state == 1" @click="updateState(scope.row)" :loading="stateLoading">显示</el-button>
          </div>
        </template>
      </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="test9" label="添加推荐商品" align="center">
        <template slot-scope="scope">
          <span style="color:#409EFF;cursor: pointer;" @click="getGoodsList(scope.row,scope.$index)">添加商品</span>
        </template>
      </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="test8" label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="update(scope.row)">修改</el-button>
          <el-button type="text" size="mini" @click="del(scope.row.catalogRecommendID, 'dir')">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableDataInfo.pageNum" :page-sizes="[10, 20, 30]" :page-size="tableDataInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableDataInfo.total"> </el-pagination>

    <!-- 新增目录 -->
    <el-dialog title="添加推荐目录" :visible.sync="addDialog" :close-on-click-modal="false" @closed="closeCatalogForm">
      <el-form ref="addCatalogForm" :rules="addCatalogFormRules" :model="addCatalogForm" label-width="160px">
        <el-form-item label="商品目录名称：" prop="catalogRecommendName">
          <el-input v-model="addCatalogForm.catalogRecommendName" placeholder="请输入商品目录名称" style="float:left"></el-input>
        </el-form-item>
        <el-form-item label="目录颜色：">
          <colorPicker  defaultColor='#000000' v-model="color" @change="themeEvent"></colorPicker >
        </el-form-item>
      </el-form>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDilog('addCatalogForm')">取 消</el-button>
        <el-button type="primary" @click="AddCatalog('addCatalogForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改目录 -->
    <el-dialog title="修改目录" :visible.sync="updateDialog" :close-on-click-modal="false">
      <el-form ref="updateForm" :model="updateForm" :rules="addCatalogFormRules" label-width="160px">
        <el-form-item label="商品目录名称：" prop="catalogRecommendName">
          <el-input v-model="updateForm.catalogRecommendName" placeholder="请输入商品目录名称" style="float:left"></el-input>
        </el-form-item>
        <el-form-item label="目录颜色：">
          <el-color-picker v-model="color" @change="themeEvent"></el-color-picker>
        </el-form-item>
      </el-form>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateConfirm('updateForm')" :loading="updateConfirmLoading">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除 -->
    <el-dialog title="确认删除" :visible.sync="delDialog" width="30%" > 
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialog = false">取 消</el-button>
        <el-button type="primary" @click="delConfirm" :loading="delConfirmLoading">确 定</el-button>
      </span>
    </el-dialog>



    <!-- 目录下的商品 -->
    <el-dialog :title="goodsListDialogName" :visible.sync="goodsListDialog" width="60%" >
      <el-table row-key="goodsID" ref="multipleTable" :data="dataGoodsList" style="width: 100%" :header-cell-style="{background:'#eef1f6',color:'#606266','text-align':'center'}" v-loading="loadingGoods" size="mini" :cell-style="{'text-align':'center'}">
       <el-table-column :show-overflow-tooltip="true" prop="goodsID" label="商品编号" align="center"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" label="商品名称">
        <template slot-scope="scope">
         <el-popover trigger="hover" placement="top">
          <p>商品名称: {{ scope.row.goodsShowVO.goodsName }}</p>
          <div slot="reference" class="name-wrapper">
            <div class="hiddenOverText">{{ scope.row.goodsShowVO.goodsName }}</div>
          </div>
        </el-popover>
        </template>
      </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="goodsPrice" label="价格" align="center">
         <template slot-scope="scope"><span>{{scope.row.goodsShowVO.goodsPrice}}</span></template>
       </el-table-column>
       <!-- <el-table-column :show-overflow-tooltip="true" prop="remark" label="备注" align="center"> 
        <template slot-scope="scope">
         <el-popover trigger="hover" placement="top">
          <p>商品备注: {{ scope.row.remark }}</p>
          <div slot="reference" class="name-wrapper">
            <div class="hiddenOverText">{{ scope.row.remark }}</div>
          </div>
        </el-popover>
        </template>
      </el-table-column> -->
       <el-table-column :show-overflow-tooltip="true" prop="test8" label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="del(scope.row.goodsID, 'goods')">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @size-change="handleSizeChangeGoods" @current-change="handleCurrentChangeGoods" :current-page="goodsQuery.pageNum" :page-sizes="[10]" :page-size="goodsQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="goodsQuery.total"> </el-pagination>

    </el-dialog>


    <!-- 添加目录商品 -->
    <el-dialog :title="goodsListDialogName" :visible.sync="addGoodsListDialog" width="60%" >
      <div class="filter-wrap">
         <span>商品编号：</span>
        <el-input type="number" v-model="goodsQuerys.goodsID" placeholder="请输入商品编号" style="width:200px" class="search-input"></el-input>
        <span>商品名称：</span>
        <el-input v-model="goodsQuerys.goodsName" placeholder="请输入商品名称" style="width:200px" class="search-input"></el-input>
        <el-button type="primary" @click="queryFormList" icon="el-icon-search" :loading="loadingGoods">查询</el-button>
        <el-button @click="multipleSelectionGoodsBatchToCatalog" icon="el-icon-upload" :loading="loadingGoods">批量推荐</el-button>
      </div>
      <el-table row-key="goodsID" ref="multipleTable" :data="dataGoodsList" style="width: 100%" @selection-change="handleSelectionChangeGoods" :header-cell-style="{background:'#eef1f6',color:'#606266','text-align':'center'}" v-loading="loadingGoods" size="mini" :cell-style="{'text-align':'center'}">
       <el-table-column :show-overflow-tooltip="true" type="selection" > </el-table-column>
       <!-- <el-table-column :show-overflow-tooltip="true" prop="goodsCode" label="商品编号" align="center"></el-table-column> -->
       <el-table-column :show-overflow-tooltip="true" prop="goodsName" label="商品名称">
        <template slot-scope="scope">
         <el-popover trigger="hover" placement="top">
          <p>商品名称: {{ scope.row.goodsName }}</p>
          <div slot="reference" class="name-wrapper">
            <div class="hiddenOverText">{{ scope.row.goodsName }}</div>
          </div>
        </el-popover>
        </template>
      </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="goodsPrice" label="价格" align="center"> </el-table-column>
       <!-- <el-table-column :show-overflow-tooltip="true" prop="remark" label="备注" align="center"> 
        <template slot-scope="scope">
         <el-popover trigger="hover" placement="top">
          <p>商品备注: {{ scope.row.remark }}</p>
          <div slot="reference" class="name-wrapper">
            <div class="hiddenOverText">{{ scope.row.remark }}</div>
          </div>
        </el-popover>
        </template>
      </el-table-column> -->
       <el-table-column :show-overflow-tooltip="true" prop="test8" label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="recommendGoodsBatchToCatalog(scope.row.goodsID,1)">推荐</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @size-change="handleSizeChangeGoodss" @current-change="handleCurrentChangeGoodss" :current-page="goodsQuerys.pageNum" :page-sizes="[10]" :page-size="goodsQuerys.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="goodsQuerys.total"> </el-pagination>
    </el-dialog>

  </div>
</template>

<script>
import Sortable from 'sortablejs'
import { geTcatalogList, updateCatalog, deleteCatalog, updateStateBatch, AddCatalog, getRecommendedCatalogue, deleteCatalogGoods, getGoodsListCatalogue, addRecommendGoodsBatchToCatalog } from '@/api/meun3/menu3-8/index'
import axios from 'axios'
import { getToken, setToken, removeToken } from '@/utils/auth'

Array.prototype.insert = function(index, arr) {
  this.splice.apply(this,[index,0]).concat(arr)   
  return this
}

export default {
  data() {
    return {
      loading: true,
      color: '#333',
      form: {},
      colorML: '', // 目录颜色
      updateForm: {},
      goodsListDialog: false,
      addGoodsListDialog: false,
      goodsListDialogName: '目录商品列表',
      addCatalogForm: {
        agentType: 0,
        catalogSource: 1
      },
      goodsType:[
        {value:1,label:'卡密'},
        {value:2,label:'充值'}
      ],
      dataGoodsList:[],//目录下已有的商品
      loadingGoods: false,
      addDialog: false,
      updateDialog: false,
      delDialog: false,
      updateAgentTypeDialog: false,
      updateConfirmLoading: false,
      delConfirmLoading: false,
      stateLoading: false,
      tableData: [],
      delIds:[],
      multipleSelection: [],
      multipleSelectionGoods: [],
      updateAgentTypeForm:{
        agentType: '',
        ids: []
      },
      addCatalogFormRules: {
        catalogRecommendName: [
          { required: true, message: '请输入目录名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]
      },
      currentPage: 1,
      tableDataInfo: {
        pageNum: 1,// 当前页数
        pageSize: 20, //每页条数
        total: 0, //数据总共条数
      },
      goodsQuery:{
        pageNum:1,
        pageSize: 10, //每页条数
        total: 0, //数据总共条数
        crID:''
      },
      goodsQuerys:{
        pageNum:1,
        pageSize: 10, //每页条数
        total: 0, //数据总共条数
        crID:''
      },
      delTrue:false, //是否是删除商品
      thisCRID:''  //当前操作的目录id
    }
  },
  mounted() {
    this.$nextTick(() => {
    
      this.rowDrop()

    })

    this.geTcatalogList()
    
  },
  methods: {

    // 清空筛查条件
    setValueNull(val){
      delete this.goodsQuery.goodsTypeID
    },

    closeCatalogForm(){
        this.addCatalogForm = {}
        this.color = '#333'
    },


    
    handleSizeChange(val) {
      this.tableDataInfo = {
        pageNum: this.tableDataInfo.pageNum,
        pageSize: val,
        total: this.tableDataInfo.total
      }
      this.geTcatalogList()
    },
    handleCurrentChange(val) {
      this.tableDataInfo = {
        pageNum: val,
        pageSize: this.tableDataInfo.pageSize,
        total: this.tableDataInfo.total
      }
      this.geTcatalogList()
    },


    // 目录下商品列表--分页
    handleSizeChangeGoods(val) {
      this.goodsQuery = {
        pageNum: this.goodsQuery.pageNum,
        pageSize: val,
        total: this.goodsQuery.total
      }
      this.getChild({catalogRecommendID:this.thisCRID},null)
    },
    handleCurrentChangeGoods(val) {
      this.goodsQuery = {
        pageNum: val,
        pageSize: this.goodsQuery.pageSize,
        total: this.goodsQuery.total
      }
      this.getChild({catalogRecommendID:this.thisCRID},null)
    },


    // 可推荐商品列表--分页
    handleSizeChangeGoodss(val) {
      this.goodsQuerys = {
        pageNum: this.goodsQuerys.pageNum,
        pageSize: val,
        total: this.goodsQuerys.total
      }
      this.getGoodsList({catalogRecommendID:this.thisCRID},null)
    },
    handleCurrentChangeGoodss(val) {
      this.goodsQuerys = {
        pageNum: val,
        pageSize: this.goodsQuerys.pageSize,
        total: this.goodsQuerys.total
      }
      this.getGoodsList({catalogRecommendID:this.thisCRID},null)
    },

    

    closeDilog(form) {
      this.addDialog = false;
      this.$refs[form].resetFields() // 将form表单重置
    },

    // 获取目录列表
    geTcatalogList() {
      geTcatalogList(this.tableDataInfo).then(res => {
        this.tableData = res.body.records
        this.tableDataInfo = {
          pageNum: res.body.current,
          pageSize: res.body.size,
          total: res.body.total 
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },

    // 添加目录
    AddCatalog(form) {
      this.$refs[form].validate(async valid => {
        if (!valid) return null  // 如果验证失败就不往下继续执行
        this.addCatalogForm = { ...this.addCatalogForm, color: this.colorML }
        AddCatalog(this.addCatalogForm).then(res => {
          if (res.code === 1001) {
            this.$notify({
              title: res.msg,
              type: 'success'
            })
            this.geTcatalogList()
            this.addDialog = false
            this.colorML= ''
            this.$refs[form].resetFields() // 将form表单重置
          } else {
            this.$notify.error({
              title: res.msg
            })
          }
          this.loading = false
        }).catch(err => {
          this.loading = false
        })
      })
    },
    // 修改目录
    update(item) {
      this.color = item.color ? item.color : '#333'
      this.updateForm = item
      this.updateDialog = true
    },
    // 确认修改目录
    updateConfirm(form) {
      this.$refs[form].validate(async valid => {
        if (!valid) return null  // 如果验证失败就不往下继续执行
        this.updateConfirmLoading = true
        this.updateForm = { ...this.updateForm, color: this.colorML }
        updateCatalog(this.updateForm).then(res => {
        if (res.code === 1001) {
            this.$notify({
              title: res.msg,
              type: 'success'
            })
            this.colorML= ''
            this.geTcatalogList()
            this.updateDialog = false
            this.$refs[form].resetFields() // 将form表单重置
          } else {
            this.$notify.error({
              title: res.msg
            })
          }
          this.updateConfirmLoading = false
        }).catch(err => {
          this.updateDialog = false
          this.updateConfirmLoading = false
        })
      })
    },
    // 删除目录
    del(id, str) {
      if (str === 'dir') {
        this.delIds = id
        this.delTrue = false
      } else {
        this.delIds = [id]
        this.delTrue = true
      }
      this.delDialog = true
    },
    // 批量删除目录
    dels() {
      this.delIds = []
      this.multipleSelection.map(item => {
        this.delIds.push(item.catalogRecommendID)
      })
      if (this.multipleSelection.length > 0) {
        this.delDialog = true
      } else {
        this.$message({
          showClose: true,
          message: '请选择目录',
          type: 'error'
        })
      }
      
    },
    // 确认删除
    delConfirm() {
      this.delConfirmLoading = true
      if(this.delTrue){
        deleteCatalogGoods({ goodsIDs: this.delIds,crID:this.thisCRID }).then(res => {
          if(res.code===1001){
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'success',
            });

            this.getChild({catalogRecommendID:this.thisCRID},null)
            
            this.delTrue = false
          }else{
             this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            }) 
          }
          this.delDialog = false
          this.delConfirmLoading = false
        }).catch(err => {
          
        })
      }else{
        deleteCatalog({ ids: this.delIds }).then(res => {
          this.delDialog = false
          this.delConfirmLoading = false
          this.geTcatalogList()
        })
      }
    },
    // 状态改变
    updateState(item) {
      this.stateLoading = true
      updateStateBatch({
        id:[item.catalogRecommendID],
        state:(item.state == 1 ? 0 : 1)
      }).then(res => {
        this.geTcatalogList()
        this.stateLoading = false
      }).catch(err => {
        this.stateLoading = false
      })
    },
    // 对接状态改变
    updateAgentType(item) {
      this.updateAgentTypeDialog = true
      this.updateAgentTypeForm.ids = [item.catalogRecommendID]
      this.updateAgentTypeForm.agentType = item.agentType
    },
    //行拖拽
    rowDrop() {
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.tableData.splice(oldIndex, 1)[0]
          _this.tableData.splice(1, 0, currRow)
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    //  选择可推荐的商品
    handleSelectionChangeGoods(val) {
      this.multipleSelectionGoods = val;
    },

    // 获取推荐目录下的商品
    getChild(item,index) {
      this.thisCRID = item.catalogRecommendID
      this.loadingGoods = true
      this.goodsListDialogName = item.catalogRecommendName?item.catalogRecommendName+'--已有商品列表':this.goodsListDialogName
      this.goodsListDialog = true
      this.goodsQuery.crID = item.catalogRecommendID
      // this.goodsQuery = {
      //   pageNum:1,
      //   pageSize: 10, //每页条数
      //   total: 0, //数据总共条数
      //   crID: item.catalogRecommendID
      // }
      getRecommendedCatalogue(this.goodsQuery).then(res => {
        if (res.code === 1001) {
          this.dataGoodsList = res.body.records
          this.goodsQuery = {
            ...this.goodsQuery,
            total:res.body.total
          }
          this.loadingGoods = false
        } else {
          this.dataGoodsList = []
          this.$notify.error({
            title: res.msg
          })
          this.loadingGoods = false
        }
      }).catch(err => {
        this.loadingGoods = false
      })
    },
    themeEvent(val) {
      this.colorML = val
    },

    // 可推荐商品
    getGoodsList(item,index){
      this.multipleSelectionGoods = []
      this.thisCRID = item.catalogRecommendID
      this.loadingGoods = true
      this.goodsListDialogName = item.catalogRecommendName?item.catalogRecommendName+'--可推荐商品列表':this.goodsListDialogName
      this.addGoodsListDialog = true
      this.goodsQuerys.crID = item.catalogRecommendID
      // this.goodsQuery = {
      //   pageNum:1,
      //   pageSize: 10, //每页条数
      //   total: 0, //数据总共条数
      //   crID: item.catalogRecommendID
      // }
      getGoodsListCatalogue(this.goodsQuerys).then(res => {
        if (res.code === 1001) {
          this.dataGoodsList = res.body.records
          this.goodsQuerys = {
            ...this.goodsQuerys,
            total:res.body.total
          }
          this.loadingGoods = false
        } else {
          this.dataGoodsList = []
          this.$notify.error({
            title: res.msg
          })
          this.loadingGoods = false
        }
      }).catch(err => {
        this.loadingGoods = false
      })
    
    },


    // 查询可推荐商品
    queryFormList(){
      this.loadingGoods = true
      getGoodsListCatalogue(this.goodsQuerys).then(res => {
        if (res.code === 1001) {
          this.dataGoodsList = res.body.records
          this.goodsQuerys = {
            ...this.goodsQuerys,
            total:res.body.total
          }
          console.log(this.goodsQuerys.total)
          this.loadingGoods = false
        } else {
          this.dataGoodsList = []
          this.$notify.error({
            title: res.msg
          })
          this.loadingGoods = false
        }
      }).catch(err => {
        this.loadingGoods = false
      })
    },


    // 批量推荐
    multipleSelectionGoodsBatchToCatalog(){
        if(this.multipleSelectionGoods.length===0){
          this.$message({
            showClose: true,
            message: '请选择您要推荐的商品',
            type: 'error'
          })
        }else{
          let goodsID = []
          this.multipleSelectionGoods.map(item => {
            goodsID.push(item.goodsID)
          })
          let payload = {
            ids:goodsID,
            crID:this.thisCRID
          }
          this.recommendGoodsBatchToCatalog(payload,2)
        }
    },
    // 推荐商品
    recommendGoodsBatchToCatalog(payload,index){
        if(index===1){
          payload = {
            ids:[payload],
            crID:this.thisCRID
          }
        }
      this.loadingGoods = true
      addRecommendGoodsBatchToCatalog(payload).then(res => {
        if (res.code === 1001) {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'success',
          });
          this.queryFormList()
          this.multipleSelectionGoods = []
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'error'
          })
          this.loadingGoods = false
        }
      }).catch(err => {
        this.loadingGoods = false
      })
    }




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
.hiddenOverText{
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow:ellipsis;
}
</style>
<style lang="scss" scoped>
.el-color-picker {
  float:left;
  margin-left:20px;
}
.container {
  padding:20px;
  .el-form {
    padding:0;
    .el-input,.el-textarea {
      width:400px;
    }
  }
}

::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
      -webkit-appearance: none !important;
}
::v-deep input[type='number'] {
      -moz-appearance: textfield !important;
}
 
</style>

