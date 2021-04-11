
import axios from 'axios'
import api from './request'
import { setToken } from '@/utils/auth'
import { getDatas } from '@/api/price/price-1/common'

const utils = {
  data() {
    return {
      PageSizes: [10, 20, 30, 40],
      PageSize: 10,
      ClassInfo: [
        { label: '产品', value: 1 },
        { label: '资讯', value: 2 },
        { label: '人才', value: 3 },
        { label: '资本', value: 4 },
        { label: '技术', value: 5 },
        { label: '渠道', value: 6 }
      ],
      routesList: []
    }
  },
  methods: {
    // 重启后
    AppStart() {
      this.$store.commit('reset')
    },

    /** 设置全局状态或对象
         *
         * @param  key 设置键值
         * @param  value
         */
    Set(key, value) {
      this.$store.commit('cache', {
        key,
        value
      })
    },

    // 读出 key
    Read(key) {
      var value = this.$store.getters.read(key)
      if (value) {
        return value.data
      } else {
        return null
      }
    },

    /**
         * 时间日期格式化
         * @param format
         * @returns {*}
         */
    DateFormat(dateObj, format) {
      const date = {
        'M+': dateObj.getMonth() + 1,
        'd+': dateObj.getDate(),
        'h+': dateObj.getHours(),
        'm+': dateObj.getMinutes(),
        's+': dateObj.getSeconds(),
        'q+': Math.floor((dateObj.getMonth() + 3) / 3),
        'S+': dateObj.getMilliseconds()
      }
      if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (dateObj.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      for (const k in date) {
        if (new RegExp('(' + k + ')').test(format)) {
          format = format.replace(RegExp.$1, RegExp.$1.length === 1
            ? date[k] : ('00' + date[k]).substr(('' + date[k]).length))
        }
      }
      return format
    },




    getUserTree(){
      console.log('调用了')
      getDatas({},'/user/function/getUserTree').then(res => {
          if(res.code == 1001){
            let powerRoutes = res.body || []
            let arrayData = []
            for(let i = 0; i < powerRoutes.length; i++){
                arrayData.push(powerRoutes[i].functionCode)
                for(let k = 0; k< powerRoutes[i].children.length; k++ ){
                  arrayData.push(powerRoutes[i].children[k].functionCode)
                }
            }
            
            let mainRoutes = this.$router.options.routes
            console.log('mainRoutes', mainRoutes)
            for(let i = 0; i<mainRoutes.length;i++){
              if(!mainRoutes[i].hidden){
                let indexArr = arrayData.indexOf(mainRoutes[i].functionCode);
                if(indexArr==-1){//判断一级目录是否存在
                    mainRoutes[i].hidden = true
                }else{
                  for(let is = 0; is < powerRoutes.length; is++){
                      if(mainRoutes[i].functionCode  == powerRoutes[is].functionCode){
                        if(mainRoutes[i].meta){
                          mainRoutes[i].meta.title = powerRoutes[is].functionName
                        }
                        if(powerRoutes[is].functionCode == 's-home'){//单独处理哈首页
                            mainRoutes[i].children[0].meta.title = powerRoutes[is].functionName
                        }
                      }
                  }
                }
                let childrenData = mainRoutes[i].children
                for(let k = 0; k<childrenData.length;k++){
                    if(!childrenData[k].hidden){
                        let indexArrs = arrayData.indexOf(childrenData[k].functionCode);
                        if(indexArrs==-1){//判断一级目录是否存在
                            childrenData[k].hidden = true
                        }else{
                          for(let ks = 0; ks < powerRoutes.length; ks++){
                              let powerRoutesChildren = powerRoutes[ks].children
                              for(let ksc = 0; ksc < powerRoutesChildren.length; ksc++){
                                if(childrenData[k].functionCode  == powerRoutesChildren[ksc].functionCode){
                                    if(childrenData[k].meta){
                                      childrenData[k].meta.title = powerRoutesChildren[ksc].functionName
                                    }
                                  }
                              }
                          }
                        }
                    }
                }
              }
            }
            
            this.routesList = mainRoutes
          }else{
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error',
            });
          }
      }).catch(err => {
        
      })
    },

  }
}

export default utils
