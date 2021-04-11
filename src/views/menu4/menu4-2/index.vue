<template>
  <div class="container menu2-1-container">
    <div class="filter-wrap">
      <!-- <span>查询条件：</span>
      <el-select v-model="form.type" placeholder="商品名称">
        <el-option label="商品名称" value="1"></el-option>
        <el-option label="供货平台" value="2"></el-option>
      </el-select>
      <el-input v-model="form.d" placeholder="请输入关键字" style="width:200px;"></el-input>
      <el-button type="primary" icon="el-icon-search">查询</el-button> -->
      <el-button type="primary" icon="el-icon-search" @click="dialog2 = true">添加供货方网站</el-button>
    </div>
      <el-table border row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" >
        <!--  <el-table-column :show-overflow-tooltip="true" type="selection" > </el-table-column> -->
         <el-table-column :show-overflow-tooltip="true" prop="label1" label="添加时间"  ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label2" label="商户信息"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label3" label="商户域名" ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="状态">
          <template slot-scope="scope">
            <el-button type="text" size="mini">显示</el-button>
          </template>
        </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="操作"  fixed="right" width="200">
          <template slot-scope="scope">
            <el-button type="text" size="mini">删除</el-button>
            <el-button type="text" size="mini" @click="dialog1 = true">目录设置</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="400"> </el-pagination>
    
    <!-- 目录设置 -->
    <el-dialog title="对接目录设置" :visible.sync="dialog1" width="60%" class="dialog1">
      <el-tree :data="treeData" show-checkbox node-key="id" :default-expand-all="true"> </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog1 = false">取 消</el-button>
        <el-button type="primary" @click="dialog1 = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加供货方网站 -->
    <el-dialog title="对接目录设置" :visible.sync="dialog2" width="60%" class="dialog2">
      <el-form ref="form" :model="form" label-width="140px">
        <el-form-item label="供货方名称：">
           <el-input v-model="form.name" placeholder="请输入供货方名称" style="width:400px;"></el-input>
           <span class="tips">备注供货方名称，尽量简短</span>
        </el-form-item>
        <el-form-item label="供货方域名：">
           <el-input v-model="form.name" placeholder="请输入供货方域名" style="width:400px;"></el-input>
           <div class="tips" style="margin-left:0;">供货方网站域名，不包含http:// 如：www.11ka.cn</div>
        </el-form-item>
        <el-form-item label="注册编号：">
           <el-input v-model="form.name" placeholder="请输入注册编号" style="width:400px;"></el-input>
           <span class="tips">在供货方网站注册的编号</span>
        </el-form-item>
        <el-form-item label="对接秘钥：">
           <el-input v-model="form.name" placeholder="请输入对接秘钥" style="width:400px;"></el-input>
           <span class="tips">联系供货方索要秘钥</span>
        </el-form-item>
        <el-form-item label="">
           <el-checkbox v-model="checked" style="color:#409eff">阅读并同意 《商户对接协议》</el-checkbox>
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
      dialog2:false,
      currentPage:1,
      checked:false,
      treeData: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
           
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
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
    go() {
      this.$router.push({path:'/menu4/1/sub1'})
    },
    go1() {
      this.$router.push({path:'/menu4/1/sub2'})
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

