<template>
<div class="container menu2-1-container">
    <div class="filter-wrap">
        <el-button style="float: right;" type="danger" @click="addDialog=true">添加用户</el-button>
    </div>
    <div class="recevie-wrap">
        <el-table border row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" v-loading="loading" size="mini">
            <el-table-column :show-overflow-tooltip="true" prop="userID" label="编号"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="login" label="登录帐号"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="userName" label="用户名称"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="money" label="金额"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="role" label="角色名">
                <template slot-scope="scope">
                    <span v-if="scope.row.roleVO">{{scope.row.roleVO.roleName || '--'}}</span>
                </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="userState" label="状态">
                <template slot-scope="scope">
                    <span>{{scope.row.userState == 1 ? '正常' : scope.row.userState == 2 ? '禁用' : scope.row.userState == 3 ? '删除' : '--' }}</span>
                </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="label10" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" @click="goSet(scope.row)">添加角色</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>

    <el-dialog :title="title" :visible.sync="userDialog" @closed="closeForm('form')">
        <el-form :model="form" ref="form" :rules="rules" label-width="100px" class="demo-dynamic">
            <el-form-item prop="roleName" label="用户名称:">
                <span style="max-width:350px">{{form.userName}}</span>
            </el-form-item>
            <el-form-item prop="roleID" label="选择角色:">
                <el-select v-model="form.roleID" placeholder="请选择">
                    <el-option v-for="item in roleList" :key="item.roleID" :label="item.roleName" :value="item.roleID">
                    </el-option>
                </el-select>
            </el-form-item>

            <!-- <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="val in roleList" :label="val.roleName" :key="val.roleID">{{val.roleName}}</el-checkbox>
          </el-checkbox-group> -->
            <el-form-item>
                <el-button type="primary" @click="submitForm('form')" :loading="confirmDelLoading">确 认 保 存</el-button>
            </el-form-item>
        </el-form>

    </el-dialog>
    <el-dialog :title="addTitle" :visible.sync="addDialog" @closed="closeForm('addForm')">
        <el-form :model="addForm" ref="addForm" :rules="addRules" label-width="100px" class="demo-dynamic">
            <!-- 
            <el-form-item prop="userType" label="用户类型">
                <el-select v-model="addForm.userType" placeholder="请选择用户类型" style="width: 100%;max-width:350px">
                    <el-option key="1" label="管理用户" value="1"></el-option>
                    <el-option key="2" label="平台用户" value="2"></el-option>
                    <el-option key="3" label="站长用户" value="3"></el-option>
                    <el-option key="4" label="前端用户" value="4"></el-option>
                </el-select>
            </el-form-item>
            -->
            <el-form-item prop="userName" label="用户名称">
                <el-input v-model="addForm.userName" placeholder="请输入用户名称" style="max-width:350px"></el-input>
            </el-form-item>
            <el-form-item prop="login" label="登录账号">
                <el-input v-model="addForm.login" placeholder="请输入登录账号" style="max-width:350px"></el-input>
            </el-form-item>
            <el-form-item prop="password" label="登录密码">
                <el-input v-model="addForm.password" type="password" placeholder="请输入登录密码" style="max-width:350px"></el-input>
            </el-form-item>
            <el-form-item prop="repassword" label="确认密码">
                <el-input v-model="addForm.repassword" type="password" placeholder="请输入确认密码" style="max-width:350px"></el-input>
            </el-form-item>
            <el-form-item prop="qq" label="QQ号码">
                <el-input v-model="addForm.qq" placeholder="请输入QQ号码" style="max-width:350px"></el-input>
            </el-form-item>
            <el-form-item prop="address" label="联系地址">
                <el-input v-model="addForm.address" placeholder="请输入联系地址" style="max-width:350px"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="addUser()" :loading="confirmDelLoading">确 认 保 存</el-button>
            </el-form-item>
        </el-form>

    </el-dialog>

</div>
</template>

<script>
import {
    getList,
    getLists,
    getData,
    getDatas
} from '@/api/price/price-1/common'
export default {
    data() {
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== this.addForm.password) {
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback()
            }
        }
        return {
            isIndeterminate: false,
            checkAll: false,
            checkedCities: [],

            form: {
                roleID: ''
            },
            rules: {
                roleID: [{
                    required: true,
                    message: '请选择角色',
                    trigger: 'blur'
                }, ]
            },
            addRules: {
                // userType: [{
                //     required: true,
                //     message: '请选择用户类型',
                //     trigger: 'blur'
                // }],
                userName: [{
                    required: true,
                    message: '请输入用户名',
                    trigger: 'blur'
                }, ],
                login: [{
                    required: true,
                    message: '请输入登录账号',
                    trigger: 'blur'
                }, {
                    min: 6,
                    message: '长度至少 6 个字符'
                }],
                password: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                }, {
                    min: 6,
                    message: '长度至少 6 个字符'
                }],
                repassword: [{
                    required: true,
                    validator: validatePass2,
                    trigger: 'blur'
                }],
                qq: [{
                    type: 'number',
                    message: '必须为数字值'
                }]
            },
            dialog1: false,
            userDialog: false,
            addDialog: false,
            title: '添加角色',
            addTitle: '添加用户',
            confirmDelLoading: false,
            delId: '',
            loading: false,
            total: 0,
            tableData: [],
            currentPage: 1,
            queryParams: {
                pageNum: 1,
                pageSize: 20
            },
            roleList: [],
            addForm: {}
        }
    },
    mounted() {
        this.getList()
    },
    methods: {

        // handleCheckAllChange(val) {
        //   this.checkedCities = val ? cityOptions : [];
        //   this.isIndeterminate = false;
        // },
        // handleCheckedCitiesChange(value) {
        //   let checkedCount = value.length;
        //   this.checkAll = checkedCount === this.cities.length;
        //   this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
        // },

        // 获取管理员列表
        getList() {
            this.loading = true
            getLists(this.queryParams, '/user/user/pageSite').then(res => {
                if (res.code === 1001) {
                    this.tableData = res.body.records
                    this.total = res.body.total
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
            })
        },

        // 清空form
        closeForm(formName) {
            this.title = '添加角色'
            this.form = {
                roleID: ''
            }
            this.$refs[formName].resetFields();
        },

        // 添加角色
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.confirmDelLoading = true
                    getLists({
                        roleID: this.form.roleID,
                        userID: this.form.userID
                    }, '/user/userRole/saveUserRole').then(res => {
                        if (res.code === 1001) {
                            this.$message({
                                showClose: true,
                                message: res.msg,
                                type: 'success',
                            });
                            this.getList()
                            this.userDialog = false
                        } else {
                            this.$message({
                                showClose: true,
                                message: res.msg,
                                type: 'error',
                            });
                        }
                        this.confirmDelLoading = false
                    }).catch(err => {
                        this.confirmDelLoading = false
                    })
                } else {
                    return false;
                }
            });
        },
        // 添加用户
        addUser() {
            this.$refs.addForm.validate((valid) => {
                if (valid) {
                    this.confirmDelLoading = true
                    getList({
                        ...this.addForm,
                        userType: 3
                    }, '/user/user/add').then(res => {
                        if (res.code === 1001) {
                            this.$message({
                                showClose: true,
                                message: res.msg,
                                type: 'success',
                            });
                            this.getList()
                            this.addDialog = false
                        } else {
                            this.$message({
                                showClose: true,
                                message: res.msg,
                                type: 'error',
                            });
                        }
                        this.confirmDelLoading = false
                    }).catch(err => {
                        this.confirmDelLoading = false
                    })
                } else {
                    return false;
                }
            });
        },

        // 获取可选择的角色
        goSet(data) { //userID:data.userID
            this.form = {
                ...data,
                roleID: ''
            }
            getDatas({}, '/user/role/getRolesByUserID').then(res => {
                if (res.code === 1001) {
                    this.roleList = res.body
                    this.userDialog = true
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
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
    padding: 20px;

    .tips {
        color: #909399;
        font-size: 12px;
        line-height: 20px;
        width: 400px;
        margin-left: 10px;
    }

    .tab-wrap {
        a {
            &.active {
                border-bottom: 2px solid #409eff
            }
        }
    }

    .filter-wrap {
        margin-top: 20px;
        display: flex;
        flex-wrap: wrap;
    }
}

.filter-wrap button {
    // float: right;
    // margin: 10px auto;
    margin-left: auto;
    margin-top: 10px;
    margin-bottom: 10px;
    
}
</style>
