<template>
  <div class="container container-good">
    <div class="filter-wrap">
      <span>查询条件：</span>
      <el-input v-model="form.goodsName" placeholder="请输入商品名称" class="search-input"></el-input>
      <el-input v-model="form.supplier" placeholder="请输入供货商名称" class="search-input"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
    </div>
    <el-table border row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" >
       <el-table-column  :show-overflow-tooltip="true" prop="goodsName" label="商品名称"></el-table-column>
       <el-table-column  :show-overflow-tooltip="true" prop="importTime" label="导入时间"></el-table-column>
       <el-table-column  :show-overflow-tooltip="true" prop="importNum" label="导入数量" ></el-table-column>
       <el-table-column  :show-overflow-tooltip="true" prop="supplier" label="供货商" ></el-table-column>
       <el-table-column  :show-overflow-tooltip="true" prop="endTime" label="到期时间" ></el-table-column>
       <el-table-column  :show-overflow-tooltip="true" prop="price" label="进货价格" ></el-table-column>
       <el-table-column  :show-overflow-tooltip="true" prop="userName" label="导卡管理员" ></el-table-column>
    </el-table>
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="queryParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>

  </div>
</template>

<script>
import { getList} from '@/api/meun3/menu3-7/index'

export default {
  data() {
    return {
      day:true,
      color:'#333',
      currentPage:1,
      total: 0,
      step:1,
      form:{d:true,textarea:''},
      tableData: [],
      tableData2: [1],
      multipleSelection: [],
      queryParams: {
        pageNum: 1,
        pageSize: 20
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      getList(this.queryParams).then(res => {
        if (res.code===1001){
          this.tableData = res.body.records
          this.total = res.body.total

          this.queryParams = {
            pageNum: res.body.current,
            pageSize: res.body.size,
          }
        }
        this.loading = false
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 查询内容
    query () {
        this.queryParams = {
          pageNum: 1,
          pageSize: 20,
          ...this.form
        }
        this.getList()
    }
  }
}
</script>

<style lang="scss">
.container-good {
  
}
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
    
</style>
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

