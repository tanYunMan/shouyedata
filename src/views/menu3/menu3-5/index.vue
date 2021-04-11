<template>
  <div class="container container-good">
    <div class="filter-wrap">
      <span>查询关键字：</span>
      <el-input placeholder="请输入模板名称" class="search-input"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="getTemplateList">查询</el-button>
      <el-button type="primary" icon="el-icon-edit" @click="dialog1 = true">添加模板</el-button>
    </div>
    <el-table border row-key="id" ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" >
       <el-table-column :show-overflow-tooltip="true" type="selection" > </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="tempName" label="模板名称" ></el-table-column>
      <!--  <el-table-column :show-overflow-tooltip="true" prop="label3" label="是否共享代理供货商品" ></el-table-column> -->
       <el-table-column :show-overflow-tooltip="true" prop="label10" label="操作" align="center" width="400px" >
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="goEdit(scope)">编辑</el-button>
          <el-popover :ref="`popover-${scope.$index}`" placement="top" width="160" v-model="scope.visible" >
              <p>确定删除吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="scope._self.$refs[`popover-${scope.$index}`].doClose()">取消</el-button>
                <el-button type="primary" size="mini" @click="deleteTask(scope)">确定</el-button>
              </div>
              <el-button type="text" size="mini" @click="del(scope)" slot="reference">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 添加模板 -->
    <el-dialog title="添加/编辑模板" :visible.sync="dialog1" @closed="closeInfo('form')">
      <el-form ref="form" :model="form" label-width="140px">
        <el-form-item label="模板名称：">
          <el-input v-model="form.tempName" placeholder="请输入模板名称" />
        </el-form-item> 
        <!-- <el-form-item label="代理供货商品：">
          <el-radio-group v-model="form.t">
            <el-radio :label="1">共享</el-radio>
            <el-radio :label="2">不共享</el-radio>
          </el-radio-group>
        </el-form-item> -->

        <el-row v-for="(item,index) in form.goodsTypeTempList" :key="index" class="modle-warp">
            <el-col >
                <el-form-item label="框内提示语：">
                  <el-input v-model="item.inputContent" placeholder="请输入框内提示语"></el-input>
                </el-form-item> 
            </el-col>
            <el-col >
                <el-form-item label="框名称："  class="w100">
                  <el-input v-model="item.inputName"  placeholder="请输入框名称"></el-input>
                  <el-radio-group style="margin-left:50px" v-model="item.inputType">
                  <el-radio :label="1">文本</el-radio>
                  <el-radio :label="2">密码</el-radio>
                </el-radio-group>
                <el-button style="margin-left:20px" type="text" icon="el-icon-delete" circle @click="delIndex(item,index)"></el-button>
                </el-form-item>
                 
            </el-col>
        </el-row>
        <el-form-item label="">
          <el-button type="warning" @click="add">插入新规则</el-button>
        </el-form-item>
        
            
        <!-- <el-form-item label="类型：">
          <el-radio-group v-model="form.goodsTypeTempList[0].inputType">
            <el-radio :label="1">文本</el-radio>
            <el-radio :label="2">密码</el-radio>
          </el-radio-group>
        </el-form-item> -->

        <!-- <el-form-item label="添加字段类型：">
          <el-button-group>
            <el-button size="mini">文本框</el-button>
            <el-button size="mini">密码框</el-button>
            <el-button size="mini">单选框</el-button>
            <el-button size="mini">下拉框</el-button>
          </el-button-group>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeInfo('form')">取 消</el-button>
        <el-button type="primary" @click="onSubmit('form')" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Sortable from 'sortablejs'

import { addTemplate, getTemplateList, deleteTemplate } from '@/api/meun3/menu3-5/index'
export default {
  data() {
    return {
      day:true,
      color:'#333',
      currentPage:1,
      step:1,
      form:{tempName:'',goodsTypeTempList:[{inputType:1,inputName:'',inputContent:''}]},
      dialog1:false,
      tableData: [],
      multipleSelection: [],
      currentPage:1,
      loading: false,
      tableDataInfo:{
        pageNum: 1,// 当前页数
        pageSize: 20, //每页条数
        total: 0, //数据总共条数
      }
    }
  },
  methods: {

    
    add() {
      let newData = {inputContent:'',inputName:'',inputType:1}
      this.form.goodsTypeTempList.push(newData)
    },

    delIndex(data,indexs) {
      let newData = []
      this.form.goodsTypeTempList.map(function(item,index) {
          if(index!==indexs){
            newData.push(item)
          }
      })
      this.form.goodsTypeTempList = newData
    },


    
    handleSizeChange(val) {
      this.tableDataInfo = {
        pageNum: this.tableDataInfo.pageNum,
        pageSize: val,
        total: this.tableDataInfo.total
      }
      this.getTemplateList();
    },
    handleCurrentChange(val) {
      this.tableDataInfo = {
        pageNum: val,
        pageSize: this.tableDataInfo.pageSize,
        total: this.tableDataInfo.total
      }
      this.getTemplateList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //编辑赋值
    goEdit (data){
        this.dialog1 = true
        if(data.row.goodsTypeTempList) {
          this.form = data.row
        } else {
          this.form = {...data.row,goodsTypeTempList:[{inputType:1,inputName:'',inputContent:''}]}
        }
    },
    // 添加模板
    onSubmit(form) {
      let dataForm = this.form
      if(!dataForm.tempName){
          this.$notify.error({
            title: '请输入模板名称'
          })
      } else {
        addTemplate(dataForm).then(res => {
            if (res.code === 1001) {
              this.$message({
                message: res.msg,
                type: 'success',
              });
              this.$refs[form].resetFields();
              this.form = {}
              this.getTemplateList()
              this.dialog1 = false
            } else {
              this.$message({
                showClose: true,
                message: res.msg,
                type: 'error',
              });
            }
        })
      }
    },
    closeInfo(form){
      //console.log(44)
      this.form = {}
      this.form = {
        tempName: '',
        goodsTypeTempList:[{inputType:1,inputName:'',inputContent:''}]
      }

      this.$refs[form].resetFields();
      this.dialog1 = false
    },
    //获取模板
    getTemplateList() {
      this.loading = true
      getTemplateList().then(res => {
        res.body.forEach(function (item) {
          item.visible = false
        })
        this.tableData = res.body
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },
    //删除

    del(data) {
      this.delIds = [data.row.goodsTempID]
    },
    // 删除用户
    deleteTask (data) {
      this.$refs[`popover-${data.$index}`].doClose()
      deleteTemplate({id:this.delIds}).then(res => {
        if (res.code === 1001) {
          this.$notify({
            title: res.msg,
            type: 'success'
          })
          this.getTemplateList();
        } else {
          this.$notify.error({
            title: res.msg
          })
        }
      }).catch(err => {
        this.loading = false
      })
    }
  },
  created() {
    this.getTemplateList()
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
.modle-warp{
    background: #f8f8f8;
    padding: 20px 0 0;
    margin-bottom: 20px;
}
</style>

