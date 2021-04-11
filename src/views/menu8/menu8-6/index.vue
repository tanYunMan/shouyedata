<template>
  <div class="container menu8-1-container">
    <div class="filter-wrap">
      <span>商品编号：</span>
      <el-input type="number" v-model="queryParams.goodsID" placeholder="请输入商品编号" class="search-input"></el-input>
      
      <span>供货商编号：</span>
      <el-input type="number" v-model="queryParams.supplierID" placeholder="请输入供货商编号" class="search-input"></el-input>

      <span>订单号：</span>
      <el-input v-model="queryParams.orderCode" placeholder="请输入订单号" style="width:200px;" />

      <span>商品名称：</span>
      <el-input v-model="queryParams.goodsName" placeholder="请输入商品名称" style="width:200px;" />

      <span>商品类型：</span>
      <el-select v-model="queryParams.goodsTypeName" placeholder="请选择">
        <el-option v-for="item in goodsType" :key="item.key" :label="item.text" :value="item.text" />
      </el-select>

      <span>卡：</span>
      <el-input v-model="queryParams.cardNumber" placeholder="请输入卡号或卡密" style="width:200px;" />

      <el-date-picker v-model="selectDatetime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" @change="dataSearch" />
      <el-button type="primary" @click="searchTime(0)">今天</el-button>
      <el-button type="primary" @click="searchTime(1)">昨天</el-button>
      <el-button type="primary" @click="searchTime(2)">三天内</el-button>
      <el-button type="primary" @click="searchTime(6)">七天内</el-button>
      <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
    </div>
    <el-table ref="multipleTable" v-loading="loading" border row-key="id" :data="tableData" style="width: 100%" :header-cell-style="{background:'#f5f5f5',color:'#606266','text-align':'center'}" size="mini" :cell-style="{'text-align':'center'}" @selection-change="handleSelectionChange">
      <el-table-column :show-overflow-tooltip="true" prop="orderCode" label="订单号" width="180"/>
      <el-table-column :show-overflow-tooltip="true" prop="goodsName" label="商品名称" width="300" align="left">
        <template slot-scope="scope">
          <div v-if="scope.row.goodsName.length < 10">
            <span :style="{'color':scope.row.color}" :class="{'font-blod':scope.row.isBlod == 1}">{{ scope.row.goodsName }}</span>
          </div>

          <el-popover v-else trigger="hover" placement="top">
            <p>商品名称: {{ scope.row.goodsName }}</p>
            <div slot="reference" class="name-wrapper">
              <div class="el-hidden-tc">
                <span :style="{'color':scope.row.color}" :class="{'font-blod':scope.row.isBlod == 1}">{{ scope.row.goodsName }}</span>
              </div>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="goodsTypeName" label="商品类型" width="80"/>
      <el-table-column :show-overflow-tooltip="true" prop="supplierName" label="供应商" width="150"/>
      <el-table-column :show-overflow-tooltip="true" prop="goodsUserName" label="购买客户" width="200"/>
      <el-table-column :show-overflow-tooltip="true" prop="orderPrice" label="购价" width="60"/>
      <el-table-column :show-overflow-tooltip="true" prop="goodsNum" label="数量" width="60"/>
      <el-table-column :show-overflow-tooltip="true" prop="createTime" label="销售日期" width="150"/>
      <el-table-column :show-overflow-tooltip="true" prop="supplierName" label="订单状态" width="80">
        <template slot-scope="scope">
          <span :style="orderStateColor(scope.row.orderState)">{{ orderState(scope.row.orderState) }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="label10" label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-search" @click="orderInfo(scope.row.orderID)">订单详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />

    <!-- 查看详情-->
    <el-dialog title="订单详情记录" :visible.sync="dialog1" class="dialog1 wl-dialog-style" @closed="closeOrderInfo">
      <div class="tab-wrap" style="margin-bottom:20px;">
        <a to="sub1" :class="{'active':orderType == 1}" @click="orderType = 1">订单基本信息</a>
        <a v-if="dataInfo.length>0 && dataInfo[0].orderState<5" to="sub1" :class="{'active':orderType == 2}" @click="orderType = 2">订单处理</a>
        <a to="sub1" :class="{'active':orderType == 3}" @click="orderType = 3">金额明细</a>
        <a v-if="dataInfo.length>0 && dataInfo[0].orderState==5" to="sub1" :class="{'active':orderType == 4}" @click="orderType = 4">退款明细</a>
        <!-- <a to="sub1" :class="{'active':orderType == 5}" @click="orderType = 5">销售明细</a>-->
        <a to="sub1" :class="{'active':orderType == 6}" @click="orderType = 6">商务资金明细</a>
      </div>
      <div v-for="value in dataInfo" v-show="orderType == 1" class="order-type order-type1">
        <div class="item">
          <el-alert title="订单信息" type="success" :closable="false" />
          <ul>
            <li>
              <span class="label">订单编号：</span>
              <span class="val">{{ value.orderCode }}</span>
            </li>
            <li>
              <span class="label">提交时间：</span>
              <span class="val">{{ value.createTime }}</span>
            </li>
            <li v-if="value.dealTime">
              <span class="label">处理时间：</span>
              <span class="val">{{ value.dealTime }}</span>
            </li>
            <li v-if="value.takeUpTime">
              <span class="label">订单处理耗时：</span>
              <span class="val">{{ value.takeUpTime }}</span>
            </li>
            <li>
              <span class="label">订单状态：</span>
              <span class="val" style="color:#409EFF">{{ value.orderState === 1 ? "未处理" : value.orderState === 2 ? "处理中" : value.orderState === 3 ? "处理完毕" : value.orderState === 4 ? "投诉中" : value.orderState === 5 ? "已退款" : value.orderState === 6 ? "已关闭" : '异常订单' }}</span>
            </li>
            <!-- <li>
              <span class="label">退款记录：</span>
              <span class="val">无退款记录</span>
            </li> -->
          </ul>
        </div>
        <div v-if="value.supplierName || value.supplierID" class="item">
          <el-alert title="供货方" type="success" :closable="false" />
          <ul>
            <li>
              <span v-if="value.supplierName" class="label">订单供货方：</span>
              <span class="val">{{ value.supplierName }}</span>
            </li>
            <li>
              <span v-if="value.supplierID" class="label">供货商编号：</span>
              <span class="val">{{ value.supplierID }}</span>
            </li>
          </ul>
        </div>
        <div class="item">
          <el-alert title="商品信息" type="success" :closable="false" />
          <ul v-for="item in value.orderCardVOList">
            <li>
              <span class="label">商品名称：</span>
              <span class="val">{{ item.goodsName }}</span>
            </li>
            <li>
              <span class="label">售价：</span>
              <span class="val">{{ item.salePrive }}元</span>
            </li>
          </ul>
        </div>
        <div class="item">
          <el-alert title="客户信息" type="success" :closable="false" />
          <ul>
            <li>
              <span class="label">购买客户：</span>
              <span class="val">{{ value.goodsUserName }}</span>
            </li>
            <li>
              <span v-if="value.goodsUserAddr" class="label">客户详细：</span>
              <span class="val">{{ value.goodsUserAddr }}</span>
            </li>
            <li>
              <span v-if="value.userMoneyDetail&&value.userMoneyDetail.remark" class="label">备注：</span>
              <span class="val">{{ value.userMoneyDetail&&value.userMoneyDetail.remark }}</span>
            </li>
          </ul>
        </div>
        <!-- <div class="item">
          <el-alert title="充值信息" type="success" :closable="false"></el-alert>
        </div> -->
        <!-- <div class="item">
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
        </div> -->
        <div class="item">
          <el-alert title="商品详细及结果" type="success" :closable="false" />
          <ul v-for="item in value.orderCardVOList">
            <li>
              <span class="label">卡号：</span>
              <span class="val">{{ item.cardNumber }}</span>
            </li>
            <li v-if="item.cardPws">
              <span class="label">密码：</span>
              <span class="val">{{ item.cardPws }}</span>
            </li>
            <!-- <li>
              <span class="label">赠品/矩阵：</span>
              <span class="val">永久有效</span>
            </li>
            <li>
              <span class="label">导卡时间：</span>
              <span class="val">	2019-11-20 08:35</span>
            </li> -->
          </ul>
        </div>
         <div class="item">
          <el-alert title="商家信息" type="success" :closable="false"></el-alert>
          <ul>
            <li v-if="value.baseInfo">
              <span class="label">站点域名：</span>
              <span class="val"><a style="color:#409EFF" v-if="value.baseInfo.domain" target="_blank" type="primary" :href="'http://'+value.baseInfo.domain">{{'http://'+value.baseInfo.domain}}</a></span>
            </li>
            <li v-if="value.baseInfo">
              <span class="label">商品名称：</span>
              <span class="val">{{value.baseInfo.merchantName}}</span>
            </li>
            <li v-if="value.baseInfo">
              <span class="label">联系电话：</span>
              <span class="val">{{value.baseInfo.phone}}</span>
            </li>
            <li v-if="value.baseInfo">
              <span class="label">联系QQ：</span>
              <span class="val">{{value.baseInfo.qq}}</span>
            </li>
          </ul>
         </div>
      </div>
      <div v-show="orderType == 2" class="order-type order-type2">
        <el-form ref="form" :model="form" label-width="140px">
          <el-form-item label="退款类型：" prop="refundType" :rules="[{ required: true, message: '请选择退款类型', trigger: 'blur' }]">
            <el-radio-group v-model="form.refundType">
              <el-radio :label="1">全退</el-radio>
              <el-radio :label="2">按张退</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item v-if="form.refundType==2" label="张数：" prop="num" :rules="[{ required: true, message: '请输入退款张数', trigger: 'blur' }]">
            <el-input-number v-model="form.num" class="el-class-number" size="mini" controls-position="right" :min="1" :precision="0" /><span> 张</span>
          </el-form-item>

          <!-- <el-form-item label="处理进度：">
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
          </el-form-item> -->
          <el-form-item label="">
            <el-button type="primary" :loading="loading" @click="confirmRefund('form')">确认处理</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-show="orderType == 3" class="order-type order-type3">
        <el-table ref="multipleTable" border row-key="id" :data="tableMoneyData" style="width: 100%" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" @selection-change="handleSelectionChange">
          <el-table-column :show-overflow-tooltip="true" prop="orderID" label="订单号" />
          <el-table-column :show-overflow-tooltip="true" prop="label2" label="交易类型">
            <template slot-scope="scope">
              <span v-if="scope.row.transactionType">{{ transactionType(scope.row.transactionType) }}</span>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="paySn" label="商户号" />
          <el-table-column :show-overflow-tooltip="true" prop="money" label="交易金额" />
          <el-table-column :show-overflow-tooltip="true" prop="beforeMoney" label="交易前(元)" />
          <el-table-column :show-overflow-tooltip="true" prop="endMoney" label="交易后(元)" />
          <el-table-column :show-overflow-tooltip="true" prop="createTime" label="交易日期" />
        </el-table>
      </div>
      <div v-show="orderType == 4" class="order-type order-type4">
        <el-table ref="multipleTable" border row-key="id" :data="tableRefundData" style="width: 100%" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" @selection-change="handleSelectionChange">
          <el-table-column :show-overflow-tooltip="true" prop="money" label="退款金额" />
          <el-table-column :show-overflow-tooltip="true" prop="label2" label="退款类型">
            <template slot-scope="scope">
              <span>{{ scope.row.operType===1 ? '本地退款' : scope.row.operType===2 ? '供货商退款' : '对接退款' }}</span>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="label2" label="操作类型">
            <template slot-scope="scope">
              <span>{{ scope.row.refundType===1 ? '全退' : '按张退' }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="orderType == 5" class="order-type order-type5">
        <el-table ref="multipleTable" border row-key="id" :data="tableData" style="width: 100%" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" @selection-change="handleSelectionChange">
          <el-table-column :show-overflow-tooltip="true" prop="label1" label="销售额" />
          <el-table-column :show-overflow-tooltip="true" prop="label2" label="销售提成" />
          <el-table-column :show-overflow-tooltip="true" prop="label3" label="手续费" />
          <el-table-column :show-overflow-tooltip="true" prop="label1" label="入账金额" />
          <el-table-column :show-overflow-tooltip="true" prop="label2" label="退款额" />
          <el-table-column :show-overflow-tooltip="true" prop="label3" label="进货额" />
        </el-table>
      </div>
      <div v-show="orderType == 6" class="order-type order-type6">
        <el-table ref="multipleTable" border row-key="id" :data="tableSiteMoneyData" style="width: 100%" :header-cell-style="{background:'#f5f5f5',color:'#606266'}">
          <el-table-column :show-overflow-tooltip="true" prop="orderID" label="订单号" />
          <el-table-column :show-overflow-tooltip="true" prop="label2" label="交易类型">
            <template slot-scope="scope">
              <span v-if="scope.row.transactionType">{{ siteMoneyType(scope.row.transactionType) }}</span>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="money" label="交易金额" />
          <el-table-column :show-overflow-tooltip="true" prop="beforeMoney" label="变化前(元)" />
          <el-table-column :show-overflow-tooltip="true" prop="endMoney" label="变化后(元)" />
          <el-table-column :show-overflow-tooltip="true" prop="createTime" label="交易日期" />
        </el-table>
      </div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialog1 = false">取 消</el-button>
        <el-button type="primary" @click="dialog1 = false">发 布</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { getList, getLists, getData } from '@/api/price/price-1/common'
export default {
  components: {
    Tinymce
  },
  data() {
    return {
      color: '#333',
      form: {},
      loading: false,
      selectDatetime: '', // 搜索选择的日期
      dialog1: false,
      currentPage: 1,
      orderType: 1,
      total: 0,
      tableData: [],
      tableMoneyData: [], // 资金详情
      tableRefundData: [], // 退款详情
      tableSiteMoneyData: [], // 商务资金明细
      goodsType: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        saleSource:1
      },
      dataInfo: [],
      multipleSelection: []
    }
  },
  mounted() {
    this.getList()
    this.goodsTypeList()
  },
  methods: {

    // 交易类型
    transactionType(type) {
      switch (type) {
        case 1:
          return '订单扣款'
          break
        case 2:
          return '订单退款'
          break
        case 3:
          return '充值到账'
          break
        case 4:
          return '前台加款'
          break
        case 5:
          return '前台减款'
          break
        case 6:
          return '管理员加款'
          break
        case 7:
          return '管理员减款'
          break
        default:
          return '未知'
      }
    },

    // 订单状态
    orderState(type) {
      switch (type) {
        case 0:
          return '待支付'
          break
        case 1:
          return '未处理'
          break
        case 2:
          return '处理中'
          break
        case 3:
          return '处理完毕'
          break
        case 4:
          return '投诉中'
          break
        case 5:
          return '已退款'
          break
        case 6:
          return '已关闭'
          break
        default:
          return '未知'
      }
    },
    // 订单状态--颜色
    orderStateColor(type) {
      switch (type) {
        case 0:
          return 'color:#e6a23c'
          break
        case 1:
          return 'color:#409eff'
          break
        case 2:
          return 'color:#e6a23c'
          break
        case 3:
          return 'color:#67c23a'
          break
        case 4:
          return 'color:#909399'
          break
        case 5:
          return 'color:#f56c6c'
          break
        case 6:
          return 'color:#909399'
          break
        default:
          return 'color:#909399'
      }
    },

    // 交易类型
    siteMoneyType(type) {
      switch (type) {
        case 1:
          return '客户充值'
          break
        case 2:
          return '对接收入'
          break
        case 3:
          return '对接收入退款'
          break
        case 4:
          return '对接支出'
          break
        case 5:
          return '对接支出退款'
          break
        case 6:
          return '站长提现'
          break
        case 7:
          return '站长充值'
          break
        case 8:
          return '投诉冻结'
          break
        case 9:
          return '投诉解冻'
          break
        default:
          return '未知'
      }
    },

    // 确认退款
    confirmRefund(formName) {
      this.loading = true
      const orderID = this.dataInfo[0].orderID
      if (!orderID) {
        this.$message({
          showClose: true,
          message: '订单异常，请联系客服',
          type: 'error'
        })
        return null
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let payload
          if (this.form.refundType === 1) {
            payload = { orderID: orderID, refundType: this.form.refundType }
          } else {
            payload = { orderID: orderID, ...this.form }
          }
          getLists({ ...payload }, '/order/order/orderRefund').then(res => {
            if (res.code === 1001) {
              this.$message({
                showClose: true,
                message: res.msg,
                type: 'success'
              })
              this.form = {}
              this.orderInfo(orderID)
              this.orderType = 1
              this.getList()
            } else {
              this.$message({
                showClose: true,
                message: res.msg,
                type: 'error'
              })
            }
            this.loading = false
          }).catch(err => {
            this.loading = false
          })
        } else {
          this.loading = false
          return false
        }
      })
    },

    // 获取订单列表
    getList() {
      this.loading = true
      getLists(this.queryParams, '/order/order/orderPage').then(res => {
        if (res.code === 1001) {
          this.tableData = res.body.records
          this.total = res.body.total
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },

    dataSearch() {
      this.getListByDataTime()
    },
    async initData(data) {
      // 获取当前时间
      var now = new Date()
      var monthn = now.getMonth() + 1
      var yearn = now.getFullYear()
      var dayn = now.getDate()
      var h = now.getHours()
      var m = now.getMinutes()
      var s = now.getSeconds()
      this.selectDatetime = yearn + '-' + monthn + '-' + dayn + ' ' + h + ':' + m + ':' + s

      this.selectUser = parseInt(sessionStorage.getItem('userid'))
      this.getListByDataTime()
    },
    async getListByDataTime(data) {

    },

    // 获取商品类型
    goodsTypeList() {
      this.loading = true
      getData({}, '/goods/goods/getGoodsTypeList').then(res => {
        if (res.code === 1001) {
          this.goodsType = res.body
        }
      }).catch(err => {
      })
    },

    // 查询
    query() {
      if (this.selectDatetime) {
        this.queryParams = { ...this.queryParams, beginTime: this.selectDatetime[0], endTime: this.selectDatetime[1] }
      } else {
        this.queryParams = { ...this.queryParams, beginTime: '', endTime: '' }
      }
      this.getList()
    },

    // 关闭弹窗
    closeOrderInfo() {
      this.orderType = 1
      this.form = {}
      this.tableMoneyData = []
      this.tableRefundData = []
      this.tableSiteMoneyData = []
    },

    // 查看订单详情
    orderInfo(id) {
      getData({ orderID: id }, '/order/order/orderDetails').then(res => {
        if (res.code === 1001) {
          // this.dataInfo = [res.body]
          this.$set(this.dataInfo, 0, res.body)
          this.tableMoneyData = res.body.userMoneyDetails
          this.tableRefundData = res.body.orderRefund ? [res.body.orderRefund] : []
          this.tableSiteMoneyData = res.body.siteMoneyDetails
          this.form = { refundType: 1 }
          this.dialog1 = true
        }
      }).catch(err => {
      })
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    searchTime(index) {
      const arr = []
      if (index === 1) {
        arr[0] = this.$moment().subtract(index, "days").format("YYYY-MM-DD")+" 00:00:00"
        arr[1] = this.$moment().format("YYYY-MM-DD")+" 00:00:00"
        this.selectDatetime = arr
      } else {
        arr[0] = this.$moment().subtract(index, "days").format("YYYY-MM-DD")+" 00:00:00"
        arr[1] = this.$moment().format("YYYY-MM-DD")+" 00:00:00"
        this.selectDatetime = arr
      }
      this.query()
    }
  }
}
</script>
<style lang="scss">
.el-hidden-tc {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  border: none;
}

.el-class-number .el-input .el-input__inner {
  width: 130px;
}

.menu8-1-container {
  .tips {
    color: #909399;
    font-size: 12px;
    line-height: 20px;
    width: 400px;
    margin-left: 10px;
  }
  .dialog1 {
    .el-dialog__body {
      overflow: auto;
      max-height: 700px;
    }

    .el-input {
      width: 400px;
    }
    .el-pagination {
      .el-input {
        width: 50px;
      }
    }
    .order-type1 {
      .item {
        margin-top: 20px;
      }
      li {
        display: flex;
        padding: 8px 0;
        // align-items: center;
        .label {
          font-weight: bold;
          margin-right: 10px;
          width: 120px;
          text-align: right;
        }
        .val {
          flex: 1;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
<style scoped lang="scss">
.container {
  padding: 20px;
  .tab-wrap {
    a {
      &.active {
        border-bottom: 2px solid #409eff;
      }
    }
  }
  .filter-wrap {
    margin-top: 20px;
    .el-input,
    .el-select {
      width: 130px;
    }
  }
  .handle-wrap {
    // margin-top:20px;
    margin-bottom: 20px;
  }
}

    ::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
      -webkit-appearance: none !important;
}
::v-deep input[type='number'] {
      -moz-appearance: textfield !important;
}
</style>

