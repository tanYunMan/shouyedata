<template>
  <div class="container goods-container">
    <el-form :model="form" ref="form" label-width="140px" :rules="formRules">
      <el-form-item label="商品名称：" prop="goodsName">
        <!-- <el-input v-model="form.goodsName" placeholder="请输入商品名称" style="float:left" class="goodname-input"></el-input> -->
        <el-input v-model="form.goodsName" placeholder="请输入商品名称" type="text" style="float:left" id="goodsinput" :class="{'blod-input':isBlod}" ></el-input>
        <el-color-picker v-model="form.color" @change="changeColor"></el-color-picker>
        <el-checkbox v-model="isBlod" style="margin-left:20px" @change="changeBlod">粗体</el-checkbox>
        <el-checkbox v-model="isHot" @change="changeHot">最热商品</el-checkbox>
      </el-form-item>
      <!-- <el-form-item label="商品面值：" prop="goodsValue">
        <el-input v-model="form.goodsValue" placeholder="请输入商品面值" ></el-input>
        <span style="margin-left:20px;">元</span>
      </el-form-item> -->
      <el-form-item label="质保天数：">
        <el-switch v-model="day" active-color="#13ce66" inactive-color="#eee" @change="changeQualityDay"></el-switch>
        <span v-if="day">
          <el-input-number v-model="form.qualityDay" placeholder="请输入质保天数" controls-position="right" :min="0" :max="365" v-if="day"></el-input-number>
          <span class="tips">输入范围：0买家不可申请售后，1-365天，此时间段内买家可申请售后</span>
        </span>
        <span v-else class="tips">售出后买家不可申请售后</span>
      </el-form-item>
      <el-form-item label="商品类型：">
        <el-radio-group v-model="form.goodsTypeID">
          <el-radio :label="item.key" v-for="(item,index) in goodsTypeList" :key="index">{{item.text}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="充值模板：" v-if="form.goodsTypeID == 2" prop="goodsTempID">
        <el-select v-model="form.goodsTempID" placeholder="请选择" >
          <el-option :label="item.tempName" :value="item.goodsTempID" v-for="(item,index) in tempList" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="充值时间：" v-if="form.goodsTypeID == 2">
        <el-input placeholder="请输入充值时间" style="width:150px;"></el-input>
        <el-select v-model="form.type" placeholder="请选择">
          <el-option label="小时" value="1"></el-option>
        </el-select>
        <span class="tips" style="margin-left:20px;">超出此时间系统将自动退单</span>
      </el-form-item>
      <el-form-item label="商品介绍：">
        <el-input v-model="form.remark" placeholder="请输入商品介绍" type="textarea" :rows="5" style="400px;"></el-input>
        <!-- <span class="tips" style="margin-left:20px;">超出此时间系统将自动退单</span> -->
      </el-form-item>
      <el-form-item label="注意事项：">
        <el-input v-model="form.goodsNote" placeholder="请输入注意事项" type="textarea" :rows="5" style="400px;"  maxlength="10" show-word-limit></el-input>
        <span class="tips" style="margin-left:20px;">买家下单时需要确认阅读此信息才可购买，300字内</span>
      </el-form-item>
      <!-- <el-form-item label="购买数量限制：">
        
        <el-input style="width:100px;" v-model="form.startCount"></el-input> — <el-input style="width:100px;" v-model="form.endCount"></el-input>
        <span class="tips" style="margin-left:20px;">请填写大于等于1的整数</span>
      </el-form-item> -->
      <el-form-item label="">
        <el-button type="primary" @click="submit" :loading="submitLoading">发布商品</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getGoodsType , getTempList } from '@/api/meun3/menu3-2/add'
import { getGoodsDetail , updateGoods} from '@/api/meun3/menu3-2/detail'

export default {
  data() {
    return {
      id:'',
      day:true,
      isBlod:false,
      isHot:false,
      color:'#000000',
      submitLoading:false,
      tempList:[],
      goodsTypeList:[],
      form:{
        goodsName:'',
        color:'#000000',
        isBlod:0,
        isHot:0,
        goodsValue:'',
        qualityDay:0,
        goodsTypeID:1,
        remark:'',
        goodsNote:'',
        startCount:'',
        endCount:'',
      },
      formRules:{
        goodsName:[{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        // goodsValue:[{ required: true, message: '请输入商品面值', trigger: 'blur' }],
        goodsTempID:[{ required: true, message: '请选择充值模板', trigger: 'blur' }],
      }
    }
  },
  mounted() {
    this.id = this.$route.params.id
    this.getGoodsType()
    this.getTempList()
    this.getGoodsDetail()
  },
  methods: {
    // 获取商品详情
    getGoodsDetail() {
      getGoodsDetail({goodsID:this.id}).then(res => {
        this.form = res.body
        // 粗体设置
        if(this.form.isBlod == 1) {
          this.isBlod = true
        }else {
          this.isBlod = false
        }
        // 最热商品
        if(this.form.isHot == 1) {
          this.isHot = true
        }else {
          this.isHot = false
        }
        // 颜色设置
        document.getElementById('goodsinput').style.color = this.form.color
      })
    },
    // 获取商品类型
    getGoodsType() {
      getGoodsType().then(res => {
        this.goodsTypeList = res.body
      })
    },
    // 获取充值模板
    getTempList() {
      getTempList().then(res => {
        this.tempList = res.body
      })
    },
    // 改变颜色
    changeColor(val) {
      this.color = val
      document.getElementById('goodsinput').style.color = val
    },
    // 改变粗体
    changeBlod(val) {
      if(val) {
        this.form.isBlod = 1
      }else {
        this.form.isBlod = 0
      }
    },
    // 质保天数开关
    changeQualityDay(val) {
      if(!val) {
        this.form.qualityDay = 0
      }
    },
    // 是否热销
    changeHot(val) {
      if(val) {
        this.form.isHot = 1
      }else {
        this.form.isHot = 0
      }
    },
    // 发布商品
    submit() {
      this.$refs['form'].validate((vaild) => {
        if(vaild) {
          this.submitLoading = true
          updateGoods(this.form).then(res => {
            this.submitLoading = false
            this.$message({
              showClose: true,
              message: '发布成功',
              type: 'success',
            });
            this.$router.go(-1)
          }).catch(err => {
            this.submitLoading = false
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  
.container {
  .tips {
    color:#909399;
    font-size:12px;
    line-height:20px;
    width:400px;
  }
  .el-input {
    width:300px;
  }
  .el-textarea {
    width:600px;
  }
  .el-color-picker {
    float:left;
    margin-left:20px;
  }
  .blod-input {
    color:red;
    ::v-deep.el-input__inner{
      font-weight: bold;
    }
  }
}
</style>
<style lang="scss">
  // .goods-container {
  //   .blod-input {
  //     input {
  //       font-weight: bold;
  //     }
  //   }
  // }
</style>
