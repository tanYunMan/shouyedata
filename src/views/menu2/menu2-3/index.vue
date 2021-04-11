<template>
  <div class="container menu2-1-container">
    <div class="tab-wrap">
      <a to="sub1" :class="{'active':type == 1}" @click="typeEvent(1)">后台登录日志</a>
      <a to="sub1" :class="{'active':type == 2}" @click="typeEvent(2)">前台登录日志</a>
      <a to="sub1" :class="{'active':type == 3}" @click="typeEvent(3)">后台操作日志</a>
      <a to="sub1" :class="{'active':type == 4}" @click="typeEvent(4)">前台操作日志</a>
      <a to="sub1" :class="{'active':type == 5}" @click="typeEvent(5)">异常登录日志</a>
    </div>
    <div class="filter-wrap">
      <span>查询关键字：</span>
      <el-input placeholder="请输入关键字" class="search-input" style="width:200px;"></el-input>
      <el-select v-model="form.type" placeholder="用户编号">
        <el-option label="用户编号" value="1"></el-option>
        <el-option label="登录名称" value="2"></el-option>
      </el-select>
      <el-select v-model="form.type" placeholder="全部类型用户">
        <el-option label="全部类型用户" value="1"></el-option>
        <el-option label="平台客户" value="2"></el-option>
        <el-option label="代理员工" value="3"></el-option>
      </el-select>
      <el-date-picker v-model="form.t" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
      <el-button type="primary" icon="el-icon-search">查询</el-button>
    </div>
    <div class="title" style="font-weight:500;font-size:13px;color:#409EFF" v-show="type== 2">登录数据汇总  登录总人数：2人，登录总次数：2次</div>
    <div class="recevie-wrap" v-show="type == 1 || type == 2">
      <el-table border row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" >
         <el-table-column :show-overflow-tooltip="true" prop="label1" label="客户类型"  ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label2" label="日期"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label3" label="操作人" ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="所属负责人"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="登录IP"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="IP所在地区"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="登录详细"></el-table-column>
      </el-table>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="400"> </el-pagination>
    </div>
    <div class="send-wrap" v-show="type == 3 || type == 4">
      <el-table border row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" >
         <el-table-column :show-overflow-tooltip="true" type="selection" > </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label1" label="日期"  ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label2" label="操作人"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label3" label="员工" ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="详细"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="操作对象"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="操作IP"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="类型"></el-table-column>
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
    typeEvent(val) {
      console.log('jkjkj')
      this.type = val
    }
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

