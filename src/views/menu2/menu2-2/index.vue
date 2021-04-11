<template>
  <div class="container menu2-1-container">
    <div class="tab-wrap">
      <a to="sub1"  :class="{'active':type == 1}" @click="type = 1">收件箱</a>
      <a to="sub1" :class="{'active':type == 2}" @click="type = 2">发件箱</a>
    </div>
    <div class="filter-wrap">
      <span>查询条件：</span>
      <el-select v-model="form.type" placeholder="请选择">
        <el-option label="全部" value="1"></el-option>
        <el-option label="未读" value="2"></el-option>
        <el-option label="已读未回复" value="3"></el-option>
        <el-option label="已读已回复" value="4"></el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-search">查询</el-button>
      <el-button type="primary" @click="dialog1 = true">短信发送</el-button>
      <el-button type="danger">删除</el-button>
    </div>
    <div class="recevie-wrap" v-show="type == 1">
      <el-table border row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" >
         <el-table-column :show-overflow-tooltip="true" type="selection" > </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label1" label="选择"  ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label2" label="发送人"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label3" label="短信标题" ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="收到时间"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="状态"></el-table-column>
      </el-table>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="400"> </el-pagination>
    </div>
    <div class="send-wrap" v-show="type == 2">
      <el-table border row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" >
         <el-table-column :show-overflow-tooltip="true" type="selection" > </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label1" label="选择"  ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label2" label="短信标题"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label3" label="发送时间" ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="备注"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="详情">
          <template slot-scope="scope">
            <el-button type="text" size="mini" >查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="400"> </el-pagination>
    </div>

    <!-- 短信发送 -->
    <el-dialog title="短信发送" :visible.sync="dialog1" width="60%" class="dialog1">
      <el-form ref="form" :model="form" label-width="140px">
        <el-form-item label="短信接收人类型：">
          <el-radio-group v-model="form.t">
            <el-radio :label="1">指定用户</el-radio>
            <el-radio :label="2">指定级别</el-radio>
            <el-radio :label="3">全部发送</el-radio>
            <el-radio :label="4">指定权限</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="短信接收人：">
          <el-input v-model="form.name" placeholder="请输入短信接收人" style="width:400px;"></el-input>
          <span class="tips">多个客户编号中间请用半角逗号隔开</span>
        </el-form-item>
        <el-form-item label="短信主题：">
          <el-input v-model="form.name" placeholder="请输入短信主题" style="width:400px;"></el-input>
        </el-form-item>
        <el-form-item label="短信内容：">
          <el-input type="textarea" v-model="form.name" :rows="5" placeholder="请输入短信内容" style="width:400px;"></el-input>
        </el-form-item>
        <el-form-item label="强制用户查看：">
          <el-radio-group v-model="form.t">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog1 = false">取 消</el-button>
        <el-button type="primary" @click="dialog1 = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
export default {
  data() {
    return {
      type:1,
      color:'#333',
      form:{},
      dialog1:false,
      currentPage:1,
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
  }
}
</style>
<style scoped lang="scss">
.container {
  padding:20px;
  .tips {
    color:#909399;
    font-size:12px;
    line-height:20px;
    width:400px;
    margin-left:10px;
  }
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

