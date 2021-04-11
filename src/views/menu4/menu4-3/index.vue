<template>
  <div class="container menu2-1-container">
    <div class="filter-wrap">
      <span>查询条件：</span>
      <el-select v-model="value" size="mini" placeholder="请选择用户级别" clearable
    @clear="setValueNull"
>
        <el-option
          v-for="item in userLevel"
          :key="item.levelID"
          :label="item.levelName"
          :value="item.levelID">
        </el-option>
      </el-select>


      <span style="padding-left:20px">对接状态：</span>
      <el-select v-model="queryParams.joinState" size="mini" placeholder="对接状态" clearable>
        <el-option label="申请对接" value="1"></el-option>
        <el-option label="申请通过" value="2"></el-option>
        <el-option label="审核失败" value="3"></el-option>
        <el-option label="拉黑" value="4"></el-option>
      </el-select>


      <el-button type="primary" icon="el-icon-search" @click="query" :loading="queryLoading">查询</el-button>
    </div>
      <div class="handle-wrap">
        <el-button-group>
          <el-button size="mini" :type="queryParams.type === -1 ? 'primary' : ''" :loading="buttonRight" @click="getSiteList(-1)">我对接的站</el-button>
          <el-button size="mini" :type="queryParams.type === 1 ? 'primary' : ''" :loading="buttonLeft" @click="getSiteList(1)">对接我的站</el-button>
        </el-button-group>
      </div>
      <el-table v-if="queryParams.type === -1" border row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266','text-align':'center'}" size="mini" v-loading="loading">
        <!--  <el-table-column :show-overflow-tooltip="true" type="selection" > </el-table-column> -->
         <el-table-column :show-overflow-tooltip="true" prop="label1" label="对接平台信息" align="left">
          <template slot-scope="scope">
              <div style="display:flex;align-items: center;"><el-image style="width: 40px; height: 40px; border-radius: 50%;"
              v-if="scope.row.site.baseInfo && scope.row.site.baseInfo.headImg" :src="scope.row.site.baseInfo.headImg" :preview-src-list="[scope.row.site.baseInfo.headImg]" />
              <span style="margin-left:20px">{{scope.row.site.siteName}}</span></div>
          </template>
        </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label2" label="商户名称">
          <template slot-scope="scope">
            <el-link :underline="false">{{scope.row.site && scope.row.site.baseInfo && scope.row.site.baseInfo.merchantName}}</el-link>
          </template>
        </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label2" label="QQ">
          <template slot-scope="scope">
            <el-link :underline="false">{{scope.row.site && scope.row.site.baseInfo && scope.row.site.baseInfo.qq || ''}}</el-link>
          </template>
        </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label2" label="介绍">
          <template slot-scope="scope">
            <div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;cursor: pointer;color:#409EFF">
              {{scope.row.site && scope.row.site.baseInfo && scope.row.site.baseInfo.remark || ''}}</div>
          </template>
        </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="levelName" label="客户级别" align="center">
          <template slot-scope="scope">
            <el-link type="warning" :underline="false" size="mini" v-if="scope.row.levelName">{{scope.row.levelName}}</el-link>
          </template>
        </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="joinTime" label="对接状态" align="center">
          <template slot-scope="scope">
            <el-button type="danger" plain size="mini" style="margin-left:0" v-show="scope.row.joinState == 1" >申请对接</el-button>
            <el-button type="warning" plain size="mini" style="margin-left:0" v-show="scope.row.joinState == 2" >申请通过</el-button>
            <el-button type="primary" plain size="mini" style="margin-left:0" v-show="scope.row.joinState == 3" >审核失败</el-button>
            <el-button type="primary" plain size="mini" style="margin-left:0" v-show="scope.row.joinState == 4" >拉黑</el-button>
          </template>
         </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="操作"  fixed="right" width="300" align="center">
          <template slot-scope="scope">
            <!-- <el-button type="text" @click="lahei(scope.row.joinSiteID)" size="mini">拉黑</el-button> -->
            <el-button type="text" @click="dockingDirectory(scope.row.siteID)" size="mini">对接目录</el-button>
            <el-button type="text" size="mini" @click="del(scope.row)">删除</el-button>
            <el-button type="text" v-if="scope.row.cloneState == 0 || scope.row.cloneState == 5" @click="applyForClone(scope.row)" size="mini">申请克隆</el-button>
            <el-button type="text" v-if="scope.row.cloneState == 2" @click="applyForClone(scope.row)" size="mini">克隆</el-button>
            <el-button type="text" v-if="scope.row.cloneState == 4" @click="applyForClone(scope.row)" size="mini">取消克隆</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-table v-if="queryParams.type === 1" border row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266','text-align':'center'}" size="mini" v-loading="loading">
        <!--  <el-table-column :show-overflow-tooltip="true" type="selection" > </el-table-column> -->
         <el-table-column :show-overflow-tooltip="true" prop="label1" label="站点名称" align="left">
          <template slot-scope="scope">
              <span style="margin-left:20px">{{scope.row.joinSite.siteName}}</span>
          </template>
        </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label2" label="站点域名" align="center">
          <template slot-scope="scope">
            <el-link :underline="false">{{scope.row.joinSite.domainPre || '' + scope.row.joinSite.systemDomain || ''}}</el-link>
          </template>
        </el-table-column>
        <!--  <el-table-column :show-overflow-tooltip="true" prop="levelName" label="客户级别" align="center">
          <template slot-scope="scope">
            <el-link type="warning" :underline="false" size="mini" v-if="scope.row.levelName">{{scope.row.levelName}}</el-link>
          </template>
        </el-table-column> -->
         <el-table-column :show-overflow-tooltip="true" prop="label2" label="标签" align="center">
          <template slot-scope="scope">
            <el-link :underline="false">{{scope.row.joinSite.siteEdition && scope.row.joinSite.siteEdition.editionName}}</el-link>
          </template>
        </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="levelName" label="客户级别" align="center">
          <template slot-scope="scope">
            <el-button type="primary" plain size="mini" v-if="scope.row.levelName" @click="setUserLevel(scope.row)">{{scope.row.levelName}}</el-button>
            <el-button type="primary" plain size="mini" v-else @click="setUserLevel(scope.row)">设置客户级别</el-button>
          </template>
        </el-table-column>

         <el-table-column :show-overflow-tooltip="true" prop="test6" label="克隆状态" align="center">
          <template slot-scope="scope">
            <el-button type="primary" plain size="mini" style="margin-left:0" v-show="scope.row.cloneState == 0" @click="updateCloneState(scope.row)">未克隆</el-button>
            <el-button type="danger" plain size="mini" style="margin-left:0" v-show="scope.row.cloneState == 1" @click="updateCloneState(scope.row)">申请中</el-button>
            <el-button type="warning" plain size="mini" style="margin-left:0" v-show="scope.row.cloneState == 2">审核通过</el-button>
            <el-button type="primary" plain size="mini" style="margin-left:0" v-show="scope.row.cloneState == 3" @click="updateCloneState(scope.row)">审核失败</el-button>
            <el-button type="primary" plain size="mini" style="margin-left:0" v-show="scope.row.cloneState == 4" @click="updateCloneState(scope.row)">已克隆</el-button>
            <el-button type="primary" plain size="mini" style="margin-left:0" v-show="scope.row.cloneState == 5" @click="updateCloneState(scope.row)">拉黑</el-button>
          </template>
        </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="test6" label="对接状态" align="center">
          <template slot-scope="scope">
            <el-button type="danger" plain size="mini" style="margin-left:0" v-show="scope.row.joinState == 1" >申请对接</el-button>
            <el-button type="warning" plain size="mini" style="margin-left:0" v-show="scope.row.joinState == 2" >申请通过</el-button>
            <el-button type="primary" plain size="mini" style="margin-left:0" v-show="scope.row.joinState == 3" >审核失败</el-button>
            <el-button type="primary" plain size="mini" style="margin-left:0" v-show="scope.row.joinState == 4" >拉黑</el-button>
          </template>
        </el-table-column>
        <!--  <el-table-column :show-overflow-tooltip="true" prop="joinTime" label="对接时间" align="center" /> -->
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="操作"  fixed="right" width="300" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="lahei(scope.row.joinSiteID)" size="mini">拉黑</el-button>
            <el-button type="text" size="mini" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>

    <!-- 修改价格体系 -->
    <el-dialog title="修改价格体系" :visible.sync="dialog1" width="60%" class="dialog1">
      <el-form ref="form" :model="form" label-width="140px">
        <el-form-item label="价格体系说明：">
          <div>级别越高，您赚取的利润越低！</div>
        </el-form-item>
        <el-form-item label="级别：">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option label="无事" value="1"></el-option>
            <el-option label="最高密价" value="2"></el-option>
            <el-option label="密价" value="3"></el-option>
            <el-option label="对接等级" value="4"></el-option>
            <el-option label="站长" value="5"></el-option>
            <el-option label="SVIP" value="6"></el-option>
            <el-option label="VIP3" value="7"></el-option>
            <el-option label="VIP2" value="8"></el-option>
            <el-option label="VIP1" value="9"></el-option>
            <el-option label="VIP" value="10"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog1 = false">取 消</el-button>
        <el-button type="primary" @click="dialog1 = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 拉黑操作 -->
    <el-dialog title="拉黑已对接的站" :visible.sync="dialog2" width="60%" class="dialog1" :close-on-click-modal="false">
      <el-form ref="form" :model="form" label-width="140px">
        <el-form-item label="操作对接站：">
          <el-select v-model="form.isClone" placeholder="请选择">
            <el-option label="取消克隆" value=1></el-option>
            <el-option label="断开对接" value=2></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog2 = false">取 消</el-button>
        <el-button type="primary" @click="operationLaHei">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 对接状态修改 -->
    <el-dialog title="对接状态修改" :visible.sync="updateJoinStateDialog" >
      <el-form ref="updateAgentTypeForm" :model="updateAgentTypeForm" label-width="120px">
        <el-form-item label="是否允许供货：">
          <el-radio-group v-model="updateAgentTypeForm.joinState">
            <el-radio :label="1">申请对接</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">拉黑</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateJoinStateDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateAgentStateConfirm" :loading="updateAgentTypeConfirmLoading">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 克隆状态修改 -->
    <el-dialog title="克隆状态修改" :visible.sync="updateCloneStateDialog" >
      <el-form ref="updateAgentCloneForm" :model="updateAgentCloneForm" label-width="120px">
        <el-form-item label="是否允许供货：">
          <el-radio-group v-model="updateAgentCloneForm.cloneState">
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateCloneStateDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateAgentCloneStateConfirm" :loading="updateAgentTypeConfirmLoading">确 定</el-button>
      </span>
    </el-dialog>


    <!-- 修改用户级别 -->
    <el-dialog title="用户级别" :visible.sync="dialog3" width="60%" class="dialog1" :close-on-click-modal="false">
      <el-form ref="formUser" :model="formUser" label-width="140px">
        <el-form-item label="级别：">
          <el-select v-model="formUser.levelID" placeholder="请选择">
            <el-option
              v-for="item in userLevel"
              :key="item.levelID"
              :label="item.levelName"
              :value="item.levelID">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog3 = false">取 消</el-button>
        <el-button type="primary" @click="confirmLevel">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 克隆 -->
    <el-dialog :title="cloneTitle" :visible.sync="cloneDialog" width="30%" :close-on-click-modal="false">
      <span slot="footer" class="dialog-footer">
        <el-button @click="cloneDialog = false">取 消</el-button>
        <el-button type="primary" @click="cloneConfirm" :loading="updateAgentTypeConfirmLoading">确 定</el-button>
      </span>
    </el-dialog>


    <!-- 删除 -->
    <el-dialog title="确认删除" :visible.sync="delDialog" width="30%" >
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialog = false">取 消</el-button>
        <el-button type="primary" @click="delConfirm" :loading="delConfirmLoading">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { getList,getLists,getDatas } from '@/api/price/price-1/common'
import { deleteJoin } from '@/api/meun4/meun4-3/index'
export default {
  data() {
    return {
      delId:-1,
      delConfirmLoading:false,
      delDialog:false,
      type:1,
      color:'#333',
      form:{
        joinSiteID: '',
      },
      formUser:{},
      buttonLeft: false,
      buttonRight: false,
      updateJoinStateDialog: false,
      updateCloneStateDialog: false,
      updateAgentTypeConfirmLoading: false,
      cloneDialog: false,
      cloneForm:{
        joinSiteID: '',
      },
      dialog1:false,
      dialog2: false,
      dialog3: false,
      currentPage:1,
      loading:true,
      tableData: [],
      queryParams:{
        pageNum:1,
        pageSize:10,
        type: -1
      },
      updateAgentTypeForm:{
        joinState: '',
        joinSiteID: ''
      },
      updateAgentCloneForm:{
        cloneState: '',
        joinSiteID: ''
      },
      queryLoading: false,
      total:0,
      multipleSelection: [],
      value: '',
      cloneTitle: '',
      cloneState: '',
      userLevel:[]   // 用户级别
    }
  },
  components: {
    Tinymce
  },
  mounted() {
    this.getList()
    this.getUserLevel()
  },
  methods: {
    // 拉黑显示
    lahei(id){
      this.dialog2 = true
      this.form = {
        joinSiteID : id
      }
    },
    // 操作拉黑
    operationLaHei() {
        if(!this.form.joinSiteID) {
          this.$message({
            showClose: true,
            message: '站点ID异常',
            type: 'error',
          });
        }else if(!this.form.isClone) {
          this.$message({
            showClose: true,
            message: '青选择操作类别',
            type: 'error',
          });
        }else{
          getLists(this.form,'/site/joinSite/cancel').then(res => {
            if (res.code===1001){
              this.$message({
                message: res.msg,
                type: 'success',
              });
              this.getList()
              this.dialog2 = false
            }else{
              this.$message({
                showClose: true,
                message: res.msg,
                type: 'error',
              });
            }
          }).catch(err => {

          })
        }
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


    // 获取对接商户列表
    getList() {
      this.loading = true
      getLists(this.queryParams,'/site/joinSite/joinSitePage').then(res => {
        if (res.code===1001){
          this.tableData = res.body.records
          this.total = res.body.total
        }
        this.loading = false
        this.queryLoading = false
        this.buttonRight = false
        this.buttonLeft = false
      }).catch(err => {
        this.loading = false
      })
    },


    // 设置用户级别
    setUserLevel(data) {
      this.dialog3 = true
      this.formUser = {
        joinSiteID : data.joinSiteID,
        levelID: data.levelID
      }
    },

    // 确认设置用户级别
    confirmLevel () {
      if(!this.formUser.levelID){
        this.$message({
          showClose: true,
          message: '请选择用户级别',
          type: 'error',
        });
      }else{
        getLists(this.formUser,'/site/joinSite/updateLevel').then(res => {
          if (res.code===1001){
            this.$message({
              message: res.msg,
              type: 'success',
            });
            this.dialog3 = false
            this.getList()
          }else{
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error',
            });
          }
        }).catch(err => {

        })
      }
    },

    // 修改对接状态
    updateJoinState(data) {
      this.updateJoinStateDialog = true
      this.updateAgentTypeForm = {
        joinState: data.joinState,
        joinSiteID: data.joinSiteID
      }
    },


    // 修改克隆状态
    updateCloneState(data) {
      this.updateCloneStateDialog = true
      this.updateAgentCloneForm = {
        cloneState: 2,
        joinSiteID: data.joinSiteID
      }
    },

    // 选择列表type
    getSiteList(val) {
      if(val===1) {
        this.buttonLeft = true
      }else {
        this.buttonRight = true
      }
      this.value = ''
      this.tableData = []
      this.loading = true
      this.queryParams = {
        pageNum:1,
        pageSize:10,
        type: val
      }
      this.getList()
    },

    // 获取用户级别
    getUserLevel () {
      getDatas({},'/site/userLevel/list').then(res => {
        if (res.code===1001){
          this.userLevel = res.body
        }
      }).catch(err => {
      })
    },

    // 查询
    query () {
      this.queryLoading = true
      if (this.value) {
        this.queryParams = {
          ...this.queryParams,
          pageNum:1,
          levelID:this.value
        }
      }else{
        this.queryParams = {
          ...this.queryParams,
          pageNum:1,
          type: this.queryParams.type
        }
      }
      this.getList()
    },
    //  清空按钮
    setValueNull(val) {
      this.value='';
      delete this.queryParams.levelID
    },

    // 确认修改状态
    updateAgentStateConfirm(){
      this.updateAgentTypeConfirmLoading = true
      getLists(this.updateAgentTypeForm,'/site/joinSite/updateJoinState').then(res => {
        if (res.code===1001){
          this.$message({
            message: res.msg,
            type: 'success',
          });
          this.updateJoinStateDialog = false
          this.updateAgentTypeConfirmLoading = false
          this.getList()
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


    // 确认修改克隆
    updateAgentCloneStateConfirm(){
      this.updateAgentTypeConfirmLoading = true
      getLists(this.updateAgentCloneForm,'/site/joinSite/updateCloneState').then(res => {
        if (res.code===1001){
          this.$message({
            message: res.msg,
            type: 'success',
          });
          this.updateCloneStateDialog = false
          this.updateAgentTypeConfirmLoading = false
          this.getList()
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

    go() {
      this.$router.push({path:'/menu4/1/sub1'})
    },
    go1() {
      this.$router.push({path:'/menu4/1/sub2'})
    },

    del(row){
      this.delId=row.joinSiteID;
      this.delDialog = true;
    },

    delConfirm(){
      this.delConfirmLoading = true
      deleteJoin({joinSiteID:this.delId}).then(res => {
        if(res.code === 1001){
          this.$message({
             showClose: true,
            message: res.msg,
            type: 'success',
          })
        }else{
           this.$message({
             showClose: true,
            message: res.msg,
            type: 'error',
          })
        }
        this.delDialog = false
        this.delConfirmLoading = false
        this.getList();
      })
    }
  }
}
</script>
<style lang="scss">
.menu2-1-container {
  .dialog1 {
    .el-dialog__body {
      overflow: auto;
      max-height:700px;
    }
    .el-input {
      // width:400px;
    }
  }
}
</style>
<style scoped lang="scss">
.container {
  padding:20px;
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
  }
  .handle-wrap {
    // margin-top:20px;
    margin-bottom:20px;
  }

}
</style>

