<template>
  <div class="container menu6-1-container">
    <div class="filter-wrap">
      <el-button type="primary" @click="addLevel(null)">新增定价范围</el-button>
    </div>
    <el-table border row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266','text-align':'center'}" size="mini" :cell-style="{'text-align':'center'}" >
       <el-table-column :show-overflow-tooltip="true" prop="priceRangeID" label="编号"  ></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="beginPrice" label="定价范围启始值"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="endPrice" label="定价范围终止值"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label10" label="操作"  fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="mini" :disabled="scope.row.del" @click="addLevel(scope.row)">编辑</el-button>
          <el-button type="text" size="mini" :disabled="scope.row.del" @click="delLevel(scope.row.priceRangeID)">删除</el-button>
          <el-button type="text" size="mini" @click="setPrice(scope.row)">定价</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"  :page-sizes="[10, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>

    <!-- 定价范围 -->
    <el-dialog :title="addEdit" :visible.sync="dialog1"  class="dialog1" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="formRules" label-width="140px">
        <el-form-item label="定价范围启始值" prop="beginPrice">
          <el-input-number v-model="form.beginPrice" style="width:300px" :disabled="form.isStart" controls-position="right" placeholder="请输入定价范围启始值" :min="0" :precision="2" /><span style="margin-left:15px;">元</span>
        </el-form-item>
        <el-form-item label="定价范围终止值" prop="endPrice">
          <el-input-number v-model="form.endPrice" style="width:300px" controls-position="right" placeholder="请输入定价范围终止值" :min="0" :precision="2"/><span style="margin-left:15px;">元</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDilog('form')">取 消</el-button>
        <el-button type="primary" @click="goSetLevel('form')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除 -->
    <el-dialog title="确认删除" :visible.sync="delDialog" width="30%" > 
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialog = false">取 消</el-button>
        <el-button type="primary" @click="delConfirm" :loading="delConfirmLoading">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 定价操作 -->
    <el-dialog title="范围价格定价" :visible.sync="setPriceDialog"  class="setPriceDialog" :close-on-click-modal="false">
      <el-table border row-key="levelID" ref="multipleTable" :data="userLevelList" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266','text-align':'center'}" size="mini" :cell-style="{'text-align':'center'}">
         <el-table-column :show-overflow-tooltip="true" prop="levelID" label="会员编号" ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="levelName" label="会员等级"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="sort" label="排序"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label3" label="操作" min-width="60%">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.levelPrice" style="width:120px" :precision="2" :step="1" :min="0" :max="9999.99" @change="changeLevelPrice(scope.row)" controls-position="right"></el-input-number>
            <span style="margin-left:15px;">元</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setPriceDialog = false">取 消</el-button>
        <el-button type="primary" @click="goSetPrice('formPrice')" :loading="delConfirmLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { getList,getLists,getData,getDatas,postApplicationJson } from '@/api/price/price-1/common'
export default {
  data() {
    let endPrice = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入定价范围终止值'));
        } else if(value<0){
          callback(new Error('输入金额不能小于0'));
        } else if (value <= this.form.beginPrice) {
          callback(new Error('终止值必须大于启始值!'));
        } else {
          callback();
        }
    };
    return {
      color:'#333',
      addEdit: '新增定价范围',
      form:{},
      delDialog: false,
      dialog1:false,
      delConfirmLoading: false,
      setPriceDialog: false,
      delIds:'',
      currentPage:1,
      total:0,
      tableData: [],
      userLevel: [], //用户级别
      userLevelList:[],   // 用户级别--使用
      multipleSelection: [],
      queryParams:{
        pageNum:1,
        pageSize:10
      },
      formPrice:{},//定价
      formRules: {
        beginPrice: [
          { required: true, message: '请输入升级金额', trigger: 'blur' }
        ],
        endPrice: [
          { required: true, message: '请输入定价范围终止值', trigger: 'blur' },
          { validator: endPrice, trigger: 'blur' }
        ],
        levelID: [
          { required: true, message: '请选择客户级别', trigger: 'blur' }
        ],
        levelPrice: [
          { required: true, message: '请输入定价价格', trigger: 'blur' },
          {
            validator(rule, value, callback) {
              if (Number(value) && Number(value) > 0 && Number(value) <= 9999.99) {
                callback()
              } else {
                callback(new Error('请输入正确的价格（大于0，小于9999）'))
              }
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  components: {
    Tinymce
  },
  mounted() {
    this.getList()
    this.getUserLevel()
  },
  methods: {

    closeDilog(form) {
      this.dialog1 = false;
      this.$refs[form].resetFields() // 将form表单重置
    },

    // 获取用户级别
    getUserLevel () {
      getDatas({},'/site/userLevel/list').then(res => {
        if (res.code===1001){
          this.userLevel = res.body
        }
      }).catch(err => {
      })
    },

    //  定价 操作
    setPrice(val) {
      this.userLevelList = []
      this.setPriceDialog = true
      let levelGroups = val.levelGroups

      let userLevelList = []

      this.userLevel.map(item => {
          let newDataSubset = {}
          newDataSubset = {
            levelPrice:item.levelPrice || 0,
            levelID:item.levelID,
            priceRangeID:val.priceRangeID,
            levelName:item.levelName,
            sort:item.sort
          }
          userLevelList.push(newDataSubset)
      })

      userLevelList.map(item => {
        if(levelGroups.length>0){
          levelGroups.map(items => {
            if(items.levelID === item.levelID){
              item.levelPrice = items.levelPrice
            }
          })
        }
      })


      this.userLevelList = userLevelList
      
    },

    // 修改定价金额
    changeLevelPrice(val){
      this.userLevelList.map(item => {
        if(item.levelID===val.levelID){
          item.levelPrice = val.levelPrice
        }
      })
    },


    // 判断等级价格
    judgePrice(data){
      for(let i=0;i<data.length-1;i++){
          if(data[i].levelPrice<data[i+1].levelPrice){
              this.$message({
                showClose: true,
                message: data[i].levelName+'的定价不能小于'+data[i+1].levelName+'的价格',
                type: 'error',
              });
              return false
              break;
          }
      }
      return true
    },

    // 确认定价操作
    goSetPrice () {
      this.judgePrice(this.userLevelList);
      if(!this.judgePrice(this.userLevelList)){return false}
      let newData = []
      this.userLevelList.map(item => {
          let newDataSubset = {}
          newDataSubset = {
            levelPrice:item.levelPrice || 0,
            levelID:item.levelID,
            priceRangeID:item.priceRangeID
          }
          newData.push(newDataSubset)
      })


      this.delConfirmLoading = true
      postApplicationJson(newData,'/site/priceRange/savePrice').then(res => {
        if (res.code===1001){
            this.$message({
              message: res.msg,
              type: 'success',
            });
            this.getList()
            this.setPriceDialog = false
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'error',
          });
        }
        this.delConfirmLoading = false
      }).catch(err => {
        this.setPriceDialog = false
        this.delConfirmLoading = false
      })
    },

    // 获取范围定价列表
    getList() {
      this.loading = true
      getLists(this.queryParams,'/site/priceRange/page').then(res => {
        if (res.code===1001){
          res.body && res.body.records.map((item,index)=>{
              if(index<res.body.records.length-1){
                item.del = true
              }
          })
          this.tableData = res.body.records
          this.total = res.body.total
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },

    // 删除
    delLevel(id) {
      this.delIds = id
      this.delDialog = true
    },
    delConfirm (){
      this.delConfirmLoading = true
      getData({id:this.delIds},'/site/priceRange/delete').then(res => {
        if (res.code===1001){
            this.$notify({
              title: res.msg,
              type: 'success'
            })
            this.getList()
        } else {
            this.$notify.error({
              title: res.msg
            })
        }
        this.delDialog = false
        this.delConfirmLoading = false
      }).catch(err => {
        this.delDialog = false
        this.delConfirmLoading = false
      })
    },
    // 新增-编辑级别
    addLevel(data) {
        this.form = {}
        this.dialog1 = true
        this.addEdit = "新增定价范围"
        console.log(this.tableData,77)
        let thisListData = this.tableData
        if(thisListData.length>0){
            thisListData.map((item,index)=>{
                if(data){//编辑
                    this.form = {priceRangeID:data.priceRangeID,beginPrice:data.beginPrice,isStart:true,endPrice:data.endPrice}
                }else{//新增
                    this.form = {beginPrice:thisListData[thisListData.length-1].endPrice,isStart:true}
                }
            })
        }
    },

    // 新增编辑
    goSetLevel(form){
      let url 
      if(this.form.priceRangeID) {
        url = '/site/priceRange/update'
      } else {
        url = '/site/priceRange/add'
      }
      this.$refs[form].validate(async valid => {
        if (!valid) return null  // 如果验证失败就不往下继续执行
          getLists(this.form,url).then(res => {
            if (res.code===1001){
                this.$message({
                  message: res.msg,
                  type: 'success',
                });
                this.getList()
            } else {
              this.$message({
                showClose: true,
                message: res.msg,
                type: 'error',
              });
            }
            this.dialog1 = false
          }).catch(err => {
            this.dialog1 = false
          })
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
    // float: right;
    // margin: 10px auto;
    margin-top: 10px;
    margin-left: auto;
    margin-bottom: 10px;

  }
  .handle-wrap {
    // margin-top:20px;
    margin-bottom:20px;
  }
  
}
</style>