<template>
  <div class="container menu2-1-container">
    <el-alert show-icon title="小提示：根域名只有审核通过后才可使用" type="success" style="margin-bottom:20px;"></el-alert>
    <div class="filter-wrap">
      <el-checkbox-group v-model="checkList" style="display:inline-block;margin-right:20px;">
        <el-checkbox label="复选框 A">官方域名</el-checkbox>
        <el-checkbox label="复选框 B">我的域名</el-checkbox>
      </el-checkbox-group> 
      <el-button type="primary" icon="el-icon-edit" @click="dialog1 = true">添加域名</el-button>
    </div>
    <el-table border row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" >
      <!--  <el-table-column :show-overflow-tooltip="true" type="selection" > </el-table-column> -->
       <el-table-column :show-overflow-tooltip="true" prop="label1" label="根域名"  ></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label2" label="备案人姓名"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label3" label="备案人身份证号" ></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label10" label="备案人电话"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label10" label="备案人地址"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label10" label="是否启用"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label10" label="审核状态"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label9" label="操作" align="center" width="250">
        <template slot-scope="scope">
          <el-button type="text" size="mini" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="400"> </el-pagination>

    <!-- 添加域名 -->
    <el-dialog title="域名添加" :visible.sync="dialog1" width="60%" class="dialog1">
      <el-form ref="form" :model="form" label-width="140px">
        <el-form-item label="根域名：">
          <el-input v-model="form.name" placeholder="请输入根域名"></el-input>
          <span class="tips">不包含www,如 kayixin.com</span>
        </el-form-item>
        <el-form-item label="备案人姓名：">
          <el-input v-model="form.name" placeholder="请输入备案人姓名"></el-input>
        </el-form-item>
        <el-form-item label="备案人身份证：">
          <el-input v-model="form.name" placeholder="请输入备案人身份证"></el-input>
        </el-form-item>
        <el-form-item label="备案人电话：">
          <el-input v-model="form.name" placeholder="请输入备案人电话"></el-input>
          <span class="tips">请确保电话畅通，便于审核人员联系</span>
        </el-form-item>
        <el-form-item label="备案人地址：">
          <el-input v-model="form.name" placeholder="请输入备案人地址"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog1 = false">取 消</el-button>
        <el-button type="primary" @click="dialog1 = false">发 布</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
export default {
  data() {
    return {
      color:'#333',
      form:{},
      dialog1:false,
      currentPage:1,
      checkList:[],
      tableData: [
        {
          label1:'1',
          label2:'名称',
          label3:'0.0',
          label5:'自动发货',
          label6:'目录',
          label7:'99',
          label8:'10'
        },
      ],
      multipleSelection: []
    }
  },
  components: {
    Tinymce
  },
  methods: {
    handleSizeChange(val) {
      console.log(val)
    },
    handleCurrentChange(val) {
      console.log(val)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  }
}
</script>
<style lang="scss">
.menu2-1-container {
  .dialog1 {
    .el-dialog__body {
      overflow: auto;
      max-height:700px;
    }
    .el-input {
      width:400px;
    }
    .tips {
      color:#909399;
      font-size:12px;
      margin-left:10px;
    }
  }
}
</style>
<style scoped lang="scss">
.container {
  padding:20px;
  .tab-wrap {
    a {
      &.active {
        border-bottom:2px solid #409eff
      }
    }
  }
  .filter-wrap {
    margin-top:20px;
  }
  .handle-wrap {
    // margin-top:20px;
    margin-bottom:20px;
  }
  
}
</style>

