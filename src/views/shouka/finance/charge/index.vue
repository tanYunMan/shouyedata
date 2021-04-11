<template>
  <div>
    <div class="button-group">
      <el-button type="primary" icon="el-icon-plus" @click="toAdd">新增接口</el-button>
    </div>
    <el-table
      stripe
      :data="list"
      header-row-class-name="faka-table-header"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="systemNoticeTitle" label="编号"></el-table-column>
      <el-table-column prop="systemNoticeTitle" label="充值属性"></el-table-column>
      <el-table-column prop="systemNoticeTitle" label="充值标识"></el-table-column>
      <el-table-column prop="systemNoticeTitle" label="充值费率"></el-table-column>
      <el-table-column prop="systemNoticeTitle" label="最低费用"></el-table-column>
      <el-table-column prop="systemNoticeTitle" label="状态"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="新增接口" :visible.sync="addDialog" width="40%">
      <add />
    </el-dialog>

  </div>
</template>

<script>
import add from './add'
export default {
  data() {
    return {
      list: [],
      loading: false,
      addDialog: false,
      searchForm: {},
    };
  },
  components: {
    add
  },
  methods: {
    search() {},
    toAdd() {
      this.addDialog = true;
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