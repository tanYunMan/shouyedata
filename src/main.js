import Vue from 'vue'
import moment from 'moment'
moment.locale('zh-cn')
Vue.prototype.$moment = moment

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import '@babel/polyfill'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import vcolorpicker from 'vcolorpicker' //颜色选择的插件
Vue.use(vcolorpicker)

import scroll from 'vue-seamless-scroll'
Vue.use(scroll)

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import utils from '@/utils/public'
Vue.mixin(utils)

//图片放大组件
import VueDirectiveImagePreviewer from 'vue-directive-image-previewer'
import 'vue-directive-image-previewer/dist/assets/style.css'
Vue.use(VueDirectiveImagePreviewer, {
  zIndex: 9999,  //层级显示
  previewSize: 3 //三倍图
})

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
