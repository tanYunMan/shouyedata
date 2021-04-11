<template>
  <div class="dashboard-container">
    <!-- 卡片列表 -->
    <div class="pan-card-container">
      <el-card shadow="hover" class="pan-card">
        <div class="card-icon">
          <img src="@/assets/icon/h1.jpg" alt />
        </div>
        <div class="card-meta">
          <div class="card-money">{{currentMoney.money||0}}元</div>
          <div class="card-title">账户余额</div>
          <div class="card-remark">冻结金额：{{currentMoney.frozenMoney || 0}}</div>
        </div>
      </el-card>
      <el-card shadow="hover" class="pan-card">
        <div class="card-icon">
          <img src="@/assets/icon/h2.jpg" alt />
        </div>
        <div class="card-meta">
          <div class="card-money">{{todaySaleData.saleMoeny || 0}}</div>
          <div class="card-title">今日收入</div>
          <div class="card-remark">
            今日成交：{{todaySaleData.orderCount || 0}}笔
            <br />今日卖出：{{todaySaleData.cardCount || 0}}张
          </div>
        </div>
      </el-card>
      <el-card shadow="hover" class="pan-card">
        <div class="card-icon">
          <img src="@/assets/icon/h1.jpg" alt />
        </div>
        <div class="card-meta">
          <div class="card-money">0.00元</div>
          <div class="card-title">冻结金额</div>
          <div class="card-remark">
            今日利润：0.00
            <br />昨日订单：0比
          </div>
        </div>
      </el-card>
      <el-card shadow="hover" class="pan-card">
        <div class="card-icon">
          <img src="@/assets/icon/h2.jpg" alt />
        </div>
        <div class="card-meta">
          <div class="card-money">{{todayCashData.today || 0}}元</div>
          <div class="card-title">最近提现</div>
          <div class="card-remark">近一月提现：{{todayCashData.sum || 0}}元</div>
        </div>
      </el-card>
    </div>
    <!-- 卡片列表结束 -->
    <!-- 统计图 -->
    <div class="order-stastic">
      <el-card shadow="never" class="stastic-card">
        <div slot="header" class="clearfix">
          <span>近期交易统计</span>
        </div>
        <div class="stastic-content" id="container"></div>
      </el-card>
    </div>
    <!-- 统计图 -->
    <el-row :gutter="20" class="bottom-table-container">
      <!-- 系统公告 -->
      <el-col :span="8">
        <el-card shadow="never" class="bottom-card card-left">
          <div slot="header" class="clearfix">
            <span>系统公告</span>
          </div>
          <div class="bottom-content"></div>
        </el-card>
      </el-col>
      <!-- 系统公告 -->
      <!-- 最新订单 -->

      <el-col :span="16">
        <el-card shadow="never" class="bottom-card card-right">
          <div slot="header" class="clearfix">
            <span>最新订单信息</span>
          </div>
          <div class="bottom-content">
            <el-table
              stripe
              :data="orderData"
              header-row-class-name="faka-table-header"
              style="width: 100%"
            >
              <el-table-column :show-overflow-tooltip="true" prop="orderCode" label="订单号" min-width="20%" align="center"/>
              <el-table-column :show-overflow-tooltip="true" prop="goodsName" label="商品名称" min-width="30%" align="center">
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
              <el-table-column prop="orderPrice" label="交易金额" min-width="10%" align="center"></el-table-column>
              <el-table-column prop="createTime" label="下单时间" min-width="20%" align="center"></el-table-column>
              <el-table-column :show-overflow-tooltip="true" label="订单状态" min-width="10%" align="center">
                <template slot-scope="scope">
                  <span :style="orderStateColor(scope.row.orderState)">{{ orderState(scope.row.orderState) }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
      <!-- 最新订单 -->
    </el-row>
  </div>
</template>

<script>
import { Chart } from "@antv/g2";
import { getData } from "@/api/shouka/common";
import { getLists } from '@/api/price/price-1/common'
export default {
  name: "DashboardAdmin",
  components: {},
  data() {
    return {
      todaySaleData:{},
      currentMoney:{},
      todayCashData:{},
      newOrderList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        saleSource:2
      },
      orderData:[],
      loading: false,
      chartData: [
        { day: "Jan", types: "Tokyo", value: 7 },
        { day: "Jan", types: "London", value: 3.9 },
        { day: "Feb", types: "Tokyo", value: 6.9 },
        { day: "Feb", types: "London", value: 4.2 },
        { day: "Mar", types: "Tokyo", value: 9.5 },
        { day: "Mar", types: "London", value: 5.7 },
        { day: "Apr", types: "Tokyo", value: 14.5 },
        { day: "Apr", types: "London", value: 8.5 },
        { day: "May", types: "Tokyo", value: 18.4 },
        { day: "May", types: "London", value: 11.9 },
        { day: "Jun", types: "Tokyo", value: 21.5 },
        { day: "Jun", types: "London", value: 15.2 },
        { day: "Jul", types: "Tokyo", value: 25.2 },
        { day: "Jul", types: "London", value: 17 },
        { day: "Aug", types: "Tokyo", value: 26.5 },
        { day: "Aug", types: "London", value: 16.6 },
        { day: "Sep", types: "Tokyo", value: 23.3 },
        { day: "Sep", types: "London", value: 14.2 },
        { day: "Oct", types: "Tokyo", value: 18.3 },
        { day: "Oct", types: "London", value: 10.3 },
        { day: "Nov", types: "Tokyo", value: 13.9 },
        { day: "Nov", types: "London", value: 6.6 },
        { day: "Dec", types: "Tokyo", value: 9.6 },
        { day: "Dec", types: "London", value: 4.8 },
      ],
      chart: null
    };
  },
  mounted() {
    this.getTodaySaleData();
    this.getCurrentMoney();
    this.getTodayCashData();
    this.getOrderData();
    this.$nextTick(()=>{
      this.initChart()
    this.getStasticData();
    })
  },
  methods: {
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

    initChart() {
      this.chart = new Chart({
        container: "container",
        autoFit: true,
        height: 500,
      });
    },
    getTodaySaleData(){
      getData('/order/order/todaySaleStatistics').then(res=>{
        if(res.code === 1001){
          this.todaySaleData = res.body
        }
      })
    },

    getCurrentMoney(){
      getData('/finance/siteMoney/getCurrentMoney').then(res=>{
        if(res.code === 1001){
          this.currentMoney = res.body
        }
      })
    },
    getTodayCashData(){
        getData('/finance/cash/todayCashStatistics').then(res=>{
        if(res.code === 1001){
          this.todayCashData = res.body
          console.log(this.todayCashData)
        }
      })
    },
     // 获取订单列表
    getOrderData() {
      this.loading = true
      getLists(this.queryParams, '/order/order/orderPage').then(res => {
        if (res.code === 1001) {
          this.orderData = res.body.records
          if(this.orderData.length > 5){
            this.orderData = this.orderData.slice(0,5)
          }
        }
      }).catch(err => {

      })
    },
    getStasticData() {
      this.chart.data(this.chartData);
      this.chart.scale({
        day: {
          range: [0, 1],
        },
        value: {
          nice: true,
        },
      });

      this.chart.tooltip({
        showCrosshairs: true,
        shared: true,
      });

      this.chart.axis("value", {
        label: {
          formatter: (val) => {
            return val + " °C";
          },
        },
      });

      this.chart.line().position("day*value").color("types").shape("smooth");

      this.chart.point().position("day*value").color("types").shape("circle");

      this.chart.render();
    },
  },
};
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}
.pan-card-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.pan-card {
  width: 23%;
}
.pan-card >>> .el-card__body {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.card-icon {
  width: 100px;
}
.card-icon img {
  width: 100px;
  height: 100px;
}

.card-meta {
  text-align: right;
}

.card-money {
  font-size: 30px;
}

.card-remark {
  font-size: 14px;
  margin-top: 10px;
  color: #a5a5a5;
}

.bottom-table-container {
  margin-top: 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.order-stastic {
  margin-top: 15px;
}
.stastic-content {
  min-height: 300px;
  max-height: 500px;
}
</style>
