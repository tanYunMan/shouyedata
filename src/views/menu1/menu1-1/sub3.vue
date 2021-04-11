<template>
  <div class="container">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>广告图片管理</span>
          <el-button style="float: right;" type="primary" size="mini" @click="_add">新增广告</el-button>
        </div>
        <el-table border row-key="goodsID" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" v-loading="loading" :header-cell-style="{background:'#f5f5f5',color:'#606266','text-align':'center'}" size="mini">
           <el-table-column :show-overflow-tooltip="true" prop="advertImgID" label="编号" align="center"></el-table-column>
           <el-table-column :show-overflow-tooltip="true" prop="seq" label="排序" align="center"></el-table-column>
           <el-table-column :show-overflow-tooltip="true" align="center" label="图片" prop="g">
              <template slot-scope="scope">
                  <!-- <el-image v-if="scope.row.imgAddr && scope.row.srcList" style="width: 80px; height: 80px" :src="scope.row.imgAddr" :preview-src-list="scope.row.srcList" /> -->
                  <img :src="scope.row.imgAddr" width="40" height="40" class="head_pic"/>
              </template>
          </el-table-column>
           <el-table-column :show-overflow-tooltip="true" prop="advertImgID" label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="editForm(scope.row)">编辑</el-button>
                <el-button size="mini" type="text" @click="confirmDel(scope.row.advertImgID)">删除</el-button>
              </template>
          </el-table-column>
        </el-table>
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"  :page-sizes="[10, 50, 100]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
      </el-card>

      <!-- 新增/编辑广告 -->
      <el-dialog title="新增/编辑广告" :visible.sync="stateLoading" width="50%" :close-on-click-modal="false">
            <el-form ref="form" :model="form" label-width="80px">
        
              <el-form-item label="广告图片">
                 <Upload :imgList="form.imgAddr" imgName="我的头像" v-on:listenTochildEvent="showMessageFromChild" v-if="imgLoading" />
              </el-form-item>

              <el-form-item label="排序">
                 <el-input-number v-model="form.seq" controls-position="right" :min="1" :precision="0"></el-input-number>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
              </el-form-item>
            </el-form>
      </el-dialog>
  </div>
</template>

<script>
import { getLists,getDatas } from '@/api/price/price-1/common'
import Upload from '@/components/Upload'
export default {
  data() {
    return {
      form:{},
      imageUrl: '',
      imgLoading: false,
      stateLoading: false,
      loading: true,
      currentPage:1,
      tableData: [],
      total: 0,
      queryParams:{
        pageNum:1,
        pageSize:20
      },
    }
  },
  components: {
    Upload
  },
  mounted() {
    this.getList()
  },
  methods: {

    //确定新增/编辑
    onSubmit() {
      if(!this.form.imgAddr){
          this.$message({
            type: 'error',
            message: '请上传图片'
          });  
        return false  
      }
      if(!this.form.seq){
          this.$message({
            type: 'error',
            message: '请输入排序'
          });  
        return false
      }
      getLists(this.form,'/site/advertimg/saveAdvertimg').then(res => {
        if (res.code===1001){
          this.$message({
            type: 'success',
            message: '操作成功!'
          });
          this.stateLoading = false
          this.getList()
        }else{
          this.$message({
            type: 'error',
            message: res.msg
          });  
        }
        
      }).catch(err => {
        
      })
    },

    //编辑
    editForm(data){
      this.form = {
        advertImgID:data.advertImgID,
        imgAddr:data.imgAddr,
        seq:data.seq
      }
      this.stateLoading = true
      this.imgLoading = true
    },
    _add(){
      this.stateLoading=true
      this.imgLoading = true
      this.form = {}
    },

    // 上传图片返回的信息
    showMessageFromChild(data){
        this.form = {
            ...this.form,
            imgAddr:data
        }
    },
    // 获取广告图片
    getList() {
      this.loading = true
      getLists(this.queryParams,'/site/advertimg/page').then(res => {
        if (res.code===1001){
          if(res.body && res.body.records){
            res.body.records.map((item,index)=>{
              item.srcList = []
              if(item.imgAddr){
                item.srcList.push(item.imgAddr)
              }
            })
            this.tableData = res.body.records
            this.total = res.body.total
          }
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },
    
    // 删除广告
    confirmDel(id){
      this.$confirm('此操作将永久删除该广告, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          
          getDatas({id: id},'/site/advertimg/delete').then(res => {
            if (res.code===1001){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getList()
            }else{
              this.$message({
                type: 'error',
                message: res.msg
              });  
            }
          }).catch(err => {
            this.loading = false
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
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
  }
}
</script>

<style scoped lang="scss">
.container {
  
}
</style>


