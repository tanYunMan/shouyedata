<template>
  <div class="container menu2-1-container">
    <div class="filter-wrap">
      <span>查询条件：</span>
      <el-select v-model="form.type" placeholder="商品编号">
        <el-option label="商品编号" value="1"></el-option>
        <el-option label="商品名称" value="2"></el-option>
        <el-option label="商品面值" value="2"></el-option>
      </el-select>
      <el-input v-model="form.d" placeholder="请输入关键字" style="width:200px;"></el-input>
      <el-button type="primary" icon="el-icon-search">查询</el-button>
      <el-button type="primary" @click="dialog1 = true">批量对接</el-button>
    </div>
    <ul>
      <li v-for="(item,index) in listData" :key="index" >
        <div style="padding:8px 0;"><el-checkbox v-model="item.id" style="color:red">{{item.label}}</el-checkbox></div>
        <ul v-if="item.children">
          <li v-for="(item1,index1) in item.children" :key="index1">
            <div style="padding:8px 0;"><el-checkbox v-model="item.id" style="color:#FF00FF">{{item1.label}}</el-checkbox></div>
            <ul v-if="item1.children">
              <!-- <li v-for="(item2,index2) in item1.children" :key="index2"> -->
                <!-- <div><el-checkbox v-model="item.id">{{item2.label}}</el-checkbox></div> -->
                 <el-checkbox-group v-model="checkList">
                    <el-checkbox v-for="(item2,index2) in item1.children" :key="index2" :label="item2.id">{{item2.label}}</el-checkbox>
                  </el-checkbox-group>
              <!-- </li> -->
            </ul>
          </li>
          
        </ul>
      </li>
      
    </ul>

    

    <!-- 一级目录对接-->
    <el-dialog title="批量对接" :visible.sync="dialog1" w class="dialog1">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="选择定价：">
          <el-table border row-key="id" :data="tableData5" style="width: 100%;" >
           <el-table-column :show-overflow-tooltip="true" prop="label1" label="" min-width="20%"></el-table-column>
           <el-table-column :show-overflow-tooltip="true" prop="label2" label="" min-width="20%"></el-table-column>
           <el-table-column :show-overflow-tooltip="true" prop="label3" label="" min-width="60%">
            <template slot-scope="scope">
              <el-select v-model="scope.row.label3.type" placeholder="请选择" style="width:30%;">
                <el-option label="全额累加" value="1"></el-option>
                <el-option label="折扣累加" value="2"></el-option>
              </el-select>
              <el-input style="width:30%" v-model="scope.row.label3.value"></el-input>
              <span style="margin-left:15px;">元 + 我的进货价</span>
            </template>
          </el-table-column>
        </el-table>
        </el-form-item>
        <el-form-item label="选择目录：">
          <el-checkbox-group v-model="checkList">
            <el-checkbox style="display:block;">一级</el-checkbox>
            <el-checkbox style="display:block;">一级</el-checkbox>
            <el-checkbox style="display:block;">一级</el-checkbox>
            <el-checkbox style="display:block;">一级</el-checkbox>
            <el-checkbox style="display:block;">一级</el-checkbox>
            <el-checkbox style="display:block;">一级</el-checkbox>
            <el-checkbox style="display:block;">一级</el-checkbox>
          </el-checkbox-group>
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
      checkList:[],
      listData:[
        {
          label:'【平台服务专区】',
          id:1,
          children:[
            {
              label:'★【　资金提现联系站长　】★',
              id:11,
              children:[
                {label:'商品1',id:111},
                {label:'商品2',id:112}
              ]
            },
            {
              label:'★【　消费任意金额进售后群　】',
              id:12,
              children:[
                {label:'商品1',id:121},
                {label:'商品2',id:122}
              ]
            }
          ]
        },
        {
          label:'┈━═☆ 号学习资料专区 ☆═━┈☆═━┈',
          id:2,
          children:[
            {
              label:'「　永久黑　」（冷热混合）',
              id:21,
              children:[
                {label:'商品1',id:211},
                {label:'商品2',id:212}
              ]
            },
            {
              label:'「　三无白　」（永不找回）',
              id:22,
              children:[
                {label:'商品1',id:221},
                {label:'商品2',id:222}
              ]
            }
          ]
        }
      ],
      multipleSelection: [],
      tableData5:[
        {
          label1:'VIP',
          label2:10,
          label3:{
            type:'1',
            value:10
          }
        },
        {
          label1:'VIP1',
          label2:10,
          label3:{
            type:'1',
            value:10
          }
        },
        {
          label1:'VIP2',
          label2:10,
          label3:{
            type:'1',
            value:10
          }
        },
        {
          label1:'VIP3',
          label2:10,
          label3:{
            type:'1',
            value:10
          }
        },
        {
          label1:'SVIP',
          label2:10,
          label3:{
            type:'1',
            value:10
          }
        },
        {
          label1:'站长',
          label2:10,
          label3:{
            type:'1',
            value:10
          }
        },
        {
          label1:'对接等级',
          label2:10,
          label3:{
            type:'1',
            value:10
          }
        },
        {
          label1:"密价",
          label2:10,
          label3:{
            type:'1',
            value:10
          }
        },
        {
          label1:"最高密价",
          label2:10,
          label3:{
            type:'1',
            value:10
          }
        },
        {
          label1:"无事",
          label2:10,
          label3:{
            type:'1',
            value:10
          }
        },
      ],
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
    .el-table__header-wrapper {
      display:none;
    }
    .el-dialog__body {
      overflow: auto;
      max-height:700px;
    }
    .el-input {
      // width:400px;
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

