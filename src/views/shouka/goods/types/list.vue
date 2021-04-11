<template>
  <div>
    <div class="button-group">
        <el-form ref="addForm" :inline="true" class="" style="margin-top:10px;margin-bottom:10px;padding : 0 0">
          <el-form-item >
            <el-input v-model="addForm.catalogName"  placeholder="分类名称" clearable />
          </el-form-item>
           <el-form-item >
            <el-input type="number" v-model="addForm.sort"  placeholder="排序" clearable min="0" />
          </el-form-item>
          <el-form-item>
           <el-button type="primary" size="small" @click.stop="addCatalog">添加分类</el-button>
          </el-form-item>
        </el-form>
    </div>
    <el-table
      stripe
      :data="list"
      :header-cell-style="{background:'#f5f5f5',color:'#606266'}"
      header-row-class-name="faka-table-header"
      style="width: 100%"
      v-loading="loading"
      border
    >
      <el-table-column prop="catalogName" align="center" label="分类名称"></el-table-column>
      <el-table-column prop="sort" label="排序" align="center"></el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-switch :active-value='1' :inactive-value='0' @change="updateState(scope.row)" v-model="scope.row.state"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="创建时间" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <!-- <el-button type="text" @click="toLink(1)">链接</el-button>
          <el-button type="text" @click="toGoods(1)">商品</el-button>
          <el-button type="text" @click="toCard(1)">库存卡</el-button> -->
          <el-button type="text" @click="toUpdate(scope.row.catalogID)">编辑</el-button>
          <el-button type="text" @click="del(scope.row.catalogID)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

     <div class="pagination-box">
      <el-pagination :current-page="searchForm.pageNum" :page-sizes="PageSizes" :page-size="searchForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
     </div>

    <el-dialog
      title="添加分类"
      :visible.sync="addDialog"
      width="30%">
      <add />
    </el-dialog>
    
    <el-dialog
      title="修改分类"
      :visible.sync="updateDialog"
      @closed="closeDialog('editForm')"
      width="30%">
      <el-form class="add-form" ref="editForm" :model="editForm" :rules="rules" label-width="120px">
      <el-form-item label="分类名称" prop="catalogName">
        <el-input v-model="editForm.catalogName" clearable />
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-switch :active-value='1' :inactive-value='0'  v-model="editForm.state"></el-switch>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input type="number" v-model="editForm.sort" clearable />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="updateCatalog('editForm')">确定</el-button>
      </el-form-item>
    </el-form>
    </el-dialog>
    
    <el-dialog
      title="链接"
      :visible.sync="linkDialog"
      width="50%">
      <link-com />
    </el-dialog>

    <!-- 删除 -->
    <el-dialog title="确认删除" :visible.sync="delDialog" width="30%" >
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialog = false">取 消</el-button>
        <el-button type="primary" @click="delConfirm" :loading="delConfirmLoading">确 定</el-button>
      </span>
    </el-dialog>
    
  </div>
</template>

<script>
import add from './add'
import update from './update'
import linkCom from './link'
import request from '@/utils/request';
export default {
  data() {
    return {
      rules:{
        catalogName:[
          { required: true, message: '请输入', trigger: 'blur' },
        ], 
        sort:[
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        state:[
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      },
      state:true,
      addForm:{},
      list: [],
      loading: false,
      addDialog: false,
      updateDialog: false,
      linkDialog: false,
      searchForm: {
        pageNum:1,
        pageSize:20
      },
      total:0,
      delDialog:false,
      delCatalogID:'',
      delConfirmLoading:false,
      editForm:{}
    };
  },
  components: {
    add,
    update,
    linkCom
  },
  methods: {
    //获取目录
    getList(){
        request({
        url: '/goods/catalogFaka/page',
        method: 'POST',
        data:this.searchForm,
        transformRequest: request.transformRequest
      }).then(res=>{
        this.list = res.body.records
        this.total = res.body.total
      })
    },
    //删除
    del(catalogID){
      this.delCatalogID = catalogID;
      this.delDialog = true;
    },
    //确认删除
    delConfirm(){
      this.delConfirmLoading = true;
       request({
        url: '/goods/catalogFaka/delete',
        method: 'GET',
        params:{id:this.delCatalogID},
        transformRequest: request.transformRequest
      }).then(res=>{
        this.delDialog = false;
        this.delConfirmLoading = false;
        if(res.code === 1001){
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'success'
          });
        }else{
           this.$message({
            showClose: true,
            message:res.msg,
            type: 'error'
          });
        }
        this.getList();
      })
    },
    //添加目录
    addCatalog(){
      if(this.addForm.catalogName == null || this.addForm.catalogName ==''){
        this.$message({
            showClose: true,
            message:'请输入',
            type: 'error'
          });
          return;
      }
      this.addForm.state = 1
      request({
        url: '/goods/catalogFaka/add',
        method: 'POST',
        data:this.addForm,
        transformRequest: request.transformRequest
      }).then(res=>{
        this.addForm = {}
        if(res.code === 1001){
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'success'
          });
        }else{
           this.$message({
            showClose: true,
            message:res.msg,
            type: 'error'
          });
        }
        this.getList();
      })
    },
    //更新状态
    updateState(data){
      request({
      url: '/goods/catalogFaka/updateStateBatch',
      method: 'POST',
      data:{ids:data.catalogID,state:data.state},
      transformRequest: request.transformRequest
      }).then(res=>{
        console.log(res)
        if(res.code !== 1001){
           this.$message({
            showClose: true,
            message:res.msg,
            type: 'error'
          });
          this.getList();
        }
      })
    },
    search() {

    },
    toAdd() {
      this.addDialog = true
    },
    toLink(typeId) {
      this.linkDialog = true
    },
    toGoods(typeId) {
      this.$router.push({ path: '/goodsManager/goods', query: { typeId }})
    },
    toCard(typeId) {
      this.$router.push({ path: '/cardManager/card', query: { typeId }})
    },
    toUpdate(id) {
      request({
        url: '/goods/catalogFaka/get',
        method: 'GET',
        params:{id:id},
        transformRequest: request.transformRequest
      }).then(res=>{
        if(res.code === 1001){
          this.editForm = res.body
          this.updateDialog = true
        }else{
           this.$message({
            showClose: true,
            message:'未知错误',
            type: 'error'
          });
        }
      })
    
    },
    toDelete(typeId) {
    },

     // 每页数量改变
    handleSizeChange(val) {
      this.searchForm.pageSize = val
      this.searchForm.pageNum = 1
      this.getList();
    },
    // 当前页面改变
    handleCurrentChange(val) {
      this.searchForm.pageNum = val
      this.getList()
    },

    closeDialog(form){
      this.updateDialog = false
      this.$refs[form].resetFields();
    },

    //更新
    updateCatalog(formName){
       this.$refs[formName].validate(valid=>{
         if(valid){
           delete this.editForm.updateTime
            request({
              url: '/goods/catalogFaka/update',
              method: 'POST',
              data:this.editForm,
              transformRequest: request.transformRequest
            }).then(res=>{
              this.updateDialog =false
              if(res.code == 1001){
                 this.$message({
                  showClose: true,
                  message:res.msg,
                  type: 'success'
                });
              }else{
                this.$message({
                  showClose: true,
                  message:res.msg,
                  type: 'error'
                });
              }
              this.getList();
            })
         }
       })
    }
  },
  mounted(){
    this.getList();
  }
};
</script>

<style scoped>
.button-group {
  margin-bottom: 15px;
}
</style>