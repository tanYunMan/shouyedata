<template>
  <div class="container menu2-1-container">
    <div class="tab-wrap">
      <a to="sub1" @click="type = 1" :class="{'active':type == 1}">自有商品收入转余额</a>
      <a to="sub1" @click="type = 2" :class="{'active':type == 2}">转余额申请列表</a>
      <a to="sub1" @click="type = 3" :class="{'active':type == 3}">未转余额变化明细</a>
    </div>
    <div v-show="type == 1">
      <el-form ref="form" :model="form" label-width="140px">
        <el-form-item label="用户编号：">
          <el-input v-model="form.name" placeholder="请输入用户编号" style="width:400px;"></el-input>
          <el-button type="primary" icon="el-icon-search">查询</el-button>
        </el-form-item>
        <el-form-item label="未转收入：">
          <span style="color:red">0</span> <span>元</span>
        </el-form-item>
        <el-form-item label="转余额的金额：">
          <el-input v-model="form.name" placeholder="请输入转余额的金额" style="width:400px;"></el-input>
          <span>元</span>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" >确 定</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-show="type == 2">
      <div class="filter-wrap">
        <span>用户编号：</span>
        <el-input placeholder="请输入用户编号" class="search-input" style="width:200px;"></el-input>
        <el-select v-model="form.type" placeholder="用户编号">
          <el-option label="用户编号" value="1"></el-option>
          <el-option label="登录名称" value="2"></el-option>
        </el-select>
        <el-select v-model="form.type" placeholder="全部处理状态">
          <el-option label="全部处理状态" value="1"></el-option>
          <el-option label="未处理" value="2"></el-option>
          <el-option label="已处理" value="3"></el-option>
          <el-option label="已驳回" value="3"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search">查询</el-button>
      </div>
      <el-table border row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" >
         <el-table-column :show-overflow-tooltip="true" type="selection" > </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label1" label="申请人"  ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label2" label="申请时间"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label3" label="申请金额" ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="处理人"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="操作"  fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="dialog1 = true">未处理</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="400"> </el-pagination>
    </div>
    <div v-show="type == 3">
      <div class="filter-wrap">
        <span>用户编号：</span>
        <el-input placeholder="请输入用户编号" class="search-input" style="width:200px;"></el-input>
        <el-date-picker v-model="form.t" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
        <el-checkbox-group v-model="checkList" style="display:inline-block;margin-right:20px;">
          <el-checkbox label="复选框 A">供货收入</el-checkbox>
          <el-checkbox label="复选框 B">申请转余额</el-checkbox>
          <el-checkbox label="复选框 B">驳回转余额</el-checkbox>
          <el-checkbox label="复选框 B">管理员手动转余额</el-checkbox>
        </el-checkbox-group> 
        
        <el-button type="primary" icon="el-icon-search">查询</el-button>
      </div>
      <el-table border row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" >
        <!--  <el-table-column :show-overflow-tooltip="true" type="selection" > </el-table-column> -->
         <el-table-column :show-overflow-tooltip="true" prop="label1" label="客户"  ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label2" label="交易时间"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label3" label="交易金额" ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="交易类型"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="变化状态"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="变化前"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="变化后"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="备注"></el-table-column>
      </el-table>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="400"> </el-pagination>
    </div>
    

    <!-- 未处理 -->
    <el-dialog title="自有商品收入转余额处理" :visible.sync="dialog1" width="60%" class="dialog1">
      <el-form ref="form" :model="form" label-width="140px">
        <el-form-item label="申请人：">
          <div>互管DD 出密收徒(10112)</div>
        </el-form-item>
        <el-form-item label="申请时间：">
          <div>2019-11-21 02:02</div>
        </el-form-item>
        <el-form-item label="申请金额：">
          <div>115.000</div>
        </el-form-item>
        <el-form-item label="处理人：">
          <div>xxx</div>
        </el-form-item>
        <el-form-item label="处理操作：">
          <el-radio-group v-model="form.t">
            <el-radio :label="1">处理</el-radio>
            <el-radio :label="2">驳回</el-radio>
          </el-radio-group>
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
      type:3,
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

