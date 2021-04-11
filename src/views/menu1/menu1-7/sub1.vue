<template>
  <div class="container">
    <div class="filter-wrap">
      <el-button type="primary" @click="addDialog = true">新增</el-button>
    </div>
    <el-table :data="tableData3" style="width: 100%" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
       <el-table-column :show-overflow-tooltip="true" prop="id" label="用户组"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="name" label="描述" > </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="rname" label="授权" show-overflow-tooltip> </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="state" label="状态" show-overflow-tooltip> </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="ip" label="操作" show-overflow-tooltip> </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next, jumper" :total="1000"> </el-pagination>

    <el-dialog title="新增" :visible.sync="addDialog" >
      <el-form ref="form" :model="form" label-width="140px">
        <el-form-item label="用户组">
          <el-input v-model="form.name" placeholder="请输入用户组"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.name" type="textarea" :rows="6" placeholder="请输入描述"></el-input>
        </el-form-item>
        
      </el-form>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">取 消</el-button>
        <el-button type="primary" @click="dialog = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      addDialog:false,
      form:{
        type:''
      },
      tableData3: [
      {
        id: '1',
        name: '2',
        rname: '3',
        state:'4',
        ip:'5',
      }],
    }
  },
  methods: {
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
    .el-input,.el-textarea {
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

