<template>
  <div>
    <div class="search-container">
      <el-form :inline="true" >
        <el-form-item>
          <el-input v-model="queryParams.goodsName" placeholder="请输入商品名称" size="small" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item>
           <el-input v-model="queryParams.cardNumber" placeholder="请输入卡密" size="small" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="button-group">
      <el-button type="primary" icon="el-icon-plus" @click="importCard">添加虚拟卡</el-button>
      <el-button type="success" icon="el-icon-upload2" @click="exportCard">导出卡密</el-button>
      <el-button type="danger" icon="el-icon-close" @click="batchDel">批量删除</el-button>
    </div>
    <el-table
      border
      :data="tableData"
      header-row-class-name="faka-table-header"
      style="width: 100%"
      v-loading="loading"
      @selection-change="handleSelectionChange"
    >
      <el-table-column :show-overflow-tooltip="true" type="selection" align="center"></el-table-column>
      <el-table-column prop="catalogFakaName" label="商品分类" align="center" min-width="15%"></el-table-column>
      <el-table-column prop="goodsName" label="商品名称" align="center" min-width="20%"></el-table-column>
      <el-table-column prop="price" label="商品价格" align="center" min-width="5%"></el-table-column>
      <el-table-column prop="cardNumber" label="卡号" align="center" min-width="20%"></el-table-column>
      <el-table-column prop="cardPws" label="卡密" align="center" min-width="20%"></el-table-column>
      <el-table-column  label="状态" align="center" min-width="10%"></el-table-column>
      <el-table-column prop="importDate" label="创建时间" align="center" min-width="15%"></el-table-column>
      <!-- <div v-if="searchForm.status === 1">
        <el-table-column prop="systemNoticeTitle" label="售出时间"></el-table-column>
        <el-table-column prop="systemNoticeTitle" label="取卡密码"></el-table-column>
        <el-table-column prop="systemNoticeTitle" label="联系方式"></el-table-column>
      </div> -->
      <el-table-column label="操作" min-width="8%" align="center">
        <template slot-scope="{row}">
          <el-button type="text" @click="del(row.cardID)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"  :page-sizes="[10, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    <!-- 导出 -->
    <el-dialog title="导出" :visible.sync="exportDialog" width="40%">
      <daochu />
    </el-dialog>


     <!-- 添加虚拟卡 -->
    <el-dialog title="导卡" :visible.sync="dialog3" width="50%" class="dialog3" @close="dialog3Close">
      <div class="step1" v-show="step == 1">
        <el-form ref="importCardForm" :model="importCardForm" label-width="140px" :rules="importCardRules">
          <el-form-item label="商品分类：" prop="catalogID">
            <el-select @change="getGoodsList" v-model="importCardForm.catalogID" style="width:100%" placeholder="请选择商品分类">
              <el-option v-for="(item,index) in catalogList" :key="index" :label="item.catalogName" :value="item.catalogID">{{item.catalogName}}</el-option>
            </el-select>
          </el-form-item>

           <el-form-item label="商品名称：" prop="goodsID">
            <el-select v-model="importCardForm.goodsID" style="width:100%" placeholder="请选择商品">

              <el-option v-for="(item,index) in goodsList" :key="index" :label="item.goodsName" :value="item.goodsID">{{item.goodsName}}</el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="点卡内容：" prop="textarea">
            <el-input type="textarea" :rows="4" placeholder="请输入点卡内容" v-model="importCardForm.textarea"></el-input>
            <div class="tips message_tips_box">
              <el-upload
                class="upload-demo upload_btn_txt"
                action="https://jsonplaceholder.typicode.com/posts/"
                :auto-upload="false"
                list-type="text"
                :on-change="writingFileTxt"
                :limit="1">
                <el-button type="text" size="mini">读取文件</el-button>
              </el-upload>
              <span>导入格式为：卡号+空格+密码，如：AAAAA BBBBB</span>
            </div>
            <!-- <div class="tips">实卡导入格式为：卡号+空格+密码+空格+(A1-A7)矩阵号(矩阵号用-号连接)，如：AAAAA BBBBB CC-DD-EE-FF-GG-HH-JJ</div> -->
          </el-form-item>
          <el-form-item label="供货商名称：">
            <el-input placeholder="请输入供货商名称" v-model="importCardForm.supplier"></el-input>
          </el-form-item>
          <el-form-item label="联系方式：">
            <el-input placeholder="请输入联系方式" v-model="importCardForm.contact"></el-input>
          </el-form-item>
          <el-form-item label="进货价格备注：">
            <el-input placeholder="请输入进货价格备注" style="width:203px" v-model="importCardForm.price"></el-input>
            <span style="margin-left:20px">元</span>
          </el-form-item>

          <el-form-item label="检查重复卡：">
            <el-switch v-model="importCardForm.isRepeatState" active-color="#13ce66" inactive-color="#eee"></el-switch>
          </el-form-item>

        </el-form>
        <div>
          <span slot="footer" class="dialog-footer" style="display:flex;justify-content:flex-end">
            <el-button @click="dialog3 = false">取 消</el-button>
            <el-button type="primary" @click="nextStep">下一步</el-button>
          </span>
        </div>
      </div>
      <div class="step2" v-show="step == 2">
        <el-form ref="form" :model="form" label-width="140px">
          <el-form-item label="导卡的商品：">
            <div>{{importCardForm.goodsName}}</div>
          </el-form-item>
          <el-form-item label="卡号与密码：">
            <el-table border row-key="id" :data="tableData2"  style="width: 100%">
              <el-table-column :show-overflow-tooltip="true" prop="label1" label="卡号"></el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="label2" label="密码"></el-table-column>
              <!--  <el-table-column :show-overflow-tooltip="true" prop="label3" label="赠品/矩阵号" ></el-table-column> -->
            </el-table>
          </el-form-item>
          <el-form-item label="导入数量：">
            <div>{{tableData2.length}}</div>
          </el-form-item>
          <el-form-item label="供货商名称：">
            <div>{{importCardForm.supplier}}</div>
          </el-form-item>
          <!-- <el-form-item label="此处卡有效日期：">
            <div>{{importCardForm.validDate}}</div>
          </el-form-item> -->
        </el-form>
        <div>
          <span slot="footer" class="dialog-footer" style="display:flex;justify-content:flex-end">
            <el-button @click="step = 1">返 回</el-button>
            <el-button type="primary" @click="confirmImport" :loading="confirmImportLoading">确认导入</el-button>
          </span>
        </div>
      </div>
    </el-dialog>

    <!-- 删除 -->
    <el-dialog title="确认删除" :visible.sync="deleteDialog" width="30%">
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmDel" :loading="confirmDelLoading">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {
  importCardApi
} from '@/api/meun3/menu3-2/index'
import daochu from "../daochu";
import Tinymce from '@/components/Tinymce'
import { getLists,getDatas,postApplicationJson } from '@/api/price/price-1/common'
import request from '@/utils/request'
export default {
  data() {
    return {
      form:{},
      currentPage:1,
      total:0,
      tableData: [],
      multipleSelection: [],
      delIds:[],
      checkIds: [],
      loading: false,
      deleteDialog: false,
      confirmDelLoading:false,
      queryParams:{
        pageNum:1,
        pageSize:10
      },
      exportDialog:false,

      dialog3:false,
      confirmImportLoading:false,
      step:1,
      importCardForm: {
        cardVOList: [],
        goodsName: '',
        goodsID: '',
        supplier: '',
        price: '',
        textarea: '',
        contact: '',
        isRepeatState: true,
        isRepeat: 1,
      },
      importCardRules: {
        textarea: [{ required: true, message: '请输入点卡内容', trigger: 'blur' }],
        catalogID:[{ required: true, message: '请选中商品分类', trigger: 'blur' }],
        goodsID:[{ required: true, message: '请选中商品', trigger: 'blur' }]
      },
       tableData2: [
        {
          label1: '123',
          label2: 'sdsdfsdf',
          label3: 'sdfsf-sdfs'
        }
      ],
      catalogList:[],
      goodsList:[]
    }
  },
  components: {
    Tinymce
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 获取密记录列表
    getList() {
      this.loading = true
      getLists(this.queryParams,'/goods/card/page').then(res => {
        console.log(res)
        if (res.code===1001){
          this.tableData = res.body.records
          this.total = res.body.total
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },

    // 删除
    delList(id) {
      this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          getDatas({id:id},'/goods/card/delete').then(res => {
            if (res.code===1001){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getList()
            }else{
              this.$message({
                type: 'info',
                message: res.msg
              });
            }
          }).catch(err => {

          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },

    checkBoxChecked() {
      this.checkIds = []
      this.multipleSelection.map(item => {
        this.checkIds.push(item.cardID)
      })
    },

    // 批量删除前的准备
    batchDel() {
      this.checkBoxChecked()
      if (this.checkIds.length < 1) {
        this.$message({
          showClose: true,
          message: '请选择卡密',
          type: 'error'
        })
        return
      }
      this.deleteDialog = true
    },

    // 单个删除
    del(id) {
      if (!id) {
        this.$message({
          showClose: true,
          message: '请选择卡密',
          type: 'error'
        })
        return
      }
      this.delIds.push(id)
      this.deleteDialog = true
    },

    // 确认批量删除
    confirmDel() {
      this.confirmDelLoading = true
      request({
        url: '/goods/card/delete/?id=' + this.delIds,
        method: 'get',
        data:{},
        transformRequest: request.transformRequest
      }).then(res=>{
        if (res.code === 1001) {
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
          this.getList();
        } else {
          this.$message({
            showClose: true,
            message: '删除失败',
            type: 'error'
          })
        }
        this.confirmDelLoading = false
        this.deleteDialog = false
      }).catch(err => {
        this.$message({
          showClose: true,
          message: '删除失败',
          type: 'error'
        })
        this.confirmDelLoading = false
      })

    },

    // 批量导出
    exportCard() {
      this.checkBoxChecked()
      if (this.checkIds.length < 1) {
        this.$message({
          showClose: true,
          message: '请选择卡密',
          type: 'error'
        })
        return
      }
      this.$confirm('此操作将导出所选卡密, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let str = ''
        this.multipleSelection.forEach(i => {
          let str_g = i.goodsName ? i.goodsName : ''
          let str_f = i.cardNumber ? ' ' + i.cardNumber : ''
          let str_s = i.cardPws ? ' ' + i.cardPws : ''
          if (str === '') {
            str = str_g + str_f + str_s
          } else {
            str = str + '\n' + str_g + str_f + str_s
          }

        })
        this.exportData("卡密导出.txt", str)

      }).catch(() => {
        this.$message.success('已取消')
      })
    },

    exportData(filename, filecontent) {
      //定义文件内容，类型必须为Blob 否则createObjectURL会报错
      let content = new Blob([filecontent])
      //生成url对象
      let  urlObject = window.URL || window.webkitURL || window
      let url = urlObject.createObjectURL(content)
      //生成<a></a>DOM元素
      let el = document.createElement('a')
      //链接赋值
      el.href = url
      el.download =filename
      //必须点击否则不会下载
      el.click()
      //移除链接释放资源
      urlObject.revokeObjectURL(url)
    },

    handleSizeChange(val) {
      this.queryParams.pageNum = 1
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

    //获取商品目录
    getCatalogFakaList(){
      request({
        url: '/goods/catalogFaka/list',
        method: 'get',
      }).then(res=>{
        this.catalogList = res.body
      })
    },

    //根据目录ID获取商品
    getGoodsList(){
      this.importCardForm.goodsID = ''
       request({
        url: '/goods/goods/getGoodsByCatalogForFaka',
        method: 'get',
        params:{
          catalogID:this.importCardForm.catalogID
        }
      }).then(res=>{
        this.goodsList = res.body
      })
    },


    // 清空导卡表单
    dialog3Close() {
      this.importCardForm = {
        cardVOList: [],
        goodsName: '',
        goodsID: '',
        supplier: '',
        price: '',
        textarea: '',
        isRepeatState: true,
        isRepeat: 1,
      }
    },

     // 导卡
    importCard() {
      this.getCatalogFakaList()
      this.dialog3 = true
      this.step = 1
    },

     // 导卡下一步
    nextStep() {
      let arr = []
      let list = this.importCardForm.textarea.trim().split(/\n+/)
      this.importCardForm.cardVOList = []

      list.map((item, index) => {
        arr.push({})
        let subList = item.trim().split(/\s+/)
        subList.map((item1, index1) => {
          let s = 'label' + (index1 + 1)
          arr[index][s] = item1
        })
      })
      this.tableData2 = arr

      this.importCardForm.isRepeat = this.importCardForm.isRepeatState ? 1 : 0
      arr.map(item => {
        this.importCardForm.cardVOList.push({
          cardNumber: item.label1,
          cardPws: item.label2,
          supplier: this.importCardForm.supplier,
          price: this.importCardForm.price,
          contact: this.importCardForm.contact
        })
      })

      this.$refs['importCardForm'].validate((vaild) => {
        if (vaild) {
          delete this.importCardForm.catalogID
          this.importCardForm.goodsName = this.goodsList.find(ele => ele.goodsID === this.importCardForm.goodsID).goodsName
          this.step = 2
        }
      })
    },
    // 确认导入
    confirmImport() {
      this.confirmImportLoading = true
      importCardApi(this.importCardForm).then(res => {

        if (res.code == 1001) {
          this.dialog3 = false
          this.$message({
            showClose: true,
            message: '导入成功',
            type: 'success'
          })
          this.getList();
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'error'
          })
        }
        this.confirmImportLoading = false

      }).catch(err => {
        this.confirmImportLoading = false
      })
    },

      writingFileTxt (file) {
      console.log(file)
      let filedata = file.raw
      let file_reader = new FileReader();
      file_reader.onload = () => {
          this.dialog3 = true
          this.importCardForm.textarea = file_reader.result
      };
      file_reader.readAsText(filedata, 'UTF-8');
    },
  },

}
</script>

<style scoped>
.search-container .el-form {
  padding: 0;
}
.button-group {
  margin-bottom: 15px;
}
</style>
