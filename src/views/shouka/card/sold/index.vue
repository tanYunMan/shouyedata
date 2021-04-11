<template>
  <div>
    <div class="search-container">
      <el-form :inline="true" :model="searchForm">
        <el-form-item>
          <el-select
            v-model="searchForm.catalogFakaName"
            @change="selectCatalogFaka"
            style="width: 100%"
            clearable
            placeholder="请选择商品分类"
          >
            <el-option value="" v-if="catalogFakaList">请选择</el-option>
            <el-option v-for="(item, index) in catalogFakaList" :key="index" :label="item.catalogName" :value="item.catalogID">{{item.catalogName}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="searchForm.goodsID"
            @change="selectCatalogFakaGoods"
            style="width: 100%"
            clearable
            placeholder="请选择商品"
          >
            <el-option v-for="(item, index) in catalogFakaGoodsList" :key="index" :label="item.goodsName" :value="item.goodsID">{{item.goodsName}}</el-option>
          </el-select>
        </el-form-item>
        <span>
          <el-form-item>
            <el-input v-model="searchForm.cardNumber " clearable placeholder="卡号或卡密" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="searchForm.contact" clearable placeholder="请输入联系方式" />
          </el-form-item>
        </span>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="button-group">
      <!-- <el-button type="primary" icon="el-icon-plus" @click="toAdd">添加虚拟卡</el-button> -->
      <el-button type="success" icon="el-icon-upload2" @click="exportCard">导出卡密</el-button>
      <el-button type="danger" icon="el-icon-close" @click="batchDel">批量删除</el-button>
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
      <!-- <el-table-column prop="cardState" label="状态"></el-table-column> -->
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <div>
        <el-table-column prop="validDate" label="售出时间"></el-table-column>
        <!-- <el-table-column prop="systemNoticeTitle" label="取卡密码"></el-table-column> -->
        <!-- <el-table-column prop="systemNoticeTitle" label="联系方式"></el-table-column> -->
      </div>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="text" @click="del(row.historyCardID)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"  :page-sizes="[10, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    <!-- 导出 -->
    <el-dialog title="导出" :visible.sync="exportDialog" width="40%">
      <daochu />
    </el-dialog>

    <!-- 导出 -->
  </div>
</template>

<script>
import request from "@/utils/request"
import daochu from "../daochu";
import { getLists } from '@/api/price/price-1/common'
export default {
  data() {
    return {
      list: [],
      total: 0,
      loading: false,
      exportDialog: false,
      searchForm: {
        cardState: 1,
        pageNum: 1,
        pageSize: 10
      },
      catalogFakaList: [],
      catalogFakaGoodsList: [],
      checkIds: [],
      multipleSelection: [],

    };
  },
  components: {
    daochu,
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
    toAdd() {
      this.$router.push("/goods/cardManager/cardAdd")
    },
    // toExport() {
    //   this.exportDialog = true;
    // },

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
    confirmAlert(msg) {
      var _that = this
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/goods/historyCard/delete/?id=' + _that.checkIds,
          method: 'get',
          data:{},
          transformRequest: request.transformRequest
        }).then(res=>{
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
              message: '删除失败',
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 批量导出
    exportCard() {
      this.checkBoxChecked()
      if (this.checkIds.length < 1) {
        this.$message({
          showClose: true,
          message: '请选择卡密',
          type: 'error'
        })
        return
      }
      this.$confirm('此操作将导出所选卡密, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let str = ''
        this.multipleSelection.forEach(i => {
          let str_g = i.goodsName ? i.goodsName : ''
          let str_f = i.cardNumber ? ' ' + i.cardNumber : ''
          let str_s = i.cardPws ? ' ' + i.cardPws : ''
          if (str === '') {
            str = str_g + str_f + str_s
          } else {
            str = str + '\n' + str_g + str_f + str_s
          }

        })
        this.exportData("卡密导出.txt", str)

      }).catch(() => {
        this.$message.success('已取消')
      })
    },

    exportData(filename, filecontent) {
      //定义文件内容，类型必须为Blob 否则createObjectURL会报错
      let content = new Blob([filecontent])
      //生成url对象
      let  urlObject = window.URL || window.webkitURL || window
      let url = urlObject.createObjectURL(content)
      //生成<a></a>DOM元素
      let el = document.createElement('a')
      //链接赋值
      el.href = url
      el.download =filename
      //必须点击否则不会下载
      el.click()
      //移除链接释放资源
      urlObject.revokeObjectURL(url)
    }
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
