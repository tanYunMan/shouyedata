<template>
  <div class="navbar" :style="{'background':color1}">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="change" trigger="click" v-if="adminTypeStatus === 0">
        <span class="el-dropdown-link">
          系统切换
          <i class="el-icon-caret-bottom" />
        </span>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item @click.native="changeMenu(1)">
            <span style="display:block;">卡盟系统</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="changeMenu(2)">
            <span style="display:block;">发卡系统</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="tab" style="display:inline-block;">
        <!-- <router-link to="/dashboard">首页</router-link> -->
        <a href>商户中心</a>
        <span class="span-money" @click="rechargeMoney">
          余额：
          <i class="red">{{ thisMoneyData.money }}</i>
        </span>
      </div>
      <!-- <el-color-picker v-model="color1" @change="themeEvent" style="margin:0 20px;"></el-color-picker> -->
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img :src="gotOutPic+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <!-- <router-link to="/">
            <el-dropdown-item>
              Home
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a>-->
          <el-dropdown-item divided>
            <span style="display:block;" @click="openPassword">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="goFundDetails">资金明细</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="go">提现</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="rechargeMoney">充值</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!-- 申请提现 -->
    <el-dialog title="余额充值" class="recharge-warp" :visible.sync="rechargeDialog">
      <el-form ref="thisMoneyForm" :model="thisMoneyForm" label-width="30%">
        <el-form-item label="充值金额：">
          <el-input-number v-model="thisMoneyForm.money" :min="0" :precision="2" controls-position="right" />
          <span style="margin-left:14px">元</span>
        </el-form-item>

        <el-form-item label="充值方式：">
          <div style="max-width:600px">
            <span v-for="(item,index) in forClientlist" :key="index" class="el-forClientlist" :style="{'border':item.select?'1px solid red':'none'}" @click="clickIndex(index)">
              <img style="width:100%;height:100%;" :src="item.rechargeImg" class="user-avatar" :alt="item.rechargeName" :title="item.rechargeName">
            </span>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rechargeDialog = false">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="rechargeConfirm">充 值</el-button>
      </span>
      <el-dialog width="240px" title="扫码支付" :visible.sync="payDialog" append-to-body>
        <vue-qr :text="qrCode" :size="200" />
      </el-dialog>
    </el-dialog>

    <!-- 资金明细 -->
    <el-dialog title="资金明细" :visible.sync="moneyDialog" width="70%">
      <div class="filter-wrap">
        <span>订单编号：</span>
        <el-input v-model="moneyListSearch.orderID" placeholder="请输入订单编号" style="width:200px;" />
        <span style="margin-left:10px">商户号：</span>
        <el-input v-model="moneyListSearch.paySn" placeholder="请输入商户号" style="width:200px;" />

        <el-date-picker v-model="queryTime" style="width:400px;" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="dataSearch" />

        <span style="margin-left:10px">交易类型：</span>
        <el-select v-model="moneyListSearch.transactionType" placeholder="请选择" clearable @clear="setValueNull()">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>

        <el-button type="primary" icon="el-icon-search" :loading="loading" @click="goFundDetails">查询</el-button>
      </div>

      <el-table ref="multipleTable" border row-key="id" :data="moneyListData" style="width: 100%" :header-cell-style="{background:'#f5f5f5',color:'#606266','text-align':'center'}" size="mini" :cell-style="{'text-align':'center'}" @selection-change="handleSelectionChange">
        <el-table-column :show-overflow-tooltip="true" prop="paySn" label="商户号" />
        <el-table-column :show-overflow-tooltip="true" prop="goodsType" label="订单号">
          <template slot-scope="scope">
            <span>
              <a type="primary" style="color:#409eff" @click="orderInfo(scope.row.orderID)">{{ scope.row.orderID }}</a>
            </span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="createTime" label="交易时间" />
        <el-table-column :show-overflow-tooltip="true" prop="beforeMoney" label="交易前（元）" />
        <el-table-column :show-overflow-tooltip="true" prop="endMoney" label="交易后（元）" />
        <el-table-column :show-overflow-tooltip="true" prop="label10" label="交易类型" fixed="right">
          <template slot-scope="scope">
            <span v-if="scope.row.transactionType===1">客户充值</span>
            <span v-if="scope.row.transactionType===2">对接收入</span>
            <span v-if="scope.row.transactionType===3">对接收入退款</span>
            <span v-if="scope.row.transactionType===4">对接支出</span>
            <span v-if="scope.row.transactionType===5">对接支出退款</span>
            <span v-if="scope.row.transactionType===6">站长提现</span>
            <span v-if="scope.row.transactionType===7">站长充值</span>
            <span v-if="scope.row.transactionType===8">投诉冻结</span>
            <span v-if="scope.row.transactionType===9">投诉解冻</span>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination background :page-sizes="[10, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </el-dialog>

    <!-- 查看详情-->
    <el-dialog title="订单详情记录" :visible.sync="dialog2" class="dialog2 wl-dialog-style" @closed="closeOrderInfo">
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
            </li>-->
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
          </ul>
        </div>
      </div>
      <div v-show="orderType == 2" class="order-type order-type2">
        <el-form ref="form1" :model="form1" label-width="140px">
          <el-form-item label="退款类型：" prop="refundType" :rules="[{ required: true, message: '请选择退款类型', trigger: 'blur' }]">
            <el-radio-group v-model="form1.refundType">
              <el-radio :label="1">全退</el-radio>
              <el-radio :label="2">按张退</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item v-if="form1.refundType==2" label="张数：" prop="num" :rules="[{ required: true, message: '请输入退款张数', trigger: 'blur' }]">
            <el-input-number v-model="form.num" class="el-class-number" size="mini" controls-position="right" :min="1" :precision="0" />
            <span>张</span>
          </el-form-item>

          <el-form-item label>
            <el-button type="primary" :loading="loading" @click="confirmRefund('form1')">确认处理</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-show="orderType == 3" class="order-type order-type3">
        <el-table ref="multipleTable" border row-key="id" :data="tableMoneyData" style="width: 100%" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" @selection-change="handleSelectionChange">
          <el-table-column :show-overflow-tooltip="true" prop="orderID" label="订单号" />
          <el-table-column :show-overflow-tooltip="true" prop="label2" label="交易类型" width="100px">
            <template slot-scope="scope">
              <span v-if="scope.row.transactionType">{{ transactionType(scope.row.transactionType) }}</span>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="paySn" label="商户号" />
          <el-table-column :show-overflow-tooltip="true" prop="money" label="交易金额" width="100px" />
          <el-table-column :show-overflow-tooltip="true" prop="beforeMoney" label="交易前(元)" width="100px" />
          <el-table-column :show-overflow-tooltip="true" prop="endMoney" label="交易后(元)" width="100px" />
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
      </span>-->
    </el-dialog>

    <!-- 修改密碼 -->
    <el-dialog title="修改密码" :visible.sync="pwdDialog" @closed="closePassword">
      <el-form ref="pwdForm" :model="pwdForm" :rules="pwdRules" label-width="100px" class="demo-dynamic">
        <el-form-item prop="oldPassword" label="原密码">
          <el-input v-model="pwdForm.oldPassword" type="password" placeholder="请输入原密码" style="max-width:350px" />
        </el-form-item>
        <el-form-item prop="password" label="新密码">
          <el-input v-model="pwdForm.password" type="password" placeholder="请输入新密码" style="max-width:350px" />
        </el-form-item>
        <el-form-item prop="repassword" label="确认密码">
          <el-input v-model="pwdForm.repassword" type="password" placeholder="请输入确认密码" style="max-width:350px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="changePWd()">确 认 修 改</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { paySubmit } from '@/utils/auth'
import { getLists, getDatas } from '@/api/price/price-1/common'
import VueQr from 'vue-qr'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    VueQr
  },
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.pwdForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      color1: window.localStorage.getItem('color1') || '#3482B3',
      gotOutPic: 'goOut1.png',
      loading: false,
      dialog2: false,
      payDialog: false, // 支付弹窗
      qrCode: '', // 二维码地址
      dataInfo: [],
      tableData: [],
      tableMoneyData: [], // 资金详情
      tableRefundData: [], // 退款详情
      tableSiteMoneyData: [], // 商务资金明细
      form1: {},
      orderType: 1,
      payInterval: null, // 支付的定时器
      payIntervalCount: 0, // 轮询次数
      outTradeNo: '', // 支付订单
      moneyDialog: false, // 资金明细
      thisMoneyData: {
        bondMoney: 0,
        frozenMoney: 0,
        money: 0
      },
      options: [
        {
          value: 1,
          label: '客户充值'
        },
        {
          value: 2,
          label: '对接收入'
        },
        {
          value: 3,
          label: '对接收入退款'
        },
        {
          value: 4,
          label: '对接支出'
        },
        {
          value: 5,
          label: '对接支出退款'
        },
        {
          value: 6,
          label: '站长提现'
        },
        {
          value: 7,
          label: '站长充值'
        },
        {
          value: 8,
          label: '投诉冻结'
        },
        {
          value: 9,
          label: '投诉解冻'
        }
      ],
      thisMoneyForm: {
        money: 0,
        rechargeModeID: null
      },
      rechargeDialog: false,
      moneyListSearch: {
        // 资金明细搜索条件
        pageNum: 1,
        pageSize: 20
      },
      currentPage: 1,
      total: 0,
      moneyListData: [],
      queryTime: [], // 查询时间
      multipleSelection: [],
      forClientlist: [], // 充值方式
      pwdDialog: false,
      pwdForm: {},
      pwdRules: {
        oldPassword: [{
          required: true,
          message: '请输入原密码',
          trigger: 'blur'
        }, {
          min: 6,
          message: '长度至少 6 个字符'
        }],
        password: [{
          required: true,
          message: '请输入新密码',
          trigger: 'blur'
        }, {
          min: 6,
          message: '长度至少 6 个字符'
        }],
        repassword: [{
          required: true,
          validator: validatePass2,
          trigger: 'blur'
        }]
      },
      adminTypeStatus: 0
    }
  },
  created() {
    //获取后台系统权限
    let type = sessionStorage.getItem('adminTypeStatus')
    if (type !== 'null') {
      type = type * 1
    } else {
      type = 0
    }
    this.adminTypeStatus = type

    // 获取账户金额
    this.thisMoney()

    // 获取提现方式
    this.getListForClient()
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar'])
  },
  methods: {
    // 充值按钮
    clickIndex(key) {
      this.forClientlist.map((item, index) => {
        if (key == index) {
          item.select = true

          this.$set(this.forClientlist, index, item)

          this.thisMoneyForm.rechargeModeID = item.rechargeModeID
        } else {
          item.select = false
        }
      })
    },

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
    // 查看订单详情
    orderInfo(id) {
      getDatas({ orderCode: id }, '/order/order/orderDetails')
        .then((res) => {
          if (res.code === 1001) {
            // this.dataInfo = [res.body]
            this.$set(this.dataInfo, 0, res.body)
            this.tableMoneyData = res.body.userMoneyDetails
            this.tableRefundData = res.body.orderRefund
              ? [res.body.orderRefund]
              : []
            this.tableSiteMoneyData = res.body.siteMoneyDetails
            this.dialog2 = true
          }
        })
        .catch((err) => { })
    },

    // 关闭弹窗
    closeOrderInfo() {
      this.orderType = 1
      this.form1 = {}
      this.tableMoneyData = []
      this.tableRefundData = []
      this.tableSiteMoneyData = []
    },

    // 获取充值方式
    getListForClient() {
      this.loading = true
      getDatas({ rechargeType: 1 }, '/finance/rechargeMode/getListForClient')
        .then((res) => {
          if (res.code === 1001) {
            // console.log(res,55)
            this.forClientlist = res.body
          } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            })
          }
          this.loading = false
        })
        .catch((err) => {
          this.loading = false
        })
    },

    // 充值--登陆者余额
    rechargeMoney() {
      this.rechargeDialog = true
    },

    // 清空筛查条件
    setValueNull() {
      delete this.moneyListSearch.transactionType
    },

    // 确认充值
    rechargeConfirm() {
      this.loading = true
      if (this.thisMoneyForm.money == 0) {
        this.$message({
          showClose: true,
          message: '请输入正确充值的金额',
          type: 'error'
        })
        this.loading = false
        return false
      } else if (this.thisMoneyForm.money > 100000) {
        this.$message({
          showClose: true,
          message: '充值金额超过最大充值金额100000',
          type: 'error'
        })
        this.loading = false
        return false
      } else if (!this.thisMoneyForm.rechargeModeID) {
        this.$message({
          showClose: true,
          message: '请选择充值支付方式',
          type: 'error'
        })
        this.loading = false
        return false
      }
      getLists(this.thisMoneyForm, '/finance/rechargeRecord/addRecharge')
        .then((res) => {
          if (res.code === 1001) {
            this.loading = false
            const qrCode = res.body.qr_code
            if (qrCode) {
              // 有二维码，当面付
              this.qrCode = qrCode
              this.outTradeNo = res.body.out_trade_no
              this.payDialog = true
              // 在这里轮询
              this.payInterval = setInterval(() => {
                getDatas(
                  { paySn: this.outTradeNo },
                  '/finance/rechargeRecord/queryPayStateFk'
                ).then((payRes) => {
                  if (payRes.body.payState == 2) {
                    this.$notify({
                      title: '支付成功',
                      message: '您的支付已经成功，请查看账户余额'
                    })
                    this.payDialog = false
                    this.qrCode = ''
                    this.outTradeNo = ''
                    clearInterval(this.payInterval)
                    this.thisMoney()
                  }
                  if (payRes.body.payState == 1) {
                    this.$message.error('支付失败 ，请重新支付')
                    this.payDialog = false
                    this.qrCode = ''
                    this.outTradeNo = ''
                    clearInterval(this.payInterval)
                  }
                })
                if (this.payIntervalCount > 60) {
                  this.$message.error('支付订单已超时 ，请重新支付')
                  this.payDialog = false
                  this.qrCode = ''
                  this.outTradeNo = ''
                  clearInterval(this.payInterval)
                }
                this.payIntervalCount++
              }, 3000)
            } else {
              paySubmit(res.body)
              // window.open(res.body.postUrl,"_blank")
            }
            setTimeout(() => {
              this.rechargeDialog = false
              this.loading = false
            }, 3000)
          } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            })
          }
          this.loading = false
        })
        .catch((err) => {
          this.loading = false
        })
    },

    // 获取当前登录者的余额信息
    thisMoney() {
      getDatas({}, '/finance/siteMoney/getCurrentMoney')
        .then((res) => {
          if (res.code === 1001) {
            this.thisMoneyData = res.body
          }
        })
        .catch((err) => { })
    },

    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    go() {
      var menuType = sessionStorage.getItem("menuType") || 1
      if(menuType == 2){
        this.$router.push({path:'/withdraw'})
      }else{
        this.$router.push({ path: '/menu10/8' })
      }
      
    },

    handleSizeChange(val) {
      this.moneyListSearch.pageSize = val
      this.goFundDetails()
    },
    handleCurrentChange(val) {
      this.moneyListSearch.pageNum = val
      this.goFundDetails()
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 切换菜单风格
    changeMenu(state) {
      console.log('点击', state)
      // this.$store.commit('permission/SET_TYPE', state)
      sessionStorage.setItem('menuType', state)
      this.$router.push('/dashboard')
      this.$router.go(0)
    },
    // 处理时间改变
    dataSearch() {
      if (this.queryTime) {
        this.moneyListSearch = {
          ...this.moneyListSearch,
          beginTime: this.queryTime[0] + ' 00:00:00',
          endTime: this.queryTime[1] + ' 23:59:59'
        }
      } else {
        delete this.moneyListSearch.beginTime
        delete this.moneyListSearch.endTime
      }
    },

    // 前往资金明细页面
    goFundDetails() {
      this.loading = true
      getLists(this.moneyListSearch, '/finance/siteMoneyDetail/page')
        .then((res) => {
          if (res.code === 1001) {
            this.moneyListData = res.body.records
            this.total = res.body.total
          } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            })
          }
          this.loading = false
          this.moneyDialog = true
        })
        .catch((err) => {
          this.loading = false
        })
    },
    // 打开修改密码窗口
    openPassword() {
      this.pwdDialog = true
    },
    closePassword() {
      this.pwdDialog = false
      this.pwdForm = {}
    },
    changePWd() {
      const {
        password,
        oldPassword
      } = this.pwdForm
      this.loading = true
      getLists({
        password,
        oldPassword
      }, '/user/user/updateUserPassword').then(res => {
        this.loading = false
        if (res.code === 1001) {
          this.pwdForm = {}
          this.pwdDialog = false
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'success'
          })
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'error'
          })
        }
      }).catch(err => {
        this.loading = false
      })
    },
    logout() {
      getDatas({}, '/login/login/logout')
        .then((res) => {
          if (res.code === 1001) {
            sessionStorage.removeItem('userType')
            sessionStorage.removeItem('token')
            this.$router.push(`/login?redirect=${this.$route.fullPath}`)
          } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            })
          }
        })
        .catch((err) => { })
    },

    themeEvent(val) {
      console.log(val)
      window.localStorage.setItem('color1', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-forClientlist {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  margin: 10px;
  cursor: pointer;
  display: block;
  width: 130px;
  height: 55px;
  float: left;
  padding: 1px;
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff !important;
  color: #000 !important;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    // height: 100%;
    display: flex;
    align-items: center;
    // line-height: 50px;
    .tab {
      a {
        padding: 0 20px;
      }
    }
    &:focus {
      outline: none;
    }
    .span-money {
      cursor: pointer;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: inline-block;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
.avatar-container {
  el-dropdown {
    height: 100%;
  }
  .el-icon-caret-bottom {
    top: -6px !important;
    color: #999;
  }
}
.right-menu {
  height: 100%;
}
.red {
  color: #ff0000;
}

.el-dropdown-link {
  font-size: 16px;
}
.change {
  margin-right: 0px;
  cursor: pointer;
  color: #000000;
}
</style>
