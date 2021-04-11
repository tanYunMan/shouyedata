<template>
  <div class="container menu8-1-container">
    <div class="filter-wrap">
      <span>商户编号：</span>
      <el-input v-model="form.w" placeholder="请输入商户编号" style="width:200px;"></el-input>
      <span>客户编号：</span>
      <el-input v-model="form.w" placeholder="请输入客户编号" style="width:200px;"></el-input>
      
      <el-date-picker v-model="form.t" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
      <el-button type="primary" icon="el-icon-search">查询</el-button>
    </div>
    <el-table border row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" >
       <el-table-column :show-overflow-tooltip="true" prop="label1" label="销售日期"  ></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label2" label="购买商品"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label3" label="数量" ></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label10" label="购买单价"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label10" label="购买总价"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label10" label="购买客户"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label10" label="总提成"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label10" label="操作"  fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="dialog2 = true">提成流程</el-button>
          <el-button type="text" size="mini" @click="dialog1 = true">订单详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="400"> </el-pagination>

    <!-- 查看详情-->
    <el-dialog title="订单详情记录" :visible.sync="dialog1" width="60%" class="dialog1">
      <div class="tab-wrap" style="margin-bottom:20px;">
        <a to="sub1" :class="{'active':orderType == 1}" @click="orderType = 1">订单基本信息</a>
        <a to="sub1" :class="{'active':orderType == 2}" @click="orderType = 2">订单处理</a>
        <a to="sub1" :class="{'active':orderType == 3}" @click="orderType = 3">金额明细</a>
        <a to="sub1" :class="{'active':orderType == 4}" @click="orderType = 4">退款明细</a>
        <a to="sub1" :class="{'active':orderType == 5}" @click="orderType = 5">销售明细</a>
        <a to="sub1" :class="{'active':orderType == 6}" @click="orderType = 6">商务资金明细</a>
      </div>
      <div class="order-type order-type1" v-show="orderType == 1">
        <div class="item">
          <el-alert title="订单信息" type="success" :closable="false"></el-alert>
          <ul>
            <li>
              <span class="label">订单编号：</span>
              <span class="val">201911205456485224</span>
            </li>
            <li>
              <span class="label">提交时间：</span>
              <span class="val">2019-11-20 08:35:50</span>
            </li>
            <li>
              <span class="label">处理时间：</span>
              <span class="val">2019-11-20 08:35:50</span>
            </li>
            <li>
              <span class="label">订单处理耗时：</span>
              <span class="val">0天 0小时0分0秒</span>
            </li>
            <li>
              <span class="label">订单状态：</span>
              <span class="val" style="color:#409EFF">0天 0小时0分0秒</span>
            </li>
            <li>
              <span class="label">退款记录：</span>
              <span class="val">无退款记录</span>
            </li>
          </ul>
        </div>
        <div class="item">
          <el-alert title="供货方" type="success" :closable="false"></el-alert>
          <ul>
            <li>
              <span class="label">订单供货方：</span>
              <span class="val">商家供货商品</span>
            </li>
            <li>
              <span class="label">供货商编号：</span>
              <span class="val">互管DD 出密收徒（10112）</span>
            </li>
          </ul>
        </div>
        <div class="item">
          <el-alert title="商品信息" type="success" :closable="false"></el-alert>
          <ul>
            <li>
              <span class="label">商品及库存：</span>
              <span class="val">老韩黑号】高质量永久年冷黑-最低是2018年最后登录，一号一邮箱，基本不存在找回，可改一切，随机皮肤。有问题请在十分钟内投诉【站长推荐】(123)</span>
            </li>
            <li>
              <span class="label">单价|数量|总价：</span>
              <span class="val">38.000元 | 1个 | 38.000元</span>
            </li>
          </ul>
        </div>
        <div class="item">
          <el-alert title="客户信息" type="success" :closable="false"></el-alert>
          <ul>
            <li>
              <span class="label">购买客户：</span>
              <span class="val">9(10695)</span>
            </li>
            <li>
              <span class="label">客户详细：</span>
              <span class="val">注册地区：00 购买客户IP:103.106.202.201</span>
            </li>
            <li>
              <span class="label">充值备注：</span>
              <span class="val">...</span>
            </li>
          </ul>
        </div>
        <div class="item">
          <el-alert title="充值信息" type="success" :closable="false"></el-alert>
        </div>
        <div class="item">
          <el-alert title="处理信息" type="success" :closable="false"></el-alert>
          <ul>
            <li>
              <span class="label">处理人：</span>
              <span class="val">自动发货</span>
            </li>
            <li>
              <span class="label">充值信息：</span>
              <span class="val">。。。。。</span>
            </li>
          </ul>
        </div>
        <div class="item">
          <el-alert title="商品详细及结果" type="success" :closable="false"></el-alert>
          <ul>
            <li>
              <span class="label">卡号：</span>
              <span class="val">giv8948@163.com----801258</span>
            </li>
            <li>
              <span class="label">密码：</span>
              <span class="val">xuxu1995611---woaibei12345---2018.8.5---273h---冷</span>
            </li>
            <li>
              <span class="label">赠品/矩阵：</span>
              <span class="val">永久有效</span>
            </li>
            <li>
              <span class="label">导卡时间：</span>
              <span class="val">	2019-11-20 08:35</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="order-type order-type2" v-show="orderType == 2">
          <el-form ref="form" :model="form" label-width="140px">
          <el-form-item label="处理进度：">
            开始：<el-input v-model="form.tf" style="width:70px;margin-right:20px;"></el-input>
            目标：<el-input v-model="form.tf" style="width:70px;margin-right:20px;"></el-input>
            当前：<el-input v-model="form.tf" style="width:70px"></el-input>
          </el-form-item>
          <el-form-item label="订单状态：">
            <el-checkbox v-model="form.tt">置为失败</el-checkbox>
            <span class="tips">仅变更订单状态，不涉及退款</span>
          </el-form-item>
          <el-form-item label="退款方式：">
            <el-radio-group v-model="form.t">
              <el-radio :label="1">供货商承担退款（中间经销商利润、手续费不退回，均由供货商承担.）</el-radio>
              <el-radio :label="2" style="margin-top:10px;">逐层退款（中间经销商利润、手续费逐一退回，会造成中间商赚取的差价被退回。）</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="退款类型：">
            <el-radio-group v-model="form.tui">
              <el-radio :label="1">全退</el-radio>
              <el-radio :label="2">部分退</el-radio>
              <el-radio :label="3">按张退</el-radio>
              <el-radio :label="4" disabled>按天退</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="退款方式：" v-if="form.tui == 2">
            <el-radio-group v-model="form.tui1">
              <el-radio :label="1">按金额</el-radio>
              <el-radio :label="2">按百分比</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="退款-金额：" v-if="form.tui == 2 && form.tui1 == 1">
            <el-input v-model="form.jjj" style="width:200px;"></el-input><span class="tips">元</span>
          </el-form-item>
          <el-form-item label="退款-比例：" v-if="form.tui == 2 && form.tui1 == 2">
            <el-input v-model="form.jjj" style="width:200px;"></el-input><span class="tips">%</span>
          </el-form-item>
          <el-form-item label="退款-卡密：" v-if="form.tui == 3">
            <el-table border row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" >
               <el-table-column :show-overflow-tooltip="true" type="selection" > </el-table-column>
               <el-table-column :show-overflow-tooltip="true" prop="label1" label="卡号"  ></el-table-column>
               <el-table-column :show-overflow-tooltip="true" prop="label2" label="密码"></el-table-column>
               <el-table-column :show-overflow-tooltip="true" prop="label3" label="赠品/矩阵" ></el-table-column>
               <el-table-column :show-overflow-tooltip="true" prop="label10" label="导卡时间"></el-table-column>
            </el-table>
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="40"> </el-pagination>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary">确认处理</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="order-type order-type3" v-show="orderType == 3">
        <el-table border row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" >
           <el-table-column :show-overflow-tooltip="true" prop="label1" label="客户"  ></el-table-column>
           <el-table-column :show-overflow-tooltip="true" prop="label2" label="交易类型"></el-table-column>
           <el-table-column :show-overflow-tooltip="true" prop="label3" label="变动类型" ></el-table-column>
           <el-table-column :show-overflow-tooltip="true" prop="label10" label="交易金额"></el-table-column>
           <el-table-column :show-overflow-tooltip="true" prop="label10" label="变化前(元)"></el-table-column>
           <el-table-column :show-overflow-tooltip="true" prop="label10" label="变化后(元)"></el-table-column>
           <el-table-column :show-overflow-tooltip="true" prop="label10" label="交易日期"></el-table-column>
        </el-table>
      </div>
      <div class="order-type order-type4" v-show="orderType == 4">
        <el-table border row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" >
           <el-table-column :show-overflow-tooltip="true" prop="label1" label="退款金额"  ></el-table-column>
           <el-table-column :show-overflow-tooltip="true" prop="label2" label="处理人"></el-table-column>
           <el-table-column :show-overflow-tooltip="true" prop="label3" label="处理时间" ></el-table-column>
        </el-table>
      </div>
      <div class="order-type order-type5" v-show="orderType == 5">
        <el-table border row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" >
           <el-table-column :show-overflow-tooltip="true" prop="label1" label="销售额"  ></el-table-column>
           <el-table-column :show-overflow-tooltip="true" prop="label2" label="销售提成"></el-table-column>
           <el-table-column :show-overflow-tooltip="true" prop="label3" label="手续费" ></el-table-column>
           <el-table-column :show-overflow-tooltip="true" prop="label1" label="入账金额"  ></el-table-column>
           <el-table-column :show-overflow-tooltip="true" prop="label2" label="退款额"></el-table-column>
           <el-table-column :show-overflow-tooltip="true" prop="label3" label="进货额" ></el-table-column>
        </el-table>
      </div>
      <div class="order-type order-type6" v-show="orderType == 6">
        <el-table border row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" >
           <el-table-column :show-overflow-tooltip="true" prop="label1" label="客户"  ></el-table-column>
           <el-table-column :show-overflow-tooltip="true" prop="label2" label="交易类型"></el-table-column>
           <el-table-column :show-overflow-tooltip="true" prop="label3" label="变动类型" ></el-table-column>
           <el-table-column :show-overflow-tooltip="true" prop="label10" label="交易金额"></el-table-column>
           <el-table-column :show-overflow-tooltip="true" prop="label10" label="变化前(元)"></el-table-column>
           <el-table-column :show-overflow-tooltip="true" prop="label10" label="变化后(元)"></el-table-column>
           <el-table-column :show-overflow-tooltip="true" prop="label10" label="交易日期"></el-table-column>
        </el-table>
      </div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialog1 = false">取 消</el-button>
        <el-button type="primary" @click="dialog1 = false">发 布</el-button>
      </span> -->
    </el-dialog>
    <!-- 提成流程 -->
    <el-dialog title="提成明细" :visible.sync="dialog2" width="60%" class="dialog2">
      <el-table border row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" >
        <!--  <el-table-column :show-overflow-tooltip="true" prop="label1" label="销售日期"  ></el-table-column> -->
         <el-table-column :show-overflow-tooltip="true" prop="label2" label="层数"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label3" label="下级客户" ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="下级价"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="上级客户"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="上级价"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="单价提成"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="提成金额"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
export default {
  data() {
    return {
      color:'#333',
      form:{
        tui:1,
        tui1:1
      },
      dialog1:false,
      dialog2:false,
      currentPage:1,
      orderType:1,
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
.menu8-1-container {
  .tips {
    color:#909399;
    font-size:12px;
    line-height:20px;
    width:400px;
    margin-left:10px;
  }
  .dialog1 {
    .el-dialog__body {
      overflow: auto;
      max-height:700px;
    }
    
    .el-input {
      width:400px;
    }
    .el-pagination {
      .el-input {
        width:50px;
      }
    }
    .order-type1 {
      .item {
        margin-top:20px;
      }
      li {
        display:flex;
        padding:8px 0;
        // align-items: center;
        .label {
          font-weight: bold;
          margin-right:10px;
          width:120px;
          text-align: right;
        }
        .val {
          flex:1;
          font-size:14px;

        }
      }
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
    .el-input,.el-select {
      width:130px;
    }
  }
  .handle-wrap {
    // margin-top:20px;
    margin-bottom:20px;
  }
  
}
</style>

