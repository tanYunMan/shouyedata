<template>
  <div class="container container-good">
    <div class="filter-wrap">
      <span>商品信息：</span>
      <el-select v-model="queryParams.type" placeholder="商品编号">
        <el-option label="商品名称" :value="2"></el-option>
        <el-option label="商品编码" :value="1"></el-option>
        <el-option label="目录编号" :value="3"></el-option>
        <el-option label="目录名称" :value="4"></el-option>
        <!-- <el-option label="目录编号" value="5"></el-option>
        <el-option label="所属目录" value="6"></el-option> -->
      </el-select>
     <el-input v-if="queryParams.type != 1" v-model="queryParams.typeValue" placeholder="请输入关键字" class="search-input"></el-input>
      <el-input v-else type="number" v-model="queryParams.typeValue" placeholder="请输入关键字" class="search-input"></el-input>
      <!-- <el-select v-model="queryParams.goodsTypeID" placeholder="商品类型">
        <el-option label="商品类型" value="1"></el-option>
        <el-option label="未设置" value="1"></el-option>
        <el-option label="自动发货" value="2"></el-option>
        <el-option label="商家发货" value="3"></el-option>
      </el-select> -->
      <!-- <el-input v-model="queryParams.goodsTypeID" placeholder="请输入商品类型id" class="search-input"></el-input> -->
      <el-select v-model="queryParams.goodsState" placeholder="商品状态">
        <el-option label="全部" value=" "></el-option>
        <el-option label="下架" value="0"></el-option>
        <el-option label="上架" value="1"></el-option>
        <el-option label="暂停" value="2"></el-option>
      </el-select>
      <el-select v-model="queryParams.hasCatalog" placeholder="是否设置目录">
        <el-option label="全部" value=" "></el-option>
        <el-option label="未设置" value="0"></el-option>
        <el-option label="已设置" value="1"></el-option>
      </el-select>
      <el-select v-model="queryParams.hasTemp" placeholder="是否设置模板">
        <el-option label="全部" value=" "></el-option>
        <el-option label="未设置" value="0"></el-option>
        <el-option label="已设置" value="1"></el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-search" @click="kcQuery">查询</el-button>
      <div class="handle-wrap">
        <el-button-group>
          <el-button size="mini" @click="setCatalog">设置目录</el-button>
          <!-- <el-button size="mini">取消目录</el-button> -->
          <el-button size="mini" @click="del">删除</el-button>
          <el-button size="mini" @click="addRecommendGoods">推荐商品</el-button>
          <el-button size="mini" @click="batchPriceArr">批量定价</el-button>
        </el-button-group>
      </div>
    </div>
    <el-table border row-key="id" ref="multipleTable" :data="tableData3" style="width: 100%"
              @selection-change="handleSelectionChange"
              :header-cell-style="{background:'#f5f5f5',color:'#606266','text-align':'center'}" size="mini"
              v-loading="loading">
      <el-table-column :show-overflow-tooltip="true" type="selection"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="goodsID" label="编号" align="center" width="80"></el-table-column>

      <el-table-column :show-overflow-tooltip="true" prop="goodsName" label="商品名称" max-width="300px" align="left">
        <template slot-scope="scope">
          <!-- <el-button type="primary" plain size="mini" @click="dialog1 = true">供</el-button> -->
          <div v-if="scope.row.goodsName.length < 20">
            <span :style="{'color':scope.row.color}" :class="{'font-blod':scope.row.isBlod == 1}">{{scope.row.goodsName}}</span>
          </div>

          <el-popover trigger="hover" placement="top" v-else>
            <p>商品名称: {{ scope.row.goodsName }}</p>
            <div slot="reference" class="name-wrapper el-hidden-tc">
              <span :style="{'color':scope.row.color}" :class="{'font-blod':scope.row.isBlod == 1}">{{scope.row.goodsName}}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="label6" label="本地目录" align="center" max-width="400">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            title="本地目录--名称"
            width="500"
            trigger="hover">
            <p v-if="scope.row.catalog">{{ scope.row.catalog.catalogName }}</p>
            <el-button slot="reference" class='el-hidden-tc' v-if="scope.row.catalog">
              {{scope.row.catalog.catalogName}}
            </el-button>
          </el-popover>
        </template>
      </el-table-column>
      <!--  <el-table-column :show-overflow-tooltip="true" prop="label3" label="源商品详情" align="center">
        <template slot-scope="scope">
          <el-button  size="mini" @click="dialog3 = true">详情</el-button>
        </template>
      </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="label3" label="货源方" align="center">
        <template slot-scope="scope">
          <el-button  size="mini"  @click="dialog1 = true">详情</el-button>
        </template>
      </el-table-column> -->
      <el-table-column :show-overflow-tooltip="true" prop="cardNum" label="密卡数量" align="center" width="100"></el-table-column>
      <!--  <el-table-column :show-overflow-tooltip="true" prop="label7" label="是否对接" align="center">
          <template slot-scope="scope">
              <div v-if="scope.row.connected"> 已对接 </div>
              <div style="color: #f56c6c" v-else> 未对接 </div>
          </template>
      </el-table-column> -->
      <el-table-column :show-overflow-tooltip="true" prop="goodsPrice" label="成本价" align="center" width="60"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="supplyPrice" label="对接价" align="center" width="60"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="label10" label="商家信息" align="center" width="90">
        <template slot-scope="scope">
          <el-button type="text" plain size="mini" @click="lookBusiness(scope.row.sourceSiteVO.siteID)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="goodsNote" label="注意事项" align="center"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="remark" label="商品介绍" align="center"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="label10" label="操作" align="center" width="100px">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="goPrice(scope.row)">定价</el-button>
          <el-button type="text" size="mini" @click="goDetail(scope.row.goodsID)">编辑</el-button>
          <!-- <el-button type="info" size="mini" @click="dialog6 = true">日志</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="10"
                   layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>


    <!-- 货源方详情 -->
    <el-dialog title="货源方信息" :visible.sync="dialog1" class="dialog1">
      <ul>
        <li v-for="(item ,index) in dialog1Data" :key="index">
          <span class="label">{{item.label}}</span>
          <span class="value">{{item.value}}</span>
        </li>
      </ul>
    </el-dialog>

    <!-- 详情 -->
    <el-dialog title="源商品详情" :visible.sync="dialog3" width="50%" class="dialog3">
      <ul>
        <li v-for="(item ,index) in detailData" :key="index">
          <span class="label">{{item.label}}</span>
          <span class="value">{{item.value}}</span>
        </li>
      </ul>
    </el-dialog>

    <!-- 库存查看 -->
    <el-dialog title="库存查看" :visible.sync="dialog4" width="70%">
      <div class="filter-wrap">
        <span>卡号：</span>
        <el-input placeholder="请输入要查找的卡号" class="search-input"></el-input>
        <el-button type="primary" icon="el-icon-search">搜索</el-button>
        <el-button type="danger" icon="el-icon-delete">批量删除</el-button>
      </div>
      <el-table border row-key="id" ref="multipleTable" :data="tableData4" style="width: 100%"
                @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266'}">
        <el-table-column :show-overflow-tooltip="true" type="selection"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="label1" label="卡号" align="center">
          <!-- <template slot-scope="scope">
            <el-input></el-input>
          </template> -->
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="label3" label="导入时间" align="center"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="label4" label="到期时间" align="center"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="label5" label="供货商" align="center"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="label6" label="备注价格" align="center"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="label10" label="操作" align="center" width="250">
          <template slot-scope="scope">
            <el-button type="text" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="10"
                     layout="total, sizes, prev, pager, next, jumper" :total="400"></el-pagination>
    </el-dialog>


    <!-- 定价 -->
    <el-dialog title="商品定价" :visible.sync="dialog5" width="70%" class="dialog5" :close-on-click-modal="false">
      <div class="item1 item">
        <div class="title">商品定价管理</div>
        <div class="label">
          <span>商品名称：</span>
          <span>{{thisGoPriceData.goodsName}}</span>
        </div>
        <div class="label">
          <span>商品面值：</span>
          <span>{{thisGoPriceData.salePrice || '未设定售价'}}</span>
        </div>
        <div class="label">
          <span>等级价格组：</span>
          <el-select v-model="userLevelListID" placeholder="请选择等级价格组" @change="changeLevelListID" style="width:200px"
                     clearable @clear="setValueNull(1)">
            <el-option
              v-for="item in userLevelList"
              :key="item.levelPriceGroupID"
              :label="item.levelPriceGroupName"
              :value="item.levelPriceGroupID">
            </el-option>
          </el-select>
        </div>
        <el-table border row-key="levelID" ref="multipleTable" :data="tableData5" style="width: 100%;"
                  :header-cell-style="{background:'#f5f5f5',color:'#606266','text-align':'center'}" size="mini"
                  :cell-style="{'text-align':'center'}">

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
              <el-input-number @change="handleChangeInputNumber(scope.row)" v-model="scope.row.prices" size="mini"
                               controls-position="right" :precision="2" :min="0" :max="9999.99"></el-input-number>
              <span style="margin-left:15px;">元 + 我的进货价</span>
            </template>
          </el-table-column>

        </el-table>
        <div class="label" v-if="!isPriceArr">
          <span style="padding-left:14px">进货价格：</span>
          <!-- <el-input placeholder="请输入进货价格" style="width:30%;" v-model="goodsPrice" @input="goodsPriceInput"></el-input> -->
          <el-input-number v-model="goodsPrice" :disabled="true" placeholder="请输入进货价格" controls-position="right"
                           @change="goodsPriceInput" :precision="2" :min="0" :max="9999.99"></el-input-number>
          <span style="margin-left:15px">元</span>
        </div>
        <div class="label" v-if="!isPriceArr">
          <span>全网供货价：</span>
          <!-- <el-input placeholder="请输入全网供货价" style="width:30%;" v-model="supplyPrice"></el-input> -->
          <el-input-number v-model="supplyPrice" :disabled="true" placeholder="请输入全网供货价" controls-position="right"
                           :precision="2" :min="0" :max="9999.99"></el-input-number>
          <span style="margin-left:15px">元</span>
        </div>
        <div class="label">
          <!-- <span>商品面值：</span> -->
          <el-button type="primary" @click="goBuyingPrice" :loading="confirmLoading">确 定 定 价</el-button>
        </div>
      </div>
      <div class="item2 item">
        <div class="title">定价方案管理</div>
        <el-table border row-key="key" :data="tableData6" style="width: 100%;" class="table">
          <el-table-column :show-overflow-tooltip="true" prop="label1" label="" min-width="20%"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="label2" label="" min-width="60%">
            <template slot-scope="scope">
              <!-- <el-input v-model="scope.row.label2.value" style="width:80%"></el-input> -->
              <el-input-number v-if="scope.row.label2.id == 1" v-model="scope.row.label2.value" style="width:80%"
                               controls-position="right" :precision="2" :min="0" :max="9999.99"></el-input-number>
              <el-input-number v-else v-model="scope.row.label2.value" style="width:80%" controls-position="right"
                               :precision="0" :step="1" :min="0" :max="100"></el-input-number>
              <span v-if="scope.row.label2.id == 1">元</span>
              <span v-else>%</span>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="label3" label="" min-width="20%">
            <template slot-scope="scope">
              <el-button v-if="scope.row.label2.id == 1" size="mini" type="primary" @click="FillInThePlan(0)">填写
              </el-button>
              <el-button v-else size="mini" type="primary" @click="FillInThePlan(1)">填写</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!-- 日志 -->
    <el-dialog title="商品操作日志" :visible.sync="dialog6" width="70%" class="dialog6">
      <div class="filter-wrap">
        <span>详情关键字：</span>
        <el-input placeholder="请输入详情关键字：" class="search-input"></el-input>
        <el-select v-model="form.t" placeholder="操作类型">
          <el-option label="全部类型" value=""></el-option>
          <el-option label="添加商品" value=""></el-option>
          <el-option label="编辑商品信息" value=""></el-option>
          <el-option label="删除商品" value=""></el-option>
          <el-option label="商品销售状态" value=""></el-option>
          <el-option label="全网通供货" value=""></el-option>
          <el-option label="设置商品所属目录" value=""></el-option>
          <el-option label="取消商品所属目录" value=""></el-option>
          <el-option label="商品类型模板" value=""></el-option>
          <el-option label="商品定价" value=""></el-option>
          <el-option label="设置推荐商品" value=""></el-option>
          <el-option label="商品导卡" value=""></el-option>
          <el-option label="商品卡密删除" value=""></el-option>
          <el-option label="商品卡密修改" value=""></el-option>
          <el-option label="审核商家商品" value=""></el-option>
          <el-option label="设置商家商品费率" value=""></el-option>
          <el-option label="添加商品模板" value=""></el-option>
          <el-option label="编辑商品模板" value=""></el-option>
          <el-option label="伤处商品模板" value=""></el-option>
          <el-option label="审核商品模板" value=""></el-option>
        </el-select>
        <el-date-picker v-model="form.r" type="daterange" range-separator="至" start-placeholder="开始日期"
                        end-placeholder="结束日期"></el-date-picker>
        <el-button type="primary" icon="el-icon-search">查询</el-button>
      </div>
      <el-table border row-key="id" ref="multipleTable" :data="tableData7" style="width: 100%"
                :header-cell-style="{background:'#f5f5f5',color:'#606266'}">
        <el-table-column :show-overflow-tooltip="true" prop="label1" label="平台类型" align="center"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="label2" label="操作人" align="center"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="label3" label="操作日期" align="center"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="label4" label="操作IP" align="center"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="label5" label="IP所在地区" align="center"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="label6" label="操作类型" align="center"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="label7" label="详细" align="center"></el-table-column>
      </el-table>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="10"
                     layout="total, sizes, prev, pager, next, jumper" :total="400"></el-pagination>
    </el-dialog>

    <!-- 设置目录 -->
    <el-dialog title="选择商品在目录下展示" :visible.sync="dialog7" width="70%" class="dialog7">
      <div class="item" v-for="(item,index) in catalogTree" :key="index">
        <div class="title">《{{item.catalogName}}》</div>
        <el-checkbox-group v-model="checkList" v-if="item.children" @change="checkCatalogID">
          <el-checkbox :label="item1.catalogID" :min="0" :max="1" v-for="(item1,index1) in item.children"
                       :key="item1.catalogID">{{item1.catalogName}}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog7 = false">取 消</el-button>
        <el-button type="primary" @click="confirmSetCatalog" :loading="confirmLoading">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加商品 -->
    <el-dialog title="编辑商品" :visible.sync="dialog8" width="60%" class="dialog8">
      <el-form ref="form" :model="form" label-width="140px">
        <el-form-item label="商品名称：">
          <el-input v-model="form.name" placeholder="请输入商品名称" style="float:left"></el-input>
        </el-form-item>
        <el-form-item label="商品样式：">
          <el-color-picker v-model="color"></el-color-picker>
          <el-checkbox v-model="form.k" style="margin-left:20px">粗体</el-checkbox>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog7 = false">取 消</el-button>
        <el-button type="primary" @click="dialog7 = false">发 布</el-button>
      </span>
    </el-dialog>


    <!-- 删除 -->
    <el-dialog title="确认删除" :visible.sync="dialog9" width="30%">
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog9 = false">取 消</el-button>
        <el-button type="primary" @click="confirmDel" :loading="confirmLoading">确 定</el-button>
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
          <span class="val">
          <el-image
            style="width: 100px; height: 100px"
            :src="headImg" :preview-src-list="srcList">
          </el-image>
          </span>
        </li>
        <li>
          <span class="label">商家名称：</span>
          <span class="val">{{businessInfo.merchantName}}</span>
        </li>
        <li>
          <span class="label">联系电话：</span>
          <span class="val">{{businessInfo.phone}}</span>
        </li>
        <li>
          <span class="label">联系QQ：</span>
          <span class="val">{{businessInfo.qq}}</span>
        </li>
        <li>
          <span class="label">备注：</span>
          <span class="val">{{businessInfo.remark}}</span>
        </li>
      </ul>
    </el-dialog>


  </div>
</template>

<script>
  import Sortable from 'sortablejs'
  import { getList, getLists, getDatas } from '@/api/price/price-1/common'
  import { addPrice,addPriceArr } from '@/api/meun3/menu3-2/index'

  export default {
    data() {
      return {
        day: true,
        color: '#333',
        currentPage: 1,
        step: 1,
        loading: true,
        form: { d: true, textarea: '' },
        dialog1: false,
        dialog2: false,
        dialog3: false,
        dialog4: false,
        dialog5: false,
        dialog6: false,
        dialog7: false,
        dialog8: false,
        dialog9: false,
        headImg: '',
        businessInfoDialog: false,
        businessInfo: {},
        srcList: [],
        confirmLoading: false,
        tableData3: [],
        catalogTree: [],
        checkList: [],
        tableData2: [
          {
            label1: '123',
            label2: 'sdsdfsdf',
            label3: 'sdfsf-sdfs'
          }
        ],
        tableData4: [
          {
            label1: '1',
            label2: 'sfsf',
            label3: '2019/10/10',
            label4: '2019/11/11',
            label5: '哈哈',
            label6: '99',
            label7: '10'
          }
        ],
        tableData5: [],
        thisGoPriceData: [],
        supplyPrice: '',//全网供货价
        goodsPrice: 0,//商品成本价
        userLevelList: [],//等级价格组
        userLevelListID: '',//价格组选项
        tableData6: [
          {
            label1: '金额累加',
            label2: {
              id: 1,
              value: 0
            },
            label3: ''
          },
          {
            label1: '折扣累加',
            label2: {
              id: 2,
              value: 0
            },
            label3: ''
          }
        ],
        tableData7: [
          {
            label1: '后台系统',
            label2: '管理员',
            label3: '2019/10/10',
            label4: '127.0.0.1',
            label5: '位置',
            label6: '添加',
            label7: '详细内容'
          },
          {
            label1: '后台系统',
            label2: '管理员',
            label3: '2019/10/10',
            label4: '127.0.0.1',
            label5: '位置',
            label6: '添加',
            label7: '详细内容'
          }
        ],
        detailData: [
          { label: '商品编号：', value: '200' },
          { label: '商品名称：', value: '这是商品名称' },
          { label: '商品面值：', value: '1000.00' },
          { label: '质保天数：', value: '10' },
          { label: '商品类型：', value: '对的' },
          { label: '商品图片：', value: '图片' },
          { label: '商品简介：', value: '这是简介' },
          { label: '注意事项：', value: '这是主要事项' },
          { label: '充值网址：', value: 'www.sdfsd.com' },
          { label: '购买数量限制：', value: '10' },
          { label: '单人购买次数：', value: '0' }
        ],
        dialog1Data: [
          { label: '货源方编号：', value: '20043' },
          { label: '货源方版本：', value: '旗舰版' },
          { label: '货源方域名：', value: 'sdfsdf.csdcs.com' },
          { label: '所在货源方级别：', value: 'vip  ' },
          { label: '关注时间：', value: '2019-09-24 20:57' }
        ],
        multipleSelection: [],
        total: 0,
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          goodsSource: 4,
          type: 2,
          typeValue: '',
          // goodsTypeID: '',
          goodsState: '',
          hasCatalog: '',
          hasTemp: ''
        },
        isPriceArr: false,
        goodsIDArr: [],
      }
    },
    mounted() {
      this.getList()
      this.getCatalogTree()
    },
    methods: {

      // 跳转编辑页面
      goDetail(id) {
        this.$router.push({ path: `/menu3/4/detail/${id}` })
      },

      // 获取对接商品列表
      getList() {
        this.loading = true
        //getLists(this.queryParams,'/goods/goods/getConnectGoods').then(res => {
        getLists(this.queryParams, '/goods/goods/goodsPage').then(res => {
          if (res.code === 1001) {
            this.tableData3 = res.body.records
            this.total = res.body.total
          }
          this.loading = false
        }).catch(err => {
          this.loading = false
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
        this.multipleSelection = val
      },

      // 获取商品目录列表
      getCatalogTree() {
        let arr = []
        getDatas({}, '/goods/catalog/tree').then(res => {
          this.catalogTree = res.body
        })
      },

      // 设置目录
      setCatalog() {
        this.delIds = []
        this.multipleSelection.map(item => {
          this.delIds.push(item.goodsID)
        })
        if (this.delIds.length < 1) {
          this.$message({
            showClose: true,
            message: '请选择商品',
            type: 'error'
          })
          return
        }
        this.dialog7 = true
      },

      // 勾选目录
      checkCatalogID(data) {
        this.checkList = []
        this.checkList = [data.pop()]
      },

      // 确认设置目录
      confirmSetCatalog() {
        this.confirmLoading = true
        getLists({ ids: this.delIds, catalogID: this.checkList }, '/goods/goods/updateCatalogIDBatch').then(res => {
          if (res.code === 1001) {
            this.$message({
              message: res.msg,
              type: 'success'
            })
            this.getList()
            this.dialog7 = false
          } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            })
          }
          this.confirmLoading = false
        }).catch(err => {
          this.confirmLoading = false
        })
      },

      // 删除
      del() {
        this.delIds = []
        this.multipleSelection.map(item => {
          this.delIds.push(item.goodsID)
        })
        if (this.delIds.length < 1) {
          this.$message({
            showClose: true,
            message: '请选择商品',
            type: 'error'
          })
          return
        }
        this.dialog9 = true
      },

      // 确认删除
      confirmDel() {
        this.confirmLoading = true
        getDatas({ id: this.delIds }, '/goods/goods/deleteGoods').then(res => {
          if (res.code === 1001) {
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            })
            this.getList()
          } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            })
          }
          this.confirmLoading = false
          this.dialog9 = false
        }).catch(err => {
          this.confirmLoading = false
        })
      },

      // 推荐商品
      addRecommendGoods() {
        let ids = []
        this.multipleSelection.map(item => {
          ids.push(item.goodsID)
        })
        if (ids.length < 1) {
          this.$message({
            showClose: true,
            message: '请选择商品',
            type: 'error'
          })
          return
        }
        getLists({ ids: ids }, '/goods/goods/addRecommendGoodsBatch').then(res => {
          if (res.code === 1001) {
            this.$message({
              showClose: true,
              message: '推荐成功',
              type: 'success'
            })
            this.getList()
          } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            })
          }
        })
      },

      // 改变价格
      handleChangeInputNumber(value) {
        let newTableData5 = this.tableData5
        newTableData5.map(item => {
          if (item.levelID === value.levelID) {
            item.countPrice = Math.round((this.goodsPrice + value.prices) * Math.pow(10, 2)) / Math.pow(10, 2)
          }
        })
      },
      // 定价列表
      goPrice(data, str) {
        if (!str) {
          this.isPriceArr = false
        }
        this.userLevelListID = ''
        this.getPriceGroupList()
        if (data.goodsPrice && data.goodsPrice > 0) {
          this.goodsPrice = data.goodsPrice
        } else {
          this.goodsPrice = 0
        }
        if (data.supplyPrice && data.supplyPrice > 0) {
          this.supplyPrice = data.supplyPrice
        } else {
          this.supplyPrice = ''
        }
        getDatas({ goodsID: data.goodsID }, '/goods/goods/getGoodsPrice').then(res => {
          if (res.code === 1001) {
            if (res.body.length > 0 && data.goodsPrice && data.goodsPrice > 0) {
              res.body.map(item => {
                //if(item.price>data.goodsPrice){
                item.prices = item.price
                item.countPrice = Math.round((item.price + data.goodsPrice) * Math.pow(10, 2)) / Math.pow(10, 2)
                //}
              })
              this.tableData5 = res.body
            } else {
              this.tableData5 = res.body
            }
            this.dialog5 = true
            this.thisGoPriceData = data
          }
        })
      },

      // 获取价格组列表
      getPriceGroupList() {
        getLists({}, '/site/levelPriceGroup/page').then(res => {
          if (res.code === 1001) {
            this.userLevelList = res.body.records
          }
        }).catch(err => {
        })
      },

      // 获取商家信息
      lookBusiness(id) {
        getDatas({ siteID: id }, '/site/baseInfo/getByID').then(res => {
          if (res.code === 1001) {
            this.businessInfo = res.body
            this.headImg = res.body.headImg
            this.srcList.push(this.headImg)

            this.businessInfoDialog = true
          } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            })
          }
        }).catch(err => {

        })
      },

      // 判断等级价格
      judgePrice(data) {
        for (let i = 0; i < data.length - 1; i++) {
          if (data[i].prices < data[i + 1].prices) {
            this.$message({
              showClose: true,
              message: data[i].userLevelVO.levelName + '的定价不能小于' + data[i + 1].userLevelVO.levelName + '的价格',
              type: 'error'
            })
            return false
          }
        }
        return true
      },

      // 确认定价价格
      goBuyingPrice() {

        this.judgePrice(this.tableData5)
        if (!this.judgePrice(this.tableData5)) {
          return false
        }

        this.confirmLoading = true
        // 第一步 判断是否已经定价 成本价不能为0
        if (this.goodsPrice) {//已经定价过了
          let thisData = []

          for (let i = 0; i < this.tableData5.length; i++) {
            this.tableData5[i].price = this.tableData5[i].price ? this.tableData5[i].price : 0
            this.tableData5[i].prices = this.tableData5[i].prices ? Number(this.tableData5[i].prices) : 0

            if (this.tableData5[i].prices == 0) {
              this.$message({
                showClose: true,
                message: '定价不能为0',
                type: 'error'
              })
              setTimeout(() => {
                this.confirmLoading = false
              }, 2000)
              return false
            }
            thisData[i] = {
              goodsID: this.tableData5[i].goodsID,
              goodsPrice: this.goodsPrice,
              levelID: this.tableData5[i].levelID,
              price: this.tableData5[i].prices,
              siteID: this.tableData5[i].siteID,
              supplyPrice: this.supplyPrice
            }
          }

          if(this.isPriceArr) { // 批量定价操作
            const dataObj = {
             goodsIDs: this.goodsIDArr,
             items: [...thisData]
            }
            addPriceArr(dataObj).then(res => {
              if (res.code === 1001) {
                this.$message({
                  showClose: true,
                  message: '定价成功',
                  type: 'success'
                })
                this.tableData6[0].label2.value = 0
                this.tableData6[1].label2.value = 0
                this.getList()
                this.dialog5 = false
              } else {
                this.$message({
                  showClose: true,
                  message: res.msg,
                  type: 'error'
                })
              }

              this.confirmLoading = false
            })

          } else {
            addPrice(thisData).then(res => {
              if (res.code === 1001) {
                this.$message({
                  showClose: true,
                  message: '定价成功',
                  type: 'success'
                })
                this.tableData6[0].label2.value = 0
                this.tableData6[1].label2.value = 0
                this.getList()
                this.dialog5 = false
              } else {
                this.$message({
                  showClose: true,
                  message: res.msg,
                  type: 'error'
                })
              }

              this.confirmLoading = false
            })
          }
        } else {
          this.$message({
            showClose: true,
            message: '请输入进货价格',
            type: 'error'
          })
          this.confirmLoading = false
        }
      },

      // 进货价改变
      goodsPriceInput(data) {
        if (this.tableData5.length === 0) {
          this.$message({
            showClose: true,
            message: '请先设置客户等级',
            type: 'error'
          })
          return
        } else {
          this.goodsPrice = data
          for (let i = 0; i < this.tableData5.length; i++) {
            this.tableData5[i].prices = this.tableData5[i].prices ? this.tableData5[i].prices : 0
            this.tableData5[i].price = Math.round((data + this.tableData5[i].prices) * Math.pow(10, 2)) / Math.pow(10, 2)
            this.tableData5[i].countPrice = Math.round((data + this.tableData5[i].prices) * Math.pow(10, 2)) / Math.pow(10, 2)
          }
        }
      },

      // 选择等级价格组
      changeLevelListID() {
        let newLevelPrice = []
        this.userLevelList.map(item => {
          if (this.userLevelListID === item.levelPriceGroupID) {
            newLevelPrice = item.levelGroups
          }
        })
        let newTableData5 = this.tableData5
        newLevelPrice.map(item => {
          newTableData5.map(items => {
            if (item.levelID === items.levelID) {
              items.prices = item.levelPrice
              items.countPrice = Math.round((this.goodsPrice + item.levelPrice) * Math.pow(10, 2)) / Math.pow(10, 2)
            }
          })
        })
        //清空 金额累加/折扣累加 参数
        this.tableData6.map(item => {
          item.label2.value = 0
        })
      },

      // 清空筛查条件
      setValueNull(val) {
        if (val === 1) {
          this.userLevelListID = ''
          this.tableData5.map(item => {
            item.prices = ''
            if (item.countPrice) {
              delete item.countPrice
            }
          })
        }
      },
      // 库存查询
      kcQuery() {
        this.getList()
      },

      // 确认折扣
      FillInThePlan(data) {
        if (data === 1) {
          //清空 金额累加 参数
          this.tableData6[0].label2.value = 0
        } else {
          //清空 折扣累加 参数
          this.tableData6[1].label2.value = 0
        }
        this.setValueNull(1)
        let thisval = Number(this.tableData6[data].label2.value)
        if (this.tableData5.length === 0) {
          this.$message({
            showClose: true,
            message: '请先设置客户等级',
            type: 'error'
          })
          return
        } else if (this.goodsPrice === 0) {
          this.$message({
            showClose: true,
            message: '请先设置进货价',
            type: 'error'
          })
          return
        }
        if (thisval === 0) {
          this.$message({
            showClose: true,
            message: '当前值不能为0',
            type: 'error'
          })
        } else {
          if (data === 0) {
            //清空 折扣累加 参数
            this.tableData6[1].label2.value = 0
            this.tableData5.map((item, index) => {
              item.prices = thisval + thisval * (this.tableData5.length - (index + 1))
              //item.countPrice = this.goodsPrice + (thisval+thisval*index)
              item.countPrice = Math.round((this.goodsPrice + (thisval + thisval * (this.tableData5.length - (index + 1)))) * Math.pow(10, 2)) / Math.pow(10, 2)
            })
          } else {
            if (this.goodsPrice === 0) {
              this.$message({
                showClose: true,
                message: '当前配置，进货价不能为0',
                type: 'error'
              })
              return false
            }
            //清空 金额累加 参数
            this.tableData6[0].label2.value = 0
            this.tableData5.map((item, index) => {
              item.prices = this.goodsPrice * ((thisval / 100) + (thisval / 100) * (this.tableData5.length - (index + 1)))
              item.countPrice = Math.round((this.goodsPrice + ((thisval / 100) + (thisval / 100) * (this.tableData5.length - (index + 1)))) * Math.pow(10, 2)) / Math.pow(10, 2)
            })
          }
        }

      },
      batchPriceArr () {
        const goodsIDArr = this.multipleSelection.map((item) => item.goodsID);

        if(!goodsIDArr.length) {
          this.$message({
            showClose: true,
            message: '请选择商品',
            type: 'error'
          })
          return
        }

        this.goodsIDArr = goodsIDArr;
        this.isPriceArr = goodsIDArr.length>1;
        this.goPrice(this.multipleSelection[0], true)
      }

    }
  }
</script>

<style lang="scss">
  .el-hidden-tc {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
    border: none;
  }

  .container-good {

    .dialog5 {
      .el-dialog__body {
        overflow: auto;
        max-height: 550px;
      }

      .el-table td, .el-table th {
        padding: 5px 0;
      }
    }

    .dialog6 {
      .el-dialog__body {
        overflow: auto;
        max-height: 550px;
      }
    }

    .dialog7 {
      .el-dialog__body {
        overflow: auto;
        max-height: 550px;
      }

      .item {
        margin-bottom: 20px;
      }
    }

    .dialog8 {
      .el-dialog__body {
        overflow: auto;
        max-height: 550px;
      }
    }
  }

  .dialog3, .dialog1 {
    li {
      padding: 15px 0;
      display: flex;

      .label {
        width: 140px;
        text-align: right;
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
  .el-dialog__wrapper {
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .el-color-picker {
    float: left;
    margin-left: 20px;
  }

  .container {
    .go-btn {
      border: 1px solid #ccc;
      font-weight: bold;
      font-size: 13px;
      padding: 1px 5px;
      border-radius: 3px;
      display: inline-block;
      color: #409EFF;
      cursor: pointer;
      transition: .3s;

      .go-btn.no {
        color: #909399;
      }
    }

    .go-btn:hover {
      transition: .3s;
      border: 1px solid #409EFF;
    }

    .tips {
      color: #909399;
      font-size: 12px;
      line-height: 20px;
      width: 400px;
    }

    padding: 20px;

    .filter-wrap {
      .search-input {
        width: 200px;
      }

      .handle-wrap {
        margin-top: 20px;
      }
    }

    .el-form {
      padding: 0;

      .el-input, .el-textarea {
        width: 400px;
      }
    }

    .dialog3 {
      .list {
        .header {
          display: flex;
          justify-content: space-between;
        }

      }
    }

    .dialog5 {

      .item {
        .label {
          padding: 15px 0;
        }
      }

      table {
        border-collapse: collapse;
        border: none;
        width: 100%
      }

      .table1 {

      }
    }

    .businessInfoUl li {
      margin: 10px auto;
    }

    .businessInfoUl li .label {
      font-weight: 600;
    }
  }

    ::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
      -webkit-appearance: none !important;
}
::v-deep input[type='number'] {
      -moz-appearance: textfield !important;
}
</style>

