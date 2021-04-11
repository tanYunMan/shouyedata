<template>
  <div class="dialog">
    <el-card shadow="never">
      <el-form class="add-form" ref="form" :model="editForm" label-width="120px" :rules="rules"> 
        <el-form-item label="商品分类" prop="catalogFakaID">
          <div class="item">
            <div class="item-form">
              <el-select
                v-model="editForm.catalogFakaID"
                style="width: 100%"
                clearable
                placeholder="商品分类"
              >
                <el-option v-for="(item, index) in catalogFakaList" :key="index" :label="item.catalogName" :value="item.catalogID">
                </el-option>
              </el-select>
            </div>
            <div class="item-info">请选择商品分类</div>
          </div>
        </el-form-item>
        <el-form-item label="商品名称" prop="goodsName">
          <div class="item">
            <div class="item-form">
              <el-input v-model="editForm.goodsName" clearable />
            </div>
            <div class="item-info">好的名字有利于销售哦！</div>
          </div>
        </el-form-item>
      
        <el-form-item label="销售价" prop="goodsValue"> 
          <div class="item">
            <div class="item-form">
              <el-input type="number" min="0" v-model.number="editForm.goodsValue" clearable @blur="goodsXSMoney" />
            </div>
            <div class="item-info">商品对外出售的价格即零售价格！</div>
          </div>
        </el-form-item>

        <el-form-item label="成本价" prop="goodsPrice">
          <div class="item">
            <div class="item-form">
              <el-input type="number" min="0" v-model.number="editForm.goodsPrice" clearable disabled="disabled" />
            </div>
            <div class="item-info">商品进货价,可以不填,填写有利于商户系统的利润统计分析！</div>
          </div>
        </el-form-item>

        <!-- <el-form-item label="对接价">
          <div class="item">
            <div class="item-form">
              <el-input type="number" min="0" v-model.number="editForm.supplyPrice" clearable />
            </div>
            <div class="item-info">商品的对接价！</div>
          </div>
        </el-form-item> -->

        <el-form-item label="商品状态" prop="goodsState" >
          <el-radio-group v-model="editForm.goodsState">
            <el-radio :label="1" disabled="disabled">上架</el-radio>
            <el-radio :label="0" disabled="disabled">下架</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="批发优惠" prop="isDiscountPrice">
          <div class="item">
            <div class="item-form">
              <el-radio-group v-model="editForm.isDiscountPrice">
                <el-radio :label="1">使用</el-radio>
                <el-radio :label="0">不使用</el-radio>
              </el-radio-group>
            </div>
            <div class="item-info">是否设置批发购买时使用批发价格！</div>
          </div>
        </el-form-item>

        <div v-show="editForm.isDiscountPrice === 1">
          <el-form-item v-for="(discount) in editForm.discountPrices" :key="discount.key">
            <div class="item">
              <div class="item-form">
                <el-input-number v-model="discount.num" style="width: 30%" />&nbsp;&nbsp;张
                <el-input v-model="discount.price" style="width: 30%"></el-input>&nbsp;&nbsp;元
                <el-button @click.prevent="removeDiscount(discount)">删除</el-button>
              </div>
            </div>
          </el-form-item>

          <el-form-item>
            <div class="item">
              <div class="item-form">
                <el-button type="primary" @click="addDiscount">添加优惠</el-button>
              </div>
              <div class="item-info">优惠价格为单价，并不是商品总价哦！</div>
            </div>
          </el-form-item>
        </div>

       
        <el-form-item label="商品介绍">
          <div class="item">
            <div class="item-form">
              <el-input
                maxlength="200"
                show-word-limit
                v-model="editForm.remark"
                clearable
                placeholder="建议填写该商品的使用方法，文字不超过200字"
                type="textarea"
                :rows="6"
              />
            </div>
            <div class="item-info">商品说明将显示在商品购买页面</div>
          </div>
        </el-form-item>

        <el-form-item label="注意事项">
          <div class="item">
            <div class="item-form">
              <el-input
                maxlength="200"
                show-word-limit
                v-model="editForm.goodsNote"
                clearable
                placeholder="建议填写该商品的使用方法，文字不超过200字"
                type="textarea"
                :rows="6"
              />
            </div>
            <div class="item-info">使用说明将显示在订单查询结果中，一般设置售后QQ群，或者下载地址类</div>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="addGoods" :loading="loading">确定提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import request from '@/utils/request';
import { getGoodsDetail , updateGoods} from '@/api/meun3/menu3-2/detail'
export default {
  data() {
    return {
      currentPage:1,
      loading:false,
      editForm: {
        goodsState:1,
        isDiscountPrice:0,
        discountPrices: [],
      },
      catalogFakaList:[],
      //校验规则
      rules:{
        catalogFakaID:[
          { required: true, message: '请选择商品分类',trigger:'blur'}
        ],
        goodsName: [
          { required: true, message: '请输入商品名称',trigger:'blur'}
        ],
        goodsValue:[
          {required:true ,message : '请输入销售价',trigger:'blur'},
          {type:'number', min:0 , message:'请输入正确的销售价', trigger : 'blur'}
        ],
        // goodsPrice:[
        //   {required:true ,message : '请输入成本价',trigger:'blur'},
        //   {type:'number', min:0 , message:'请输入正确的成本价', trigger : 'blur'}
        // ],
        isDiscount:[
           {required:true ,message : '请选择',trigger:'blur'},
        ],
        // goodsState:[
        //   {required:true ,message : '请选择',trigger:'blur'},
        // ]
        
      }
    };
  },
  methods: {
    removeDiscount(item) {
      var index = this.editForm.discountPrices.indexOf(item);
      if (index !== -1) {
        this.editForm.discountPrices.splice(index, 1);
      }
    },
    addDiscount() {
      this.editForm.discountPrices.push({
        count: "",
        money: "",
        key: Date.now(),
      });
    },
    getAllCatalogFaka(){
      request({
        url: '/goods/catalogFaka/list',
        method: 'get',
        data:{},
        transformRequest: request.transformRequest
      }).then(res=>{
        this.catalogFakaList = res.body
      })
    },

    addGoods(){
      var _this = this
      var isReturn = false
      var numList=[]
      this.editForm.discountPrices.forEach(element => {
        numList.push(element.num)
        if(element.num <= 0 || element.price <= 0){
          this.$message({
            showClose: true,
            message: '优惠卷的数量或价格小于零',
            type: 'error'
          })
          isReturn = true
          return
        }
        if(element.num == null || element.num == '' || element.price == null || element.price == ''){
          this.$message({
            showClose: true,
            message: '请填写优惠卷的价格或数量',
            type: 'error'
          })
          isReturn = true
          return
        }
      });

      if(isReturn)  return;

      if((new Set(numList)).size != numList.length){
        this.$message({
          showClose: true,
          message: '优惠卷的数量重复',
          type: 'error'
        })
        return
      }

      this.$refs['form'].validate((valid)=>{
        if(valid){
           this.loading = true
           return request({
            url: '/goods/goods/batchFakaGoods',
            method: 'post',
            data: this.editForm,
            transformRequest:[function (){
              return JSON.stringify(_this.editForm)
            }],
            headers:{
              'Content-Type':'application/json'
            }
          }).then(res=>{
            this.loading = false
            if(res.code === 1001){
              this.$message({
                showClose: true,
                message: res.msg,
                type: 'success'
              })
               this.editForm={
                goodsState:1,
                isDiscount:0,
                discountPrices: [],
               }
               console.log("我要开始返回界面了，回去的页数为："+this.currentPage)
               this.$router.push({
                 name:'network-goods-inter',
                 params:{
                   currentPage:this.currentPage
                 }
               })
            }else{
              this.$message({
                showClose: true,
                message: res.msg,
                type: 'error'
              })
            }
          }).catch(err => {
             this.loading = false
          })
        }
      })
    },

    getGoods(goodsID){
      getGoodsDetail({goodsID:goodsID}).then(res => {
        this.editForm = res.body
        delete this.editForm.updateTime
        this.editForm.goodsValue = null
        this.editForm.catalogFakaID = null
        if(this.editForm.discountPrices == null){
          this.editForm.discountPrices = []
        }
      })
    },
    goodsXSMoney () {
      if (this.editForm.goodsPrice > this.editForm.goodsValue) {
        this.$message({
          showClose: true,
          message: '销售价不能低于成本价',
          type: 'error'
        })
        this.editForm.goodsValue = ''
      }
    }
  },
  mounted() {
    this.getAllCatalogFaka();
    this.editForm = this.$route.query
    this.currentPage = this.$route.query.currentPage
    delete this.editForm.currentPage
  },
  created() {
  
  },
};
</script>
<style scoped>
.dialog >>> .el-form {
  padding: 0;
}
/* .add-form {
  width: 00px;
} */
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