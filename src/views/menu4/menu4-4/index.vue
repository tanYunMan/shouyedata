<template>
  <div class="container menu2-1-container">
    <div class="filter-wrap">
      <span>查询条件：</span>
      <el-select @change="onTypeChange" v-model="form.type" placeholder="请选择查询类型">
        <el-option label="商品" value="2"></el-option>
        <el-option label="站点" value="1"></el-option>
      </el-select>
      <el-input v-model="form.keyword" placeholder="请输入关键字" style="width:200px;"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="queryList">查询</el-button>
      <el-button v-if="tabIdx === 2" type="primary" icon="el-icon-share" style="margin:0 10px 0 0" @click="batchDocking">批量对接</el-button>
    </div>
    <div class="tab" v-if="tabIdx === 1">
      <div>
        <el-table border row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266','text-align':'center'}" size="mini" v-loading="loading" >
          <!--  <el-table-column :show-overflow-tooltip="true" type="selection" > </el-table-column> -->
          <el-table-column :show-overflow-tooltip="true" prop="siteName" label="供货平台信息"  >
            <template slot-scope="scope">
              <div style="display:flex;align-items: center;">
                <el-image style="width: 40px; height: 40px; border-radius: 50%;" v-if="scope.row.baseInfo" :src="scope.row.baseInfo.headImg||AvatarDef" :preview-src-list="[scope.row.baseInfo.headImg]" />
                <el-image style="width: 40px; height: 40px; border-radius: 50%;" :src="AvatarDef" :preview-src-list="[AvatarDef]" v-else></el-image>
                <span style="margin-left:5px">{{scope.row.siteName}}</span>
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column :show-overflow-tooltip="true" prop="label2" label="商户名称">
            <template slot-scope="scope">
              <el-link :underline="false">{{scope.row.baseInfo && scope.row.baseInfo.merchantName || ''}}</el-link>
            </template>
          </el-table-column> -->
          <!-- <el-table-column :show-overflow-tooltip="true" prop="label2" label="对接码">
            <template slot-scope="scope">
              <el-link :underline="false">{{scope.row.joinCode || ''}}</el-link>
            </template>
          </el-table-column> -->
          <el-table-column :show-overflow-tooltip="true" prop="label2" label="QQ">
            <template slot-scope="scope">
              <el-link :underline="false">{{scope.row.baseInfo && scope.row.baseInfo.qq || ''}}</el-link>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="label2" label="介绍">
            <template slot-scope="scope">
              <div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;cursor: pointer;color:#409EFF">{{scope.row.baseInfo && scope.row.baseInfo.remark || ''}}</div>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="label2" label="保证金（元）" align="center">
            <template slot-scope="scope">
              <!-- <el-button type="danger" plain size="mini" v-if="scope.row.connectMoney">{{scope.row.connectMoney}}</el-button> -->
              <div>{{scope.row.connectMoney || ''}}</div>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="label3" label="版本" align="center" >
            <template slot-scope="scope">
              <el-button type="text" plain size="mini" v-if="scope.row.siteEdition" >{{scope.row.siteEdition&&scope.row.siteEdition.editionName}}</el-button>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="label10" label="商家网址" align="center">
            <template slot-scope="scope">
              <a style="color:#409EFF" v-if="scope.row.systemDomain" target="_blank" type="primary" :href="'http://'+scope.row.domainPre+'.'+scope.row.systemDomain.domainAddr">{{'http://'+scope.row.domainPre+'.'+scope.row.systemDomain.domainAddr}}</a>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="label10" label="商家信息" align="center" width="160">
            <template slot-scope="scope">
              <el-button type="text" plain size="mini" @click="lookBusiness(scope.row.siteID)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="label10" label="操作"  fixed="right" width="160" align="center">
            <template slot-scope="scope">
              <el-button type="text" v-if="!scope.row.joinState" size="mini" @click="applicationDocking(scope.row)">申请对接</el-button>
              <el-button type="text" v-else @click="dockingDirectory(scope.row.siteID)" size="mini">对接目录</el-button>
              <el-button type="text" v-if="scope.row.cloneState == 0 || scope.row.cloneState == 5" @click="applyForClone(scope.row)" size="mini">申请克隆</el-button>
              <el-button type="text" v-if="scope.row.cloneState == 2" @click="applyForClone(scope.row)" size="mini">克隆</el-button>
              <el-button type="text" v-if="scope.row.cloneState == 4" @click="applyForClone(scope.row)" size="mini">取消克隆</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[30,50,100]" :page-size="30" layout="prev, pager, next, jumper" :total="total"> </el-pagination>
      </div>

      <!-- 申请对接 -->
      <el-dialog title="是否申请对接？" :visible.sync="dockingDialog" width="30%" :close-on-click-modal="false">
      <span slot="footer" class="dialog-footer">
        <el-button @click="dockingDialog = false">取 消</el-button>
        <el-button type="primary" @click="dockingConfirm" :loading="dockingConfirmLoading">确 定</el-button>
      </span>
      </el-dialog>

      <!-- 查看商家信息 -->
      <el-dialog title="商家信息" :visible.sync="businessInfoDialog" width="40%" class="dialog1">
        <ul class="businessInfoUl">
          <li>
            <span class="label">站点域名：</span>
              <a style="color:#409EFF" v-if="businessInfo" target="_blank" type="primary" :href="'http://'+businessInfo.domain">{{'http://'+businessInfo.domain}}</a>
          </li>
          <li>
            <span class="label">头像：</span>
            <el-image class="val-img" :src="businessInfo.headImg" v-if="businessInfo"></el-image>
          </li>
          <li>
            <span class="label">商家名称：</span>
            <span class="val" v-if="businessInfo">{{businessInfo.merchantName}}</span>
          </li>
          <li>
            <span class="label">联系电话：</span>
            <span class="val" v-if="businessInfo">{{businessInfo.phone}}</span>
          </li>
          <li>
            <span class="label">联系QQ：</span>
            <span class="val" v-if="businessInfo">{{businessInfo.qq}}</span>
          </li>
          <li>
            <span class="label">备注：</span>
            <span class="val" v-if="businessInfo">{{businessInfo.remark}}</span>
          </li>
        </ul>
      </el-dialog>
      <!-- 克隆 -->
      <el-dialog :title="cloneTitle" :visible.sync="cloneDialog" width="30%" :close-on-click-modal="false">
      <span slot="footer" class="dialog-footer">
        <el-button @click="cloneDialog = false">取 消</el-button>
        <el-button type="primary" @click="cloneConfirm" :loading="updateAgentTypeConfirmLoading">确 定</el-button>
      </span>
      </el-dialog>
    </div>
    <div class="tab" v-if="tabIdx === 2">
      <GoodsTable ref="goodsTable" :goodsName="form.keyword" />
    </div>


  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { getLists,getDatas } from '@/api/price/price-1/common'
import AvatarDef from '@/assets/avatar_def.jpg'
import GoodsTable from './components/index';

export default {
  data() {
    return {
      form:{
        type: '2',
      },
      dialog1:false,
      businessInfoDialog: false,
      dockingConfirmLoading: false,
      updateAgentTypeConfirmLoading: false,
      dockingDialog: false,
      currentPage:1,
      dockingForm:{},
      businessInfo:{},
      queryParams:{
        pageNum:1,
        pageSize:30
      },
      loading: true,
      total:0,
      tableData: [],
      multipleSelection: [],
      cloneDialog: false,
      cloneTitle: '',
      cloneState: '',
      AvatarDef,
      goodsName: '',
      tabIdx: 1,
    }
  },
  components: {
    Tinymce,
    GoodsTable
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 选择类型
    onTypeChange() {

      if(+this.form.type === 3) {
        this.$router.push('/menu4/5')
      }
    },

    batchDocking() {
      this.$refs.goodsTable.batchDocking();
    },

    // 获取全网通站点列表
    getList() {
      this.loading = true
      getLists(this.queryParams,'/platform/site/getConnectSites').then(res => {
        if (res.code===1001){
          this.tableData = res.body.records
          this.total = res.body.total
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },

    // 申请对接
    applicationDocking(data){
      this.dockingDialog = true
      this.dockingForm = {
        siteID: data.siteID
      }
    },
    // 确认对接申请
    dockingConfirm (){
      this.dockingConfirmLoading = true
      if(!this.dockingForm.siteID){
        this.$message({
          showClose: true,
          message: '站点ID异常',
          type: 'error',
        });

        this.dockingConfirmLoading = false
        return
      }
      getLists(this.dockingForm,'/site/joinSite/saveJoinSite').then(res => {
        if (res.code===1001){
          this.$message({
            message: res.msg,
            type: 'success',
          });
          this.dockingDialog = false
          this.dockingConfirmLoading = false
          this.getList()
        }else{
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'error',
          });
          this.dockingConfirmLoading = false
        }
      }).catch(err => {
          this.dockingConfirmLoading = false
      })
    },
    // 申请克隆
    applyForClone(row) {
        this.cloneState = row.cloneState
        if (this.cloneState == 0 || this.cloneState == 5) {
          this.cloneTitle = "是否申请克隆？"
        } else if (this.cloneState == 2) {
          this.cloneTitle = "是否克隆？"
        } else if (this.cloneState == 4) {
          this.cloneTitle = "是否取消克隆？"
        }
        this.cloneDialog = true
        this.cloneForm = {
          joinSiteID: row.joinSiteID
        }
    },

    // 确认申请克隆
    cloneConfirm(){
      this.updateAgentTypeConfirmLoading = true
      let url = ''
      if (this.cloneState == 0 || this.cloneState == 5) {// 申请克隆
        url = "/site/joinSite/applyClone"
      } else if (this.cloneState == 2) { // 克隆
        url = "/site/joinSite/clone"
      } else if (this.cloneState == 4) { // 取消克隆
        url = "/site/joinSite/cancleClone"
      }
      getLists(this.cloneForm,url).then(res => {
        if (res.code===1001){
          this.$message({
            message: res.msg,
            type: 'success',
          });
          this.cloneDialog = false
          this.updateAgentTypeConfirmLoading = false
          this.getList()
        }else{
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'error',
          });
          this.updateAgentTypeConfirmLoading = false
        }
      }).catch(err => {
          this.updateAgentTypeConfirmLoading = false
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
      this.multipleSelection = val;
    },
    godomainAddr(data){
      if (data.systemDomain && data.systemDomain.domainAddr){
        let url = data.systemDomain.domainAddr
        if(url.indexOf('http')!==0){
            url = "http://"+url
        }
        window.open(url,"_blank")
      }
    },

    // 查询列表
    queryList(){
      if(!this.form.type){
        this.$message({
          showClose: true,
          message: '请选择查询类型',
          type: 'error',
        });
        return
      }

      if(!this.form.keyword){
        this.$message({
          showClose: true,
          message: '请输入查询关键字',
          type: 'error',
        });
        return
      }

      this.tabIdx = +this.form.type;

      if(+this.form.type === 2) {
        setTimeout(()=> {
          this.$refs.goodsTable.queryList();
        }, 1000)
        return;
      }
      this.queryParams = {
        pageNum:1,
        pageSize:10,
      }
      if (this.form.type === '1') {// 站点名称查询
          this.queryParams = { ...this.queryParams,siteName:this.form.keyword}
      }
      if (this.form.type === '2') {// 站点名称查询
          this.queryParams = { ...this.queryParams,siteName:this.form.keyword}
      }

      this.getList()
    },

    // 获取商家信息
    lookBusiness(id){
      getDatas({siteID:id},'/site/baseInfo/getByID').then(res => {
        if (res.code===1001){
          this.businessInfo = res.body
          this.businessInfoDialog = true
        }else{
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'error',
          });
        }
      }).catch(err => {

      })
    },

    go(data) {
      this.$router.push({path:'/menu4/4/sub1/'+data.siteID})
    },
    // 对接目录列表
    dockingDirectory(id){
      if (!id) {
        this.$message({
          showClose: true,
          message: '站点ID异常（null）',
          type: 'error',
        });
      }else{
        this.$router.push({path:'/menu4/3/sub1/'+id})
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.container {
  padding:20px;
  .filter-wrap {
    button {
      float: none;
    }
  }
  &.menu2-1-container {
    .dialog1 {
      .el-dialog__body {
        overflow: auto;
        max-height:700px;
      }
      .el-input {
        width:400px;
      }
    }
  }
  .tips {
    color:#909399;
    font-size:12px;
    line-height:20px;
    width:400px;
    margin-left:10px;
  }
  .tab-wrap {
    a {
      &.active {
        border-bottom:2px solid #409eff
      }
    }
  }
  .filter-wrap {
    margin-top:20px;
    &.hack {

    }
  }
  .handle-wrap {
    // margin-top:20px;
    margin-bottom:20px;
  }
  .businessInfoUl li{
    margin: 10px auto;
  }
  .businessInfoUl li .label{
      font-weight: 600;
  }
  .businessInfoUl li {
    display: flex;
    align-items: center;
    .label {
      width: 100px;
    }
    .val-img {
      width: 50px;
      height: 50px;
    }
  }
}
</style>

