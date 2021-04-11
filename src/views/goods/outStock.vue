<template>
  <div class="container container-good">
    <div class="filter-wrap">
      <span>商品信息：</span>
      <el-select v-model="queryParams.type" size="small" placeholder="商品编号">
        <el-option label="商品编码" value="1"></el-option>
        <el-option label="商品名称" value="2"></el-option>
        <el-option label="目录编号" value="3"></el-option>
        <el-option label="目录名称" value="4"></el-option>
      </el-select>
      <el-input v-model="queryParams.typeValue" size="small" placeholder="请输入关键字" class="search-input"></el-input>
      <el-input v-model="queryParams.goodsTypeID" size="small" placeholder="请输入商品类型id" class="search-input"></el-input>
      <el-select v-model="queryParams.goodsState" size="small" placeholder="商品状态">
        <el-option label="全部" value=" "></el-option>
        <el-option label="下架" value="0"></el-option>
        <el-option label="上架" value="1"></el-option>
        <el-option label="暂停" value="2"></el-option>
      </el-select>
      <el-select v-model="queryParams.hasCatalog" size="small" placeholder="是否设置目录">
        <el-option label="全部" value=" "></el-option>
        <el-option label="未设置" value="0"></el-option>
        <el-option label="已设置" value="1"></el-option>
      </el-select>
      <el-select v-model="queryParams.hasTemp" size="small" placeholder="是否设置模板">
        <el-option label="全部" value=" "></el-option>
        <el-option label="未设置" value="0"></el-option>
        <el-option label="已设置" value="1"></el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-search" size="small" @click="query">查询</el-button>
      <div class="handle-wrap">
        <el-button-group>
          <el-button size="mini" @click="updateState(0)">下架</el-button>
          <el-button size="mini" @click="updateState(1)">上架</el-button>
          <el-button size="mini" @click="updateState(2)">暂停</el-button>
          <el-button size="mini" @click="updateAgentType(2)">全网供货</el-button>
          <el-button size="mini" @click="setCatalog">设置目录</el-button>
          <!-- <el-button size="mini">取消目录</el-button> -->
          <el-button size="mini" @click="del">删除</el-button>
          <el-button size="mini" @click="addRecommendGoods">推荐商品</el-button>
          <el-button size="mini" @click="modifyColor">商品名颜色</el-button>
        </el-button-group>
      </div>
    </div>



    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>断货商品列表</span>
      </div>
    <el-table border row-key="goodsID" ref="multipleTable" :data="tableData3" style="width: 100%" @selection-change="handleSelectionChange" v-loading="loading" :header-cell-style="{background:'#f5f5f5',color:'#606266','text-align':'center'}" size="mini">
       <el-table-column :show-overflow-tooltip="true" type="selection" > </el-table-column>
      <!--  <el-table-column :show-overflow-tooltip="true" prop="label1" label="编号" align="center"></el-table-column> -->
       <el-table-column :show-overflow-tooltip="true" prop="goodsName" label="商品名称" width="300" align="left">
        <template slot-scope="scope">
          <!-- <el-button type="primary" plain size="mini" @click="dialog1 = true">供</el-button> -->
          <div v-if="scope.row.goodsName.length < 20"><div class="go-btn" @click="updateAgentType(1,scope.row.goodsID,scope.row.agentType)" :class="{'no':!scope.row.agentType}">供</div>
          <span :style="{'color':scope.row.color}" :class="{'font-blod':scope.row.isBlod == 1}" >{{scope.row.goodsName}}</span>
          </div>
          <el-popover trigger="hover" placement="top" v-else>
          <p>商品名称: {{ scope.row.goodsName }}</p>
          <div slot="reference" class="name-wrapper">
            <div class="el-hidden-tc"><div class="go-btn" @click="updateAgentType(1,scope.row.goodsID,scope.row.agentType)" :class="{'no':!scope.row.agentType}">供</div>
          <span :style="{'color':scope.row.color}" :class="{'font-blod':scope.row.isBlod == 1}" >{{scope.row.goodsName}}</span>
        </div>
          </div>
        </el-popover>
        </template>
      </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label4" label="状态" align="center" width="80">
         <template slot-scope="scope">
          <el-button size="mini"  @click="updateStates(scope.row)">{{scope.row.goodsState | filterState}}</el-button>
        </template>
      </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label5" label="类型" align="center" width="120">
         <template slot-scope="scope">
          <div v-if="scope.row.goodsTypeID == 1">卡密</div>
          <div v-if="scope.row.goodsTypeID == 2">充值</div>
        </template>
      </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label6" label="本地目录" align="center" width="360">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            title="本地目录--名称"
            width="500"
            trigger="hover">
              <p v-if="scope.row.catalog">{{ scope.row.catalog.catalogName }}</p>
              <el-button slot="reference" class='el-hidden-tc' v-if="scope.row.catalog">{{scope.row.catalog.catalogName}}</el-button>
          </el-popover>
        </template>
      </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="goodsValue" label="面值" align="center" width="120"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="goodsPrice" label="成本价" align="center" width="120"></el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label9" label="库存操作" align="center" width="250">
        <template slot-scope="scope">
          <el-button type="" size="mini" @click="importCard(scope.row)">导卡</el-button>
          <el-button type="" size="mini" @click="showCart(scope.row)">查看</el-button>
          <span>剩余：{{scope.row.cardNum || 0}}</span>
        </template>
      </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label10" label="操作" align="center" width="250" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="goPrice(scope.row)">定价</el-button>
          <el-button type="text" size="mini" @click="delGoods(scope.row.goodsID)">删除</el-button>
          <!-- <el-button type="info" size="mini" @click="dialog6 = true">日志</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @size-change="handleSizeChange1" @current-change="handleCurrentChange1"  :page-sizes="[10, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>

    </el-card>

    <!-- 设置全网供货 -->
    <el-dialog title="设置全网供货" :visible.sync="dialog1" width="35%">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="是否允许供货：">
          <el-radio-group v-model="agentType">
            <el-radio :label="0">禁止对接</el-radio>
            <el-radio :label="1">单次对接</el-radio>
            <el-radio :label="2">二次对接</el-radio>
          </el-radio-group>
        </el-form-item> 
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog1 = false">取 消</el-button>
        <el-button type="primary" @click="confirm1" :loading="confirm1Loading">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 设置商品销售状态 -->
    <el-dialog title="设置商品销售状态" :visible.sync="dialog2" width="30%">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="商品：" v-if="stateGoodsName">
          <div>{{stateGoodsName}}</div>
        </el-form-item>
        <el-form-item label="是否允许供货：">
          <el-radio-group v-model="goodsState">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="2">暂停</el-radio>
            <el-radio :label="0">下架</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="暂停状态说明：" v-if="goodsState==2">
          <el-input type="textarea" v-model="goodsStateRemark"></el-input>
        </el-form-item> 
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog2 = false,goodsStateRemark=''">取 消</el-button>
        <el-button type="primary" @click="confirm2" :loading="confirm2Loading">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 导卡 -->
    <el-dialog title="导卡" :visible.sync="dialog3" width="50%" class="dialog3" @close="dialog3Close">
      <div class="step1" v-show="step == 1">
        <el-form ref="importCardForm" :model="importCardForm" label-width="140px" :rules="importCardRules">
          <el-form-item label="导卡的商品：">
            <el-input placeholder="请输入导卡商品名" v-model="importCardForm.goodsName" disabled=""></el-input>
          </el-form-item>
          <el-form-item label="点卡内容：" prop="textarea"> 
            <el-input type="textarea" :rows="4" placeholder="请输入点卡内容" v-model="importCardForm.textarea"></el-input>
            <div class="tips">导入格式为：卡号+空格+密码，如：AAAAA BBBBB</div>
            <!-- <div class="tips">实卡导入格式为：卡号+空格+密码+空格+(A1-A7)矩阵号(矩阵号用-号连接)，如：AAAAA BBBBB CC-DD-EE-FF-GG-HH-JJ</div> -->
          </el-form-item>
          <el-form-item label="供货商名称：">
            <el-input placeholder="请输入供货商名称" v-model="importCardForm.supplier"></el-input>
          </el-form-item>
          <el-form-item label="联系方式：">
            <el-input placeholder="请输入联系方式" v-model="importCardForm.contact"></el-input>
          </el-form-item>
          <el-form-item label="进货价格备注：">
            <el-input placeholder="请输入进货价格备注" style="width:203px" v-model="importCardForm.price"></el-input><span style="margin-left:20px">元</span>
          </el-form-item>
          <el-form-item label="该卡截止有效日期：">
            <el-date-picker v-model="importCardForm.validDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"> </el-date-picker>
          </el-form-item>
          <!-- <el-form-item label="判断点卡内容重复：">
            <el-switch v-model="form.d" active-color="#13ce66" inactive-color="#eee"></el-switch>
          </el-form-item> -->
          <el-form-item label="判断（库存）重复：">
            <el-switch v-model="importCardForm.isRepeatState" active-color="#13ce66" inactive-color="#eee"></el-switch>
          </el-form-item>
          <el-form-item label="是否优先销售：">
            <el-switch v-model="importCardForm.isFirstState" active-color="#13ce66" inactive-color="#eee"></el-switch>
          </el-form-item>
        </el-form>
        <div>
          <span slot="footer" class="dialog-footer" style="display:flex;justify-content:flex-end">
            <el-button @click="dialog3 = false">取 消</el-button>
            <el-button type="primary" @click="nextStep" >下一步</el-button>
          </span>
        </div>
      </div>
      <div class="step2" v-show="step == 2">
        <el-form ref="form" :model="form" label-width="140px">
          <el-form-item label="导卡的商品：">
            <div>{{importCardForm.goodsName}}</div>
          </el-form-item>
          <el-form-item label="卡号与密码：">
            <el-table border row-key="id"  :data="tableData2" style="width: 100%" >
               <el-table-column :show-overflow-tooltip="true" prop="label1" label="卡号" ></el-table-column>
               <el-table-column :show-overflow-tooltip="true" prop="label2" label="密码" ></el-table-column>
              <!--  <el-table-column :show-overflow-tooltip="true" prop="label3" label="赠品/矩阵号" ></el-table-column> -->
            </el-table>
          </el-form-item>
          <el-form-item label="导入数量：">
            <div>{{tableData2.length}}</div>
          </el-form-item>
          <el-form-item label="供货商名称：">
            <div>{{importCardForm.supplier}}</div>
          </el-form-item>
          <el-form-item label="此处卡有效日期：">
            <div>{{importCardForm.validDate}}</div>
          </el-form-item>
        </el-form>
        <div>
          <span slot="footer" class="dialog-footer" style="display:flex;justify-content:flex-end">
            <el-button @click="step = 1">返 回</el-button>
            <el-button type="primary" @click="confirmImport" :loading="confirmImportLoading">确认导入</el-button>
          </span>
        </div>
      </div>
    </el-dialog>

    <!-- 库存查看 -->
    <el-dialog title="库存查看" :visible.sync="dialog4" width="70%">
      <div class="filter-wrap">
        <span>卡号：</span>
        <el-input placeholder="请输入要查找的卡号" class="search-input" v-model="kcQueryParams.cardNumber"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="kcQuery">搜索</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="delCard">批量删除</el-button>
      </div>
      <el-table border row-key="cardID" ref="multipleTable" :data="tableData4" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" >
         <el-table-column :show-overflow-tooltip="true" type="selection" > </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="cardNumber" label="卡号" align="center"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="cardPws" label="卡密" align="center"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label3" label="导入时间" align="center"> </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="validDate" label="到期时间" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.validDate | date}}</div>
          </template>
        </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="supplier" label="供货商" align="center"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="contact" label="联系方式" align="center"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="price" label="备注价格" align="center"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="label10" label="操作" align="center" width="250">
          <template slot-scope="scope">
            <el-button type="text" @click="delCardsingle(scope.row)" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="kcTotal"> </el-pagination>
    </el-dialog>

    <!-- 定价 -->
    <el-dialog title="商品定价" :visible.sync="dialog5" width="70%" class="dialog5" :close-on-click-modal="false">
      <div class="item1 item">
        <div class="title">商品定价管理</div>
        <div class="label">
          <span >商品名称：</span>
          <span>{{thisGoPriceData.goodsName}}</span>
        </div>
        <div class="label">
          <span>商品面值：</span>
          <span>{{thisGoPriceData.salePrice || '未设定售价'}}</span>
        </div>
        <div class="label">
          <span>等级价格组：</span>
          <el-select v-model="userLevelListID" placeholder="请选择等级价格组" @change="changeLevelListID" style="width:200px" clearable @clear="setValueNull(1)">
          <el-option
            v-for="item in userLevelList"
            :key="item.levelPriceGroupID"
            :label="item.levelPriceGroupName"
            :value="item.levelPriceGroupID">
          </el-option>
      </el-select>
        </div>
        <el-table border row-key="levelID" ref="multipleTable" :data="tableData5" style="width: 100%;" :header-cell-style="{background:'#f5f5f5',color:'#606266','text-align':'center'}" size="mini" :cell-style="{'text-align':'center'}">

           <el-table-column :show-overflow-tooltip="true" prop="userLevelVO" label="等级" min-width="20%">
            <template slot-scope="scope">
              <span>{{scope.row.userLevelVO.levelName}}</span>
            </template>
          </el-table-column>

           <el-table-column :show-overflow-tooltip="true" prop="sort" label="排序" min-width="20%">
            <template slot-scope="scope">
              <span style="margin-left:15px;">{{scope.row.userLevelVO.sort || 0}}</span>
            </template>
          </el-table-column>

           <el-table-column :show-overflow-tooltip="true" prop="sort" label="成本价" min-width="20%">
            <template slot-scope="scope">
              <span style="margin-left:15px;">{{goodsPrice}}</span>
            </template>
          </el-table-column>

           <el-table-column :show-overflow-tooltip="true" prop="price" label="销售价" min-width="20%">
            <template slot-scope="scope">
              <span v-if="scope.row.countPrice && scope.row.countPrice>0" style="margin-left:15px;">{{scope.row.countPrice}}元</span>
              <span v-else style="margin-left:15px;">{{scope.row.price || 0}}元</span>
            </template>
          </el-table-column>

           <el-table-column :show-overflow-tooltip="true" prop="label3" label="操作" min-width="60%">
            <template slot-scope="scope">
              <!-- <el-input style="width:30%" size="mini" v-model="scope.row.prices"></el-input> -->
              <el-input-number @change="handleChangeInputNumber(scope.row)" v-model="scope.row.prices" size="mini" controls-position="right" :precision="2" :min="0" :max="9999.99"></el-input-number>
              <span style="margin-left:15px;">元 + 我的进货价</span>
            </template>
          </el-table-column>
          
        </el-table>
        <div class="label">
          <span style="padding-left:14px">进货价格：</span>
          <!-- <el-input placeholder="请输入进货价格" style="width:30%;" v-model="goodsPrice" @input="goodsPriceInput"></el-input> -->
          <el-input-number v-model="goodsPrice" placeholder="请输入进货价格" controls-position="right" @change="goodsPriceInput" :precision="2" :min="0" :max="9999.99"></el-input-number>
        </div>
        <div class="label">
          <span >全网供货价：</span>
          <!-- <el-input placeholder="请输入全网供货价" style="width:30%;" v-model="supplyPrice"></el-input> -->
          <el-input-number v-model="supplyPrice" placeholder="请输入全网供货价" controls-position="right" :precision="2" :min="0" :max="9999.99"></el-input-number>
        </div>
        <div class="label">
          <!-- <span>商品面值：</span> -->
          <el-button type="primary" @click="goBuyingPrice" :loading="confirmLoading">确定定价</el-button>
        </div>
      </div>
      <div class="item2 item">
        <div class="title">定价方案管理</div>
        <el-table border row-key="key" :data="tableData6" style="width: 100%;" class="table">
           <el-table-column :show-overflow-tooltip="true" prop="label1" label="" min-width="20%"></el-table-column>
           <el-table-column :show-overflow-tooltip="true" prop="label2" label="" min-width="60%">
            <template slot-scope="scope">
              <!-- <el-input v-model="scope.row.label2.value" style="width:80%"></el-input> -->
              <el-input-number v-if="scope.row.label2.id == 1" v-model="scope.row.label2.value" style="width:80%" controls-position="right" :precision="2" :min="0" :max="9999.99"></el-input-number>
              <el-input-number v-else v-model="scope.row.label2.value" style="width:80%" controls-position="right" :precision="0" :step="1" :min="0" :max="100"></el-input-number>
              <span v-if="scope.row.label2.id == 1">元</span>
              <span v-else>%</span>
            </template>
          </el-table-column>
           <el-table-column :show-overflow-tooltip="true" prop="label3" label="" min-width="20%">
            <template slot-scope="scope">
              <el-button v-if="scope.row.label2.id == 1" size="mini" type="primary" @click="FillInThePlan(0)">填写</el-button>
              <el-button v-else size="mini" type="primary" @click="FillInThePlan(1)">填写</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!-- 设置目录 -->
    <el-dialog title="选择商品在目录下展示" :visible.sync="dialog7" width="70%" class="dialog7">
      <div class="item" v-for="(item,index) in catalogTree" :key="index">
        <div class="title">《{{item.catalogName}}》</div>
        <el-checkbox-group v-model="checkList" v-if="item.children" @change="checkCatalogID">
          <el-checkbox :label="item1.catalogID" :min="0" :max="1" v-for="(item1,index1) in item.children" :key="item1.catalogID">{{item1.catalogName}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog7 = false">取 消</el-button>
        <el-button type="primary" @click="confirmSetCatalog" :loading="confirmLoading">确 定</el-button>
      </span>
    </el-dialog>

    
    <!-- 批量修改颜色 -->
    <el-dialog title="批量修改商品名称颜色" :visible.sync="dialogColor" width="60%" class="dialog8">
      <el-form ref="formColor" :model="formColor" label-width="180px">
        <el-form-item label="选择商品名称颜色：" prop="color" :rules="[{ required: true, message: '请选择商品名称的颜色', trigger: 'blur' }]">
          <el-color-picker v-model="formColor.color"></el-color-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogColor = false">取 消</el-button>
        <el-button type="primary" @click="confirmColor('formColor')" :loading="loading">确 认 修 改</el-button>
      </span>
    </el-dialog>

    <!-- 添加商品 -->
    <el-dialog title="添加商品" :visible.sync="dialog8" width="60%" class="dialog8">
      <el-form ref="form" :model="form" label-width="140px">
        <el-form-item label="商品名称：">
          <el-input v-model="form.name" placeholder="请输入商品名称" style="float:left"></el-input>
          <el-color-picker v-model="color"></el-color-picker>
          <el-checkbox v-model="form.k" style="margin-left:20px">粗体</el-checkbox>
          <el-checkbox v-model="form.k">最热商品</el-checkbox>
        </el-form-item>
        <el-form-item label="商品面值：">
          <el-input v-model="form.name" placeholder="请输入商品面值"></el-input>
          <span style="margin-left:20px;">元</span>
        </el-form-item>
        <el-form-item label="质保天数：">
          <el-switch v-model="day" active-color="#13ce66" inactive-color="#eee"></el-switch>
          <span v-if="day">
            <el-input v-model="form.name" placeholder="请输入质保天数" style="width:150px;margin:0 15px;" v-if="day"></el-input>
            <span class="tips">输入范围：0买家不可申请售后，1-365天，此时间段内买家可申请售后</span>
          </span>
          <span v-else class="tips">售出后买家不可申请售后</span>
        </el-form-item>
        <el-form-item label="商品类型：">
          <el-radio-group v-model="form.t">
            <el-radio :label="1">自动发货</el-radio>
            <el-radio :label="2">商家发货</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="充值模板：">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option label="模板一" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="充值时间：">
          <el-input placeholder="请输入充值时间" style="width:150px;"></el-input>
          <el-select v-model="form.type" placeholder="请选择">
            <el-option label="小时" value="1"></el-option>
          </el-select>
          <span class="tips" style="margin-left:20px;">超出此时间系统将自动退单</span>
        </el-form-item>
        <el-form-item label="商品介绍：">
          <el-input placeholder="请输入商品介绍" type="textarea" :rows="5" style="400px;"></el-input>
          <span class="tips" style="margin-left:20px;">超出此时间系统将自动退单</span>
        </el-form-item>
        <el-form-item label="注意事项：">
          <el-input placeholder="请输入注意事项" type="textarea" :rows="5" style="400px;"></el-input>
          <span class="tips" style="margin-left:20px;">买家下单时需要确认阅读此信息才可购买，300字内</span>
        </el-form-item>
        <el-form-item label="购买数量限制：">
          <el-input style="width:100px;"></el-input> — <el-input style="width:100px;"></el-input>
          <span class="tips" style="margin-left:20px;">请填写大于等于1的整数</span>
        </el-form-item>
        <el-form-item label="单人购买次数：">
          <el-input style="width:100px;"></el-input>
          <span class="tips" style="margin-left:20px;">请填写大于等于1的整数</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog7 = false">取 消</el-button>
        <el-button type="primary" @click="dialog7 = false">发 布</el-button>
      </span>
    </el-dialog>

    <!-- 删除 -->
    <el-dialog title="确认删除" :visible.sync="dialog9" width="30%" > 
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog9 = false">取 消</el-button>
        <el-button type="primary" @click="confirmDel" :loading="confirmDelLoading">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import Sortable from 'sortablejs'
import { getGoodsList , delGoods , confirmSetCatalog , updateAgentTypeBatch , addRecommendGoodsBatch , updateGoodsStateBatch , getCatalogTree , importCardApi , getCardList , getPriceList, addPrice} from '@/api/meun3/menu3-2/index'
import { getLists,getDatas,postApplicationJson } from '@/api/price/price-1/common'

export default {
  data() {
    return {
      kcGoodsID:'',
      userLevelList:[],//等级价格组
      userLevelListID: '',//价格组选项
      kcTotal:0,
      loading:true,
      checkList: [],
      day:true,
      color:'#333',
      formColor:{
        color:''
      },
      currentPage:1,
      total:0,
      step:1,
      catalogTree:[],
      form:{d:true,textarea:''},
      cardNumber:'',
      importCardForm:{
        cardVOList:[],
        goodsName:'',
        goodsID:'',
        isRepeatState:true,
        isFirstState:true,
        isRepeat:1,
        isFirst:1,
        supplier:'',
        price:'',
        validDate:'',
        textarea:'',
        contact:'',
      },
      importCardRules: {
        textarea:[{ required: true, message: '请输入点卡内容', trigger: 'blur' }],
      },
      dialog1:false,
      dialog2:false,
      dialog3:false,
      dialog4:false,
      dialog5:false,
      dialog6:false,
      dialog7:false,
      dialog8:false,
      dialog9:false,
      dialogColor: false,
      confirmLoading:false,
      confirmDelLoading:false,
      confirm1Loading:false,
      confirm2Loading:false,
      confirmImportLoading:false,
      agentType:0,
      agentTypeIds:[],
      delIds:[],
      stateGoodsName:'',
      goodsIDState: [],//goodsID
      goodsStateRemark: '',//暂停时的说明
      goodsState:'',
      goodsID:'',
      tableData3: [],
      isTypeDel: 'goods',
      tableData2: [
        {
          label1:'123',
          label2:'sdsdfsdf',
          label3:'sdfsf-sdfs',
        },
      ],
      tableData4:[],
      tableData5: [],
      thisGoPriceData: [],
      supplyPrice: '',//全网供货价
      goodsPrice: 0,//商品成本价
      tableData6:[
        {
          label1:'金额累加',
          label2:{
            id:1,
            value:0
          },
          label3:'',
          key:1
        },
        {
          label1:'折扣累加',
          label2:{
            id:2,
            value:0
          },
          label3:'',
          key:2
        }
      ],
      multipleSelection: [],
      queryParams:{
        pageNum:1,
        pageSize:10,
        isBreak: 1
      },
      kcQueryParams: {
        pageNum:1,
        pageSize:10
      },
      cardQueryParams:{
        pageNum:1,
        pageSize:10,
      }
    }
  },
  filters: {
    filterState(val) {
      if(val == 0) {
        return '下架'
      }
      if(val == 1) {
        return '上架'
      }
      if(val == 2) {
        return '暂停'
      }
    },
  },
  mounted() {
    this.getGoodsList()
    this.getCatalogTree()
    let data = [
      {
        child:[]
      },
      {
        child:[]
      }
    ]
  },
  methods: {

    // 清空筛查条件
    setValueNull(val){
      if(val === 1){
        this.userLevelListID = ''
        this.tableData5.map(item => {
          item.prices = ''
          if(item.countPrice){
            delete item.countPrice
          }
        })
      }
    },


    // 选择等级价格组
    changeLevelListID(){
      let newLevelPrice = []
      this.userLevelList.map(item => {
        if(this.userLevelListID===item.levelPriceGroupID){
          newLevelPrice = item.levelGroups
        }
      })
      let newTableData5 = this.tableData5
      newLevelPrice.map(item => {
          newTableData5.map(items => {
              if(item.levelID===items.levelID){
                items.prices = item.levelPrice
                items.countPrice = Math.round((this.goodsPrice + item.levelPrice)*Math.pow(10, 2))/Math.pow(10, 2)
              }
          })
      })
      //清空 金额累加/折扣累加 参数
      this.tableData6.map(item => {
        item.label2.value = 0
      })
    },

    // 获取商品列表
    getGoodsList() {
      this.loading = true
      getGoodsList(this.queryParams).then(res => {
        if (res.code===1001){
          this.tableData3 = res.body.records
          this.total = res.body.total
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },

    // 设置目录
    setCatalog (){
      this.delIds = []
      this.multipleSelection.map(item => {
        this.delIds.push(item.goodsID)
      })
      if(this.delIds.length < 1) {
        this.$message({
          showClose: true,
          message: '请选择商品',
          type: 'error',
        });
        return 
      }
      this.dialog7 = true
    },

    // 确实设置目录
    confirmSetCatalog (){
      this.confirmLoading = true
      confirmSetCatalog({ids:this.delIds,catalogID:this.checkList}).then(res => {
        if(res.code === 1001){
          this.$message({
            message: res.msg,
            type: 'success',
          });
          this.getGoodsList()
          this.dialog7 = false
        }else{
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'error',
          });
        }
        this.confirmLoading = false
      }).catch(err => {
        this.confirmLoading = false
      })

    },

    // 勾选目录
    checkCatalogID(data){
        this.checkList = []
        this.checkList = [data.pop()]
    },

    //  删除秘卡
    delCard(){
      this.delIds = []
      this.multipleSelection.map(item => {
        this.delIds.push(item.cardID)
        this.thisGoodsID = item.goodsID
      })
      if(this.delIds.length < 1) {
        this.$message({
          showClose: true,
          message: '请选择秘卡',
          type: 'error',
        });
        return 
      }
      this.dialog9 = true
      this.isTypeDel = 'card'
    },
    // 删除
    del() {
      this.delIds = []
      this.multipleSelection.map(item => {
        this.delIds.push(item.goodsID)
      })
      if(this.delIds.length < 1) {
        this.$message({
          showClose: true,
          message: '请选择商品',
          type: 'error',
        });
        return 
      }
      this.dialog9 = true
      this.isTypeDel = 'goods'
    },

    // 删除自营商品
    delGoods(id){
        this.$confirm('此操作将删除该自营商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            
          delGoods({id:id},'/goods/goods/deleteGoods').then(res => {
            if (res.code === 1001) {
              this.$message({
                showClose: true,
                message: '删除成功',
                type: 'success',
              });
              this.getGoodsList()
            } else {
                this.$message({
                  showClose: true,
                  message: res.msg,
                  type: 'error',
                });
            }
          }).catch(err => {
            
          })

        }).catch(() => {
          this.$message.success('已取消删除')
        })
    },




    //删除单个秘卡
    delCardsingle(data) {
      this.delIds = []
      this.delIds = [data.cardID]
      this.thisGoodsID = data.goodsID
      this.dialog9 = true
      this.isTypeDel = 'card'
    },
    // 确认删除
    confirmDel() {
      this.confirmDelLoading = true
      let url
      if (this.isTypeDel == 'goods'){
          url = '/goods/goods/deleteGoods'
      } else if (this.isTypeDel == 'card') {
          url = '/goods/card/delete'
      }
      
      delGoods({id:this.delIds},url).then(res => {
        if (res.code === 1001) {
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success',
            });
          if (this.isTypeDel == 'card') {
              let arr = {goodsID:this.thisGoodsID}
              this.showCart(arr)
              this.getGoodsList()
          } else if (this.isTypeDel == 'goods') {
              this.getGoodsList()
          }
        } else {
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'error',
            });
        }
        this.confirmDelLoading = false
        this.dialog9 = false
      }).catch(err => {
        this.confirmDelLoading = false
      })
    },
  
    // 设置全网供货
    updateAgentType(type,id,agentType) {
      this.agentTypeIds = []
      // 单个
      if(type == 1) {
        this.agentTypeIds.push(id)
        this.agentType = agentType
      }
      // 批量
      if(type == 2) {
        this.agentType = 0
        this.multipleSelection.map(item => {
          this.agentTypeIds.push(item.goodsID)
        })
      }
      if(this.agentTypeIds.length < 1) {
        this.$message({
          showClose: true,
          message: '请选择商品',
          type: 'error',
        });
        return 
      }
      this.dialog1 = true
    },
    // 确认设置供货
    confirm1() {
      this.confirm1Loading = true
      updateAgentTypeBatch({
        ids:this.agentTypeIds,
        agentType:this.agentType
      }).then(res => {
        this.dialog1 = false
        setTimeout(()=>{
          this.confirm1Loading = false
        },2000)
        if(res.code==1001){
          this.$message({
            showClose: true,
            message: '设置成功',
            type: 'success',
          });
        }else{
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'error',
          });
        }
        this.getGoodsList()
      }).catch(err => {
        this.confirm1Loading = false
        this.$message({
          showClose: true,
          message: err.msg || '网络异常',
          type: 'error',
        });
      })
    },


    // 改变价格
    handleChangeInputNumber(value) {
      let newTableData5 = this.tableData5
      newTableData5.map(item => {
          if(item.levelID===value.levelID){
            item.countPrice = Math.round((this.goodsPrice + value.prices)*Math.pow(10, 2))/Math.pow(10, 2)
          }
      })
    },
    FillInThePlan(data){
      this.setValueNull(1)
      let thisval = Number(this.tableData6[data].label2.value)
      if (this.tableData5.length===0) {
          this.$message({
            showClose: true,
            message: '请先设置客户等级',
            type: 'error',
          });
          return
      }else if (this.goodsPrice===0){
          this.$message({
            showClose: true,
            message: '请先设置进货价',
            type: 'error',
          });
          return
      }
      if(thisval===0){
          this.$message({
            showClose: true,
            message: '当前值不能为0',
            type: 'error',
          });
      } else {
        if (data===0) {    
            //清空 折扣累加 参数
            this.tableData6[1].label2.value = 0
            this.tableData5.map((item,index) => {
              item.prices = thisval+thisval*(this.tableData5.length-(index+1))
              //item.countPrice = this.goodsPrice + (thisval+thisval*index)
              item.countPrice = Math.round((this.goodsPrice + (thisval+thisval*(this.tableData5.length-(index+1))))*Math.pow(10, 2))/Math.pow(10, 2)
            })
        } else {
            //清空 金额累加 参数
            this.tableData6[0].label2.value = 0
            this.tableData5.map((item,index) => {
              item.prices = this.goodsPrice*((thisval / 100)+(thisval / 100)* (this.tableData5.length-(index+1)))
              item.countPrice = Math.round((this.goodsPrice + ((thisval / 100)+(thisval / 100)* (this.tableData5.length-(index+1))))*Math.pow(10, 2))/Math.pow(10, 2)
            })
        }
      }

    },

    // 定价列表
    goPrice(data) {
        this.userLevelListID = ''
        this.getPriceGroupList()
        if (data.goodsPrice && data.goodsPrice>0) {
          this.goodsPrice = data.goodsPrice
        }else{
          this.goodsPrice = 0
        }
        if (data.supplyPrice && data.supplyPrice>0) {
          this.supplyPrice = data.supplyPrice
        }else{
          this.supplyPrice = ''
        }
        getPriceList({goodsID:data.goodsID}).then(res => {
             if(res.code === 1001){
                if(res.body.length>0 && data.goodsPrice && data.goodsPrice>0){
                    res.body.map(item => {
                        //if(item.price>data.goodsPrice){
                            item.prices = item.price
                            item.countPrice = Math.round((item.price + data.goodsPrice)*Math.pow(10, 2))/Math.pow(10, 2)
                        //}
                    })
                    this.tableData5 = res.body
                }else{
                  this.tableData5 = res.body
                }
                this.dialog5 = true
                this.thisGoPriceData = data
             }
        })
    },

    // 获取价格组列表
    getPriceGroupList (){
      getLists({},'/site/levelPriceGroup/page').then(res => {
        if (res.code===1001){
          this.userLevelList = res.body.records
        }
      }).catch(err => {
      })
    },

    // 进货价改变
    goodsPriceInput(data){
        if (this.tableData5.length===0) {
          this.$message({
            showClose: true,
            message: '请先设置客户等级',
            type: 'error',
          });
          return
        }else{
            this.goodsPrice = data
            for ( let i = 0; i < this.tableData5.length; i++) {
                this.tableData5[i].prices = this.tableData5[i].prices ? this.tableData5[i].prices : 0
                this.tableData5[i].price = Math.round((data + this.tableData5[i].prices)*Math.pow(10, 2))/Math.pow(10, 2)
                this.tableData5[i].countPrice = Math.round((data + this.tableData5[i].prices)*Math.pow(10, 2))/Math.pow(10, 2)
            }
        }
    },
    // 确认进货价格
    goBuyingPrice() {
        this.confirmLoading = true
        // 第一步 判断是否已经定价 成本价不能为0
        if (this.goodsPrice) {//已经定价过了
            let thisData = []

            for ( let i = 0; i < this.tableData5.length; i++) {
                this.tableData5[i].price = this.tableData5[i].price ? this.tableData5[i].price : 0
                this.tableData5[i].prices = this.tableData5[i].prices ? Number(this.tableData5[i].prices) : 0
                
                thisData[i] = {
                    goodsID:this.tableData5[i].goodsID,
                    goodsPrice:this.goodsPrice,
                    levelID:this.tableData5[i].levelID,
                    price:this.tableData5[i].prices,
                    siteID:this.tableData5[i].siteID,
                    supplyPrice:this.supplyPrice
                }
            }
            
            addPrice(thisData).then(res => {
              if (res.code===1001) {
                this.$message({
                  showClose: true,
                  message: '定价成功',
                  type: 'success',
                });
                this.tableData6[0].label2.value = 0
                this.tableData6[1].label2.value = 0
                this.getGoodsList()
                this.dialog5 = false
              } else {
                this.$message({
                  showClose: true,
                  message: res.msg,
                  type: 'error',
                });
              }

              this.confirmLoading = false
            })
        } else {
            this.$message({
              showClose: true,
              message: '请输入进货价格',
              type: 'error',
            });
            this.confirmLoading = false
        }
    },

    // 推荐商品
    addRecommendGoods() {
      let ids = this.verificationGoods()
      if(ids){
        addRecommendGoodsBatch({ids:ids}).then(res => {
          if (res.code===1001) {
            this.$message({
              showClose: true,
              message: '推荐成功',
              type: 'success',
            });
            this.getGoodsList()
          } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error',
            });
          }
        })
      }
    },


    //验证是否勾选需要批量操作的商品
    verificationGoods(){
      let ids = []
      this.multipleSelection.map(item => {
        ids.push(item.goodsID)
      })
      if(ids.length < 1) {
        this.$message({
          showClose: true,
          message: '请选择商品',
          type: 'error',
        });
        return false
      }else{
        return ids
      }
    },

    // 批量修改商品名称颜色
    modifyColor(){
      let ids = this.verificationGoods()
      if(ids){
         this.dialogColor = true
      }
    },

    // 确认批量修改颜色
    confirmColor(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true
            let ids = this.verificationGoods()
            if(ids){
               getLists({...this.formColor,ids:ids},'/goods/goods/updateColorBatch').then(res => {
                  if (res.code===1001){
                      this.$message({
                        message: res.msg,
                        type: 'success',
                      });
                      this.dialogColor = false
                      this.getGoodsList()
                      this.formColor = {}
                  } else {
                    this.$message({
                      showClose: true,
                      message: res.msg,
                      type: 'error',
                    });
                  }
                  this.loading = false
                }).catch(err => {
                  this.loading = false
                })
            }else{
              this.loading = false
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    



    // 批量状态改变：下架，上架，暂停
    updateState(goodsState) {
      let ids = []
      this.multipleSelection.map(item => {
        ids.push(item.goodsID)
      })

      if(ids.length < 1) {
        this.$message({
          showClose: true,
          message: '请选择商品',
          type: 'error',
        });
        return
      }
      if(goodsState===2){
        this.dialog2 = true
        this.goodsState =2
        this.goodsStateRemark = ''
        this.stateGoodsName = ''
        this.goodsIDState = ids
      }else{
        updateGoodsStateBatch({
          ids:ids,
          goodsState:goodsState
        }).then(res => {
          this.$message({
            showClose: true,
            message: '操作成功',
            type: 'success',
          });
          this.getGoodsList()
        })
      }

    },
    // 单个状态改变
    updateStates(item) {
      this.dialog2 = true
      this.stateGoodsName = item.goodsName
      this.goodsStateRemark = item.goodsStateRemark
      this.goodsState = item.goodsState
      this.goodsID = item.goodsID
      this.goodsIDState = [item.goodsID]
    },
    // 确认单个状态改变
    confirm2() {
      let confirmForm = {}
      if(this.goodsState==2 && !this.goodsStateRemark){
          this.$message({
            showClose: true,
            message: '请输入暂停状态说明！',
            type: 'error'
          });
          return null
      }
      if(this.goodsState==2){
        confirmForm = {
          ids:this.goodsIDState,
          goodsState:this.goodsState,
          goodsStateRemark: this.goodsStateRemark
        }
      }else{
        confirmForm = {
          ids:this.goodsIDState,
          goodsState:this.goodsState
        }
      }
      this.confirm2Loading = true

      updateGoodsStateBatch({
        ...confirmForm
      }).then(res => {
        if(res.code === 1001){
          this.$message({
            showClose: true,
            message: '操作成功',
            type: 'success',
          });
          this.dialog2 = false
          this.getGoodsList()
        }else{
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'error'
          });
        }
        this.confirm2Loading = false
      }).catch(err => {
        this.confirm2Loading = false
      })
    },
    // 获取商品目录列表
    getCatalogTree() {
      let arr = []
      getCatalogTree().then(res => {
        this.catalogTree = res.body
        // adata.map(item => {
        //   if(!item.parentCode) {
        //     arr.push(item)
        //   }
        // })
      })
    },  
   
    // 库存查询
    kcQuery() {
      this.getCardList()
    },
    // 导卡
    importCard(item) {
      this.dialog3 = true
      this.step = 1
      this.importCardForm.goodsName = item.goodsName
      this.importCardForm.goodsID = item.goodsID
      this.importCardForm.supplier = item.supplier
    },
    // 导卡下一步
    nextStep() {
      let arr = []
      let list = this.importCardForm.textarea.trim().split(/\n+/)
      this.importCardForm.cardVOList = []

      list.map((item,index) => {
        arr.push({})
        let subList = item.trim().split(/\s+/)
        subList.map((item1,index1) => {
          let s = 'label'+(index1+1)
          arr[index][s] = item1
        })
      })
      this.tableData2 = arr
      
      this.importCardForm.isRepeat = this.importCardForm.isRepeatState ? 1 : 0
      this.importCardForm.isFirst = this.importCardForm.isFirstState ? 1 : 0
      arr.map(item => {
        this.importCardForm.cardVOList.push({
          cardNumber:item.label1,
          cardPws:item.label2,
          supplier:this.importCardForm.supplier,
          price:this.importCardForm.price,
          validDate:this.importCardForm.validDate,
          contact:this.importCardForm.contact,
        })
      })
      
      this.$refs['importCardForm'].validate((vaild) => {
        if(vaild) {
          this.step = 2
        }
      })
    },
    // 确认导入
    confirmImport() {
      this.confirmImportLoading = true
      importCardApi(this.importCardForm).then(res => {
         
        if(res.code == 1001) {
          this.dialog3 = false
          this.$message({
            showClose: true,
            message: '导入成功',
            type: 'success',
          });
          this.getGoodsList()
        }else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'error',
          });
        }
        this.confirmImportLoading = false
        
      }).catch(err => {
        this.confirmImportLoading = false
      })
    },
    // 清空导卡表单
    dialog3Close() {
      this.importCardForm = {
        cardVOList:[],
        goodsName:'',
        goodsID:'',
        isRepeatState:true,
        isFirstState:true,
        isRepeat:1,
        isFirst:1,
        supplier:'',
        price:'',
        validDate:'',
        textarea:'',
      }
    },
    // 库存查看
    showCart(item) {
      this.dialog4 = true
      this.kcGoodsID = item.goodsID
      this.kcQueryParams = {...this.kcQueryParams,goodsID:item.goodsID}
      if (this.kcQueryParams.goodsID) {
          this.getCardList()
      }
    },
    // 查看库存 
    getCardList() {
      getCardList(this.kcQueryParams).then(res => {
        this.tableData4 = res.body.records
        this.kcTotal = res.body.total
      })
    },
    // 查询
    query() {
      this.getGoodsList()
    },
    // 改变每页数量
    handleSizeChange1(val) {
      this.queryParams.pageNum = val
      this.getGoodsList()
    },
    // 翻页
    handleCurrentChange1(val) {
      this.queryParams.pageNum = val
      this.getGoodsList()
    },
    handleSizeChange(val) {
      this.kcQueryParams.pageNum = val
      this.getCardList()
    },
    handleCurrentChange(val) {
      this.kcQueryParams.pageNum = val
      this.getCardList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    themeEvent(val) {
      console.log(val)
    },
    getChild(item,index) {
      let arr = [{
          test1:11,
          test2:'子集1',
          test3:'#eeedcd',
          test4:3,
          test5:'显示',
          test6:'显示',
          test7:'是',
          test8:''
        },
        {
          test1:12,
          test2:'子集2',
          test3:'#eeedcd',
          test4:3,
          test5:'显示',
          test6:'显示',
          test7:'是',
          test8:''
        }]

      let tt = index + 1
      arr.unshift(tt, 0); 
      Array.prototype.splice.apply(this.tableData3, arr); 
      this.tableData3 = Object.assign([],this.tableData3)
    },
    themeEvent(val) {
      console.log(val)
    }
  }
}
</script>

<style lang="scss">

.el-hidden-tc {
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
  width: 100%;
  border: none;
}

.container-good {
  
  .dialog5 {
    .el-table__header-wrapper {
      display:block;
    }
    .el-dialog__body {
      overflow: auto;
      max-height:700px;
    }
    .el-table td, .el-table th {
      padding:5px 0;
    }
  }
  .dialog6 {
    .el-dialog__body {
      overflow: auto;
      max-height:700px;
    }
  }
  .dialog7 {
    .el-dialog__body {
      overflow: auto;
      max-height:700px;
    }
    .item {
      margin-bottom:20px;
    }
  }
  .dialog8 {
    .el-dialog__body {
      overflow: auto;
      max-height:700px;
    }
  }
}
.dialog3 {
  .step2 {
    .el-table__header tr,
    .el-table__header th {
      padding: 0;
      font-weight: normal;
      color:#333;
    }
  }
}
.avatar-uploader {
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    
  }
  .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
  }
  .avatar {
    width: 60px;
    height: 60px;
    display: block;
  }
}
    
</style>
<style lang="scss" scoped>

  .el-color-picker {
    float:left;
    margin-left:20px;
  }
.container {
  .font-blod {
    font-weight:bold;
  }
  .go-btn {
    border:1px solid #ccc;
    font-weight: bold;
    font-size:13px;
    padding:1px 5px;
    border-radius: 3px;
    display:inline-block;
    color:#409EFF;
    cursor: pointer;
    transition:.3s;
    &.no {
      color:#909399;
    }
  }

  .go-btn:hover {
    transition:.3s;
    border:1px solid #409EFF;
  }
  .tips {
    color:#909399;
    font-size:12px;
    line-height:20px;
    width:400px;
  }
  padding:20px;
  .filter-wrap {
    .search-input {
      width:200px;
    }
    .handle-wrap {
      margin-top:20px;
    }
  }
  .el-form {
    padding:0;
    .el-input,.el-textarea {
      width:400px;
    }
  }
  .dialog3 {
    .list {
      .header {
        display:flex;
        justify-content: space-between;
      }
      
    }
  }
  .dialog5 {
    
    .item {
      .label {
        padding:15px 0;
      }
    }
    .el-table__header-wrapper {
      display:block;
    }
    table {
      border-collapse:collapse;
      border:none;
      width:100%
    }
    .table1 {

    }
  }
}
</style>

