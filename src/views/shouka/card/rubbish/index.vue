<template>
  <div>
    <div class="search-container">
      <el-form :inline="true" :model="searchForm" >
        <el-form-item>
          <el-select
            v-model="searchForm.catalogFakaName"
            @change="selectCatalogFaka"
            clearable
            placeholder="请选择商品分类"
          >
            <el-option value="" v-if="catalogFakaList">请选择</el-option>
              <el-option v-for="(item, index) in catalogFakaList" :key="index" :label="item.catalogName" :value="item.catalogID">{{item.catalogName}}</el-option>
          </el-select>
          <el-select
            v-model="searchForm.goodsID"
            @change="selectCatalogFakaGoods"
            clearable
            placeholder="请选择商品"
          >
            <el-option v-for="(item, index) in catalogFakaGoodsList" :key="index" :label="item.goodsName" :value="item.goodsID">{{item.goodsName}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="button-group">
       <!-- <el-button type="primary" icon="el-icon-refresh">批量恢复</el-button> -->
       <el-button type="warning" icon="el-icon-close" @click="batchDel">批量删除</el-button>
       <el-button type="danger" icon="el-icon-delete" @click="clearRubbish">清空回收站</el-button>
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
      <el-table-column prop="catalogName" label="商品分类"></el-table-column>
      <el-table-column prop="goodsName" label="商品名称"></el-table-column>
      <el-table-column prop="prive" label="商品价格"></el-table-column>
      <el-table-column prop="cardNumber" label="卡号"></el-table-column>
      <el-table-column prop="cardPws" label="卡密"></el-table-column>
      <!-- <el-table-column prop="systemNoticeTitle" label="状态"></el-table-column> -->
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="text" @click="del(row.historyCardID)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"  :page-sizes="[10, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>

  </div>
</template>

<script>
import request from "@/utils/request"
import { getLists } from '@/api/price/price-1/common'
export default {
  data() {
    return {
      list: [],
      total: 0,
      loading: false,
      searchForm: {
        cardState: 2,
        pageNum: 1,
        pageSize: 10
      },
      catalogFakaList: [],
      catalogFakaGoodsList: [],
      checkIds: [],
      multipleSelection: [],
    };
  },
  mounted() {
    this.getCatalogFakaList()
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      getLists(this.searchForm, '/goods/historyCard/page').then(res => {
        if (res.code===1001){
          this.list = res.body.records
          this.total = res.body.total
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
      });
    },
    getCatalogFakaList() {
      request({
        url: '/goods/catalogFaka/list',
        method: 'get',
        data:{},
        transformRequest: request.transformRequest
      }).then(res=>{
        this.catalogFakaList = res.body
      })
    },
    selectCatalogFaka(val) {
      var _that = this
      this.catalogFakaList.forEach(function(item, key){
        if (item.catalogID == val) {
          _that.searchForm.catalogFakaName = item.catalogName
        }
      })
      if (!val) {
        this.searchForm.catalogFakaName = ''
        this.searchForm.goodsID = ''
        this.searchForm.goodsName = ''
        this.catalogFakaGoodsList = []
        return
      }
      this.catalogFakaGoodsList = []
      this.getCatalogFakaGoodsList(val);
    },
    getCatalogFakaGoodsList(catalogID) {
      request({
        url: '/goods/goods/getGoodsByCatalogForFaka/?catalogID=' + catalogID,
        method: 'get',
        data:{},
        transformRequest: request.transformRequest
      }).then(res=>{
        this.catalogFakaGoodsList = res.body
      })
    },
    selectCatalogFakaGoods(val) {
      var _that = this
      this.catalogFakaGoodsList.forEach(function(item, key) {
        if (item.goodsID == val) {
          _that.searchForm.goodsName = item.goodsName
        }
      })
    },
    handleSizeChange(val) {
      this.searchForm.pageNum = 1
      this.searchForm.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.searchForm.pageNum = val
      this.getList()
    },
    checkBoxChecked() {
      this.checkIds = []
      this.multipleSelection.map(item => {
        this.checkIds.push(item.historyCardID)
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 批量删除前的准备
    batchDel() {
      this.checkBoxChecked()
      if (this.checkIds.length < 1) {
        this.$message({
          showClose: true,
          message: '请选择卡密',
          type: 'error'
        })
        return
      }
      this.confirmAlert('此操作将批量删除所选项, 是否继续?')
    },
    // 单个删除
    del(id) {
      if (!id) {
        this.$message({
          showClose: true,
          message: '请选择卡密',
          type: 'error'
        })
        return
      }
      this.checkIds.push(id)
      this.confirmAlert('此操作将删除此选项, 是否继续?')
    },
    clearRubbish() {
      this.confirmAlert('此操作清空回收站, 是否继续?', 'clear')
    },
    confirmAlert(msg, type = '') {
      var _that = this
      var url = type == 'clear' ? '/goods/historyCard/clear' : '/goods/historyCard/delete/?id=' + _that.checkIds
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: url,
          method: 'get',
          data:{},
          transformRequest: request.transformRequest
        }).then(res=>{
          if (res.code === 1001) {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'success'
            })
            this.getList();
          } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            })
          }
        }).catch(err => {
          this.$message({
            showClose: true,
            message: '删除失败',
            type: 'error'
          })
        })
      })
    },
  },
};
</script>

<style scoped>
.search-container .el-form {
  padding: 0;
}
.button-group {
  margin-bottom: 15px;
}
</style>
