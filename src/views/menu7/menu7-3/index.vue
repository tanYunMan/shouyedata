<template>
  <div class="container menu7-3-container">
    <div class="filter-wrap">
      <el-button type="primary" @click="dialog1 = true">发布公告</el-button>
    </div>
    <el-table border row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" >
      <!--  <el-table-column :show-overflow-tooltip="true" type="selection" > </el-table-column> -->
       <el-table-column :show-overflow-tooltip="true" prop="label1" label="公告标题"  ></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label2" label="显示状态">
        <template slot-scope="scope">
          <el-button type="text" size="mini" >隐藏</el-button>
        </template>
      </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label3" label="添加时间" ></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label10" label="操作"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label9" label="操作" align="center" width="250">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="dialog1 = true">修改</el-button>
          <el-button type="text" size="mini" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="400"> </el-pagination>
    <!-- 发布公告 -->
    <el-dialog title="发布公告" :visible.sync="dialog1" width="60%" class="dialog1">
      <el-form ref="form" :model="form" label-width="140px">
        <el-form-item label="公告标题：">
          <el-input v-model="form.name" placeholder="请输入公告标题" style="float:left;width:45%"></el-input>
          <el-color-picker v-model="color" style="float:left;margin:0 20px"></el-color-picker>
        </el-form-item>
        <el-form-item label="公告显示状态：">
          <el-radio-group v-model="form.t">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="2">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="公告内容：">
          <tinymce v-model="form.j" :height="300" />
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

