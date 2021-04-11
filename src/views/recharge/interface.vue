<template>
  <div class="container menu2-1-container">
    <div class="filter-wrap">
      <el-button type="success" size="small" @click.stop="dialogVisible = true">新增接口</el-button>
    </div>
    <el-table v-loading="loading" :data="dataList" style="width: 100%;margin-top:30px;" border size="mini">
      <el-table-column :show-overflow-tooltip="true" align="center" label="编号" prop="rechargeAttrID" width="140px" />
      <el-table-column :show-overflow-tooltip="true" align="center" label="充值属性" prop="attrJson" min-width="400px" />
      <el-table-column :show-overflow-tooltip="true" align="center" label="充值标识" prop="rechargeKey" width="140px" />
      <el-table-column :show-overflow-tooltip="true" align="center" label="充值费率" prop="rechargeRate" width="140px" />
      <el-table-column :show-overflow-tooltip="true" align="center" label="最低费用" prop="rechargeCost" width="140px" />
      <el-table-column :show-overflow-tooltip="true" align="center" label="状态" prop="rechargeState" width="140px">
        <template slot-scope="scope">
          <span>{{ scope.row.state == 1 ? '启用' : '禁用' }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" label="操作" width="300px">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click.stop="_det(scope.row)">编辑</el-button>
          <!-- <el-button size="mini" type="text" @click.stop="_rate(scope.row.rechargeAttrID)">费率设置</el-button> -->
          <el-button size="mini" type="text" @click.stop="_del(scope.row.rechargeAttrID)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-box">
      <el-pagination :current-page="page" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <el-dialog width="70%" :title="form.rechargeAttrID ? '修改接口' : '新增接口' " :visible.sync="dialogVisible">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="充值标识" label-width="120px" prop="rechargeKey">
          <el-select v-model="form.rechargeKey" style="width:250px" size="small" placeholder="请选择充值标识" filterable @change="changeKey">
            <el-option v-for="item in rechargeMode" :key="item.rechargeKey" :label="item.rechargeName" :value="item.rechargeKey" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" label-width="120px">
          <el-radio-group v-model="form.state">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="充值费率" label-width="120px" prop="rechargeRate">
          <el-input-number v-model="form.rechargeRate" style="width:250px" size="small" controls-position="right" :min="0" :max="100" />
        </el-form-item>
        <el-form-item label="最低费用" label-width="120px" prop="rechargeCost">
          <el-input-number v-model="form.rechargeCost" style="width:250px" size="small" controls-position="right" :precision="2" :step="0.01" :min="0" />
        </el-form-item>
        <el-form-item label="充值属性" label-width="120px">
          <div v-for="(item,index) in rateArr" :key="index" style="margin-bottom:10px;">
            <el-input v-model="item.key" placeholder="属性" style="width:300px" size="small" />
            ：
            <el-input v-model="item.value" placeholder="属性值" style="width:300px" size="small" />
            <el-button v-if="item.del!==0" type="text" size="medium" style="position:relative;" @click="reduceone(index)">
              <i class="el-icon-close" style="position:absolute;left: 0;bottom: 0px;" />
            </el-button>
          </div>
          <div v-if="rateArr && rateArr.length < 10">
            <el-button size="small" type="text" style="color:#67c23a" @click="addone()">新增 + </el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button size="small" style="float:right;margin-left:20px;" type="primary" :loading="loadingButton" @click="save('form')">{{ form.rechargeAttrID ? "立即保存" : "立即创建" }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog width="50%" title="设置费率" :visible.sync="rateVisible">
      <el-form ref="rateForm" :model="rateForm" :rules="rules">

        <el-form-item label="充值费率" label-width="120px" prop="rechargeRate">
          <el-input-number v-model="rateForm.rechargeRate" style="width:150px" size="small" controls-position="right" :min="0" :max="100" /> %
        </el-form-item>
        <el-form-item label="最低费用" label-width="120px" prop="rechargeCost">
          <el-input-number v-model="rateForm.rechargeCost" style="width:150px" size="small" controls-position="right" :precision="2" :step="0.01" :min="0" />
        </el-form-item>
        <el-form-item>
          <el-button size="small" style="float:right;margin-left:20px;" type="primary" @click="saveRate('rateForm')">立即保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getLists, getDatas, postApplicationJson } from '@/api/price/price-1/common'
export default {
  data() {
    return {
      dataList: [],
      total: 0,
      page: 1,
      size: 10,
      rechargeMode: [],
      loading: false,
      loadingButton: false,
      dialogVisible: false,
      rules: {
        rechargeKey: [
          { required: true, message: '请选择充值标识', trigger: 'change' }
        ],
        rechargeRate: [
          { required: true, message: '请输入充值费率', trigger: 'blur' }
        ],
        rechargeCost: [
          { required: true, message: '请输入最低费用', trigger: 'blur' }
        ]

      },
      form: {
        rechargeAttrID: '',
        attrJson: {},
        rechargeKey: '',
        state: 1,
        rechargeRate: 0,
        rechargeCost: 0,
        rechargeField: []
      },
      rateArr: [{ key: '', value: '' }],
      rateVisible: false,
      rateForm: {
        rechargeRate: 0,
        rechargeCost: 0
      },
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      attrJson: {},
      newArr: []
    }
  },
  watch: {
    dialogVisible() {
      if (!this.dialogVisible) {
        this.cancel()
      }
    },
    rateVisible() {
      if (!this.rateVisible) {
        this.rateForm = {
          rechargeRate: 0,
          rechargeCost: 0
        }
        this.$refs['rateForm'].resetFields()
      }
    }
  },
  mounted() {
    this.getList()
    this.getRechargeMode()
  },
  methods: {
    getList() {
      this.loading = true
      getLists(this.queryParams, '/finance/rechargeAttr/page').then(res => {
        if (res.code === 1001) {
          this.dataList = res.body.records
          this.total = res.body.total
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },

    getRechargeMode() {
      const _this = this
      getDatas({}, '/finance/rechargeMode/list').then(res => {
        if (res.code === 1001) {
          _this.rechargeMode = res.body
        }
      })
    },
    // 切换标识
    changeKey(e) {
      const _this = this
      const index = _this.rechargeMode.find(res => (res.rechargeKey == e))
      const item = JSON.parse(index.rechargeField)
      _this.rateArr = []
      _this.newArr = []
      console.log(item)
      for (const key in item) {
        if (item[key] === '') {
          _this.rateArr.push({
            key: key,
            value: item[key],
            del: 0
          })
        } else {
          _this.newArr.push({
            key: key,
            value: item[key]

          })
        }
      }
      console.log(_this.rateArr)
    },
    // 充值属性数据处理
    handleData(attrJson, row) {
      let rechargeField = []
      const rateArr = []
      this.rechargeMode.forEach(item => {
        if (row.rechargeKey == item.rechargeKey) {
          rechargeField = item.rechargeField
        }
      })
      let ishas = false
      for (const key in attrJson) {
        rateArr.push({
          key: key,
          value: attrJson[key]
        })
      }
      rechargeField.forEach(item => {
        for (const key in attrJson) {
          if (key == item) {
            ishas = true
            break
          } else {
            ishas = false
          }
        }
        if (!ishas) {
          rateArr.push({
            key: item,
            value: ''
          })
        }
      })
      return rateArr
    },
    _det(row) {
      this.attrJson = JSON.parse(row.attrJson)
      // const rateArr = this.handleData(this.attrJson, row)
      for (const key in this.attrJson) {
        this.rateArr.push({
          key: key,
          value: this.attrJson[key],
          del: 0
        })
      }
      // for (const key in attrJson) {
      //   rateArr.push({
      //     key: key,
      //     value: attrJson[key]
      //   })
      // }
      // this.rateArr = rateArr
      this.form = {
        rechargeAttrID: row.rechargeAttrID,
        attrJson: {},
        rechargeKey: row.rechargeKey,
        state: row.state,
        rechargeRate: row.rechargeRate,
        rechargeCost: row.rechargeCost
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
        getDatas({ id: id }, '/finance/rechargeAttr/delete').then(res => {
          if (res.code == 1001) {
            _this.$message({
              message: '操作成功！',
              type: 'success'
            })
            this.getList()
          } else {
            _this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      })
    },
    addone() {
      this.rateArr.push({
        key: '',
        value: ''
      })
    },
    reduceone(index) {
      this.rateArr.splice(index, 1)
    },
    cancel() {
      this.form = {
        rechargeAttrID: '',
        attrJson: {},
        rechargeKey: '',
        state: 1
      }
      this.rateArr = [{ key: '', value: '' }]
      this.$refs['form'].resetFields()
    },
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.rateArr && this.rateArr.length) {
            this.rateArr.forEach((el, index) => {
              this.form.attrJson[el.key] = el.value
            })
          }
          if (this.newArr && this.newArr.length) {
            this.newArr.forEach((el) => {
              this.form.attrJson[el.key] = el.value
            })
          }

          const data = {
            state: this.form.state,
            rechargeKey: this.form.rechargeKey,
            attrJson: JSON.stringify(this.form.attrJson),
            rechargeRate: this.form.rechargeRate,
            rechargeCost: this.form.rechargeCost
          }
          if (this.form.rechargeAttrID) {
            data.rechargeAttrID = this.form.rechargeAttrID
          }
          this.loadingButton = true
          getLists({ ...data }, this.form.rechargeAttrID ? '/finance/rechargeAttr/update' : '/finance/rechargeAttr/add').then(res => {
            if (res.code == 1001) {
              this.$message({
                message: '操作成功！',
                type: 'success'
              })
              this.getList()
              this.dialogVisible = false
              this.cancel()
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
            setTimeout(() => {
              this.loadingButton = false
            }, 1200)
          }).catch(() => {
            this.loadingButton = false
          })
        } else {
          return false
        }
      })
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
    _rate(id) { // 暂时无用
      // this.GET(
      //   '/finance/rechargeRate/get',
      //   {
      //     id: id
      //   },
      //   data => {
      //     this.rateVisible = true
      //     if (data.body) {
      //       this.rateForm.rechargeRate = data.body.rechargeRate
      //       this.rateForm.rechargeCost = data.body.rechargeCost
      //     }
      //   }
      // )
    },
    saveRate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.rateForm.rechargeRate) {
            this.$message.error('请输入充值费率')
            return
          }
          if (!this.rateForm.rechargeCost) {
            this.$message.error('请输入最低费用')
            return
          }
          // this.POST(
          //   '/finance/rechargeRate/add',
          //   this.rateForm,
          //   data => {
          //     if (data.code == 1001) {
          //       this.$message({
          //         message: '操作成功！',
          //         type: 'success'
          //       })
          //       this.rateVisible = false
          //     }
          //   }
          // )
        } else {
          return false
        }
      })
    }
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
.table-img {
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
