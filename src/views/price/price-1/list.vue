<template>
  <div class="container menu6-1-container">
    <div class="filter-wrap">
      <el-button type="primary" @click="addLevel(null)">新增价格组</el-button>
    </div>
    <el-table border row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266','text-align':'center'}" size="mini" :cell-style="{'text-align':'center'}">
       <el-table-column :show-overflow-tooltip="true" prop="levelPriceGroupID" label="编号"  ></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="levelPriceGroupName" label="价格组名称"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label10" label="操作"  fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="addLevel(scope.row)">编辑</el-button>
          <el-button type="text" size="mini" @click="delLevel(scope.row.levelPriceGroupID)">删除</el-button>
          <el-button type="text" size="mini" @click="setPrice(scope.row)">定价</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"  :page-sizes="[10, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>

    <!-- 新增价格组/编辑 -->
    <el-dialog :title="addEdit" :visible.sync="dialog1" class="wl-dialog-style" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="formRules" label-width="140px">
        <el-form-item label="价格组名称" prop="levelPriceGroupName">
          <el-input v-model="form.levelPriceGroupName" placeholder="请输入价格组名称" style="max-width:350px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDilog('form')">取 消</el-button>
        <el-button type="primary" @click="goSetLevel('form')">确 定</el-button>
      </span>
    </el-dialog>



    <!-- 定价操作 -->
    <el-dialog title="价格组定价" :visible.sync="setPriceDialog"  class="setPriceDialog" :close-on-click-modal="false">
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
        <el-button type="primary" @click="goSetPrice" :loading="delConfirmLoading">确 认 定 价</el-button>
      </span>
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
import Tinymce from '@/components/Tinymce'
import { getList,goSetLevel,deleteData } from '@/api/price/price-1/index'
import { getLists,getDatas,postApplicationJson } from '@/api/price/price-1/common'
export default {
  data() {
    return {
      color:'#333',
      addEdit: '新增价格组',
      form:{},
      delDialog: false,
      setPriceDialog: false,
      dialog1:false,
      delConfirmLoading: false,
      delIds:'',
      currentPage:1,
      total:0,
      tableData: [],
      multipleSelection: [],
      queryParams:{
        pageNum:1,
        pageSize:10
      },
      userLevel:[],   // 用户级别
      userLevelList:[],   // 用户级别--使用
      formRules: {
        levelPriceGroupName: [
          { required: true, message: '请输入价格组名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
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

    // 获取用户等级列表
    getList() {
      this.loading = true
      getList(this.queryParams).then(res => {
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
    delLevel(id) {
      this.delIds = id
      this.delDialog = true
    },
    delConfirm (){
      this.delConfirmLoading = true
      deleteData({id:this.delIds}).then(res => {
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
        this.addEdit = "新增价格组"
        if (data) {
          this.addEdit = "编辑价格组"
          this.form = {levelPriceGroupID:data.levelPriceGroupID,levelPriceGroupName:data.levelPriceGroupName}
        }
    },

    // 新增编辑
    goSetLevel(form){
      let url 
      if(this.form.levelPriceGroupID) {
        url = '/site/levelPriceGroup/update'
      } else {
        url = '/site/levelPriceGroup/add'
      }
      this.$refs[form].validate(async valid => {
        if (!valid) return null  // 如果验证失败就不往下继续执行
          goSetLevel(this.form,url).then(res => {
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
            levelPriceGroupID:val.levelPriceGroupID,
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
      console.log(this.userLevelList)
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
            levelPriceGroupID:item.levelPriceGroupID,
            levelName:item.levelName,
            sort:item.sort
          }
          newData.push(newDataSubset)
      })

      this.delConfirmLoading = true
      postApplicationJson(newData,'/site/levelPriceGroup/savePrice').then(res => {
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
  .filter-wrap {
    margin-top:20px;
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
  .handle-wrap {
    // margin-top:20px;
    margin-bottom:20px;
  }
  
}
</style>