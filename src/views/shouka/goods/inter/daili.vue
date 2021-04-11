<template>
  <div>
    <div class="search-container">
      <el-form :inline="true" :model="searchForm">
        <el-form-item>
          <el-select v-model="searchForm.readState" clearable placeholder="分类">
            <el-option label="卡盟加款机器人" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm.orderId" clearable placeholder="商品名" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="button-group">
      <el-button type="primary" icon="el-icon-plus" @click="toAdd">添加商品</el-button>
      <el-button type="danger" icon="el-icon-close">申请成为代理</el-button>
    </div>
    <el-table
      stripe
      :data="list"
      header-row-class-name="faka-table-header"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="systemNoticeTitle" label="商品分类"></el-table-column>
      <el-table-column prop="systemNoticeTitle" label="排序"></el-table-column>
      <el-table-column prop="systemNoticeTitle" label="商品名称"></el-table-column>
      <el-table-column prop="systemNoticeTitle" label="供货价格"></el-table-column>
      <el-table-column prop="systemNoticeTitle" label="商品原价"></el-table-column>
      <el-table-column prop="systemNoticeTitle" label="库存"></el-table-column>
      <el-table-column prop="systemNoticeTitle" label="创建时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="text">对接</el-button>
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
    search() {},
    toAdd() {
      this.$router.push('/goodsManager/add')
    },
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