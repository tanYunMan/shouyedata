<template>
  <div>
    <div class="search-container">
      <el-form :inline="true" :model="searchForm" >
        <el-form-item>
          <el-select v-model="searchForm.readState" clearable placeholder="读取状态">
            <el-option label="已读取" :value="1"></el-option>
            <el-option label="未读取" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      stripe
      :data="logList"
      header-row-class-name="faka-table-header"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="systemNoticeTitle" label="发件人"></el-table-column>
      <el-table-column prop="systemNoticeTitle" label="标题"></el-table-column>
      <el-table-column prop="systemNoticeTitle" label="内容"></el-table-column>
      <el-table-column prop="systemNoticeTitle" label="读取状态"></el-table-column>
      <el-table-column prop="systemNoticeTitle" label="发送时间"></el-table-column>
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
      logList: [],
      searchForm: {},
    };
  },
  methods: {
    search() {},
  },
};
</script>

<style scoped>
.search-container .el-form {
  padding: 0;
}
</style>