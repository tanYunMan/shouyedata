<template>
  <div>
    <div class="search-container">
      <el-form :inline="true" :model="searchForm" >
        <el-form-item>
          <el-select v-model="searchForm.readState" clearable placeholder="分类">
            <el-option label="卡盟加款机器人" :value="2"></el-option>
          </el-select>
          <el-select v-model="searchForm.readState" clearable placeholder="状态">
            <el-option label="已使用" :value="1"></el-option>
            <el-option label="未使用" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="button-group">
       <el-button type="primary" icon="el-icon-plus" @click="toAdd">添加优惠券</el-button>
       <el-button type="danger" icon="el-icon-close">批量删除</el-button>
    </div>
    <el-table
      stripe
      :data="list"
      header-row-class-name="faka-table-header"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="systemNoticeTitle" label="商品分类"></el-table-column>
      <el-table-column prop="systemNoticeTitle" label="优惠券号码"></el-table-column>
      <el-table-column prop="systemNoticeTitle" label="面额"></el-table-column>
      <el-table-column prop="systemNoticeTitle" label="生成时间"></el-table-column>
      <el-table-column prop="systemNoticeTitle" label="有效期"></el-table-column>
      <el-table-column prop="systemNoticeTitle" label="备注"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      loading: false,
      searchForm: {},
    };
  },
  methods: {
    search() {

    },
    toAdd() {
      this.$router.push('/discount/add')
    }
  },
};
</script>

<style scoped>
.search-container .el-form {
  padding: 0;
}
.button-group {
  margin-bottom: 15px;
}
</style>