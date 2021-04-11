<template>
  <div class="dialog">

    <div class="step1" v-show="step == 1">
      <el-form ref="importCardForm" :model="importCardForm" label-width="140px" :rules="importCardRules">
        <el-form-item label="商品分类" prop="catalogFakaID">
          <div class="item">
            <div class="item-form">
              <el-select
                v-model="importCardForm.catalogFakaID"
                @change="selectCatalogFaka"
                style="width: 100%"
                clearable
                placeholder="请选择商品分类"
              >
                <el-option v-for="(item, index) in catalogFakaList" :key="index" :label="item.catalogName" :value="item.catalogID">
                </el-option>
              </el-select>
            </div>
            <div class="item-info"></div>
          </div>
        </el-form-item>
        <el-form-item label="导卡的商品" prop="goodsName">
          <div class="item">
            <div class="item-form">
              <el-select
                v-model="importCardForm.goodsName"
                @change="selectCatalogFakaGoods"
                style="width: 100%"
                clearable
                placeholder="请选择商品"
              >
                <el-option v-for="(item, index) in catalogFakaGoodsList" :key="index" :label="item.goodsName" :value="item.goodsID">
                </el-option>
              </el-select>
            </div>
            <div class="item-info"></div>
          </div>
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
        <el-form-item label="该卡截止有效日期：">
          <el-date-picker v-model="importCardForm.validDate" type="date" placeholder="选择日期"
                          value-format="yyyy-MM-dd"></el-date-picker>
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
          <el-table border row-key="id" :data="tableData2" style="width: 100%">
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
  </div>
</template>
<script>
import request from '@/utils/request'
import { importCardApi } from '@/api/meun3/menu3-2/index'
export default {
  data() {
    return {
      loading: false,
      step: 1,
      catalogFakaList: [],
      catalogFakaGoodsList: [],
      importCardForm: {
        cardVOList: [],
        goodsName: '',
        goodsID: '',
        isRepeatState: true,
        isFirstState: true,
        isRepeat: 1,
        isFirst: 1,
        supplier: '',
        price: '',
        validDate: '',
        textarea: '',
        contact: ''
      },
      tableData2: [
        {
          label1: '123',
          label2: 'sdsdfsdf',
          label3: 'sdfsf-sdfs'
        }
      ],
      importCardRules: {
        catalogFakaID:[
          { required: true, message: '请选择商品分类'}
        ],
        goodsName: [
          { required: true, message: '请选择商品'}
        ],
        textarea: [{ required: true, message: '请输入点卡内容', trigger: 'blur' }]
      },
      form: { d: true, textarea: '' },
      confirmImportLoading:false,
    };
  },
  mounted() {
    this.getCatalogFakaList()
  },
  created() {

  },
  methods: {
    getCatalogFakaList() {
      request({
        url: '/goods/catalogFaka/list',
        method: 'get',
        data:{},
        transformRequest: request.transformRequest
      }).then(res=>{
        this.catalogFakaList = res.body
      })
    },
    selectCatalogFaka(val) {
      this.catalogFakaGoodsList = []
      this.getCatalogFakaGoodsList(val);
    },
    getCatalogFakaGoodsList(catalogID) {
      this.loading = true
      request({
        url: '/goods/goods/getGoodsByCatalogForFaka/?catalogID=' + catalogID,
        method: 'get',
        data:{},
        transformRequest: request.transformRequest
      }).then(res=>{
        console.log('goodsListByCatalog', res)
        this.catalogFakaGoodsList = res.body
        this.loading = false
      })
    },
    selectCatalogFakaGoods(val) {
      this.importCardForm.goodsID = parseInt(val)
    },
    writingFileTxt (file) {
      console.log(file)
      let filedata = file.raw
      let file_reader = new FileReader();
      file_reader.onload = () => {
          this.importCardForm.textarea = file_reader.result
      };
      file_reader.readAsText(filedata, 'UTF-8');
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
      this.importCardForm.isFirst = this.importCardForm.isFirstState ? 1 : 0
      arr.map(item => {
        this.importCardForm.cardVOList.push({
          cardNumber: item.label1,
          cardPws: item.label2,
          supplier: this.importCardForm.supplier,
          price: this.importCardForm.price,
          validDate: this.importCardForm.validDate,
          contact: this.importCardForm.contact
        })
      })

      this.$refs['importCardForm'].validate((vaild) => {
        if (vaild) {
          this.step = 2
        }
      })
    },
    // 确认导入
    confirmImport() {
      this.confirmImportLoading = true
      importCardApi(this.importCardForm).then(res => {
        console.log('res', res)
        if (res.code == 1001) {
          this.$message({
            showClose: true,
            message: '导入成功',
            type: 'success'
          })
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

  }
};
</script>
<style scoped>
.dialog >>> .el-form {
  padding: 0;
}
.item {
  display: flex;
}

.item-form {
  width: 600px;
}

.item-info {
  margin-left: 20px;
}
</style>
