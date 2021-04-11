<template>
  <div class="container container-good">
    <div class="filter-wrap">
      <el-button type="primary" @click="dels">取消推荐</el-button>
    </div>
   <el-table border row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" >
       <el-table-column :show-overflow-tooltip="true" type="selection" > </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="goodsID" label="编号"  align="center"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label2" label="商品名称" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.goodsShowVO">{{scope.row.goodsShowVO.goodsName}}</div>
        </template>
      </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label3" label="面值（元）" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.goodsShowVO">{{scope.row.goodsShowVO.goodsPrice}}</div>
        </template>
      </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label10" label="购买类型" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.goodsShowVO && scope.row.goodsShowVO.goodsTypeID == 1">卡密</div>
          <div v-if="scope.row.goodsShowVO && scope.row.goodsShowVO.goodsTypeID == 2">充值</div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>

    <!-- 移除 -->
    <el-dialog title="确认删除" :visible.sync="delDialog" width="30%" > 
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialog = false">取 消</el-button>
        <el-button type="primary" @click="delConfirm" :loading="delConfirmLoading">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import Sortable from 'sortablejs'
import { getList,deleteGoods,sortGoods } from '@/api/meun3/menu3-9/index'

export default {
  data() {
    return {
      day:true,
      color:'#333',
      currentPage:1,
      step:1,
      form:{d:true,textarea:''},
      total:0,
      tableData: [],
      params:{
        pageNum:1,
        pageSize:10,
      },
      tableData2:[1],
      delIds:[],
      multipleSelection: [],
      delConfirmLoading: false,
      delDialog: false
    }
  },
  mounted() {
    this.$nextTick(() => {
    
      this.rowDrop()

    })

    this.getList()
  },
  methods: {
    getList() {
      getList(this.params).then(res => {
        this.tableData = res.body.records
        this.total = res.body.total
      })
    },
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.params.pageNum = val
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 批量移除推荐商品
    dels() {
      this.delIds = []
      this.multipleSelection.map(item => {
        this.delIds.push(item.goodsID)
      })
      if(this.multipleSelection.length > 0) {
        this.delDialog = true
      }else {
        this.$message({
          showClose: true,
          message: '请选择推荐商品',
          type: 'error'
        });
      }
      
    },

    //行拖拽
    rowDrop() {
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.tableData.splice(oldIndex, 1)[0]
          
          _this.tableData.splice(1, 0, currRow)
          _this.sortClick(newIndex,oldIndex,currRow)
        }
      })
    },

    // 排序
    sortClick(newIndex,oldIndex,currRow) {
        let formSort = {
          id:currRow.catalogGoodsRecommendID,
          referId:this.tableData[oldIndex].catalogGoodsRecommendID,
          type: newIndex===0 ? -1 : 1
        }
        sortGoods({...formSort}).then(res => {
          if (res.code === 1001){
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'success',
            });
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
    },

    // 确认移除
    delConfirm() {
      this.delConfirmLoading = true
      deleteGoods({goodsIDs:this.delIds}).then(res => {
        this.delDialog = false
        this.delConfirmLoading = false
        if(res.code===1001){
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'success'
            });
            this.getList()
        } else{
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            });
        }
      })
    },
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
    width: 330px;
    height: 145px;
    line-height: 145px;
    text-align: center;
  }
  .avatar {
    width: 330px;
    height: 145px;
    display: block;
  }
  &.avatar-uploader1 {
    .avatar-uploader-icon {
      width: 80px;
      height: 80px;
      line-height: 80px;
    }
    .avatar {
      width: 80px;
      height: 80px;
    }
  }
}
.filter-wrap {
  display: flex;
  flex-wrap: wrap;
}

.filter-wrap button {
    // float: right;
    // margin: 10px auto;
    margin-left: auto;
    margin-top: 10px;
    margin-bottom: 10px;

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

