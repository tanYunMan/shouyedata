<template>
  <div class="container menu8-3-container">
    <div class="filter-wrap">
      <span>查询信息：</span>
      <el-input v-model="form.w" placeholder="请输入关键字" style="width:200px;"></el-input>
      <el-select v-model="form.type" placeholder="自营订单">
        <el-option label="自营订单" value="1"></el-option>
        <el-option label="手工订单" value="2"></el-option>
      </el-select>
      <el-select v-model="form.type" placeholder="购买订单号">
        <el-option label="购买订单号" value="1"></el-option>
        <el-option label="客户编号" value="2"></el-option>
        <el-option label="商品编号" value="3"></el-option>
        <el-option label="供货商编号" value="1"></el-option>
        <el-option label="充值账号" value="2"></el-option>
        <el-option label="商品名称" value="3"></el-option>
        <el-option label="平台对接订单号" value="1"></el-option>
        <el-option label="全网通对接订单号" value="2"></el-option>
        <el-option label="处理人" value="3"></el-option>
        <el-option label="退款人" value="1"></el-option>
      </el-select>
      <el-date-picker v-model="form.t" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>

      <el-checkbox-group v-model="checkList" style="display:inline-block;margin:0 10px;">
        <el-checkbox label="等待处理"></el-checkbox>
        <el-checkbox label="处理中"></el-checkbox>
        <el-checkbox label="交易成功"></el-checkbox>
        <el-checkbox label="已退单" ></el-checkbox>
        <el-checkbox label="成功已退款"></el-checkbox>
      </el-checkbox-group>
      <el-button type="primary" icon="el-icon-search">查询</el-button>
    </div>
    <el-table border row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" >
       <el-table-column :show-overflow-tooltip="true" type="selection" > </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label1" label="商品"  ></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label2" label="数量"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label3" label="购买客户" ></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label10" label="充值账号"></el-table-column>
    </el-table>
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="400"> </el-pagination>

    <!-- 发布公告 -->
    <el-dialog title="发布公告" :visible.sync="dialog1" width="60%" class="dialog1">
      <el-form ref="form" :model="form" label-width="140px">
         <el-form-item label="公告类型：">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option label="首页公告" value="1"></el-option>
            <el-option label="行业动态" value="1"></el-option>
            <el-option label="常见问题" value="1"></el-option>
            <el-option label="帮助信息" value="1"></el-option>
            <el-option label="最新动态" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公告标题：">
          <el-input v-model="form.name" placeholder="请输入公告标题" style="float:left;"></el-input>
          <el-color-picker v-model="color" style="float:left;margin:0 20px"></el-color-picker>
          <el-checkbox v-model="form.k">置顶</el-checkbox>
        </el-form-item>
        <el-form-item label="公告显示状态：">
          <el-radio-group v-model="form.t">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="2">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="公告来源：">
          <el-radio-group v-model="form.t">
            <el-radio :label="1">本地内容</el-radio>
            <el-radio :label="2">外部链接</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="公告链接url：">
          <el-input v-model="form.name" placeholder="请输入公告链接url" ></el-input>
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

