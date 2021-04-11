<template>
  <div class="container menu6-1-container">
    <div class="filter-wrap">
      <span>查询条件：</span>
      <el-input v-model="queryParams.cardNumber" placeholder="请输入卡号" size="small" style="width:200px;"></el-input>
      <el-input v-model="queryParams.cardPws" placeholder="请输入卡密" size="small" style="width:200px;"></el-input>
      <el-input v-model="queryParams.supplier" placeholder="请输入供货商名称" size="small" style="width:200px;"></el-input>
      <el-input v-model="queryParams.price" placeholder="请输入价格" size="small" style="width:200px;"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
        <el-button type="danger" @click="delMoreData" >批量删除</el-button>
    </div>

    <el-table border row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266','text-align':'center'}" size="mini" :cell-style="{'text-align':'center'}" >
         <el-table-column :show-overflow-tooltip="true" type="selection" > </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="goodsID" label="商品编号"  ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="goodsName" label="商品名称"  ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="cardNumber" label="卡号"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="cardPws" label="卡密" align="center"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="supplier" label="供货商"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="price" label="价格"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="sort" label="序号"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="validDate" label="有效时间"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="操作"  fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="delList(scope.row.cardID)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"  :page-sizes="[10, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { getLists,getDatas,postApplicationJson } from '@/api/price/price-1/common'
export default {
  data() {
    return {
      form:{},
      currentPage:1,
      total:0,
      tableData: [],
      multipleSelection: [],
      queryParams:{
        pageNum:1,
        pageSize:10
      },
    }
  },
  components: {
    Tinymce
  },
  mounted() {
    this.getList()
  },
  methods: {


    // 获取密记录列表
    getList() {
      this.loading = true
      getLists(this.queryParams,'/goods/card/page').then(res => {
        if (res.code===1001){
          this.tableData = res.body.records
          this.total = res.body.total
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },

    // 删除
    delList(id) {
      this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          getDatas({id:id},'/goods/card/delete').then(res => {
            if (res.code===1001){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getList()
            }else{
              this.$message({
                type: 'info',
                message: res.msg
              });   
            }
          }).catch(err => {
            
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },

    // 批量删除
    delMoreData(){
        if(this.multipleSelection.length == 0){
          this.$message({
            type: 'info',
            message: '请选择您要删除的数据'
          });
          return false
        }
        getDatas({id:this.multipleSelection},'/goods/card/delete').then(res => {
          if (res.code===1001){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getList()
          }else{
            this.$message({
              type: 'info',
              message: res.msg
            });   
          }
        }).catch(err => {
          
        })
    },

    handleSizeChange(val) {
      this.queryParams.pageNum = 1
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
  }
}
</script>
<style lang="scss">

.menu6-1-container {
  .dialog1 {
    .el-dialog__body {
      overflow: auto;
      max-height:700px;
    }
    .el-input {
      width:300px;
    }
  }
  .setPriceDialog {
    .el-dialog__body {
      overflow: auto;
      max-height:700px;
    }
    .el-input {
      width:120px;
    }
  }
}
</style>
<style scoped lang="scss">
.container {
  padding:20px;
  .header {
    background-color: #f0f9eb;
    color: #67c23a;
    padding:20px;
    border-radius: 5px;
    font-size:13px;
    li {
      padding:3px 0;
    }
  }
  .filter-wrap {
    margin-top:20px;
    display: flex;
    flex-wrap: wrap;
  }
  .filter-wrap button {
    // margin: 10px auto;
    margin-left: auto;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .handle-wrap {
    // margin-top:20px;
    margin-bottom:20px;
  }
  
}
</style>