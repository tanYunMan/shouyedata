<template>
  <div class="container">
    <div class="filter-wrap">
      <el-button type="primary" @click="addDialog = true">添加目录</el-button>
      <el-button type="danger" @click="dels(1)" >批量删除</el-button>
      <el-button type="warning" @click="dels(2)" >目录名称颜色</el-button>
      <el-button type="danger" @click="deleteEmptyCatalog()">一键删除空目录</el-button>
    </div>
    <el-table v-if="tabelShowAgain" row-key="catalogID" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#eef1f6',color:'#606266'}" v-loading="loading" :load="load" lazy :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
       <el-table-column :show-overflow-tooltip="true" type="selection" > </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="catalogName" label="目录名称" width="300">
        <template slot-scope="scope">
            <span :style="{'color':scope.row.color}">{{scope.row.catalogName}}</span>
        </template>
      </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="catalogID" label="目录编号" align="center"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="color" label="颜色" align="center"> </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="sort" label="序号" align="center">
          <template slot-scope="scope">
            <a class="el-icon-edit-outline" style="color:#409EFF" @click="sortDialog=true,formSort.id=scope.row.catalogID,formSort.thisSort=scope.row.sort">{{scope.row.sort}}</a>
        </template>
      </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="test5" label="状态" align="center">
        <template slot-scope="scope">
          <div>
            <el-button type="text" plain size="mini" v-show="scope.row.state == 0" @click="updateState(scope.row)" :loading="stateLoading">隐藏</el-button>
            <el-button type="text" plain size="mini" style="margin-left:0" v-show="scope.row.state == 1" @click="updateState(scope.row)" :loading="stateLoading">显示</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="label5" label="目录来源" align="center" width="120">
         <template slot-scope="scope">
          <div v-if="scope.row.catalogSource == 1">本地目录</div>
          <div v-if="scope.row.catalogSource == 2">对接目录</div>
        </template>
      </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="test6" label="对接状态" align="center">
        <template slot-scope="scope">
          <el-button type="text" plain size="mini" style="margin-left:0" v-show="scope.row.agentType == 0" @click="updateAgentType(scope.row)">禁止对接</el-button>
          <el-button type="text" plain size="mini" style="margin-left:0" v-show="scope.row.agentType == 1" @click="updateAgentType(scope.row)">单次对接</el-button>
          <el-button type="text" plain size="mini" style="margin-left:0" v-show="scope.row.agentType == 2" @click="updateAgentType(scope.row)">多次对接</el-button>
        </template>
      </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="test7" label="推荐目录" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" v-if="scope.row.isRecommend == 1">是</el-button>
          <el-button type="text" plain size="mini" v-if="scope.row.isRecommend == 0">否</el-button>
        </template>
      </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="test7" label="排序" align="center">
        <template slot-scope="scope">
          <a title="移至顶部" class="wl-move-top" v-if="scope.row.arrowTop" @click="moveClick(scope.row,1)" style="background-image: url(css-icon.png);background-position:0 -20px;"></a>
          <a title="移至顶部" class="wl-move-top" v-else @click="moveClick(scope.row,1)" style="background-image: url(css-icon.png);background-position:0 -140px;"></a>
          <a title="上移一行" class="wl-move-top" v-if="scope.row.arrowTop" @click="moveClick(scope.row,2)" style="background-image: url(css-icon.png);background-position:0 0;"></a>
          <a title="上移一行" class="wl-move-top" v-else @click="moveClick(scope.row,2)" style="background-image: url(css-icon.png);background-position:0 -120px;"></a>
          <a title="下移一行" class="wl-move-top" v-if="!scope.row.arrowBottom" @click="moveClick(scope.row,3)" style="background-image: url(css-icon.png);background-position:0 -80px;"></a>
          <a title="下移一行" class="wl-move-top" v-else @click="moveClick(scope.row,3)" style="background-image: url(css-icon.png);background-position:0 -39px;"></a>
          <a title="移至底部" class="wl-move-top" v-if="!scope.row.arrowBottom" @click="moveClick(scope.row,4)" style="background-image: url(css-icon.png);background-position:0 -100px;"></a>
          <a title="移至底部" class="wl-move-top" v-else @click="moveClick(scope.row,4)" style="background-image: url(css-icon.png);background-position:0 -41px;"></a>
        </template>
      </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="test8" label="操作" align="center"  min-width="100px">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="update(scope.row)">修改</el-button>
          <el-button type="text" size="mini" @click="del(scope.row.catalogID)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增目录 -->
    <el-dialog title="添加目录" :visible.sync="addDialog" :close-on-click-modal="false" @closed="closeCatalogForm">
      <el-form ref="addCatalogForm" :rules="addCatalogFormRules" :model="addCatalogForm" label-width="160px">
        <el-form-item label="商品目录名称：" prop="catalogName">
          <el-input v-model="addCatalogForm.catalogName" placeholder="请输入商品目录名称" style="float:left"></el-input>
        </el-form-item>
        <el-form-item label="目录颜色：">
          <colorPicker  defaultColor='#000000' v-model="color" @change="themeEvent"></colorPicker >
        </el-form-item>
        <el-form-item label="上级目录选择：">
          <el-select v-model="addCatalogForm.parentID" placeholder="请选择上级目录">
            <el-option
              v-for="item in tableData"
              :key="item.catalogID"
              :label="item.catalogName"
              :value="item.catalogID"
              :disabled="item.disabled">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目录图片：">
          <Upload :imgList ="addCatalogForm.img" v-on:listenTochildEvent="showMessageFromChild" />
          <span class="tips">图片尺寸：180*60</span>
        </el-form-item>
        <el-form-item label="对接类型：">
          <el-radio-group v-model="addCatalogForm.agentType">
            <el-radio :label="0">禁止对接</el-radio>
            <el-radio :label="1">单次对接</el-radio>
            <el-radio :label="2">多次对接</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否允许显示：">
          <el-radio-group v-model="addCatalogForm.state">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="0">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否推荐目录：">
          <el-radio-group v-model="addCatalogForm.isRecommend">
            <el-radio :label="0">不推荐</el-radio>
            <el-radio :label="1">推荐</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="目录简介或包含产品：">
          <el-input type="textarea" v-model="addCatalogForm.remark" :rows="5" placeholder="请输入目录简介或包含产品"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDilog('addCatalogForm')">取 消</el-button>
        <el-button type="primary" @click="AddCatalog('addCatalogForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 批量修改颜色 -->
    <el-dialog title="修改目录" :visible.sync="colorDialog" :close-on-click-modal="false">
      <el-form ref="colorForm" :model="colorForm" label-width="160px">
          <el-form-item label="目录名称颜色：" prop="color" :rules="[{ required: true, message: '请目录名称的颜色', trigger: 'blur' }]">
              <colorPicker v-model="colorForm.color"></colorPicker>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="colorDialog=false,colorForm={}">取 消</el-button>
        <el-button type="primary" @click="AddColorForm('colorForm')" :loading="delConfirmLoading">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改目录 -->
    <el-dialog title="修改目录" :visible.sync="updateDialog" :close-on-click-modal="false">
      <el-form ref="updateForm" :model="updateForm" :rules="addCatalogFormRules" label-width="160px">
        <el-form-item label="商品目录名称：" prop="catalogName">
          <el-input v-model="updateForm.catalogName" placeholder="请输入商品目录名称" style="float:left"></el-input>
          <colorPicker v-model="updateForm.color" @change="themeEvent" style="margin-left:30px;"></colorPicker>
        </el-form-item>
        <el-form-item label="上级目录选择：">
          <el-select v-model="updateForm.parentCode" placeholder="作为一级商品目录" disabled="">
          <el-option label="作为一级商品目录" value="" ></el-option>
        </el-select>
        </el-form-item>

        <el-form-item label="目录图片：">
          <Upload :imgList ="updateForm.img" v-on:listenTochildEvent="showMessageFromChild" v-if="updateDialog"/>
          <span class="tips">图片尺寸：180*60</span>
        </el-form-item>
        <el-form-item label="是否允许显示：">
          <el-radio-group v-model="updateForm.state">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="0">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="对接类型：">
          <el-radio-group v-model="updateForm.agentType">
            <el-radio :label="0">禁止对接</el-radio>
            <el-radio :label="1">单次对接</el-radio>
            <el-radio :label="2">多次对接</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否推荐目录：">
          <el-radio-group v-model="updateForm.isRecommend">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="目录简介或包含产品：">
          <el-input type="textarea" :rows="5" placeholder="请输入目录简介或包含产品" v-model="updateForm.remark"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateConfirm('updateForm')" :loading="updateConfirmLoading">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除 -->
    <el-dialog title="确认删除" :visible.sync="delDialog" width="30%" >
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialog = false">取 消</el-button>
        <el-button type="primary" @click="delConfirm" :loading="delConfirmLoading">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 一键删除 -->
    <el-dialog title="您确认要一键删除所有空目录吗" :visible.sync="delEmptyDialog" width="30%" >
      <span slot="footer" class="dialog-footer">
        <el-button @click="delEmptyDialog = false">取 消</el-button>
        <el-button type="primary" @click="deleteEmptyCatalog" :loading="delConfirmLoading">确 定</el-button>
      </span>
    </el-dialog>

    

    <!-- 目录对接状态修改 -->
    <el-dialog title="目录对接状态修改" :visible.sync="updateAgentTypeDialog" >
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="是否允许供货：">
          <el-radio-group v-model="updateAgentTypeForm.agentType">
            <el-radio :label="0">禁止对接</el-radio>
            <el-radio :label="1">单次对接</el-radio>
            <el-radio :label="2">多次对接</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateAgentTypeDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateAgentTypeConfirm" :loading="updateAgentTypeConfirmLoading">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 排序 -->
    <el-dialog title="目录排序" :visible.sync="sortDialog" width="20%">
      <el-form ref="formSort" :model="formSort" label-width="120px">
        <el-form-item label="当前序号：">
          <span>{{formSort.thisSort}}</span>
        </el-form-item>
        <el-form-item label="序号：">
          <el-input-number v-model="formSort.sort" controls-position="right" size="small" :min="0" :precision="0" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sortDialog = false">取 消</el-button>
        <el-button type="primary" @click="sortClick" :loading="delConfirmLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
import Upload from '@/components/Upload'
import { geTcatalogList, updateCatalog, deleteCatalog, updateStateBatch, updateAgentTypeBatch, AddCatalog, AddColorFormAPI, sortCatalog, sortCatalogArrow, deleteEmptyCatalog } from '@/api/meun3/menu3-1/index'
import axios from 'axios'
import { getToken, setToken, removeToken } from '@/utils/auth'

Array.prototype.insert = function(index, arr) {
  this.splice.apply(this,[index,0]).concat(arr)
  return this
}

export default {
  data() {
    return {
      delEmptyDialog:false,
      loading: true,
      color: '#000000',
      colorForm:{
        color: '',
      },
      formSort:{},//排序
      sortDialog:false,
      colorML: '',
      form: {},
      colorML: '', // 目录颜色
      updateForm: {},
      addCatalogForm: {
        agentType: 2,
        state: 1,
        isRecommend: 0,
        catalogSource: 1
      },
      isClick: false,
      addDialog: false,
      updateDialog: false,
      delDialog: false,
      updateAgentTypeDialog: false,
      updateConfirmLoading: false,
      delConfirmLoading: false,
      stateLoading: false,
      updateAgentTypeConfirmLoading: false,
      colorDialog: false,//批量修改颜色
      tableData: [],
      delIds:[],
      multipleSelection: [],
      updateAgentTypeForm:{
        agentType: '',
        ids: []
      },
      addCatalogFormRules: {
        catalogName: [
          { required: true, message: '请输入目录名称', trigger: 'blur' }
        ]
      },
      thisTreeNode:'',
      thisResolve:'',
      tabelShowAgain: true
    }
  },
  components: {
    Upload
  },
  mounted() {
    this.$nextTick(() => {

      // this.rowDrop() // 去掉拖拽

    })

    this.geTcatalogList()

  },
  methods: {

    // 上传图片返回的信息
    showMessageFromChild(data){
        this.addCatalogForm = {
            ...this.addCatalogForm,
            img:data
        }

        this.updateForm = {
            ...this.updateForm,
            img:data
        }
    },
    closeDilog(form) {
      this.addDialog = false;
      this.$refs[form].resetFields() // 将form表单重置
    },

    // 获取目录列表
    geTcatalogList() {
      geTcatalogList({ catalogType: 1 }).then(res => {
        res.body.map(item => {
            item.hasChildren = true
        })
        if (!this.tabelShowAgain) {
          this.tabelShowAgain = true
        }
        this.tableData = res.body
        this.sortArrow()
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },

    // 排序箭头
    sortArrow(){
      let arrowData = this.tableData;
      arrowData.map((item,index)=>{
          item.arrowTop = index==0
          item.arrowBottom = index==arrowData.length-1
      })
    },

    //批量修改目录名称颜色
    AddColorForm(form) {
      this.$refs[form].validate(async valid => {
        if (!valid) return null  // 如果验证失败就不往下继续执行
        this.delConfirmLoading = true
        AddColorFormAPI({...this.colorForm,ids:this.delIds}).then(res => {
          if (res.code === 1001){
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'success',
            });
            this.colorDialog = false
            this.colorForm = {}
            this.geTcatalogList()
          }else{
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            });
          }
          this.delConfirmLoading = false
        }).catch(err => {

        })
      })
    },

    // 排序
    sortClick() {
        if(!this.formSort.sort){
          this.$message({
            showClose: true,
            message: '请填写序号',
            type: 'error'
          });
          return false
        }
        this.delConfirmLoading = true
        sortCatalog({...this.formSort}).then(res => {
          if (res.code === 1001){
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'success',
            });
            this.geTcatalogList()
            this.sortDialog = false
          }else{
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            });
          }
          this.delConfirmLoading = false
        }).catch(err => {

        })
    },

    // 验证当前位置
    moveLocation(data,location){
        let isTrue = false
        if(location == 1){
            isTrue = data.arrowTop
            isTrue && this.$message({
              showClose: true,
              message: '已是当前首位，无法移动',
              type: 'error'
            });
        }else if(location == 2){
            isTrue = data.arrowTop
            isTrue && this.$message({
              showClose: true,
              message: '已是当前首位，无法移动',
              type: 'error'
            });
        }else if(location == 3){
            isTrue = data.arrowBottom
            isTrue && this.$message({
              showClose: true,
              message: '已是当前末位，无法移动',
              type: 'error'
            });
        }else{
            isTrue = data.arrowBottom
            isTrue && this.$message({
              showClose: true,
              message: '已是当前末位，无法移动',
              type: 'error'
            });
        }
        return isTrue
    },
    // 点击排序
    moveClick(data,location){
        let formData = {},index
        if(this.moveLocation(data,location)){
           return false
        }
        formData.id = data.catalogID
        let childrenData = []
        let indexChildren
        if(data.parentID){
          this.tableData.map((item,indexx)=>{
              if(item.catalogID == data.parentID){
                  if(item.children.length==0){
                      this.isClick = false
                      this.load(this.tableData[indexx],this.thisTreeNode,this.thisResolve)
                  }
                  childrenData = item.children
                  indexChildren = indexx
              }
          })
          childrenData.map((item,indexs)=>{
              if(item.catalogID == data.catalogID){
                  index = indexs
              }
          })
        }else{
          this.tableData.map((item,indexs)=>{
              if(item.catalogID == data.catalogID){
                  index = indexs
              }
          })
        }
        if(index==undefined){
            this.$message.error('操作过于频繁，请刷新后重试');
            return false
        }
        if (location==1) {
            // 当前操作   移至顶部
            formData.referId = data.parentID ? childrenData[0].catalogID : this.tableData[0].catalogID
            formData.type = -1
        }else if (location==2) {
            // 当前操作   上移一行
            formData.referId =  data.parentID ? childrenData[index-1].catalogID : this.tableData[index-1].catalogID
            formData.type = -1
        }else if (location==3) {
            // 当前操作   下移一行
            formData.referId =  data.parentID ? childrenData[index+1].catalogID : this.tableData[index+1].catalogID
            formData.type = 1
        }else {
            // 当前操作   移至底部
            formData.referId =  data.parentID ? childrenData[childrenData.length-1].catalogID : this.tableData[this.tableData.length-1].catalogID
            formData.type = 1
        }
        //console.log(location,index,formData);
        sortCatalogArrow(formData).then(res => {
          if (res.code === 1001) {
              this.$message({
                showClose: true,
                message: res.msg,
                type: 'success',
              });
            if(data.parentID){
                this.isClick = false
                this.load(this.tableData[indexChildren],this.thisTreeNode,this.thisResolve)
            }else{
                this.geTcatalogList()
            }

          } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            });
          }
          this.loading = false
        }).catch(err => {
          this.loading = false
        })
    },

    // 清空
    closeCatalogForm(){
      let obj = {
        agentType: 2,
        state: 1,
        isRecommend: 0,
        catalogSource: 1
      }
        this.addCatalogForm = obj
    },

    // 添加目录
    AddCatalog(form) {
      this.$refs[form].validate(async valid => {
        if (!valid) return null  // 如果验证失败就不往下继续执行
        this.addCatalogForm = { ...this.addCatalogForm, color: this.colorML }
        AddCatalog(this.addCatalogForm).then(res => {
          this.color = "#000000";
          if (res.code === 1001) {
            this.$notify({
              title: res.msg,
              type: 'success'
            })
            this.tabelShowAgain = false
            this.geTcatalogList()
            this.addDialog = false
            this.colorML = ''
            this.addCatalogForm = {}
            this.$refs[form].resetFields() // 将form表单重置
          } else {
            this.$notify.error({
              title: res.msg
            })
          }
          this.loading = false
        }).catch(err => {
          this.loading = false
        })
      })
    },
    // 修改目录
    update(item) {
      this.updateForm = {}
      this.updateForm = item
      this.updateDialog = true
    },
    // 确认修改目录
    updateConfirm(form) {
      this.$refs[form].validate(async valid => {
        if (!valid) return null  // 如果验证失败就不往下继续执行
        let newData = {
          catalogID:this.updateForm.catalogID,
          agentType:this.updateForm.agentType,
          catalogName:this.updateForm.catalogName,
          color:this.colorML ? this.colorML : this.updateForm.color,
          img:this.updateForm.img || '',
          remark:this.updateForm.remark || '',
          state:this.updateForm.state || 0,
          isRecommend:this.updateForm.isRecommend || 0
        }
        this.updateConfirmLoading = true
        updateCatalog(newData).then(res => {
          if (res.code === 1001) {
              this.$message({
                showClose: true,
                message: res.msg,
                type: 'success',
              });
            this.colorML = ''
            this.updateForm = {}
            this.updateDialog = false
            this.geTcatalogList()
          }else{
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            });
          }
          this.updateConfirmLoading = false
        }).catch(err => {
            this.$message({
              showClose: true,
              message: '数据异常',
              type: 'error'
            });
            this.updateConfirmLoading = false
        })
      })
    },
    // 删除目录
    del(id) {
      this.delIds = [id]
      this.delDialog = true
    },
    // 批量删除目录
    dels(state) {
      this.delIds = []
      this.multipleSelection.map(item => {
        this.delIds.push(item.catalogID)
      })
      if(this.multipleSelection.length > 0) {
        if(state==1){
          this.delDialog = true
        }else{
          this.colorDialog = true
        }
      }else {
        this.$message({
          showClose: true,
          message: '请选择目录',
          type: 'error'
        });
      }

    },
    // 确认删除
    delConfirm() {
      this.delConfirmLoading = true
      deleteCatalog({id:this.delIds}).then(res => {
        this.delDialog = false
        this.delConfirmLoading = false
        this.geTcatalogList()
      })
    },
    // 状态改变
    updateState(item) {
      this.stateLoading = true
      updateStateBatch({
        ids:[item.catalogID],
        state:(item.state == 1 ? 0 : 1)
      }).then(res => {
        this.geTcatalogList()
        this.stateLoading = false
      }).catch(err => {
        this.stateLoading = false
      })
    },
    // 对接状态改变
    updateAgentType(item) {
      this.updateAgentTypeDialog = true
      this.updateAgentTypeForm.ids = [item.catalogID]
      this.updateAgentTypeForm.agentType = item.agentType
    },
    // 确认对接状态改变
    updateAgentTypeConfirm() {
      this.updateAgentTypeConfirmLoading = true
      updateAgentTypeBatch(this.updateAgentTypeForm).then(res => {
        this.updateAgentTypeDialog = false
        this.$message({
          showClose: true,
          message: res.msg,
          type: 'success',
        });
        this.geTcatalogList()
        setTimeout(()=>{
            this.updateAgentTypeConfirmLoading = false
        },2000)
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.msg || '网络异常',
          type: 'error'
        });
        this.updateAgentTypeConfirmLoading = false
      })
    },
    //行拖拽
    rowDrop() {
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.tableData.splice(oldIndex, 1)[0]
          _this.tableData.splice(1, 0, currRow)
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 加载子集
    load(tree, treeNode, resolve) {
        if(this.isClick){
          return
        }
        this.thisTreeNode = treeNode
        this.thisResolve = resolve
        this.isClick = true;
        geTcatalogList({ parentID: tree.catalogID }).then(res => {
        if (res.code === 1001) {
            res.body.map((item,index)=>{
                item.arrowTop = index==0
                item.arrowBottom = index==res.body.length-1
            })
            this.tableData.map((item)=>{
                if (item.catalogID == tree.catalogID) {
                  item.children = res.body
                }
            })
            resolve(res.body)
        }
        this.isClick = false;
      }).catch(err => {
        this.isClick = false;
      })
    },

    themeEvent(val) {
      this.colorML = val
    },

    //一键清空空目录
    deleteEmptyCatalog(){
       this.delConfirmLoading = true
      deleteEmptyCatalog().then(res => {
        if(res.code === 1001){
          this.$message({
                showClose: true,
                message: res.msg,
                type: 'success',
            });
        }else{
          this.$message({
                showClose: true,
                message: res.msg,
                type: 'error',
            });
        }
        this.delEmptyDialog = false
        this.delConfirmLoading = false
        this.geTcatalogList()
      })
    }
  }
}
</script>

<style lang="scss">

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
  padding:20px;
  .el-form {
    padding:0;
    .el-input,.el-textarea {
      width:400px;
    }
  }
}
.wl-move-top{
    display: inline-block;
    width: 10px;
    height: 9px;
    margin-right: 5px;
    // background-image: url(../css-icon.png);
    background-repeat: no-repeat;
}

</style>

