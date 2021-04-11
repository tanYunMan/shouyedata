<template>
  <div class="">
    <div>
      <el-table border row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266','text-align':'center'}" size="mini" v-loading="loading" >
         <el-table-column :show-overflow-tooltip="true" type="selection" > </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="goodsName" label="商品名称" width="660"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="price" label="商品对接价格" align="center"></el-table-column>
        <!--  <el-table-column :show-overflow-tooltip="true" prop="supplyPrice" label="商品全网通价" align="center"></el-table-column> -->
         <el-table-column :show-overflow-tooltip="true" prop="cardNum" label="密卡数量" align="center"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label3" label="站点来源" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.site&&scope.row.site.siteName}}</span>
          </template>
        </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="test6" label="对接状态" align="center">
        <template slot-scope="scope">
          <el-button type="danger" plain size="mini" style="margin-left:0" v-show="scope.row.agentType == 0">禁止对接</el-button>
          <el-button type="warning" plain size="mini" style="margin-left:0" v-show="scope.row.agentType == 1">单次对接</el-button>
          <el-button type="primary" plain size="mini" style="margin-left:0" v-show="scope.row.agentType == 2">多次对接</el-button>
        </template>
      </el-table-column>
        </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="操作"  fixed="right" width="160" align="center">
          <template slot-scope="scope">
            <el-button type="text" v-show="!scope.row.connected" size="mini" @click="applicationDocking(scope.row)">申请对接</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10,20]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>

    <!-- 申请对接 -->
    <el-dialog title="是否申请对接？" :visible.sync="dockingDialog" width="30%" :close-on-click-modal="false">
      <el-form :model="ruleForm" ref="ruleForm" label-width="160px">
        <el-form-item label="本地目录">
          <!-- <el-select v-model="ruleForm.catalogID" placeholder="请选择本地目录">
            <el-option
              v-for="item in localCatalogData"
              :key="item.catalogID"
              :label="item.catalogName"
              :value="item.catalogID">
            </el-option>
          </el-select> -->
            <el-cascader v-model="ruleForm.catalogID" :options="recombinationData" :props="optionProps">
              <template slot-scope="{ node, data }">
                <span>{{ data.catalogName }}</span>
              </template>
            </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dockingDialog = false">取 消</el-button>
        <el-button type="primary" @click="dockingConfirm" :loading="dockingConfirmLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { getLists,getDatas } from '@/api/price/price-1/common'
export default {
  props: {
    goodsName: String
  },
  data() {
    return {
      form:{
        type: '1'
      },
      dialog1:false,
      dockingConfirmLoading: false,
      dockingDialog: false,
      currentPage:1,
      ruleForm:{},
      businessInfo:{},
      queryParams:{
        pageNum:1,
        pageSize:10
      },
      loading: true,
      total:0,
      tableData: [],
      localCatalogData: [], // 本地目录
      multipleSelection: [],
      recombinationData: [],
      optionProps:{
        value: 'catalogID',
        label: 'catalogName',
        children: 'children'
      },
    }
  },
  components: {
    Tinymce
  },
  mounted() {
    // this.getList()
    this.localCatalog()
  },
  methods: {

    // 选择类型
    onTypeChange() {
      if(+this.form.type !== 1) {
        this.$router.push('/menu4/4')
      }
    },

    // 获取全网通对接商品列表
    getList() {
      this.loading = true
      getLists(this.queryParams,'/goods/goods/getConnectGoods').then(res => {
        if (res.code===1001){
          this.tableData = res.body.records
          this.total = res.body.total
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },

    // 获取本地目录
    localCatalog() {
      //getDatas({},'/goods/catalog/catalogList').then(res => {
      //  if (res.code===1001){
      //    this.localCatalogData = res.body
      //  }
      //}).catch(err => {
//
      //})

      getDatas({},'/goods/catalog/tree').then(res => {
        if (res.code===1001){
          let recombinationData = []
          res.body.map(item => {
              if(item.children.length>0){
                  let newData = []
                  item.children.map(items => {
                      newData.push({catalogID:items.catalogID,catalogName:items.catalogName})
                  })
                  recombinationData.push({catalogID:item.catalogID,catalogName:item.catalogName,disabled:false,children:newData})
              }else{
                  recombinationData.push({catalogID:item.catalogID,catalogName:item.catalogName,disabled:true})
              }
          })
          //console.log(recombinationData,789)
          this.recombinationData = recombinationData
        }
      }).catch(err => {

      })
    },

    // 申请对接
    applicationDocking(data){
      this.ruleForm = {}
      this.dockingDialog = true
      this.ruleForm = {
        sourceGoodsIDs: [data.goodsID]
      }
    },
    // 确认对接申请
    dockingConfirm (){
      this.dockingConfirmLoading = true
      if(!this.ruleForm.catalogID){
        this.$message({
          showClose: true,
          message: '请选择本地目录',
          type: 'error',
        });

        this.dockingConfirmLoading = false
        return
      }
      getLists({sourceGoodsIDs:this.ruleForm.sourceGoodsIDs,catalogID:this.ruleForm.catalogID[1]},'/goods/goods/batchGoods').then(res => {
        if (res.code===1001){
          this.$message({
            message: res.msg,
            type: 'success',
          });
          this.dockingDialog = false
          this.dockingConfirmLoading = false
          this.ruleForm = {}
          this.getList()
        }else{
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'error',
          });
          this.dockingConfirmLoading = false
        }
      }).catch(err => {
          this.dockingConfirmLoading = false
      })
    },

    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getList()
    },

    // 批量对接
    batchDocking(){
      if(!this.ruleForm.sourceGoodsIDs || this.ruleForm.sourceGoodsIDs.length===0){
        this.$message({
          showClose: true,
          message: '请选择对接商品',
          type: 'error',
        });
        return
      }else{
          this.dockingDialog = true
      }
    },
    handleSelectionChange(val) {
      this.ruleForm = {}
      //this.multipleSelection = val;
      let goodsID = []
      val.map(item => {
          goodsID.push(item.goodsID)
      })
      this.ruleForm = {
        sourceGoodsIDs:goodsID
      }
    },
    godomainAddr(data){
      if (data.systemDomain && data.systemDomain.domainAddr){
        let url = data.systemDomain.domainAddr
        if(url.indexOf('http')!==0){
            url = "http://"+url
        }
        window.open(url,"_blank")
      }
    },

    // 查询列表
    queryList(){
      if(!this.form.type){
        this.$message({
          showClose: true,
          message: '请选择查询类型',
          type: 'error',
        });
        return
      }
      this.queryParams = {
        pageNum:1,
        pageSize:10,
      }
      if (this.form.type === '1') {// 商品名称查询
          this.queryParams = { ...this.queryParams,goodsName:this.goodsName}
      }

      this.getList()
    },

    go(data) {
      this.$router.push({path:'/menu4/4/sub1/'+data.siteID})
    }
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
  .businessInfoUl li{
    margin: 10px auto;
  }
  .businessInfoUl li .label{
      font-weight: 600;
  }
}
</style>

