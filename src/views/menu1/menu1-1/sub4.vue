<template>
  <div class="container">
    <div class="filter">
      <el-button type="primary" @click="handleClick(null)">添加链接</el-button>
    </div>
    <el-table ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#eef1f6',color:'#606266','text-align':'left'}" size="mini">
       <el-table-column :show-overflow-tooltip="true" type="selection" > </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="friendLinkName" label="友情链接名称">
        <!-- <template slot-scope="scope">{{ scope.row.date }}</template> -->
      </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="friendLinkAddr" label="链接地址"> </el-table-column>
      <!--  <el-table-column :show-overflow-tooltip="true" prop="state" label="显示状态" show-overflow-tooltip> </el-table-column> -->
       <el-table-column :show-overflow-tooltip="true"
      fixed="right"
      label="操作"
      width="220">

        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleClick(scope.row)">编辑</el-button>
          <el-button
            @click.native.prevent="deleteRow(scope.$index, tableData)"
            type="text"
            size="small">
            删除
          </el-button>
        </template>
    </el-table-column>
    </el-table>
    <el-popover
      placement="top"
      width="230"
      class="delete"
      v-show="visible"
      v-model="visible"
      >
      <p>您确定要删除该友情链接吗？</p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="visible = false">取消</el-button>
        <el-button type="primary" size="mini" @click="deleteFriendshipLinks">确定</el-button>
      </div>
      <!-- <el-button slot="reference">删除</el-button> -->
    </el-popover>

    <el-dialog title="新增/编辑 友情链接" :visible.sync="dialog" width="60%" style="max-width:1000px;margin:0 auto">
      <el-form ref="form1" :model="form1" :rules="rules" label-width="140px">
        <el-form-item label="链接名称：" prop="friendLinkName">
          <el-input v-model="form1.friendLinkName" placeholder="请输入友情链接的名称"></el-input>
        </el-form-item>
        <el-form-item label="链接地址：" prop="friendLinkAddr">
          <el-input v-model="form1.friendLinkAddr" placeholder="请输入友情链接的地址（url）"></el-input>
        </el-form-item>
      </el-form>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">取 消</el-button>
        <el-button type="primary" @click="addfriendLinkAddr('form1')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getFriendshipLinks,deleteFriendshipLinks,addfriendLinkAddr } from '@/api/meun1/menu1-1/index'
export default {
  data() {
    let isTrueUrl = (rule, value, callback) => {
      //let reg = /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/
      let reg=/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
      if (!reg.test(value)) {
        callback(new Error('请输入正确的链接,例如：(https://www.baidu.com)'))
      } else {
        callback()
      }
    }
    return {
      dialog: false,
      tableData: [],
      multipleSelection: [],
      visible: false,
      thisData: [],
      form1: {},
      rules:{
          friendLinkName: [
            { required: true, message: '请输入友情链接的名称', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在  到 20 个字符', trigger: 'blur' }
          ],
          friendLinkAddr: [
            { required: true, message: '请输入友情链接的地址', trigger: 'change' },
            { validator: isTrueUrl, trigger: 'blur' }
          ]
      }
    }
  },
  methods: {
    deleteRow(index, dataList) {
      this.thisData = dataList[index]
      this.visible = true
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 新增-编辑友情链接
    addfriendLinkAddr(formName) {
      this.$refs[formName].validate((valid) => {
          if (valid) {
              addfriendLinkAddr({ payload: this.form1 }).then(res => {
                this.dialog = false
                if(res.code==1001){
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
                this.getFriendshipLinks()
              }).catch(err => {
                  
              })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },

    // 点击编辑按钮
    handleClick(data) {
      this.dialog = true
      if(data){
        this.form1 = data
      }else{
        this.form1 ={}
        if(this.$refs['form1']){this.$refs['form1'].resetFields();}
      }
      
    },

    // 删除友情链接
    deleteFriendshipLinks() {
      deleteFriendshipLinks({ id: this.thisData.friendLinkID }).then(res => {
        this.$notify({
          title: res.msg,
          type: 'success'
        })
        this.visible = false
        this.getFriendshipLinks()
      }).catch(err => {
      })
    },
    /*
    获取友情链接列表
    */
    getFriendshipLinks() {
      getFriendshipLinks({}).then(res => {
        this.tableData = res.body
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    }
  },
  created() {
    this.getFriendshipLinks()
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
    width: 180px;
    height: 60px;
    line-height: 60px;
    text-align: center;
  }
  .avatar {
    width: 180px;
    height: 60px;
    display: block;
  }
}
    
</style>
<style scoped lang="scss">
.delete{
  position: fixed;
  left: 44%;
  top: 30%;
}
.container {
  padding:0 20px;
  .el-table {
    margin-top:20px;
  }
  .filter {
    float: right;
    margin: 10px 0;
  }
  .el-form {
    .el-input {
      width:300px;
    }
    .tips {
      color:#909399;
      font-size:12px;
      margin-left:10px;
    }
    .el-div-item {
      margin-bottom:20px;
      .label {
        color:#606266;
        margin:0 10px;
      }
    }
    
    
  }
  

}
</style>

