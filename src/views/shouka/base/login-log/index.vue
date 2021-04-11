<template>
  <div>
    <div class="filter-wrap">
      <span style="margin-left:10px">登录账号</span>
      <el-input v-model="queryParams.login" placeholder="请输入登录账号" style="width:200px;"></el-input>
      <span style="margin-left:10px">地址</span>
      <el-input v-model="queryParams.adrr" placeholder="请输入地址" style="width:200px;"></el-input>

      <el-button style="margin-left:20px" type="primary" icon="el-icon-search" @click="getList" :loading="loading">查询</el-button>
    </div>

    <div class="info-content">只保留近30天的登录日志</div>
    <el-table
      stripe
      :data="logList"
      header-row-class-name="faka-table-header"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="localUserID" label="用户编号"  ></el-table-column>
      <el-table-column prop="login" label="登录账号"></el-table-column>
      <el-table-column prop="logType" label="日志类别" ></el-table-column>
      <el-table-column prop="createTime" label="时间"></el-table-column>
      <el-table-column prop="domain" label="域名"></el-table-column>
      <el-table-column prop="ip" label="IP地址"></el-table-column>
      <el-table-column prop="addr" label="地址"></el-table-column>
    </el-table>
     <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryParams.pageNum" :page-sizes="[10, 20, 30]" :page-size="queryParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="this.total || 0"> </el-pagination>
  </div>
</template>

<script>
import { getList,getLists,getData } from '@/api/price/price-1/common'
export default {
  data() {
    return {
      logList: [],
      total:0,
      loading:false,
      queryParams:{
        pageNum:1,
        pageSize:20,
        logType:3
      }
    };
  },
  methods:{
    getList(){
       this.loading = true
      getLists(this.queryParams,'/log/loginLog/page').then(res => {
        if (res.code===1001){
          this.tableData = res.body.records.map((item) => {
            item.logType = '站长用户'
            return item;
          })
          this.total = res.body.total
          this.logList = res.body.records
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.queryParams.pageNum = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getList()
    },
  },
  created() {
      
  },
  mounted() {
    this.getList();
  },
};
</script>

<style scoped>
.info-content {
  background-color: #d6f6fb;
  height: 50px;
  color: #35b8e0;
  border: 1px solid #a5ecf7;
  font-size: 14px;
  display: flex;
  align-items: center;
  padding-left: 20px;
  margin-bottom: 15px;
}
</style>