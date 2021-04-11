<template>
  <div class="container menu7-5-container">
    <!-- <el-alert
      show-icon
      title="您当前版本是旗舰版，只有6个套餐设置数量。版本越高，套餐设置数量越多"
      type="success"
      style="margin-bottom:10px;"
      :closable="false"
    ></el-alert>-->

    <div class="filter-wrap">
      <!-- <el-button type="text" style="color:#67C23A" @click="dialog2 = true">查看规则</el-button> -->
      <el-button type="primary" icon="el-icon-edit" @click="addDialog = true">添加套餐</el-button>
    </div>
    <!-- <div class="handle-wrap">
      <el-button-group>
        <el-button size="mini">显示</el-button>
        <el-button size="mini">隐藏</el-button>
        <el-button size="mini">删除</el-button>
      </el-button-group>
    </div>-->
    <el-table
      border
      row-key="id"
      ref="multipleTable"
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      :header-cell-style="{background:'#f5f5f5',color:'#606266'}"
    >
      <el-table-column :show-overflow-tooltip="true" type="selection"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="name" label="套餐名称"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="money" label="套餐价格(元)"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="level.levelName" label="赠送级别"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="edition.editionName" label="分站版本"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="createTime" label="添加时间"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="statu" label="显示状态">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.statu === 1">显示</el-tag>
          <el-tag type="info" v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="label9"
        label="操作"
        align="center"
        width="250"
      >
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="toUpdate(scope.row)">修改</el-button>
          <el-button type="text" size="mini" @click="toDelete(scope.row.subPackageID)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.pageNum"
      :page-sizes="[10, 20, 30]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total"
    ></el-pagination>

    <!-- 添加套餐 -->
    <el-dialog title="添加套餐" :visible.sync="addDialog" width="60%" class="addDialog">
      <el-form ref="form" :model="form" label-width="140px">
        <el-form-item label="套餐名称：">
          <el-input v-model="form.name" placeholder="请输入套餐名称"></el-input>
        </el-form-item>
        <el-form-item label="套餐价格：">
          <el-input-number v-model="form.money" placeholder="请输入套餐价格" />
          <span class="tips">元</span>
        </el-form-item>
        <el-form-item label="赠送级别：">
          <el-select v-model="form.levelID" placeholder="赠送级别">
            <el-option
              :label="item.levelName"
              :value="item.levelID"
              v-for="item in userLevelList"
              :key="item.levelID"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分站版本：">
          <el-radio-group v-model="form.editionID">
            <el-radio
              :label="item.editionID"
              v-for="item in versionList"
              :key="item.editionID"
            >{{item.editionName}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态：">
          <el-radio-group v-model="form.statu">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="savePackage">发 布</el-button>
      </span>
    </el-dialog>

    <!-- 修改套餐 -->
    <el-dialog title="修改套餐" :visible.sync="updateDialog" width="60%" class="addDialog">
      <el-form ref="form" :model="updateForm" label-width="140px">
        <el-form-item label="套餐名称：">
          <el-input v-model="updateForm.name" placeholder="请输入套餐名称"></el-input>
        </el-form-item>
        <el-form-item label="套餐价格：">
          <el-input-number v-model="updateForm.money" placeholder="请输入套餐价格" />
          <span class="tips">元</span>
        </el-form-item>
        <el-form-item label="赠送级别：">
          <el-select v-model="updateForm.levelID" placeholder="赠送级别">
            <el-option
              :label="item.levelName"
              :value="item.levelID"
              v-for="item in userLevelList"
              :key="item.levelID"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分站版本：">
          <el-radio-group v-model="updateForm.editionID">
            <el-radio
              :label="item.editionID"
              v-for="item in versionList"
              :key="item.editionID"
            >{{item.editionName}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态：">
          <el-radio-group v-model="updateForm.statu">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialog = false">取 消</el-button>
        <el-button type="primary" @click="updatePackage">发 布</el-button>
      </span>
    </el-dialog>
    <!-- 规则 -->
    <el-dialog title="主站版本套餐规则" :visible.sync="dialog2" width="40%" class="dialog2">
      <ul>
        <li>
          <span class="label">普及版：</span>
          <span class="val">2个</span>
        </li>
        <li>
          <span class="label">专业版：</span>
          <span class="val">3个</span>
        </li>
        <li>
          <span class="label">旗舰版：</span>
          <span class="val">4个</span>
        </li>
        <li>
          <span class="label">MA云版：</span>
          <span class="val">5个</span>
        </li>
        <li>
          <span class="label">至尊版：</span>
          <span class="val">6个</span>
        </li>
        <li>
          <span class="label">官方测试版本：</span>
          <span class="val">10个</span>
        </li>
      </ul>
    </el-dialog>
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
import {
  getLists,
  getDatas,
  postApplicationJson,
} from "@/api/price/price-1/common";
export default {
  data() {
    return {
      color: "#333",
      form: {},
      addDialog: false,
      updateDialog: false,
      dialog2: false,
      currentPage: 1,
      checkList: [],
      page: {
        pageSize: 20,
        pageNum: 1,
        total: 0,
      },
      updateForm: {}, // 待修改
      tableData: [],
      multipleSelection: [],
      versionList: [], // 版本列表
      userLevelList: [], // 用户级别列表
    };
  },
  components: {
    Tinymce,
  },
  created() {
    this.getSiteVersionList();
    this.getUserLevelList();
    this.getList();
  },
  methods: {
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.page.pageNum = val;
      this.getList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    toUpdate(row) {
      this.updateForm = row;
      this.updateDialog = true;
    },
    toDelete(id) {
      this.$confirm("此操作将会删除数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          getDatas({ id: id }, "/site/subPackage/delete").then(
            (res) => {
              if (res.code === 1001) {
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
                this.getList();
              }
            }
          );
        })
        .catch(() => {});
    },
    getList() {
      // 分页查询
      getLists(this.page, "/site/subPackage/page").then((res) => {
        this.tableData = res.body.records;
        this.page.total = res.body.total;
      });
    },
    getSiteVersionList() {
      // 获取版本列表
      getDatas({ editionType: 2 }, "/platform/siteEdition/getList").then(
        (res) => {
          this.versionList = res.body;
        }
      );
    },
    getUserLevelList() {
      // 获取用户级别
      getDatas({}, "/site/userLevel/list").then((res) => {
        this.userLevelList = res.body;
      });
    },
    toAdd() {
      this.addDialog = true;
    },
    savePackage() {
      getLists(this.form, "/site/subPackage/add").then((res) => {
        if (res.code === 1001) {
          this.$message.success("添加成功");
          this.addDialog = false;
          this.getList();
        }
      });
    },
    updatePackage() {
      getLists(this.updateForm, "/site/subPackage/update").then((res) => {
        if (res.code === 1001) {
          this.$message.success("修改成功");
          this.updateDialog = false;
          this.getList();
        }
      });
    },
  },
};
</script>
<style lang="scss">
.menu7-5-container {
  .addDialog {
    .el-dialog__body {
      overflow: auto;
      max-height: 700px;
    }
    .el-input {
      width: 400px;
    }
    .tips {
      color: #909399;
      font-size: 12px;
      margin-left: 10px;
    }
  }
  .dialog2 {
    li {
      padding: 7px 0;
      display: flex;
      align-items: center;
      .label {
        width: 120px;
        text-align: right;
        margin-right: 10px;
      }
      a {
        color: #409eff;
      }
    }
  }
}
</style>
<style scoped lang="scss">
.container {
  padding: 20px;
  .tips {
    color: #909399;
    font-size: 12px;
    line-height: 20px;
    width: 400px;
    margin-left: 10px;
  }
  .tab-wrap {
    a {
      &.active {
        border-bottom: 2px solid #409eff;
      }
    }
  }
  .filter-wrap {
    margin-top: 20px;
  }
  .handle-wrap {
    // margin-top:20px;
    margin-bottom: 20px;
  }
}
</style>

