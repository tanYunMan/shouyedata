<template>
  <div class="dialog">
    <el-form class="add-form" ref="editForm" :model="editForm" label-width="120px">
      <el-form-item label="分类名称">
        <el-input v-model="editForm.catalogName" clearable />
      </el-form-item>
      <el-form-item label="状态">
        <el-switch :active-value='1' :inactive-value='0'  v-model="editForm.state"></el-switch>
      </el-form-item>
      <el-form-item label="排序">
        <el-input type="number" v-model="editForm.sort" clearable />
      </el-form-item>

      <el-form-item>
        <el-button type="primary">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      editForm: {},
    };
  },
  props:['editData'],
  methods:{

  },
  created(){

  },
  mounted(){
    console.log(this.editData)
  }
};
</script>
<style scoped>
.dialog >>> .el-form {
  padding: 0;
}
</style>