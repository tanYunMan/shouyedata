<template>
  <div>
      <!-- 列表 -->
      <ul>
        <li  v-for="(content,index) in array" :key="index">
          <el-card class="box-card cardContent" @click.native="getNotice(content)"  shadow="hover">
            <div class="title" v-bind:style="{color:content.color}">
              {{content.title}}
            </div>
            <div class="time">
              <i class="el-icon-time"></i>&nbsp&nbsp{{content.time}}
            </div>
            <div class="content">
              {{content.content}}
            </div>
          </el-card>
        </li>
      </ul>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage1"
          :page-size="6"
          background
          layout="total, prev, pager, next"
          :total="pageSize">
        </el-pagination>
      </div>
  </div>
</template>

<script>
import { getLists,getDatas } from '@/api/price/price-1/common'

export default {
  name: 'notice',
  data() {
    return {
      status:false,
      isWidth: false,
      id: '',
      dataInfo: {},
      array:[
        // {
        //   title:'在线实例测试工具在线实例测试工具在线实例测试工具',
        //   time:'2020-01-10',
        //   content:`一寸光阴一寸金，因此，我们为您提供快捷易懂的学习内容。在这里，您可以通过一种易懂的便利的模式获得您需要的任何知识。
        //   一寸光阴一寸金，因此，我们为您提供快捷易懂的学习内容。在这里，您可以通过一种易懂的便利的模式获得您需要的任何知识。
        //   一寸光阴一寸金，因此，我们为您提供快捷易懂的学习内容。在这里，您可以通过一种易懂的便利的模式获得您需要的任何知识。
        //   `
        // },
        // {
        //   title:'在线实例测试工具',
        //   time:'2020-01-10',
        //   content:`一寸光阴一寸金，因此，我们为您提供快捷易懂的学习内容。在这里，您可以通过一种易懂的便利的模式获得您需要的任何知识。
        //   一寸光阴一寸金，因此，我们为您提供快捷易懂的学习内容。在这里，您可以通过一种易懂的便利的模式获得您需要的任何知识。
        //   一寸光阴一寸金，因此，我们为您提供快捷易懂的学习内容。在这里，您可以通过一种易懂的便利的模式获得您需要的任何知识。
        //   `
        // },
        // {
        //   title:'在线实例测试工具',
        //   time:'2020-01-10',
        //   content:`一寸光阴一寸金，因此，我们为您提供快捷易懂的学习内容。在这里，您可以通过一种易懂的便利的模式获得您需要的任何知识。
        //   一寸光阴一寸金，因此，我们为您提供快捷易懂的学习内容。在这里，您可以通过一种易懂的便利的模式获得您需要的任何知识。
        //   一寸光阴一寸金，因此，我们为您提供快捷易懂的学习内容。在这里，您可以通过一种易懂的便利的模式获得您需要的任何知识。
        //   `
        // },
        // {
        //   title:'在线实例测试工具',
        //   time:'2020-01-10',
        //   content:`一寸光阴一寸金，因此，我们为您提供快捷易懂的学习内容。在这里，您可以通过一种易懂的便利的模式获得您需要的任何知识。
        //   一寸光阴一寸金，因此，我们为您提供快捷易懂的学习内容。在这里，您可以通过一种易懂的便利的模式获得您需要的任何知识。
        //   一寸光阴一寸金，因此，我们为您提供快捷易懂的学习内容。在这里，您可以通过一种易懂的便利的模式获得您需要的任何知识。
        //   `
        // },
        // {
        //   title:'在线实例测试工具',
        //   time:'2020-01-10',
        //   content:`一寸光阴一寸金，因此，我们为您提供快捷易懂的学习内容。在这里，您可以通过一种易懂的便利的模式获得您需要的任何知识。
        //   一寸光阴一寸金，因此，我们为您提供快捷易懂的学习内容。在这里，您可以通过一种易懂的便利的模式获得您需要的任何知识。
        //   一寸光阴一寸金，因此，我们为您提供快捷易懂的学习内容。在这里，您可以通过一种易懂的便利的模式获得您需要的任何知识。
        //   `
        // },
        // {
        //   title:'在线实例测试工具',
        //   time:'2020-01-10',
        //   content:`一寸光阴一寸金，因此，我们为您提供快捷易懂的学习内容。在这里，您可以通过一种易懂的便利的模式获得您需要的任何知识。
        //   一寸光阴一寸金，因此，我们为您提供快捷易懂的学习内容。在这里，您可以通过一种易懂的便利的模式获得您需要的任何知识。
        //   一寸光阴一寸金，因此，我们为您提供快捷易懂的学习内容。在这里，您可以通过一种易懂的便利的模式获得您需要的任何知识。
        //   `
        // },
        // {
        //   title:'在线实例测试工具',
        //   time:'2020-01-10',
        //   content:`一寸光阴一寸金，因此，我们为您提供快捷易懂的学习内容。在这里，您可以通过一种易懂的便利的模式获得您需要的任何知识。
        //   一寸光阴一寸金，因此，我们为您提供快捷易懂的学习内容。在这里，您可以通过一种易懂的便利的模式获得您需要的任何知识。
        //   一寸光阴一寸金，因此，我们为您提供快捷易懂的学习内容。在这里，您可以通过一种易懂的便利的模式获得您需要的任何知识。
        //   `
        // },
        // {
        //   title:'在线实例测试工具',
        //   time:'2020-01-10',
        //   content:`一寸光阴一寸金，因此，我们为您提供快捷易懂的学习内容。在这里，您可以通过一种易懂的便利的模式获得您需要的任何知识。
        //   一寸光阴一寸金，因此，我们为您提供快捷易懂的学习内容。在这里，您可以通过一种易懂的便利的模式获得您需要的任何知识。
        //   一寸光阴一寸金，因此，我们为您提供快捷易懂的学习内容。在这里，您可以通过一种易懂的便利的模式获得您需要的任何知识。
        //   `
        // },
        // {
        //   title:'在线实例测试工具',
        //   time:'2020-01-10',
        //   content:`一寸光阴一寸金，因此，我们为您提供快捷易懂的学习内容。在这里，您可以通过一种易懂的便利的模式获得您需要的任何知识。
        //   一寸光阴一寸金，因此，我们为您提供快捷易懂的学习内容。在这里，您可以通过一种易懂的便利的模式获得您需要的任何知识。
        //   一寸光阴一寸金，因此，我们为您提供快捷易懂的学习内容。在这里，您可以通过一种易懂的便利的模式获得您需要的任何知识。
        //   `
        // },
        // {
        //   title:'在线实例测试工具',
        //   time:'2020-01-10',
        //   content:`一寸光阴一寸金，因此，我们为您提供快捷易懂的学习内容。在这里，您可以通过一种易懂的便利的模式获得您需要的任何知识。
        //   一寸光阴一寸金，因此，我们为您提供快捷易懂的学习内容。在这里，您可以通过一种易懂的便利的模式获得您需要的任何知识。
        //   一寸光阴一寸金，因此，我们为您提供快捷易懂的学习内容。在这里，您可以通过一种易懂的便利的模式获得您需要的任何知识。
        //   `
        // },
        // {
        //   title:'在线实例测试工具',
        //   time:'2020-01-10',
        //   content:`一寸光阴一寸金，因此，我们为您提供快捷易懂的学习内容。在这里，您可以通过一种易懂的便利的模式获得您需要的任何知识。
        //   一寸光阴一寸金，因此，我们为您提供快捷易懂的学习内容。在这里，您可以通过一种易懂的便利的模式获得您需要的任何知识。
        //   一寸光阴一寸金，因此，我们为您提供快捷易懂的学习内容。在这里，您可以通过一种易懂的便利的模式获得您需要的任何知识。
        //   `
        // },
        // {
        //   title:'在线实例测试工具',
        //   time:'2020-01-10',
        //   content:`一寸光阴一寸金，因此，我们为您提供快捷易懂的学习内容。在这里，您可以通过一种易懂的便利的模式获得您需要的任何知识。
        //   一寸光阴一寸金，因此，我们为您提供快捷易懂的学习内容。在这里，您可以通过一种易懂的便利的模式获得您需要的任何知识。
        //   一寸光阴一寸金，因此，我们为您提供快捷易懂的学习内容。在这里，您可以通过一种易懂的便利的模式获得您需要的任何知识。
        //   `
        // },
      ],
      //分页
       currentPage1: 1,
       pageSize:0
    }
  },
  created(){
    var w=document.documentElement?document.documentElement.clientWidth:document.body.clientWidth;//先获取窗口宽度
    if(w<750){
      this.isWidth = true
    }
    this.getLists()
  },
  mounted() {
    if (this.$route.params && this.$route.params.id) {
      this.id = this.$route.params.id,
      this.getLists();
    }
  },
  methods: {
    getNotice(per){
      this.$router.push({ path:'/menu1/goNotice/'+per.id})
    },

    // 获取公告详情信息
    getLists(page){
        var page = page || 1;
      getLists({pageNum:page,pageSize:6},'/platform/updateNotice/pageParentNotices').then(res => {
        if (res.code===1001){
            this.currentPage1 = res.body.current;
            this.pageSize = res.body.total;
          this.tableData = res.body.records
          res.body.records.forEach(element => {
              this.array.unshift({
                title:element.title,
                time:element.createTime,
                content:this.Trim(this.getSimpleText(element.content),'g'),
                id:element.updateNoticeID,
                color:element.color

            })
          });
        }
      }).catch(err => {
      })
      
    },

    //去掉所有的空格
    Trim(str,is_global)
    {
        var result;
        result = str.replace(/(^\s+)|(\s+$)/g,"");
        if(is_global.toLowerCase()=="g")
        {
            result = result.replace(/\s/g,"");
        }
        return result;
    },

    //清除所有的标签
    getSimpleText(html){
        var re1 = new RegExp("<.+?>","g");//匹配html标签的正则表达式，"g"是搜索匹配多个符合的内容
        var msg = html.replace(re1,'');//执行替换成空字符
        return msg;
    },

    //分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.array = [];
      this.getLists(val)
    }

  },
}
</script>

<style lang="scss" scoped>
  .content{
    overflow: hidden;
    -webkit-line-clamp: 2;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
  .cardContent{
    cursor: pointer;
  }
  .time{
    color:#999896;
    margin-bottom:10px;
  }
  .title{
    font-size:20px;
    margin-bottom:10px;
    overflow: hidden;
    -webkit-line-clamp: 2;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
  .content{
    color:#878787;
    font-size:15px;
  }
  .box-card{
    width: 60%;
    margin: 30px auto;
  }
  .block{
        text-align: center;
  }
  ul{
      min-height: calc(100vh - 250px);
  }
</style>
