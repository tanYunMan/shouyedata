<template>
  <div class="container">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>角色权限配置</span>
          <div style="float: right;">角色名称：<span style="color:#F56C6C">{{form.name}}</span></div>
        </div>

        <el-form ref="form" :model="form" label-width="100px">
            <div v-for="(item,index) in listData" :key="index">
                <el-form-item :label="item.functionName">
                  <el-checkbox :indeterminate="item.isIndeterminate" v-model="item.itemCheckAll" @change="handleCheckAllChange($event,item,index)"></el-checkbox>
                  <div style="margin: 15px 0;"></div>
                  <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange($event,item,index)">
                    <el-checkbox v-for="val in item.children" :label="val.functionID" :key="val.functionID">{{val.functionName}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
            </div>


            <el-form-item>
              <el-button type="primary" @click="savePower" :loading="confirmLoading">保存权限</el-button>
              <el-button @click="checkAllPower" v-if="!isAllChecked">全部勾选</el-button>
              <el-button @click="cancelAllPower" type="danger" v-else>全部取消</el-button>
            </el-form-item>
        </el-form>

      </el-card>

  </div>
</template>

<script>
import { getLists,getDatas } from '@/api/price/price-1/common'
export default {
  data() {
    return {
      type:1,
      color:'#333',
      form:{},
      checkAll: false,// 局部全选
      checkedCities: [],// 选择
      checkList:[],
      listData:[],
      roleData:[],//角色权限
      multipleSelection: [],
      confirmLoading:false,
      isAllChecked: false,
    }
  },
  mounted() {
    if (this.$route.params && this.$route.params.roleID) {
      this.form = {
        roleID:this.$route.params.roleID,
        name: this.$route.params.name
      }
      this.getByRoleID();
    }
  },
  methods: {
    // 获取角色权限
    getByRoleID() {
      getDatas({roleID:this.form.roleID},'/user/function/getByRoleID').then(res => {
        if (res.code===1001){
            this.roleData = res.body ? res.body : []
            this.roleData.map((item)=>{
              this.checkedCities.push(item.functionID)
            })
          this.getList()
        }else{
          setTimeout(()=>{
            this.getList()
          },1000)
        }
      }).catch(err => {

      })
    },
    
    // 获取权限树
    getList() {
      getDatas({},'/user/function/tree').then(res => {
        if (res.code===1001){
          let thisData =  res.body
          //this.listData = res.body
          thisData.map((item)=>{
              item.isIndeterminate = false   //是否只负责控制样式
              item.itemCheckAll = false      // 分支是否全选
          })
          this.listData = thisData
          // 去渲染
          this.goShow()
        }
      }).catch(err => {

      })
    },
    //渲染
    goShow(){
        let Array1 = this.listData;
        let Array2 = this.checkedCities
        Array1.map((item,index)=>{
          if(item.children.length==0){
            //查看是否存在
            let thisIndex = this.checkedCities.indexOf(item.functionID);
            if(thisIndex!=-1){
                item.itemCheckAll = true
            }
          }else{
            //进入时初始渲染
            this.handleCheckedCitiesChange(this.checkedCities,item,index)
          }
        })
    },


    // 局部全选
    handleCheckAllChange(data,item,index) {
       let thisData = item.children
       if(data){//全选
          this.checkedCities.push(item.functionID)
          if(thisData.length>0){
              thisData.map((val)=>{
                  this.checkedCities.push(val.functionID)
              })
          }
        }else{//全取消勾选
          thisData.map((val)=>{
              let thisIndex = this.checkedCities.indexOf(val.functionID);
              
              if(thisIndex!=-1){
                  this.checkedCities.splice(thisIndex,1)
              }
          })
        }
      this.checkedCities = Array.from(new Set(this.checkedCities))  //ES6 去重
    },

    // 剔除  勾选
    handleCheckedCitiesChange(data,item,index) {
        //判断当前是否还有子集被勾选
        let thisData = item.children
        let checkTrue = [],checkFalse=[]
        for (var i = 0; i < thisData.length; i++) {
            let thisIndex = this.checkedCities.indexOf(thisData[i].functionID);
            if(thisIndex==-1){
              checkFalse.push(i)
            }else{
              checkTrue.push(i)
            }
            if(checkTrue.length==0 && checkFalse.length == thisData.length){
              this.listData[index].itemCheckAll = false
              this.listData[index].isIndeterminate = false
            }else if(checkTrue.length>0 && checkFalse.length>0){
              this.listData[index].itemCheckAll = false
              this.listData[index].isIndeterminate = true
            }else{
              this.listData[index].itemCheckAll = true
              this.listData[index].isIndeterminate = false
            }
        }
    },


    // 保存权限
    savePower(){
      this.checkedCities = Array.from(new Set(this.checkedCities))  //ES6 去重
      this.confirmLoading = true
      getLists({roleID:this.form.roleID,functionID:this.checkedCities},'/user/roleFunction/saveRoleFunction').then(res => {
        if (res.code===1001){
          this.$message({
            message: res.msg,
            type: 'success',
          });
          setTimeout(()=>{
            this.confirmLoading = false
          },1000)
          this.getByRoleID();
          this.$router.push({path:'/menu9/4'})
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'error',
          });
          setTimeout(()=>{
            this.confirmLoading = false
          },1000)
        }
      }).catch(err => {

      })
    },

    // 选中所有
    checkAllPower(){
        this.checkedCities = []
        this.listData.map((item)=>{
          item.itemCheckAll = true
          item.children.map((items)=>{
            this.checkedCities.push(items.functionID)
          })
          this.checkedCities.push(item.functionID)
        })
        this.isAllChecked = true
    },

    // 全部取消
    cancelAllPower() {
      this.checkedCities = []
      this.isAllChecked = false
      this.listData.map((item)=>{
        item.itemCheckAll = false
        item.isIndeterminate = false
      })
    }


    

  }
}
</script>

<style scoped lang="scss">
.container {
 
}
</style>

