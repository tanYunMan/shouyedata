<template>
  <div class="container menu2-1-container">
    <div class="filter-wrap">
      <!-- <el-button type="primary" @click="getOneLevel">对接一级目录</el-button> -->
      <el-button type="primary" @click="sureNowLevel">对接</el-button>
      <el-button type="primary" @click="checkall(1)">全选</el-button>
      <el-button type="primary" @click="checkall(0)">取消全选</el-button>
    </div>

    <!-- <el-table row-key="catalogID" ref="multipleTable" :data="listData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#eef1f6',color:'#606266'}" v-loading="loading" :tree-props="{children: 'children'}">
      //<el-table-column :show-overflow-tooltip="true" type="selection" > </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="catalogName" label="目录名称"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="catalogID" label="目录编号" align="center"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="sort" label="序号" align="center"> </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="test6" label="对接状态" align="center">
        <template slot-scope="scope">
          <el-button type="danger" plain size="mini" style="margin-left:0" v-show="scope.row.agentType == 0">禁止对接</el-button>
          <el-button type="warning" plain size="mini" style="margin-left:0" v-show="scope.row.agentType == 1">单次对接</el-button>
          <el-button type="primary" plain size="mini" style="margin-left:0" v-show="scope.row.agentType == 2">多次对接</el-button>
        </template>
      </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="test8" label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" v-show="!scope.row.parentID" @click="secondLevel(scope.row)" icon="el-icon-share">对接子级目录</el-button>
          <el-button type="text" size="mini" v-show="scope.row.parentID" icon="el-icon-share" @click="goGoodsList(scope.row)">对接目录商品</el-button>
        </template>
      </el-table-column>
    </el-table> -->

    <div :key="time" class="dir_project_box">
      <div v-for="(item, index) in listData" :key="index" class="dir_box">
        <div class="item_first_dir">
          <div class="first_txt">
            <span v-if="item.isAgent === 0 && item.agentType === 0" class="no_select_txt">{{ item.catalogName }}</span>
            <el-checkbox v-else v-model="item.isAgent === 1?true:item.selected" :disabled="item.isAgent === 1" :class="{red_txt: item.agentType === 2, green_txt: item.agentType === 1}" @change="changeCheckboxNow(item, 'first',index)">{{ item.catalogName }}</el-checkbox>
          </div>
          <div class="second_box">
            <div v-for="(items, indexs) in item.children" :key="indexs" class="second_txt">
              <span v-if="items.isAgent === 0 && items.agentType === 0" class="no_select_txt">{{ items.catalogName }}</span>
              <el-checkbox v-else v-model="items.isAgent === 1 ? true : items.selected" :disabled="items.isAgent === 1||items.isAgent === 2" :class="{red_txt: items.agentType === 2, green_txt: items.agentType === 1}" @change="changeCheckboxNow(items, 'second')">{{ items.catalogName }}</el-checkbox>
              <span class="txt_top" @click="goGoodsList(items)" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 一级目录对接-->
    <!-- <el-dialog title="对接一级目录" :visible.sync="dialog1" class="dialog1" :close-on-click-modal="false">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="选择目录：">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="oneLevel in listData" :label="oneLevel.catalogID" :key="oneLevel.catalogID">{{oneLevel.catalogName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog1 = false">取 消</el-button>
        <el-button type="primary" @click="goOneLevel" :loading="confirmLoading">确 定</el-button>
      </span>
    </el-dialog> -->

    <el-dialog title="提示" :visible.sync="dialog1" width="30%">
      <span>确认对接一级目录吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog1 = false">取 消</el-button>
        <el-button type="primary" @click="goOneLabel">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 二级目录对接-->
    <!-- <el-dialog title="对接二级目录" :visible.sync="dialog2" class="dialog1" :close-on-click-modal="false">
      <el-form :model="ruleForm" ref="ruleForm" label-width="160px">
        <el-form-item label="本地目录">
          <el-select v-model="ruleForm.catalogID" placeholder="请选择本地目录">
            <el-option
              v-for="item in localCatalogData"
              :key="item.catalogID"
              :label="item.catalogName"
              :value="item.catalogID">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="选择对接目录：">
          <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="data in secondLevelData" :label="data.catalogID" :key="data.catalogID" :disabled = "data.isAgent===1">{{data.catalogName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog2 = false">取 消</el-button>
        <el-button type="primary" @click="goSecondLevel" :loading="confirmLoading">确 定</el-button>
      </span>
    </el-dialog> -->

    <el-dialog title="对接二级目录" :visible.sync="dialog2" class="dialog1" :close-on-click-modal="false">
      <el-form ref="ruleForm" :model="ruleForm" label-width="160px">
        <el-form-item label="本地目录">
          <el-select v-model="ruleForm.catalogID" placeholder="请选择本地目录">
            <el-option v-for="item in localCatalogData" :key="item.catalogID" :label="item.catalogName" :value="item.catalogID" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog2 = false">取 消</el-button>
        <el-button type="primary" :loading="confirmLoading" @click="goSecondLabel">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 对接商品 -->
    <el-dialog title="对接商品" :visible.sync="dialog3" class="dialog1" :close-on-click-modal="false">
      <el-form ref="ruleForm" :model="ruleForm" label-width="160px">
        <el-form-item label="本地目录">
          <!-- <el-select v-model="ruleForm.catalogID" placeholder="请选择本地目录">
            <el-option
              v-for="item in localCatalogData"
              :key="item.catalogID"
              :label="item.catalogName"
              :value="item.catalogID">
            </el-option>
          </el-select> -->
          <el-cascader v-model="ruleForm.catalogID" :options="recombinationData" :props="optionProps">
            <template slot-scope="{ data }">
              <span>{{ data.catalogName }}</span>
            </template>
          </el-cascader>
        </el-form-item>
      </el-form>

      <el-table ref="goodsListTable" border row-key="goodsID" :data="goodsList" style="width: 100%" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" @selection-change="handleSelectionChangeGoods">
        <el-table-column :show-overflow-tooltip="true" type="selection" :selectable="isDisabled" />
        <el-table-column :show-overflow-tooltip="true" prop="goodsCode" label="编号" />
        <el-table-column :show-overflow-tooltip="true" prop="goodsName" label="商品名称" min-width="400px" />
        <el-table-column :show-overflow-tooltip="true" prop="test6" label="对接状态" align="center">
          <template slot-scope="scope">
            <el-button v-show="scope.row.agentType == 0" type="danger" plain size="mini" style="margin-left:0">禁止对接</el-button>
            <el-button v-show="scope.row.agentType == 1" type="warning" plain size="mini" style="margin-left:0">单次对接</el-button>
            <el-button v-show="scope.row.agentType == 2" type="primary" plain size="mini" style="margin-left:0">多次对接</el-button>
          </template>
        </el-table-column>

      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog3 = false">取 消</el-button>
        <el-button type="primary" :loading="confirmLoading" @click="goGoods">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
// import Tinymce from '@/components/Tinymce'
import { getLists, getDatas } from '@/api/price/price-1/common'
export default {
  components: {
    //  Tinymce
  },
  data() {
    return {
      optionProps: {
        value: 'catalogID',
        label: 'catalogName'
      },
      type: 1,
      color: '#333',
      form: {},
      ruleForm: {},
      dialog1: false, // 是否展示一级目录
      dialog2: false, // 是否展示二级目录
      dialog3: false, // 是否对接商品
      currentPage: 1,
      tableData: [],
      queryParams: {},
      checkList: [],
      listData: [],
      listDatas: [],
      loading: true,
      multipleSelection: [],
      goodsUpData: [], // 对接商品选择的商品ID
      isIndeterminate: false, // 操作一级目录
      checkAll: false, // 操作一级目录
      checkedCities: [], // 操作一级目录
      confirmLoading: false,
      localCatalogData: [], // 本地目录
      secondLevelData: [],
      recombinationData: [], // 重组数据--本地目录
      goodsList: [], // 可对接商品
      firstLabelData: [], // 一级选中的菜单
      secondLabelData: [], // 二级选中的菜单
      time: new Date().getTime()
    }
  },
  mounted() {
    if (this.$route.params && this.$route.params.id) {
      this.queryParams = {
        siteID: this.$route.params.id
      }
      this.getList()
      this.localCatalog()
      this.getCatalogTree()
    }
  },
  methods: {
    // 获取目录列表
    getList() {
      this.loading = true
      getDatas(this.queryParams, '/goods/catalog/agentTree').then(res => {
        if (res.code === 1001) {
          // res.body.map(item => {
          //     item.hasChildren = true
          // })
          // this.listData = JSON.parse(JSON.stringify(res.body))
          const data = JSON.parse(JSON.stringify(res.body))
          const lastArr = []
          data.forEach((i, oi) => {
            if (oi < 30) {
              this.listData.push(i)
            } else {
              lastArr.push(i)
            }
          })
          console.log(new Date().getTime() - this.time)
          setTimeout(() => {
            this.listData = [...this.listData, ...lastArr]
          }, 1000)
          this.listDatas = JSON.parse(JSON.stringify(res.body))
          this.firstLabelData = []
          this.secondLabelData = []
          this.loading = false
        }
      }).catch(err => {

      })
    },

    // 获取本地目录
    localCatalog() {
      getDatas({}, '/goods/catalog/catalogList').then(res => {
        if (res.code === 1001) {
          this.localCatalogData = res.body
        }
      }).catch(err => {

      })
    },

    // 获取一级目录
    getOneLevel() {
      this.dialog1 = true
      this.confirmLoading = false
      this.checkAll = false
      this.checkedCities = []
    },

    handleCheckAllChange(val) {
      this.checkedCities = []
      if (val) {
        const catalogID = []
        this.listData.map(item => {
          catalogID.push(item.catalogID)
        })
        this.checkedCities = catalogID
      }
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.listData.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.listData.length
    },

    // 提交一级目录
    goOneLevel() {
      this.confirmLoading = true
      if (this.checkedCities.length === 0) {
        this.$message({
          showClose: true,
          message: '请选择要对接的一级目录',
          type: 'error'
        })
      } else {
        getLists({ sourceCatalogID: this.checkedCities }, '/goods/catalog/batchCatalog').then(res => {
          if (res.code === 1001) {
            this.$message({
              message: res.msg,
              type: 'success'
            })
            this.getList()
            this.confirmLoading = false
            this.dialog1 = false
            this.checkAll = false
            this.checkedCities = []
          } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            })
            this.confirmLoading = false
          }
        }).catch(err => {
          this.confirmLoading = false
        })
      }
    },

    //  对接二级目录

    secondLevel(data) {
      this.checkedCities = []
      this.ruleForm = {}
      if (data.children.length === 0) {
        this.$message({
          showClose: true,
          message: '当前目录没有子级目录哟~',
          type: 'error'
        })
      } else {
        this.secondLevelData = data.children
        this.dialog2 = true
      }
    },

    // 对接二级目录
    goSecondLevel() {
      if (!this.ruleForm.catalogID) {
        this.$message({
          showClose: true,
          message: '请选择本地目录',
          type: 'error'
        })
      } else if (this.checkedCities.length === 0) {
        this.$message({
          showClose: true,
          message: '请选择对接目录',
          type: 'error'
        })
      } else {
        this.confirmLoading = true
        getLists({ sourceCatalogID: this.checkedCities, catalogID: this.ruleForm.catalogID }, '/goods/catalog/batchCatalog').then(res => {
          if (res.code === 1001) {
            this.$message({
              message: res.msg,
              type: 'success'
            })
            this.getList()
            this.confirmLoading = false
            this.dialog2 = false
            this.checkedCities = []
          } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            })
            this.confirmLoading = false
          }
        }).catch(err => {
          this.confirmLoading = false
        })
      }
    },

    // 获取可对接的商品
    goGoodsList(data) {
      // let recombinationData = []
      // if(this.localCatalogData.length>0){
      //    this.listData.map(item => {
      //        if(item.children.length>0){
      //            let newData = []
      //            item.children.map(items => {
      //                newData.push({catalogID:items.catalogID,catalogName:items.catalogName})
      //            })
      //            recombinationData.push({catalogID:item.catalogID,catalogName:item.catalogName,disabled:false,children:newData})
      //        }else{
      //            recombinationData.push({catalogID:item.catalogID,catalogName:item.catalogName,disabled:true})
      //        }
      //    })
      // }
      // this.recombinationData = recombinationData
      this.ruleForm = {}
      getDatas({ catalogID: data.catalogID }, '/goods/goods/goodsListByCatalog').then(res => {
        if (res.code === 1001) {
          this.goodsList = res.body
          this.dialog3 = true
        }
      }).catch(err => {

      })
    },
    //  对接商品
    goGoods() {
      const goodsID = []
      this.goodsUpData.map(item => {
        goodsID.push(item.goodsID)
      })
      if (!this.ruleForm.catalogID) {
        this.$message({
          showClose: true,
          message: '请选择本地目录',
          type: 'error'
        })
      } else if (goodsID.length === 0) {
        this.$message({
          showClose: true,
          message: '请选择对接商品',
          type: 'error'
        })
      } else {
        this.confirmLoading = true
        getLists({ sourceGoodsIDs: goodsID, catalogID: this.ruleForm.catalogID[1] }, '/goods/goods/batchGoods').then(res => {
          if (res.code === 1001) {
            this.$message({
              message: res.msg,
              type: 'success'
            })
            this.getList()
            this.confirmLoading = false
            this.dialog3 = false
          } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            })
            this.confirmLoading = false
          }
        }).catch(err => {
          this.confirmLoading = false
        })
      }
    },

    // 获取本地目录tree
    getCatalogTree() {
      getDatas({}, '/goods/catalog/tree').then(res => {
        if (res.code === 1001) {
          const recombinationData = []
          res.body.map(item => {
            if (item.children.length > 0) {
              const newData = []
              item.children.map(items => {
                newData.push({ catalogID: items.catalogID, catalogName: items.catalogName })
              })
              recombinationData.push({ catalogID: item.catalogID, catalogName: item.catalogName, disabled: false, children: newData })
            } else {
              recombinationData.push({ catalogID: item.catalogID, catalogName: item.catalogName, disabled: true })
            }
          })

          this.recombinationData = recombinationData
          // this.catalogTreeList = res.body
        }
      }).catch(err => {

      })
    },

    // 部分禁用
    isDisabled(row, index) {
      if (row.isAgent == 0 || !row.isAgent) {
        return true
      } else {
        return false
      }
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    handleSelectionChangeGoods(val) {
      this.goodsUpData = val
    },
    changeCheckboxNow(item, str, index) {
      console.log(item.selected)
      if (str === 'first') { // 选中一级
        this.secondLabelData = []
        const dataArr = this.firstLabelData
        const againStatus = this.firstLabelData.length
        if (item.selected) {
          dataArr.push(item.catalogID)
        } else {
          this.firstLabelData = []
          dataArr.forEach((i, oi) => {
            if (i === item.catalogID) {
              dataArr.splice(oi, 1)
            }
          })
        }
        this.firstLabelData = dataArr
        if (this.firstLabelData.length && againStatus) {
          if (item.selected) {
            this.listData.forEach((item, b) => {
              if (index === b) {
                item.children.forEach(item1 => {
                  item1.isAgent = 1
                })
              }
            })
          } else {
            this.listData.forEach((item, b) => {
              if (index === b) {
                this.$forceUpdate()
                item.children.forEach(item1 => {
                  item1.isAgent = 2
                })
              }
            })
          }
          return
        } else {
          if (item.selected) {
            const data = this.listData
            console.log(index)
            data.forEach((item, b) => {
              if (index === b) {
                item.children.forEach(item1 => {
                  item1.isAgent = 1
                })
              } else {
                if (item.children && item.children.length) {
                  item.children.forEach(item1 => {
                    item1.isAgent = 2
                  })
                }
              }
            })
            // this.countList(data, 2, item.children, item.selected)
          } else {
            this.listData = JSON.parse(JSON.stringify(this.listDatas))
          }
        }
      } else {
        const dataArr = this.secondLabelData
        const againStatus = this.secondLabelData.length
        if (item.selected) {
          dataArr.push(item.catalogID)
        } else {
          dataArr.forEach((i, oi) => {
            if (i === item.catalogID) {
              dataArr.splice(oi, 1)
            }
          })
        }
        this.secondLabelData = dataArr
        if (this.secondLabelData.length && againStatus) {
          return
        } else {
          if (item.selected) {
            const data = this.listData
            this.countList(data, 1, this.listData, item.selected)
          } else {
            this.listData = JSON.parse(JSON.stringify(this.listDatas))
          }
        }
      }
    },
    checkall(type) {
      this.time = new Date().getTime()
      if (type === 0) {
        this.firstLabelData = []
        this.listData.forEach(item => {
          item.isAgent = 0
          delete item.selected
          if (item.children) {
            item.children.forEach(item1 => {
              delete item1.selected
              item1.isAgent = 0
            })
          }
        })
      } else {
        this.listData.forEach(item => {
          this.firstLabelData.push(item.catalogID)
          item.selected = true
          if (item.children) {
            item.children.forEach(item1 => {
              item1.isAgent = 1
            })
          }
        })
      }
    },
    countList(list, num, arr, status) {
      const arrs = []
      const countArr = (list, num, index, status) => {
        list.forEach(i => {
          if (index === num) {
            i.isAgent = status ? 1 : 0
          }
          if (i.children && i.children.length) {
            countArr(i.children, num, index + 1, status)
          }
        })
      }
      arr = arrs
      countArr(list, num, 1, status)
    },
    sureOneLevel() {
      if (!this.firstLabelData.length) {
        this.$message({
          showClose: true,
          message: '请选择要对接的一级目录',
          type: 'error'
        })
      } else {
        this.dialog1 = true
      }
    },
    goOneLabel() {
      getLists({ sourceCatalogID: this.firstLabelData }, '/goods/catalog/batchCatalog').then(res => {
        if (res.code === 1001) {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.getList()
          this.confirmLoading = false
          this.dialog1 = false
          this.checkAll = false
          this.firstLabelData = []
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'error'
          })
          this.confirmLoading = false
          this.dialog1 = false
          this.firstLabelData = []
        }
      }).catch(err => {
        this.confirmLoading = false
        this.dialog1 = false
        this.firstLabelData = []
      })
    },
    sureSecondLevel() {
      if (!this.secondLabelData.length) {
        this.$message({
          showClose: true,
          message: '请选择要对接的二级目录',
          type: 'error'
        })
      } else {
        this.dialog2 = true
      }
    },
    // 二级目录
    goSecondLabel() {
      if (!this.ruleForm.catalogID) {
        this.$message({
          showClose: true,
          message: '请选择本地目录',
          type: 'error'
        })
      } else {
        this.confirmLoading = true
        getLists({ sourceCatalogID: this.secondLabelData, catalogID: this.ruleForm.catalogID }, '/goods/catalog/batchCatalog').then(res => {
          if (res.code === 1001) {
            this.$message({
              message: res.msg,
              type: 'success'
            })
            this.getList()
            this.confirmLoading = false
            this.dialog2 = false
          } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            })
            this.confirmLoading = false
            this.secondLabelData = []
          }
        }).catch(err => {
          this.confirmLoading = false
          this.secondLabelData = []
        })
      }
    },
    sureNowLevel() {
      if (this.firstLabelData.length) {
        this.sureOneLevel()
      } else if (this.secondLabelData.length) {
        this.sureSecondLevel()
      } else {
        this.$message({
          showClose: true,
          message: '请选择要对接的目录',
          type: 'error'
        })
      }
    }
  }
}
</script>
<style lang="scss">
.menu2-1-container {
  .dialog1 {
    .el-table__header-wrapper {
      //display:none;
    }
    .el-dialog__body {
      overflow: auto;
      max-height: 700px;
    }
    .el-input {
      // width:400px;
    }
  }
}
</style>
<style scoped lang="scss">
.container {
  padding: 20px;
  .tips {
    color: #909399;
    font-size: 12px;
    line-height: 20px;
    width: 400px;
    margin-left: 10px;
  }
  .tab-wrap {
    a {
      &.active {
        border-bottom: 2px solid #409eff;
      }
    }
  }
  .filter-wrap {
    margin-top: 20px;
  }
  .handle-wrap {
    // margin-top:20px;
    margin-bottom: 20px;
  }

  .dir_project_box {
    .dir_box {
      .item_first_dir {
        margin-bottom: 5px;
        .first_txt {
          height: 40px;
          display: flex;
          align-items: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          background: #ecf5ff;
          padding: 0 5px;
          box-sizing: border-box;
          .el-checkbox {
            display: flex;
            align-items: center;
          }
          .no_select_txt {
            color: #909399;
          }
          .red_txt {
            color: rgb(255, 43, 43);
          }
          .green_txt {
            color: #67c23a;
          }
        }
        .second_box {
          display: flex;
          flex-wrap: wrap;
          border-top: 1px solid #eeecea;
          border-left: 1px solid #eeecea;
          .second_txt {
            width: 20%;
            overflow: hidden;
            border-right: 1px solid #eeecea;
            border-bottom: 1px solid #eeecea;
            padding: 5px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            position: relative;
            .el-checkbox {
              width: 100%;
              display: flex;
              align-items: center;
            }
            .no_select_txt {
              color: #909399;
            }
            .red_txt {
              color: rgb(255, 43, 43);
            }
            .green_txt {
              color: #67c23a;
            }
            .txt_top {
              position: absolute;
              right: 0;
              top: 0;
              left: 24px;
              height: 100%;
              z-index: 2;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
</style>

