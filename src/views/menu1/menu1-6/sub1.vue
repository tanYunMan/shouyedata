<template>
  <div class="container">
    <div class="tips">小提示：只有超级管理员才拥有给其他管理员加款和设置权限功能，超级管理员不可删除。</div>
    <div class="filter">
      <el-button type="primary" @click="addDialog = true">新增</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
       <el-table-column :show-overflow-tooltip="true" prop="userID" label="用户ID"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="userName" label="用户名" > </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="rname" label="真实姓名" show-overflow-tooltip> </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="state" label="状态" show-overflow-tooltip> </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="ip" label="IP绑定" show-overflow-tooltip> </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="qq" label="QQ登录绑定" show-overflow-tooltip> </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="wei" label="微信登录绑定" show-overflow-tooltip> </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="weicode" label="微信安全码绑定" show-overflow-tooltip> </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="money" label="账户余额" show-overflow-tooltip> </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="change" label="金额变化" show-overflow-tooltip> </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="handle" label="操作" width="300" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="detailDialog = true">查看</el-button>
          <el-button size="mini" type="text" @click="updateDialog = true">修改</el-button>
          <el-button size="mini" type="text" @click="moneyDialog = true">加款</el-button>
            <el-popover :ref="`popover-${scope.$index}`" placement="top" width="160" v-model="scope.visible" >
                <p>确定删除吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="scope._self.$refs[`popover-${scope.$index}`].doClose()">取消</el-button>
                  <el-button type="primary" size="mini" @click="deleteTask(scope)">确定</el-button>
                </div>
                <el-button type="danger" size="mini" @click="scope.visible = true" slot="reference">删除</el-button>
            </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="tableDataInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableDataInfo.total"> </el-pagination>

    <el-dialog title="新增管理员" :visible.sync="addDialog" width="50%">
      <el-form ref="form" :model="form" label-width="140px">
        <el-form-item label="管理员用户名：">
          <el-input v-model="form.userName" placeholder="请输入管理员用户名"></el-input>
          <span class="tips">字母开头，字母和数字的组合，长度在6~10之间</span>
        </el-form-item>
        <el-form-item label="重复用户名：">
          <el-input v-model="form.userName1" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="管理员登陆密码：">
          <el-input v-model="form.password" placeholder="请输入管理员登陆密码"></el-input>
          <span class="tips">以字母开头，长度在6~10之间，只能包含字母、数字和下划线</span>
        </el-form-item>
        <el-form-item label="重复登陆密码：">
          <el-input v-model="form.password1" placeholder="请输入登陆密码"></el-input>
        </el-form-item>
      </el-form>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">取 消</el-button>
        <el-button type="primary" @click="dialog = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改" :visible.sync="updateDialog" width="50%">
      <el-form ref="form" :model="form" label-width="140px">
        <el-form-item label="管理员用户名：">
          <el-input v-model="form.name" placeholder="请输入管理员用户名" disabled=""></el-input>
        </el-form-item>
        <el-form-item label="管理员登陆密码：">
          <el-input v-model="form.name" placeholder="请输入管理员登陆密码"></el-input>
          <span class="tips">以字母开头，长度在6~10之间，只能包含字母、数字和下划线</span>
        </el-form-item>
        <el-form-item label="管理员姓名：">
          <el-input v-model="form.name" placeholder="请输入管理员姓名"></el-input>
        </el-form-item>
        <el-form-item label="账户开通状态：">
          <el-radio-group v-model="form.t">
            <el-radio :label="1">开通</el-radio>
            <el-radio :label="2">关闭</el-radio>
          </el-radio-group>
        </el-form-item>   
      </el-form>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">取 消</el-button>
        <el-button type="primary" @click="dialog = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="给管理员加款" :visible.sync="moneyDialog">
      <el-form ref="form" :model="form" label-width="140px">
        <el-form-item label="管理员用户名：">
          <div>急急急</div>
        </el-form-item>
        <el-form-item label="加/扣款金额：">
          <el-input v-model="form.name" placeholder="请输入金额"></el-input>
        </el-form-item>
        <el-form-item label="操作类型：">
          <el-select v-model="form.region" placeholder="请选择">
            <el-option label="加款给管理员" value="shanghai"></el-option>
            <el-option label="扣款管理员余额" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">取 消</el-button>
        <el-button type="primary" @click="dialog = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="给管理员加款" :visible.sync="moneyDialog">
      <el-form ref="form" :model="form" label-width="140px">
        <el-form-item label="管理员用户名：">
          <div>急急急</div>
        </el-form-item>
        <el-form-item label="加/扣款金额：">
          <el-input v-model="form.name" placeholder="请输入金额"></el-input>
        </el-form-item>
        <el-form-item label="操作类型：">
          <el-select v-model="form.region" placeholder="请选择">
            <el-option label="加款给管理员" value="shanghai"></el-option>
            <el-option label="扣款管理员余额" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">取 消</el-button>
        <el-button type="primary" @click="dialog = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="查看明细" :visible.sync="detailDialog" width="80%">
      <div class="filter">
        交易类型：
        <el-select v-model="form.type" >
          <el-option label="全部类型" value="" />
          <el-option label="超级管理员加款" value="1" />
          <el-option label="超级管理员扣款" value="2" />
          <el-option label="客户加款" value="3" />
          <el-option label="客户扣款" value="4" />
          <el-option label="红包发放扣款" value="5" />
        </el-select>
        <el-date-picker v-model="form.value1" type="daterange" range-separator="至" start-placeholder="开始日期"  end-placeholder="结束日期"></el-date-picker>
        <el-button type="primary">查询</el-button>
      </div>
      <el-table :data="tableData3" style="width: 100%" :header-cell-style="{background:'#eef1f6',color:'#606266'}" >
         <el-table-column :show-overflow-tooltip="true" prop="id" label="操作人"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="name" label="操作对象" > </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="rname" label="操作时间" show-overflow-tooltip> </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="state" label="操作金额" show-overflow-tooltip> </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="ip" label="变化前" show-overflow-tooltip> </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="qq" label="变化后" show-overflow-tooltip> </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="wei" label="变化类型" show-overflow-tooltip> </el-table-column>
      </el-table>
      <el-pagination background layout="prev, pager, next, jumper" :total="1000"> </el-pagination>
    </el-dialog>
  </div>
</template>

<script>

import { getAdministratorsList, deletaUser } from '@/api/meun6/menu6-1/index'
export default {
  data() {
    return {
      detailDialog: false,
      moneyDialog: false,
      addDialog: false,
      updateDialog: false,
      form: {},
      tableData: [],
      tableData3: [],
      currentPage: 1,
      detailTable: [],
      tableDataInfo: {
        pageNum: 1,// 当前页数
        pageSize: 20, //每页条数
        total: 0, //数据总共条数
        userType: 1 // 管理用户
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.tableDataInfo = {
        pageNum: this.tableDataInfo.pageNum,
        pageSize: val,
        total: this.tableDataInfo.total
      }
      this.getAdministratorsList()
    },
    handleCurrentChange(val) {
      this.tableDataInfo = {
        pageNum: val,
        pageSize: this.tableDataInfo.pageSize,
        total: this.tableDataInfo.total
      }
      this.getAdministratorsList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 获取用户列表
    getAdministratorsList() {
      getAdministratorsList(this.tableDataInfo).then(res => {
        res.body.records.forEach(function (item) {
          item.visible = false
        })
        this.tableData = res.body.records
        this.tableDataInfo = {
          pageNum: res.body.current,
          pageSize: res.body.size,
          total: res.body.total 
        }
        this.loading = false
      }).catch(err => {
          this.loading = false
      })
    },

    // 删除用户
    deleteTask (data) {
      this.$refs[`popover-${data.$index}`].doClose()
      deletaUser({id: data.row.userID}).then(res => {
        if (res.code === 1001) {
          this.$notify({
            title: res.msg,
            type: 'success'
          })
          this.getAdministratorsList();
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
  created(){
      this.getAdministratorsList();
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
.container {
  .tips {
    color:#F56C6C;
    font-size:12px;
    padding:20px 0;
  }
  padding:0 30px;
  .el-table {
    margin-top:20px;
  }
  .filter {
  }
  .el-form {
    .el-input {
      width:300px;
    }
    .el-select {
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

