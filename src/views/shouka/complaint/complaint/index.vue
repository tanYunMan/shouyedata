<template>
  <div>
    <div class="search-container">
      <el-form :inline="true" :model="searchForm" >
        <el-form-item>
          <el-select v-model="queryParams.complaintState" clearable placeholder="处理状态">
            <el-option label="未处理" :value="1"></el-option>
            <el-option label="处理中" :value="2"></el-option>
            <el-option label="处理完" :value="3"></el-option>
            <el-option label="已撤销" :value="4"></el-option>
          </el-select>
          <el-select v-model="queryParams.themeName" clearable placeholder="投诉类型">
            <el-option label="无效卡密" value="无效卡密"></el-option>
            <el-option label="虚假商品" value="虚假商品"></el-option>
            <el-option label="非法商品" value="非法商品"></el-option>
            <el-option label="侵权商品" value="侵权商品"></el-option>
            <el-option label="不能购买" value="不能购买"></el-option>
            <el-option label="恐怖色情" value="恐怖色情"></el-option>
            <el-option label="其他投诉" value="其他投诉"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table ref="multipleTable" border row-key="id" :data="tableData" style="width: 100%" :header-cell-style="{background:'#f5f5f5',color:'#606266','text-align':'center'}" size="mini" :cell-style="{'text-align':'center'}" @selection-change="handleSelectionChange">
      <el-table-column :show-overflow-tooltip="true" type="selection" />
      <el-table-column :show-overflow-tooltip="true" prop="themeName" label="投诉主题" width="200"/>
      <el-table-column :show-overflow-tooltip="true" prop="userName" label="投诉客户" />
      <el-table-column :show-overflow-tooltip="true" prop="goodsType" label="商品类型" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.goodsType===1">卡密</span>
          <span v-else>充值</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="goodsType" label="订单号" width="180">
        <template slot-scope="scope">
          <span><a type="primary" style="color:#409eff" @click="orderInfo(scope.row.orderID)">{{ scope.row.order && scope.row.order.orderCode }}</a></span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="type" label="销售类型">
        <template slot-scope="scope">
          <span v-if="scope.row.type===1">平台销售</span>
          <span v-else>对接销售</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="createTime" label="投诉时间"/>
      <el-table-column :show-overflow-tooltip="true" prop="label10" label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="scope.row.complaintState===1" type="text" size="mini" @click="seeComplanitsMessage(scope.row)">未处理</el-button>
          <el-button v-else-if="scope.row.complaintState===2" type="text" size="mini" @click="seeComplanitsMessage(scope.row)">处理中</el-button>
          <el-button v-else type="text" size="mini" @click="seeComplanitsMessage(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background :page-sizes="[10, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />

    <el-dialog
      title="沟通处理"
      :visible.sync="infoDialog"
      width="70%"
      >
      <info />
    </el-dialog>
    <el-dialog
      title="投诉详情"
      :visible.sync="dialogVisibleInfo"
      width="60%"
      class="replyMessageBox"
      :before-close="handleCloseInfo">
      <div class="afterSaleInfo_container">
        <div class="time_box">
            <div class="l_box">
                <img src="../../../../assets/clock_icon.png" alt="">
            </div>
            <div class="r_box">
                <span>投诉沟通倒计时</span>
                <span>{{timeLastTxt}}</span>
            </div>
        </div>
        <div class="order_box" v-if="orderComInfo">
            <div class="title_label_txt">订单信息</div>
            <div class="c_box">
                <div class="l_txt">
                    <span>订单编号：</span>
                    <span>{{orderComInfo.order && orderComInfo.order.orderCode ? orderComInfo.order.orderCode : ''}}</span>
                </div>
                <div class="l_txt">
                    <span>投诉原因：</span>
                    <span>{{orderComInfo.themeName}}</span>
                </div>
                <div class="l_txt l_phone">
                    <span>联系方式：</span>
                    <span>{{orderComInfo.phone}}</span>
                </div>
                <div class="l_txt">
                    <span>投诉时间：</span>
                    <span>{{orderComInfo.createTime}}</span>
                </div>
                <div class="l_txt">
                    <span>投诉状态：</span>
                    <span>{{orderComInfo.complaintState === 1 ? '未处理' : orderComInfo.complaintState === 2 ? '处理中' : orderComInfo.complaintState === 3 ? '处理完毕' : orderComInfo.complaintState === 4 ? '已撤销' : ''}}</span>
                </div>
                <div class="l_txt">
                    <span>投诉结果：</span>
                    <span>{{orderComInfo.isJudg === 1 ? '退款' : orderComInfo.isJudg === 2 ? '不处理' : ''}}</span>
                </div>
            </div>
        </div>
        <div class="leavMessage_box">
            <div class="item_box" v-for="(item, index) in orderComInfo.complaintContentVOList" :key="index">
                <div class="name_box">
                    <span class="name">{{item.complaintType === 1 ? '买家' : item.complaintType === 2 ? '卖家' : item.complaintType === 3 ? '管理员' : item.complaintType === 4 ? '超级管理员' : ''}}</span>
                    <span class="time">{{item.replyTime}}</span>
                </div>
                <div class="txt_box">
                    <span>{{item.content}}</span>
                    <img v-if="item.filePath" @click="toPreviewImgBig(item.filePath)" :src="item.filePath" alt="">
                </div>
            </div>
        </div>
        <div class="admin_make_box">
            <div class="write_message_box">
                <div class="textarea_box">
                    <el-input
                      type="textarea"
                      :rows="6"
                      placeholder="请输入内容"
                      v-model="replyData.content">
                    </el-input>
                </div>
                <div class="img_box">
                    <!-- <el-upload
                      class="avatar-uploader"
                      action="https://jsonplaceholder.typicode.com/posts/"
                      :show-file-list="false"
                      :auto-upload="false"
                      :on-change="changeImgFile"
                      :on-remove="removeImgFile">
                      <img v-if="imageUrl" :src="imageUrl" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload> -->
                    <Upload v-if="imgLoading" :img-list="replyData.filePath" img-name="发卡投诉回复图片" @listenTochildEvent="showMessageFromChild" />
                </div>
            </div>
            <div class="btn_box">
                <el-button type="primary" @click="sendMessageNow">发送内容</el-button>
            </div>
        </div>
    </div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleInfo = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisibleInfo = false">确 定</el-button>
      </span> -->
    </el-dialog>
    <el-dialog
      title="图片预览"
      :visible.sync="showBigImgStatus"
      width="50%"
      class="imgDialogMaskBox"
      :before-close="handleClosePreviewBox">
      <img class="previewImg" :src="previewSrcImg" alt="">
    </el-dialog>
  </div>
</template>

<script>
import info from '../info'
import { getList, getLists, getData, getDatas } from '@/api/price/price-1/common'
import Upload from '@/components/Upload'

export default {
  data() {
    return {
      loading: false,
      searchForm: {},
      infoDialog: false,
      tableData: [],
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        themeName: '',
        complaintState: '',
        saleSource: 2
      },
      dialogVisibleInfo: false,
      orderComInfo: '',
      timeLastTxt: '',
      replyData: {
        content: '',
        filePath: ''
      },
      imageUrl: '',
      imgFileSub: '',
      startTime: '',
      previewSrcImg: '',
      showBigImgStatus: false,
      timeInterval: '',
      selectOrderItem: '',
      imgLoading: true
    };
  },
  components: {
    info,
    Upload
  },
  created () {
    if (this.$route.query.typeJump) {
      this.queryParams.complaintState = 1
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    toHandle() {
      this.infoDialog = true
    },
    search() {
      console.log(this.queryParams)
      this.getList()
    },
    showMessageFromChild (str) {
      this.replyData.filePath = str
    },
    // 获取订单投诉列表
    getList() {
      this.loading = true
      // if (!this.queryParams.ThemeName) {
      //   delete this.queryParams.ThemeName
      // }
      getLists(this.queryParams, '/order/complaint/complaintPage').then(res => {
        if (res.code === 1001) {
          res.body.records.map(item => {
            if (item.complaintState === 1) {
              item.complaintStatecontent = '未处理'
            } else if (item.complaintState === 2) {
              item.complaintStatecontent = '已处理'
            } else {
              item.complaintStatecontent = '处理完毕'
            }
          })
          this.tableData = res.body.records
          this.total = res.body.total
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getList()
    },
    handleCloseInfo () {
      this.dialogVisibleInfo = false
    },
    changeImgFile (file) {
        console.log(file)
        this.imgFileSub = file.raw
        this.imageUrl = URL.createObjectURL(file.raw);
    },
    removeImgFile (file) {
        this.imgFileSub = ''
    },
    sendMessageNow () {
        if (this.replyData.content === '') {
            Message.error('请先填写回复内容')
            return
        }
        this.submitUserMessage()
    },
    async submitUserMessage () {
          let file = new FormData()
          file.append('complaintID', this.orderComInfo.complaintID)
          file.append('content', this.replyData.content)
          if (this.replyData.filePath) {
            file.append('filePath', this.replyData.filePath)
          }
          getList(file,'/order/complaintContent/saveSeller').then(res => {
            console.log(res)
            if (res.code === 1001) {      
               this.$message.success(res.msg)
               this.getOrderComInfo()
               this.replyData.content = ''
               this.replyData.filePath = ''
               this.imgLoading = false
               setTimeout(() => {
                 this.imgLoading = true
               }, 30)
               this.imgFileSub = ''
               this.imageUrl = ''
            } else {
              this.$message.error(res.msg)
            }
          }).catch(err => {
            console.log(err)
            this.$message.error(err.msg)
          })
        },
        seeComplanitsMessage (item) {
          this.selectOrderItem = item
          this.getOrderComInfo()
        },
        getOrderComInfo () {
          getData({id: this.selectOrderItem.complaintID},'/order/complaint/getComplaint').then(res => {
                console.log(res)
                 if (res.code === 1001 && res.body) {
                    console.log(res.body)
                    this.orderComInfo = res.body
                    this.startTime = res.body.createTime
                    this.dialogVisibleInfo = true
                    this.replyData.content = ''
                    this.replyData.filePath = ''
                    this.imgLoading = false
                    setTimeout(() => {
                      this.imgLoading = true
                    }, 30)
                    this.imgFileSub = ''
                    this.imageUrl = ''
                    console.log()
                    let oneDayTime = 1000 * 60 * 60 * 24
                    console.log(oneDayTime)
                    console.log(new Date().getTime() - new Date(res.body.createTime).getTime())
                    if ((new Date().getTime() - new Date(res.body.createTime).getTime()) < oneDayTime) {
                        this.timeInterval = setInterval(() => {
                            let time = (new Date().getTime() - new Date(this.startTime).getTime())
                            this.timeLastTxt = this.formatDuring(oneDayTime - time)
                        }, 1000)
                    } else {
                        this.timeLastTxt = '00天00时00分00秒'
                        clearInterval(this.timeInterval)
                    }
                }
            }).catch(err => {
                console.log(err)
            })
        },
        toPreviewImgBig (src) {
            this.previewSrcImg = src
            this.showBigImgStatus = true
        },
        handleClosePreviewBox () {
            this.showBigImgStatus = false
        },
        formatDuring(mss) {
            var days = parseInt(mss / (1000 * 60 * 60 * 24));
            var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = parseInt((mss % (1000 * 60)) / 1000);
            return days + " 天 " + hours + " 小时 " + minutes + " 分钟 " + seconds + " 秒 ";
        },
  }
};
</script>

<style lang="scss">
.search-container {
  .el-form {
    padding: 0;
  }
}

.replyMessageBox {
  .el-dialog {
    max-width: 800px;
  }
}

.afterSaleInfo_container {
    box-sizing: border-box;
    background: #fff;
    .time_box {
        padding-bottom: 10px;
        border-bottom: 1px solid #D8D8D8;
        display: flex;
        .l_box {
            img {
                height: 40px;
                width: 40px;
                display: block;
                margin-right: 20px;
            }
        }
        .r_box {
            flex: 1;
            overflow: hidden;
            span {
                height: 20px;
                line-height: 20px;
                font-size: 14px;
                color: black;
                display: inline-block;
                width: 100%;
            }
            span:last-child {
                color: #F56C6C;
                font-size: 16px;
            }
        }
    }
    .order_box {
        padding-bottom: 10px;
        border-bottom: 1px solid #D8D8D8;
        .title_label_txt {
            height: 30px;
            line-height: 30px;
            font-size: 15px;
            font-weight: bold;
            color: black;
        }
        .c_box {
            .l_txt {
                span {
                    height: 25px;
                    line-height: 25px;
                    font-size: 14px;
                    color: #D8D8D8;
                    display: inline-block;
                }
            }
            .l_txt.l_phone {
                span:last-child {
                    color: blue;
                }
            }
        }
    }
    .leavMessage_box {
        max-height: 500px;
        overflow-y: auto;
        border-bottom: 1px solid #D8D8D8;
        padding-top: 10px;
        .item_box {
            margin-bottom: 20px;
            .name_box {
                display: flex;
                align-items: center;
                margin-bottom: 5px;
                .name {
                    height: 20px;
                    line-height: 20px;
                    padding: 0 5px;
                    border-radius: 3px;
                    background: #bbbfff;
                    margin-right: 20px;
                    font-size: 14px;
                    color: #fff;
                }
                .name.admin_people {
                    background: #F56C6C;
                }
                .time {
                    height: 20px;
                    line-height: 20px;
                    font-size: 14px;
                    color: black;
                }
            }
            .txt_box {
                padding: 10px;
                box-sizing: border-box;
                background: #F1F1F1;
                img {
                    width: 100px;
                    height: 100px;
                    display: block;
                    cursor: pointer;
                    margin-top: 10px;
                }
                span {
                    line-height: 20px;
                    font-size: 14px;
                }
            }
        }
    }
    .admin_make_box {
        padding-top: 10px;
        .write_message_box {
            .textarea_box {
                margin-bottom: 5px;
            }
            .img_box {
                margin-bottom: 20px;
            }
        }
        .btn_box {
            .el-button {
                width: 100%;
                margin-bottom: 15px;
                margin-right: 0;
                margin-left: 0;
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
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
}

.imgDialogMaskBox {
        .el-dialog {
            max-width: 800px;
            .previewImg {
                width: 100%;
                display: block;
            }
        }
    }
</style>