<template>
  <div class="container menu6-2-container">
    <div class="filter-wrap">
      <span>查询条件：</span>
      <el-input v-model="tableDataInfo.userName" placeholder="请输入客户名称" style="width:200px;"></el-input>
      <el-input v-model="tableDataInfo.localUserID" placeholder="请输入客户编号" style="width:200px;"></el-input>
      <el-select v-model="tableDataInfo.userState" placeholder="客户状态" clearable >
        <el-option label="正常" value="1"></el-option>
        <el-option label="禁用" value="2"></el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-search" @click="getUserListform">查询</el-button>
      <!-- <el-button type="primary" icon="el-icon-delete" @click="dialog7 = true">回收站</el-button> -->
    </div>
    <div class="handle-wrap">
      <el-button-group>
        <el-button size="mini" @click="modifyForm(4)">状态</el-button>
        <el-button size="mini" @click="modifyForm(11)" type="warning">客户等级</el-button>
        <!-- <el-button size="mini" @click="dialog5 = true">上下关系</el-button>
        <el-button size="mini" @click="dialog6 = true">发送短信</el-button>
        <el-button size="mini">删除</el-button> -->
      </el-button-group>
    </div>
    <el-table border row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266','text-align':'center'}" v-loading="loading" size="mini" :cell-style="{'text-align':'center'}">
         <el-table-column :show-overflow-tooltip="true" type="selection" > </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="localUserID" label="编号"  ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="userName" label="用户名"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="userLevelName" label="客户级别">
          <template slot-scope="scope">
            <a type="primary" plain size="mini" style="color:#409EFF" v-show="scope.row.userLevelName" @click="updateAgentType(scope.row)">{{scope.row.userLevelName}}</a>
          </template>
        </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="money" label="余额"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="oldMoney" label="已消费"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="userState" label="状态">
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.userState == 1" size="mini" @click="updateUserState(scope.row)">开通</el-button>
            <el-button type="text" size="mini" v-if="scope.row.userState == 2" @click="updateUserState(scope.row)">禁用</el-button>
          </template>
        </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="QQ">
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.isQq===0" size="mini" style="color:#F56C6C" @click="bindOperation(scope.row,'qq')" >未绑定</el-button>
            <el-button type="text" v-else size="mini" @click="bindOperation(scope.row,'qq')" >解绑</el-button>
          </template>
        </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="微信">
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.isWx===0" size="mini" style="color:#F56C6C" @click="bindOperation(scope.row,'wx')" >未绑定</el-button>
            <el-button type="text"v-else size="mini" @click="bindOperation(scope.row,'wx')">解绑</el-button>
          </template>
        </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="财务">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-goods" @click="addAndDeduct(scope.row)"></el-button>
            <el-button type="info" icon="el-icon-view" size="mini" @click="lookMoneyList(scope.row)"></el-button>
          </template>
        </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="操作"  fixed="right" width="250">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="editUserInfo(scope.row)">编辑</el-button>
            <!-- <el-button type="warning" size="mini" @click="editUserInfo(scope.row)">权限</el-button> -->
            <el-button style="margin-right:10px;" type="text" size="mini" @click="setRole(scope.row)">权限</el-button>
            <el-popover :ref="`popover-${scope.$index}`" placement="top" width="160" v-model="scope.visible" >
                <p>确定删除吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="scope._self.$refs[`popover-${scope.$index}`].doClose()">取消</el-button>
                  <el-button type="primary" size="mini" @click="deleteTask(scope)">确定</el-button>
                </div>
                <el-button type="text" size="mini" @click="scope.visible = true" slot="reference">删除</el-button>
            </el-popover>
          </template>
        </el-table-column>

      </el-table>
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="tableDataInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableDataInfo.total"> </el-pagination>

    <!-- 财务 -->
    <el-dialog title="财务" :visible.sync="dialog1"  class="dialog1">
      <el-form ref="financeForm" :model="financeForm" label-width="140px">
        <el-form-item label="加款方式：">
          <div style="color:#F56C6C">平台给客户加/扣款</div>
        </el-form-item>
        <el-form-item label="管理员账户余额：">
          <span style="color:#F56C6C;">{{financeForm.userMoney || '0'}}</span><span class="tips">元</span>
        </el-form-item>
        <el-form-item label="客户编号：">
          <el-input v-model="financeForm.userID" style="width:180px" placeholder="请输入客户编号" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="操作金额：">
          <!-- <el-input v-model="financeForm.money" placeholder="请输入操作金额" ></el-input> -->
          <el-input-number v-model="financeForm.money" placeholder="请输入操作金额" controls-position="right" :min="0" :max="financeForm.userMoney" :precision="2" :step="1"></el-input-number><span class="tips">元</span>
        </el-form-item>
        <el-form-item label="确认金额：">
          <!-- <el-input v-model="financeForm.moneys" placeholder="请输入操作金额" ></el-input><span class="tips">元</span> -->
          <el-input-number v-model="financeForm.moneys" placeholder="请输入操作金额" controls-position="right" :min="0" :max="financeForm.userMoney" :precision="2" :step="1"></el-input-number><span class="tips">元</span>
        </el-form-item>
        <el-form-item label="操作类型：">
          <el-select v-model="financeForm.transactionType" placeholder="请选择">
            <el-option
              v-for="item in operTypeList"
              :key="item.key"
              :label="item.text"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="相关备注：">
          <el-input v-model="financeForm.remark" type="textarea" :rows="4" placeholder="请输入相关备注" style="width:400px;" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog1 = false">取 消</el-button>
        <el-button type="primary" @click="addAndDeductData" :loading="confirmLoading">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog title="编辑客户资料" :visible.sync="dialog2"  class="dialog2" :close-on-click-modal="false">
      <el-form ref="userInfoForm" :rules="rules" :model="userInfoForm" label-width="140px">
        <el-form-item label="客户编号：">
          <div >{{userInfoForm.localUserID}}</div>
        </el-form-item>
        <el-form-item label="用户名：">
          <el-input v-model="userInfoForm.userName" placeholder="请输入用户名" style="width:220px"></el-input>
        </el-form-item>
        <el-form-item label="账户：">
          <el-input v-model="userInfoForm.login" placeholder="请输入账户" style="width:220px"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="pass">
          <el-input v-model="userInfoForm.password" type="password" autocomplete="off" placeholder="请输入密码" style="width:220px"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="userInfoForm.checkPass" autocomplete="off" style="width:220px"></el-input>
        </el-form-item>
        <!-- <el-form-item label="客户级别：">
          <el-select v-model="userInfoForm.levelId" placeholder="请选择">
            <el-option
              v-for="item in levelList"
              :key="item.levelID"
              :label="item.levelName"
              :value="item.levelID">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="QQ号码：">
          <el-input v-model="userInfoForm.qq" placeholder="请输入QQ号码" style="width:220px"></el-input>
        </el-form-item>
        <el-form-item label="联系地址：">
          <el-input v-model="userInfoForm.address" placeholder="请输入联系地址" style="width:220px"></el-input>
        </el-form-item>
        <!-- <el-form-item label="账号状态：">
          <el-radio-group v-model="form.userState">
            <el-radio :label="1">开通</el-radio>
            <el-radio :label="2">关闭</el-radio>
          </el-radio-group>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog2 = false">取 消</el-button>
        <el-button type="primary" @click="updateConfirm('userInfoForm')" :loading="confirmLoading">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 权限 -->
    <el-dialog title="编辑客户权限" :visible.sync="dialog3"  class="dialog3">
      <el-form ref="form1" :model="form1" label-width="180px">
        <el-form-item label="商品发布：">
          <el-radio-group v-model="form1.isSupply">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">有</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发布不需审核：">
          <el-radio-group v-model="form1.isSupplyCheck">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">有</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="前端转账：">
          <el-radio-group v-model="form1.isMoneyTransfer">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">有</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="收入自动转余额：">
          <el-radio-group v-model="form1.isSupplyAuto">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">有</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="扣下级款：">
          <el-radio-group v-model="form1.isOperMoney">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">有</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="前端登陆：">
          <el-radio-group v-model="form1.isFrontPage">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">有</el-radio>
          </el-radio-group>
        </el-form-item>
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog3 = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditRoles" :loading="confirmEditRolesLoading">确 定</el-button>
      </span>
    </el-dialog>


    <!-- 状态 -->
    <el-dialog title="修改客户状态" :visible.sync="dialog4"  class="dialog4">
      <el-form ref="form" :model="form" label-width="140px">
        <el-form-item label="客户状态：" prop="userState" :rules = "[{ required: true, message: '请输入客户状态', trigger: 'blur' }]">
          <el-radio-group v-model="form.userState">
            <el-radio :label="1">开通</el-radio>
            <el-radio :label="2">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="禁用原因：">
          <el-input v-model="form.name" placeholder="请输入禁用原因" ></el-input>
          <div class="tips" style="margin-left:0;margin-top:5px;">禁用客户在登录时会看到提示信息</div>
        </el-form-item> -->
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog4 = false">取 消</el-button>
        <el-button type="primary" @click="modifyFormSave('form',4)" :loading="confirmLoading">确 定</el-button>
      </span>
    </el-dialog>


    <!-- 上下关系 -->
    <el-dialog title="设置上下关系" :visible.sync="dialog5"  class="dialog5">
      <el-form ref="form" :model="form" label-width="140px">
        <el-form-item label="下级客户编号：">
          <el-input v-model="form.name" placeholder="请输入下级客户编号" style="width:50%"></el-input>
          <span class="tips">(多个编号之间用半角,隔开)</span>
        </el-form-item>
        <el-form-item label="上级客户编号：">
          <el-input v-model="form.name" placeholder="请输入上级客户编号" style="width:50%"></el-input>
          <span class="tips">(取消绑定可以不输入上级编号)</span>
        </el-form-item>
        <el-form-item label="操作类型：">
          <el-radio-group v-model="form.t">
            <el-radio :label="1">绑定</el-radio>
            <el-radio :label="2">取消绑定</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog5 = false">取 消</el-button>
        <el-button type="primary" @click="dialog5 = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 短信发送 -->
    <el-dialog title="短信发送" :visible.sync="dialog6" width="60%" class="dialog6">
      <el-form ref="form" :model="form" label-width="140px">
        <el-form-item label="短信接收人类型：">
          <el-radio-group v-model="form.t">
            <el-radio :label="1">指定用户</el-radio>
            <el-radio :label="2">指定级别</el-radio>
            <el-radio :label="3">全部发送</el-radio>
            <el-radio :label="4">指定权限</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="短信接收人：">
          <el-input v-model="form.name" placeholder="请输入短信接收人" style="width:400px;"></el-input>
        </el-form-item>
        <el-form-item label="短信主题：">
          <el-input v-model="form.name" placeholder="请输入短信主题" style="width:400px;"></el-input>
        </el-form-item>
        <el-form-item label="短信内容：">
          <el-input type="textarea" v-model="form.name" :rows="5" placeholder="请输入短信内容" style="width:400px;"></el-input>
        </el-form-item>
        <el-form-item label="强制用户查看：">
          <el-radio-group v-model="form.t">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog1 = false">取 消</el-button>
        <el-button type="primary" @click="dialog1 = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 回收站 -->
    <el-dialog title="回收站" :visible.sync="dialog7" width="70%" class="dialog7">
      <div class="filter-wrap">
        <span>客户信息：</span>
        <el-select v-model="form.t" placeholder="客户编号" >
          <el-option label="客户编号" value=""></el-option>
          <el-option label="用户名" value=""></el-option>
        </el-select>
        <el-input placeholder="请输入详情关键字：" class="search-input" style="width:200px;"></el-input>
        <el-button type="primary" icon="el-icon-search">查询</el-button>
        <el-button type="primary">恢复</el-button>
      </div>
      <el-table border row-key="id" ref="multipleTable" :data="tableData2" style="width: 100%" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" >
         <el-table-column :show-overflow-tooltip="true" type="selection" > </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label1" label="编号" align="center"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label2" label="用户名" align="center"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label3" label="公司名称" align="center"></el-table-column>
      </el-table>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="400"> </el-pagination>
    </el-dialog>


    <!-- 修改会员等级 -->
    <el-dialog title="修改客户等级" :visible.sync="updateAgentTypeDialog" :close-on-click-modal="false">
      <el-form ref="updateAgentTypeForm" :model="updateAgentTypeForm" label-width="120px">
        <el-form-item label="选择会员等级：">
          <el-select v-model="updateAgentTypeForm.levelId" placeholder="请选择">
            <el-option
              v-for="item in levelList"
              :key="item.levelID"
              :label="item.levelName"
              :value="item.levelID">
            </el-option>
          </el-select>
        </el-form-item> 
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateAgentTypeDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateAgentTypeConfirm" :loading="updateAgentTypeConfirmLoading">确 定</el-button>
      </span>
    </el-dialog>


    <!-- 加扣款记录 -->
    <el-dialog title="加扣款记录" :visible.sync="moneyDialog" :close-on-click-modal="false" width="70%">
        <div class="recevie-wrap">
          <el-table border row-key="id" ref="multipleTable" :data="tableDataMoey" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266','text-align':'center'}" v-loading="loading" :cell-style="{'text-align':'center'}">
            
             <el-table-column :show-overflow-tooltip="true" prop="operUserName" label="操作人"  ></el-table-column>
             <el-table-column :show-overflow-tooltip="true" prop="operUserID" label="操作编号"  ></el-table-column>
             <el-table-column :show-overflow-tooltip="true" prop="operTime" label="操作时间"  ></el-table-column>
             <el-table-column :show-overflow-tooltip="true" prop="toUserName" label="客户名称"  ></el-table-column>
             <el-table-column :show-overflow-tooltip="true" prop="toUserID" label="客户编号"  ></el-table-column>


             <el-table-column :show-overflow-tooltip="true" prop="operTypeName" label="操作类型"></el-table-column>
             <el-table-column :show-overflow-tooltip="true" prop="money" label="操作金额" ></el-table-column>
             <el-table-column :show-overflow-tooltip="true" prop="remark" label="备注">
              <template slot-scope="scope">
                <el-popover
                  placement="bottom"
                  title="加扣款备注信息"
                  width="300"
                  trigger="click">
                  <div>
                      <span>{{scope.row.remark}}</span>
                  </div>
                  <div slot="reference" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;cursor: pointer;color:#409EFF">{{scope.row.remark || ''}}</div>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination background @size-change="sizeC" @current-change="currentC" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="moneyTotal"> </el-pagination>
        </div>

    </el-dialog>



  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { getUserList, deletaUser, updateUserState, getUserLevelList, editUserLevel , getUserRoles , editRoles} from '@/api/meun6/menu6-1/index'
import { getLists,getDatas } from '@/api/price/price-1/common'
export default {
  data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.userInfoForm.checkPass !== '') {
            this.$refs.userInfoForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.userInfoForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
    return {
      form1:{
        userID:'',
        isSupply:0,
        isSupplyCheck:0,
        isMoneyTransfer:0,
        isSupplyAuto:0,
        isOperMoney:0,
        isFrontPage:1,

      },
      color:'#333',
      form:{},
      updateAgentTypeDialog: false,//修改用户等级展示框是否显示
      updateAgentTypeForm: {},//修改用户等级选择内容
      updateAgentTypeConfirmLoading: false,//修改用户等级 确定按钮
      confirmLoading: false,//确定操作
      confirmEditRolesLoading:false,
      levelList: [],//修改用户等级时的等级list
      loading: true,
      dialog1:false,
      dialog2:false,
      dialog3:false,
      dialog4:false,
      dialog5:false,
      dialog6:false,
      dialog7:false,
      moneyDialog: false,   // 加扣款记录
      currentPage:1,
      bindOperationForm: {},// 解除绑定操作
      financeForm:{},//加扣款form
      tableData: [],
      userInfoForm:{},//编辑用户信息form
      operTypeList: [],//加扣款操作类型
      tableData2: [],
      multipleSelection: [],
      tableDataInfo:{
        pageNum: 1,// 当前页数
        pageSize: 20, //每页条数
        total: 0, //数据总共条数
        userType: 3 // 管理用户
      },
      rules: {
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ]
      },
      ids:[],  // 批量操作存储id


      queryParams:{
        pageNum:1,
        pageSize:10
      },
      tableDataMoey: [],
      moneyTotal: 0,
    }
  },
  components: {
    Tinymce
  },
  methods: {

    // 查看当前客户加扣款记录记录
    lookMoneyList(data){
      getLists({...this.queryParams,toUserID:data.userID},'/finance/operMoney/operPage').then(res => {
        if(res.code == 1001){
          this.tableDataMoey = res.body.records
          this.moneyTotal = res.body.total
          this.moneyDialog = true
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

    sizeC(val) {
      this.queryParams = {
        ...this.queryParams,
        pageNum: 1,
        pageSize: val,
      }
      this.lookMoneyList();
    },
    currentC(val) {
      this.queryParams = {
        ...this.queryParams,
        pageNum: val,
      }
      this.lookMoneyList();
    },





    handleSizeChange(val) {
      this.tableDataInfo = {
        ...this.tableDataInfo,
        pageNum: 1,
        pageSize: val,
      }
      this.getUserList();
    },
    handleCurrentChange(val) {
      this.tableDataInfo = {
        ...this.tableDataInfo,
        pageNum: val,
      }
      this.getUserList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 修改状态
    modifyForm(state){
      let ids = []
      this.multipleSelection.map(item => {
        ids.push(item.userID)
      })

      if(ids.length < 1) {
        this.$message({
          showClose: true,
          message: '请选择客户',
          type: 'error',
        });
        return
      }
      this.ids = ids
      if(state===4){
        this.dialog4 = true
      }else if(state===11){
        this.updateAgentTypeDialog = true
        this.updateAgentType({userID:ids,levelId:''}) //获取会员等级
      }
    },
    // 获取批量操作的访问地址
    getUrl(state) {
        switch(state){
          case 4:
          return '/user/user/updateUserState'
          break;
          case 6:
          return '/user/user/updateUserStateq'
        }
    },

    // 确定批量操作
    modifyFormSave(formName,state) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.confirmLoading = true
            getLists({...this.form,userID:this.ids},this.getUrl(state)).then(res => {
              if(res.code === 1001){
                this.$message({
                  showClose: true,
                  message: res.msg,
                  type: 'success',
                });
                this.form = {}
                if(state===4){
                  this.dialog4 = false
                }
                this.getUserList()
              }else{
                this.$message({
                  showClose: true,
                  message: res.msg,
                  type: 'error',
                });
              }
              this.confirmLoading = false
            }).catch(err => {
              
            })

          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },

    // 解绑
    bindOperation(data,type){
      let url
      this.bindOperationForm ={
        userID: data.userID
      }
      if(type === 'qq') {
        if(data.isQq===0){
          this.$message({
            showClose: true,
            message:'客户端才可以绑定哟~',
            type: 'error'
          });return null
        }
        url = '/user/oauth/unbind'
      } else{
        if(data.isWx===0){
          this.$message({
            showClose: true,
            message:'客户端才可以绑定哟~',
            type: 'error'
          });return null
        }
        url = '/user/oauth/unwbind'
      }


      getDatas(this.bindOperationForm,url).then(res => {
          if(res.code === 1001){
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'success',
            });
            this.getUserList();
          }else{
            this.$message({
              showClose: true,
              message:res.msg,
              type: 'error'
            });
          }
      }).catch(err => {
        
      })
    },


    // 查询
    getUserListform(){
      this.tableDataInfo = {
        ...this.tableDataInfo,
        pageNum: 1
      }
      if(!this.tableDataInfo.userName){
        delete this.tableDataInfo.userName
      }
      if(!this.tableDataInfo.userCode){
        delete this.tableDataInfo.userCode
      }
      this.getUserList()
    },
    // 获取用户列表
    getUserList() {
      this.loading = true
      getUserList(this.tableDataInfo).then(res => {
        res.body.records.forEach(function (item) {
          item.visible = false
        })
        this.tableData = res.body.records
        this.tableDataInfo = {
          ...this.tableDataInfo,
          pageNum: res.body.current,
          pageSize: res.body.size,
          total: res.body.total 
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },

    // 编辑客户信息
    editUserInfo(data){
      this.updateAgentType() //获取会员等级
      this.userInfoForm = data
      this.dialog2 = true
      console.log(this.userInfoForm,8787)
    },



    // 确认修改用户信息
    updateConfirm(form){
      this.$refs[form].validate(async valid => {
        if (!valid) return null  // 如果验证失败就不往下继续执行
      this.confirmLoading = true
      let dataInfo = {
        userID:this.userInfoForm.userID || '',
        userName:this.userInfoForm.userName || '',
        login:this.userInfoForm.login || '',
        password:this.userInfoForm.password || '',
        parentID:this.userInfoForm.parentID || '',
        qq:this.userInfoForm.qq || '',
        address:this.userInfoForm.address || ''
      }
      getLists(dataInfo,'/user/user/update').then(res => {
        if(res.code === 1001){
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'success',
          });
          this.userInfoForm = {}
          this.dialog2 = false
          this.getUserList()
        }else{
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'error',
          });
        }
        this.confirmLoading = false
      }).catch(err => {
        
      })

        
      })

    },


    //展示修改会员等级
    updateAgentType(data) {
        getUserLevelList({pageNum:1,pageSize:200}).then(res => {
        if (res.code===1001){
          this.updateAgentTypeForm = {userID:data.userID,levelId:data.levelID}
          this.levelList = res.body.records
          this.updateAgentTypeDialog = true
        }else{
            this.$message({
              showClose: true,
              message: '用户等级列表查询失败',
              type: 'error',
            });
        }
        
      }).catch(err => {
        
      })
    },
    // 修改会员等级
    updateAgentTypeConfirm() {
      editUserLevel(this.updateAgentTypeForm).then(res => {
        if (res.code===1001){
          this.$message({
              showClose: true,
              message: res.msg,
              type: 'success',
          });
          this.getUserList();
        }else{
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error',
            });
        }
        this.updateAgentTypeDialog = false
      }).catch(err => {
        
      })
    },
    // 修改状态
    updateUserState(data) {
        updateUserState({userID: data.userID,userState:data.userState==1 ? 2 : 1}).then(res => {
        if (res.code === 1001) {
          this.$notify({
            title: res.msg,
            type: 'success'
          })
          this.getUserList();
        } else {
          this.$notify.error({
            title: res.msg
          })
        }
      }).catch(err => {
        this.loading = false
      })
    },

    // 删除用户
    deleteTask (data) {
      this.$refs[`popover-${data.$index}`].doClose()
      deletaUser({id: data.row.userID}).then(res => {
        if (res.code === 1001) {
          this.$notify({
            title: res.msg,
            type: 'success'
          })
          this.getUserList();
        } else {
          this.$notify.error({
            title: res.msg
          })
        }
      }).catch(err => {
        this.loading = false
      })
    },


    //  点击加扣款
    addAndDeduct(data){
      this.financeForm = {
        ...this.financeForm,
        userID:data.localUserID
      }
      this.thisUserMoney()
      this.dialog1 = true
    },

    // 获取当前用户的余额
    thisUserMoney(){
      getDatas({},'/finance/userMoney/getNowUserMoney').then(res => {
        if (res.code===1001){
          if(res.body && res.body.money){
            this.financeForm = {
              ...this.financeForm,
              userMoney:res.body.money
            }
          }
        }
      }).catch(err => {
        
      })
    },

    // 点击  加扣款操作
    addAndDeductData(){
      if(this.financeForm.money!==this.financeForm.moneys){
        this.$message({
          showClose: true,
          message: '请重新确认操作金额',
          type: 'error',
        });
        return
      }
      this.confirmLoading = true
      getLists(this.financeForm,'/finance/userMoney/changeUserMoney').then(res => {
        if(res.code === 1001){
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'success',
          });
          this.financeForm = {}
          this.dialog1 = false
          this.getUserList()
        }else{
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'error',
          });
        }
        this.confirmLoading = false
      }).catch(err => {
        
      })
    },

    // 获取加扣款类型
    getOperTypeList(){
      getDatas({},'/finance/operMoney/getOperTypeList').then(res => {
        if (res.code===1001){
          this.operTypeList = res.body
        }
      }).catch(err => {
        
      })
    },
    // 权限
    setRole(item) {
      
      this.dialog3 = true
      getUserRoles({id:item.userID}).then(res => {
        if(res.body == null) {
          this.form1 = {
            userID:item.userID,
            isSupply:0,
            isSupplyCheck:0,
            isMoneyTransfer:0,
            isSupplyAuto:0,
            isOperMoney:0,
            isFrontPage:1,
          }
        }else {
          this.form1 = res.body
        }
      })
    },
    confirmEditRoles() {
      this.confirmEditRolesLoading = true
      editRoles(this.form1).then(res => {
        if (res.code===1001){
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'success',
          });
          this.dialog3 = false
          setTimeout(()=>{
              this.confirmEditRolesLoading = false
          })
          
        }else{
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'error',
          });
          this.confirmEditRolesLoading = false
        }
      }).catch(err => {
        this.confirmEditRolesLoading = false
      })
    }

  },
  created(){
      this.getUserList();
      this.getOperTypeList();//获取加扣款操作类型
  },
  
}
</script>
<style lang="scss">
.menu6-2-container {
  .dialog1,.dialog2 {
    .el-dialog__body {
      overflow: auto;
      max-height:700px;
    }
    
  }
}
</style>
<style scoped lang="scss">
.container {
  .tips {
      color:#909399;
      font-size:12px;
      line-height:20px;
      width:400px;
      margin-left:10px;
    }
  padding:20px;
  .header {
    background-color: #f0f9eb;
    color: #67c23a;
    padding:20px;
    border-radius: 5px;
    font-size:13px;
    li {
      padding:3px 0;
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

