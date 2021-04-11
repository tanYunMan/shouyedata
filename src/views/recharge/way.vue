<template>
  <div class="container menu2-1-container">
    <div class="filter-wrap">
      <el-button type="success" size="small" @click.stop="dialogVisible = true">新增方式</el-button>
    </div>
    <el-table :data="dataList" style="width: 100%;margin-top:30px;" border size="mini">
       <el-table-column :show-overflow-tooltip="true" align="center" label="编号" prop="rechargeModeID" width="140px" />
       <el-table-column :show-overflow-tooltip="true" align="center" label="充值方式名称" prop="rechargeName" width="140px" />
       <el-table-column :show-overflow-tooltip="true" align="center" label="图片" prop="rechargeImg" width="180px">
        <template slot-scope="scope">
          <span v-if="scope.row.rechargeImg">
            <el-image
              style="height: 50px"
              :src="scope.row.rechargeImg"
              :preview-src-list="scope.row.imgArr"
            />
          </span>
          <span v-else>无</span>
        </template>
      </el-table-column>
       <el-table-column :show-overflow-tooltip="true" align="center" label="充值类型" prop="rechargeType" width="140px">
        <template slot-scope="scope">
          <span>{{ scope.row.rechargeType == 1 ? 'PC' : '移动' }}</span>
        </template>
      </el-table-column>
       <el-table-column :show-overflow-tooltip="true" align="center" label="充值标识" prop="rechargeKey" width="140px" />
       <el-table-column :show-overflow-tooltip="true" align="center" label="状态" prop="rechargeState" width="140px">
        <template slot-scope="scope">
          <span>{{ scope.row.rechargeState == 1 ? '启用' : '禁用' }}</span>
        </template>
      </el-table-column>
       <el-table-column :show-overflow-tooltip="true" align="center" label="操作" width="160px">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click.stop="_det(scope.row)">编辑</el-button>
          <el-button size="mini" type="text" @click.stop="_del(scope.row.rechargeModeID)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-box">
      <el-pagination
        :current-page="page"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog width="70%" :title="form.rechargeModeID ? '修改充值方式' : '新增充值方式' " :visible.sync="dialogVisible">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="充值名称" label-width="120px" prop="rechargeName">
          <el-input v-model="form.rechargeName" style="width:250px" size="small" />
        </el-form-item>
        <el-form-item label="图片" label-width="120px">
          <Upload :img-list="form.rechargeImg" img-name="图片" @listenTochildEvent="showMessageFromChild" />
        </el-form-item>
        <el-form-item label="状态" label-width="120px">
          <el-radio-group v-model="form.rechargeType">
            <el-radio label="1">PC</el-radio>
            <el-radio label="2">移动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="充值标识" label-width="120px" prop="rechargeKey">
          <el-input v-model="form.rechargeKey" style="width:250px" size="small" />
        </el-form-item>
        <el-form-item label="状态" label-width="120px">
          <el-radio-group v-model="form.rechargeState">
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button size="small" style="float:right;margin-left:20px;" type="primary" @click="save('form')" :loading="loadingButton">{{ form.siteID ? "立即保存" : "立即创建" }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Upload from '@/components/Upload'
import { getLists,getDatas,postApplicationJson } from '@/api/price/price-1/common'
export default {
  components: {
    Upload
  },
  data() {
    return {
      dataList: [],
      total: 0,
      page: 1,
      size: 10,
      form: {
        rechargeModeID: '',
        rechargeName: '',
        rechargeImg: '',
        rechargeType: '1',
        rechargeKey: '',
        rechargeState: '1'
      },
      dialogVisible: false,
      rules: {
        rechargeName: [
          { required: true, message: '请输入充值名称', trigger: 'blur' }
        ],
        rechargeKey: [
          { required: true, message: '请输入充值标识', trigger: 'blur' }
        ]
      },
      queryParams:{
        pageNum:1,
        pageSize:10
      },
      loading: false,
      loadingButton:false
    }
  },
  watch: {
    dialogVisible() {
      if (!this.dialogVisible) {
        this.cancel()
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      getLists(this.queryParams,'/finance/rechargeMode/page').then(res => {
        if (res.code===1001){
          const imgArr = []
          res.body.records.forEach(el => {
            if (el.rechargeImg) {
              imgArr.push(el.rechargeImg)
            }
            el.imgArr = imgArr
          })
          this.dataList = res.body.records
          this.total = res.body.total
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },
    _det(row) {
      this.form = {
        rechargeModeID: row.rechargeModeID,
        rechargeName: row.rechargeName,
        rechargeImg: row.rechargeImg || '',
        rechargeType: row.rechargeType,
        rechargeKey: row.rechargeKey,
        rechargeState: row.rechargeState
      }
      this.dialogVisible = true
    },
    _del(id) {
      var _this = this
      _this.$confirm('确定删除该条数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        getDatas({id: id},'/finance/rechargeMode/delete').then(res => {
            if (res.code==1001){
                _this.$message({
                  message: '操作成功！',
                  type: 'success'
                })
                this.getList()
            }else{
              _this.$message({
                message: res.msg,
                type: 'error'
              })
            }
        }).catch(err => {
        })

      })
    },
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loadingButton = true
          getLists({...this.form},this.form.rechargeModeID ? '/finance/rechargeMode/update' : '/finance/rechargeMode/add').then(res => {
            if (res.code==1001){
                this.$message({
                    message: '操作成功！',
                    type: 'success'
                })
                this.getList()
                this.dialogVisible = false
                this.cancel()
            }else{
                this.$message({
                    message: res.msg,
                    type: 'error'
                })
            }
            setTimeout(()=>{
                this.loadingButton = false
            },1200)
        }).catch(err => {
            this.loadingButton = false
        })
        } else {
          return false
        }
      })
    },
    cancel() {
      this.form = {
        rechargeModeID: '',
        rechargeName: '',
        rechargeImg: '',
        rechargeType: 1,
        rechargeKey: '',
        rechargeState: 1
      }
      this.$refs['form'].resetFields()
    },
    // 上传图片返回的信息
    showMessageFromChild(data) {
      this.form = {
        ...this.form,
        rechargeImg: data
      }
    },
    // 每页数量改变
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.queryParams.pageNum = 1
      this.getList()
    },
    // 当前页面改变
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getList()
    },
  }
}
</script>

<style lang="scss" scoped>
    .app-container {
        .roles-table {
            margin-top: 30px;
        }
        .permission-tree {
            margin-bottom: 30px;
        }
    }
    .table-img{
        width: 80px;
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
