
import Layout from '@/layout'
export default [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    functionCode: 's-home',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        functionCode: 's-home',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '网站首页', icon: 'icon0' }
      }
    ],
    icon: require('../assets/icon/sy.png'),
    meta: { title: '', icon: '' }
  },
  {
    path: '/topNav',
    component: Layout,
    redirect: '/outOfStock',
    children: [
      {
        path: 'outOfStock',
        name: 'outOfStock',
        hidden: true,
        component: () => import('@/views/goods/outStock'),
        meta: { title: '断货商品', icon: 'icon0' }
      }
    ],
    meta: { title: '断货商品', icon: 'icon0' }
  },
  // 平台服务
  /* {
    path: '/platform',
    component: Layout,
    redirect: '/platform/1',
    meta: { title: '平台管理', icon: 'icon3' },
    alwaysShow:true,
    children: [
      {
        path: '1',
        name: 'website',
        component: () => import('@/views/platform/website/list'),
        meta: { title: '站点管理', icon: '' }
      },
      {
        path: '2',
        name: 'buySite',
        component: () => import('@/views/platform/buySite/list'),
        meta: { title: '站点购买', icon: '' }
      },
      {
        path: '3',
        name: 'net',
        component: () => import('@/views/platform/net/list'),
        meta: { title: '域名管理（二级）', icon: '' }
      },
      {
        path: '4',
        name: 'siteEdition',
        component: () => import('@/views/platform/siteEdition/list'),
        meta: { title: '站点版本管理', icon: '' }
      },
      {
        path: '5',
        name: 'Versioning',
        component: () => import('@/views/platform/Versioning/list'),
        meta: { title: '平台版本管理', icon: '' }
      }
    ]
  },*/
  // 网站设置
  {
    path: '/menu1',
    component: Layout,
    redirect: '/menu1/1',
    name: 'menu1',
    functionCode: 's-set',
    meta: { title: '网站设置', icon: 'icon1' },
    icon: require('../assets/icon/sz.png'),
    children: [
      {
        path: 'sub1',
        name: 'menu111',
        functionCode: 's-set-base',
        component: () => import('@/views/menu1/menu1-1/sub1'),
        meta: { title: '基本信息', icon: '' }
        // hidden:true
      },
      {
        path: 'sub2',
        name: 'menu222',
        component: () => import('@/views/menu1/menu1-1/sub2'),
        meta: { title: '', icon: '' },
        hidden: true
      },
      {
        path: 'sub3',
        name: 'menu333',
        functionCode: 's-set-advertImg',
        component: () => import('@/views/menu1/menu1-1/sub3'),
        meta: { title: '广告图片', icon: '' }
        // hidden:true
      },
      {
        path: 'sub7',
        name: 'menu777',
        functionCode: 's-set-faka',
        component: () => import('@/views/menu1/menu1-1/sub7'),
        meta: { title: '发卡网设置', icon: '' }
        // hidden:true
      },
      // {
      //   path: '1',
      //   name: 'menu11',
      //   redirect: '/menu1/1/sub1',
      //   functionCode: 's-set',
      //   component: () => import('@/views/menu1/menu1-1/index'),
      //   meta: { title: '装修设置', icon: '' },
      //   children: [
      //     {
      //       path: 'sub1',
      //       name: 'menu111',
      //       component: () => import('@/views/menu1/menu1-1/sub1'),
      //       meta: { title: '', icon: '' },
      //       hidden:true
      //     },
      //     {
      //       path: 'sub2',
      //       name: 'menu222',
      //       component: () => import('@/views/menu1/menu1-1/sub2'),
      //       meta: { title: '', icon: '' },
      //       hidden:true
      //     },
      //     {
      //       path: 'sub3',
      //       name: 'menu333',
      //       component: () => import('@/views/menu1/menu1-1/sub3'),
      //       meta: { title: '', icon: '' },
      //       hidden:true
      //     },
      //     /*{
      //       path: 'sub4',
      //       name: 'menu444',
      //       component: () => import('@/views/menu1/menu1-1/sub4'),
      //       meta: { title: '', icon: '' },
      //       hidden:true
      //     },*/
      //     {
      //       path: 'sub5',
      //       name: 'menu555',
      //       component: () => import('@/views/menu1/menu1-1/sub5'),
      //       meta: { title: '', icon: '' },
      //       hidden:true
      //     },
      //     {
      //       path: 'sub6',
      //       name: 'menu666',
      //       component: () => import('@/views/menu1/menu1-1/sub6'),
      //       meta: { title: '', icon: '' },
      //       hidden:true
      //     },
      //     {
      //       path: 'sub7',
      //       name: 'menu777',
      //       component: () => import('@/views/menu1/menu1-1/sub7'),
      //       meta: { title: '', icon: '' },
      //       hidden:true
      //     }
      //   ]
      // },
      {
        path: 'goNotice/:id',
        name: 'goNotice',
        component: () => import('@/views/dashboard/notice'),
        meta: { title: '', icon: '' },
        hidden: true
      },
      {
        path: 'listNotice',
        name: 'listNotice',
        component: () => import('@/views/dashboard/listNotice'),
        meta: { title: '', icon: '' },
        hidden: true
      },
      {
        path: '11',
        name: 'menu1111',
        functionCode: 's-set-style',
        component: () => import('@/views/menu1/menu1-1/sub2'),
        meta: { title: '系统风格', icon: '' }
      },
      {
        path: '8',
        name: 'menu18',
        functionCode: 's-set-friendLink',
        component: () => import('@/views/menu1/menu1-1/sub4'),
        meta: { title: '友情链接', icon: '' }
      },
      {
        path: '9',
        name: 'menu19',
        functionCode: 's-set-online',
        component: () => import('@/views/menu1/menu1-1/sub5'),
        meta: { title: '在线客服', icon: '' }
      },
      {
        path: '10',
        name: 'menu110',
        functionCode: 's-set-decoration',
        component: () => import('@/views/menu1/menu1-1/sub6'),
        meta: { title: '装修代码', icon: '' }
      },
      {
        path: '12',
        name: 'menu23',
        functionCode: 's-set-customMenu',
        component: () => import('@/views/menu1/menu1-1/sub8'),
        meta: { title: '自定义菜单', icon: '' }
      },
      {
        path: '3',
        name: 'menu13',
        functionCode: 's-set-site',
        component: () => import('@/views/menu1/menu1-3/sub1'),
        meta: { title: '商户基本信息', icon: '' }
      },
      /* {
        path: '4',
        name: 'menu14',
        component: () => import('@/views/menu1/menu1-4/sub1'),
        meta: { title: '对接设置', icon: '' },
      },*/
      {
        path: '5',
        name: 'menu15',
        functionCode: 's-set-pay',
        component: () => import('@/views/menu1/menu1-5/sub1'),
        meta: { title: '支付通道设置', icon: '' }
      },
      {
        path: '2',
        name: 'menu12',
        redirect: '/menu1/2/sub1',
        functionCode: 's-set-system',
        component: () => import('@/views/menu1/menu1-2/index'),
        meta: { title: '系统设置', icon: '' },
        children: [
          {
            path: 'sub1',
            name: 'menu121',
            component: () => import('@/views/menu1/menu1-2/sub1'),
            meta: { title: '', icon: '' },
            hidden: true
          },
          {
            path: 'sub2',
            name: 'menu122',
            component: () => import('@/views/menu1/menu1-2/sub2'),
            meta: { title: '', icon: '' },
            hidden: true
          },
          {
            path: 'sub3',
            name: 'menu123',
            component: () => import('@/views/menu1/menu1-2/sub3'),
            meta: { title: '', icon: '' },
            hidden: true
          }
        ]
      }
      /* {
        path: '6',
        name: 'menu16',
        component: () => import('@/views/menu1/menu1-6/sub1'),
        meta: { title: '管理员设置', icon: '' },
      },
      {
        path: '7',
        name: 'menu17',
        component: () => import('@/views/menu1/menu1-7/sub1'),
        meta: { title: '管理权限设置', icon: '' },
      },*/
    ]
  },

  // 充值方式
  // {
  //   path: '/recharge',
  //   component: Layout,
  //   redirect: '/recharge/way',
  //   functionCode: "a-recharge",
  //   meta: { title: '充值方式管理', icon: 'eye-open' },
  //   children: [
  //     {
  //       path: 'way',
  //       name: 'rechargeWay',
  //       component: () => import('@/views/recharge/way'),
  //       functionCode: "a-recharge-mode",
  //       meta: { title: '充值方式' }
  //     },
  //     {
  //       path: 'interface',
  //       name: 'rechargeInterface',
  //       component: () => import('@/views/recharge/interface'),
  //       functionCode: "a-recharge-attr",
  //       meta: { title: '充值接口' }
  //     },
  //     {
  //       path: 'rate',
  //       name: 'rateMaster',
  //       component: () => import('@/views/recharge/rate'),
  //       functionCode: "a-recharge-rate",
  //       meta: { title: '充值费率' }
  //     }
  //   ]
  // },

  // 网站营销
  {
    path: '/menu11',
    component: Layout,
    redirect: '/menu11/1',
    name: 'meun11',
    functionCode: 's-operate',
    meta: { title: '网站营销', icon: 'icon2' },
    icon: require('../assets/icon/yy.png'),
    alwaysShow: true,
    children: [
      {
        path: '1',
        name: 'menu111',
        functionCode: 's-operate-notice',
        component: () => import('@/views/menu11/menu11-1/index'),
        meta: { title: '系统公告', icon: '' }
      },
      {
        path: '2',
        name: 'menu112',
        functionCode: 's-operate-tips',
        component: () => import('@/views/menu11/menu11-2/index'),
        meta: { title: '登录提示', icon: '' }
      },
      {
        path: '3',
        name: 'menu113',
        functionCode: 's-operate-domain',
        component: () => import('@/views/menu11/menu11-3/index'),
        meta: { title: '域名管理', icon: '' }
      }
    ]
  },

  // 商品管理
  {
    path: '/menu3',
    component: Layout,
    redirect: '/menu3/1',
    name: 'menu3',
    functionCode: 's-goods',
    meta: { title: '商品管理', icon: 'icon3' },
    icon: require('../assets/icon/sp.png'),
    children: [
      {
        path: '1',
        name: 'menu31',
        functionCode: 's-goods-catalog',
        component: () => import('@/views/menu3/menu3-1/index'),
        meta: { title: '目录管理', icon: '' }
      },
      {
        path: '8',
        name: 'menu38',
        functionCode: 's-goods-recommendCatalog',
        component: () => import('@/views/menu3/menu3-8/index'),
        meta: { title: '推荐目录', icon: '' }
      },
      {
        path: '2',
        name: 'menu32',
        functionCode: 's-goods-self',
        component: () => import('@/views/menu3/menu3-2/index'),
        meta: { title: '平台自营商品', icon: '' }
      },
      {
        path: '2/add',
        name: 'menu32add',
        hidden: true,
        component: () => import('@/views/menu3/menu3-2/add'),
        meta: { title: '添加商品', icon: '' }
      },
      {
        path: '2/detail/:id',
        name: 'menu32detail',
        hidden: true,
        component: () => import('@/views/menu3/menu3-2/detail'),
        meta: { title: '编辑商品', icon: '' }
      },
      {
        path: '3',
        name: 'menu33',
        functionCode: 's-goods-supplier',
        component: () => import('@/views/menu3/menu3-3/index'),
        meta: { title: '商家供货商品', icon: '' }
      },
      {
        path: '3/detail',
        name: 'menu33detail',
        hidden: true,
        component: () => import('@/views/menu3/menu3-3/detail'),
        meta: { title: '商品信息', icon: '' }
      },
      {
        path: '4',
        name: 'menu34',
        functionCode: 's-goods-join',
        component: () => import('@/views/menu3/menu3-4/index'),
        meta: { title: '对接商品', icon: '' }
      },
      {
        path: '4/detail/:id',
        name: 'menu34detail',
        hidden: true,
        component: () => import('@/views/menu3/menu3-4/detail'),
        meta: { title: '编辑商品', icon: '' }
      },
      {
        path: '5',
        name: 'menu35',
        functionCode: 's-goods-temp',
        component: () => import('@/views/menu3/menu3-5/index'),
        meta: { title: '商品模板', icon: '' }
      },
      {
        path: '6',
        name: 'menu36',
        functionCode: 's-goods-secretPrice',
        component: () => import('@/views/menu3/menu3-6/index'),
        meta: { title: '商品秘价', icon: '' }
      },
      {
        path: '7',
        name: 'menu37',
        functionCode: 's-goods-import',
        component: () => import('@/views/menu3/menu3-7/index'),
        meta: { title: '导卡记录', icon: '' }
      },
      {
        path: '9',
        name: 'menu39',
        functionCode: 's-goods-recommendGoods',
        component: () => import('@/views/menu3/menu3-9/index'),
        meta: { title: '推荐商品', icon: '' }
      }
    ]
  },
  // 网站运营
  /* {
    path: '/menu2',
    component: Layout,
    redirect: '/menu2/1',
    name:'meun2',
    meta: { title: '网站运营', icon: 'icon2' },
    alwaysShow:true,
    children: [
      {
        path: '1',
        name: 'menu21',
        component: () => import('@/views/menu2/menu2-1/index'),
        meta: { title: '公告管理', icon: '' }
      },
      {
        path: '2',
        name: 'menu22',
        component: () => import('@/views/menu2/menu2-2/index'),
        meta: { title: '短信管理', icon: '' }
      },
      {
        path: '3',
        name: 'menu23',
        component: () => import('@/views/menu2/menu2-3/index'),
        meta: { title: '日志查询', icon: '' }
      },
      {
        path: '4',
        name: 'menu24',
        component: () => import('@/views/menu2/menu2-4/index'),
        meta: { title: '域名管理', icon: '' }
      }
    ]
  },*/
  // 卡密管理
  {
    path: '/cardPAge',
    component: Layout,
    redirect: '/cardPAge/list',
    functionCode: 's-card',
    meta: { title: '卡密管理', icon: 'icon3' },
    icon: require('../assets/icon/km.png'),
    alwaysShow: true,
    children: [
      {
        path: 'list',
        name: 'cardList',
        functionCode: 's-card-card',
        component: () => import('@/views/recordList/recordList-1/list'),
        meta: { title: '卡密库存', icon: '' }
      },
      {
        path: 'pageRecord',
        name: 'recordList',
        functionCode: 's-card-history',
        component: () => import('@/views/recordList/recordList-2/list'),
        meta: { title: '卡密销售记录', icon: '' }
      },
      {
        path: 'rubbish',
        name: 'rubbishList',
        functionCode: 's-card-recover',
        component: () => import('@/views/recordList/rubbishList'),
        meta: { title: '卡密回收站', icon: '' }
      }
    ]
  },


  // 价格管理
  {
    path: '/price',
    component: Layout,
    redirect: '/price/1',
    functionCode: 's-price',
    meta: { title: '价格管理', icon: 'icon3' },
    icon: require('../assets/icon/jg.png'),
    alwaysShow: true,
    children: [
      {
        path: '1',
        name: 'website',
        functionCode: 's-price-group',
        component: () => import('@/views/price/price-1/list'),
        meta: { title: '等级价格组', icon: '' }
      },
      {
        path: '2',
        name: 'buySite',
        functionCode: 's-price-range',
        component: () => import('@/views/price/price-2/list'),
        meta: { title: '范围定价', icon: '' }
      }
      /* {
        path: '3',
        name: 'net',
        component: () => import('@/views/price/price-3/list'),
        meta: { title: '等级分组价格', icon: '' }
      }*/
    ]
  },
  // {
  //   path: '/subsite',
  //   component: Layout,
  //   redirect: '/subsite/site',
  //   functionCode: "s-subsite",
  //   meta: { title: '分站管理', icon: 'icon3' },
  //   icon:require('../assets/icon/jg.png'),
  //   alwaysShow:true,
  //   children: [
  //     {
  //       path: 'site',
  //       name: 'site',
  //       functionCode: "s-subsite-site",
  //       component: () => import('@/views/price/price-1/list'),
  //       meta: { title: '分站列表', icon: '' }
  //     },
  //     {
  //       path: 'sale',
  //       name: 'sale',
  //       functionCode: "s-subsite-sale",
  //       component: () => import('@/views/price/price-2/list'),
  //       meta: { title: '分站销售排行', icon: '' }
  //     },
  //     {
  //       path: 'quota',
  //       name: 'quota',
  //       functionCode: "s-subsite-quota",
  //       component: () => import('@/views/price/price-2/list'),
  //       meta: { title: '额度购买', icon: '' }
  //     }
  //   ]
  // },
  // 进货管理
  {
    path: '/menu4',
    component: Layout,
    redirect: '/menu4/1',
    functionCode: 's-join',
    meta: { title: '进货管理', icon: 'icon4' },
    icon: require('../assets/icon/jh.png'),
    alwaysShow: true,
    children: [
      {
        path: '1',
        name: 'menu41',
        hidden: true,
        component: () => import('@/views/menu4/menu4-1/index'),
        meta: { title: '平台对接', icon: '' }
      },
      {
        path: '4',
        name: 'menu44',
        functionCode: 's-join-site',
        component: () => import('@/views/menu4/menu4-4/index'),
        meta: { title: '全网通对接站点', icon: '' }
      },
      {
        path: '5',
        name: 'menu55',
        functionCode: 's-join-goods',
        component: () => import('@/views/menu4/menu4-5/index'),
        meta: { title: '全网通对接商品', icon: '' }
      },
      {
        path: '1/sub1',
        name: 'menu41sub1',
        hidden: true,
        component: () => import('@/views/menu4/menu4-1/sub1'),
        meta: { title: '目录列表', icon: '' }
      },
      {
        path: '4/sub1/:id',
        name: 'menu44sub1',
        hidden: true,
        component: () => import('@/views/menu4/menu4-4/sub1'),
        meta: { title: '目录列表', icon: '' }
      },
      {
        path: '3/sub1/:id',
        name: 'menu33sub1',
        hidden: true,
        component: () => import('@/views/menu4/menu4-3/sub1'),
        meta: { title: '目录列表', icon: '' }
      },
      {
        path: '1/sub2',
        name: 'menu41sub2',
        hidden: true,
        component: () => import('@/views/menu4/menu4-1/sub2'),
        meta: { title: '一建克隆', icon: '' }
      },
      {
        path: '2',
        name: 'menu42',
        hidden: true,
        component: () => import('@/views/menu4/menu4-2/index'),
        meta: { title: '一键通对接', icon: '' }
      },
      {
        path: '3',
        name: 'menu43',
        functionCode: 's-join-sites',
        component: () => import('@/views/menu4/menu4-3/index'),
        meta: { title: '对接商户管理', icon: '' }
      }
    ]
  },
  // 供货管理
  // {
  //   path: '/menu5',
  //   component: Layout,
  //   redirect: '/menu5/1',
  //   meta: { title: '供货管理', icon: 'icon5' },
  //   // alwaysShow:true,
  //   children: [
  //     {
  //       path: '1',
  //       name: 'menu51',
  //       component: () => import('@/views/menu5/menu5-1/index'),
  //       meta: { title: '供货管理', icon: '' }
  //     },

  //   ]
  // },
  // 订单管理
  {
    path: '/menu8',
    component: Layout,
    redirect: '/menu8/1',
    functionCode: 's-order',
    meta: { title: '订单管理', icon: 'icon8' },
    icon: require('../assets/icon/dd.png'),
    alwaysShow: true,
    children: [
      {
        path: '6',
        name: 'menu86',
        functionCode: 's-order-all',
        component: () => import('@/views/menu8/menu8-6/index'),
        meta: { title: '所有订单', icon: '' }
      },
      {
        path: '1',
        name: 'menu81',
        functionCode: 's-order-order',
        component: () => import('@/views/menu8/menu8-1/index'),
        meta: { title: '直销销售记录', icon: '' }
      },
      {
        path: '2',
        name: 'menu82',
        functionCode: 's-order-join',
        component: () => import('@/views/menu8/menu8-2/index'),
        meta: { title: '对接销售记录', icon: '' }
      },
      // {
      //   path: '3',
      //   name: 'menu83',
      //   component: () => import('@/views/menu8/menu8-3/index'),
      //   meta: { title: '手工订单处理', icon: '' }
      // },
      {
        path: '4',
        name: 'menu84',
        functionCode: 's-order-complaint',
        component: () => import('@/views/menu8/menu8-4/index'),
        meta: { title: '订单投诉管理', icon: '' }
      },
      {
        path: '5',
        name: 'menu85',
        functionCode: 's-order-complaintTheme',
        component: () => import('@/views/menu8/menu8-5/index'),
        meta: { title: '投诉主题列表', icon: '' }
      }
    ]
  },
  // 客户管理
  {
    path: '/menu6',
    component: Layout,
    redirect: '/menu6/1',
    functionCode: 's-user',
    meta: { title: '客户管理', icon: 'icon6' },
    icon: require('../assets/icon/kf.png'),
    alwaysShow: true,
    children: [
      {
        path: '1',
        name: 'menu61',
        functionCode: 's-user-level',
        component: () => import('@/views/menu6/menu6-1/index'),
        meta: { title: '客户级别体系', icon: '' }
      },
      {
        path: '2',
        name: 'menu62',
        functionCode: 's-user-uesr',
        component: () => import('@/views/menu6/menu6-2/index'),
        meta: { title: '客户列表', icon: '' }
      },
      {
        path: '5',
        name: 'menu65',
        functionCode: 's-user-money',
        component: () => import('@/views/menu6/menu6-5/index'),
        meta: { title: '客户余额', icon: '' }
      },
      {
        path: '3',
        name: 'menu63',
        functionCode: 's-user-moneyDetail',
        component: () => import('@/views/menu6/menu6-3/index'),
        meta: { title: '客户资金明细', icon: '' }
      },
      {
        path: '4',
        name: 'menu64',
        functionCode: 's-user-parent',
        component: () => import('@/views/menu6/menu6-4/index'),
        meta: { title: '客户上下级调整', icon: '' }
      }
    ]
  },
  // 客服管理
  {
    path: '/menu9',
    component: Layout,
    redirect: '/menu9/1',
    functionCode: 's-customer',
    meta: { title: '客服管理', icon: 'icon9' },
    icon: require('../assets/icon/kh.png'),
    alwaysShow: true,
    children: [
      {
        path: '4',
        name: 'menu94',
        functionCode: 's-customer-role',
        component: () => import('@/views/menu9/menu9-4/index'),
        meta: { title: '管理员权限管理', icon: '' }
      },
      {
        path: '5',
        name: 'menu95',
        functionCode: 's-customer-manager',
        component: () => import('@/views/menu9/menu9-5/index'),
        meta: { title: '管理员列表', icon: '' }
      },
      {
        path: '4/sub1/:roleID/:name',
        name: 'menu94sub1',
        hidden: true,
        component: () => import('@/views/menu9/menu9-4/sub1'),
        meta: { title: '设置权限', icon: '' }
      },
      {
        path: '1',
        name: 'menu91',
        functionCode: 's-customer-user',
        component: () => import('@/views/menu9/menu9-1/index'),
        meta: { title: '客户安全管理', icon: '' }
      },
      // {
      //   path: '2',
      //   name: 'menu92',
      //   functionCode: "s-customer-manager",
      //   component: () => import('@/views/menu9/menu9-2/index'),
      //   meta: { title: '员工安全管理', icon: '' }
      // },
      {
        path: '3',
        name: 'menu93',
        functionCode: 's-customer-abnormalUser',
        component: () => import('@/views/menu9/menu9-3/index'),
        meta: { title: '异常账户列表', icon: '' }
      }
    ]
  },
  // 财务管理
  {
    path: '/menu10',
    component: Layout,
    redirect: '/menu10/1',
    functionCode: 's-finance',
    meta: { title: '财务管理', icon: 'icon10' },
    icon: require('../assets/icon/cw.png'),
    alwaysShow: true,
    children: [
      {
        path: '1',
        name: 'menu101',
        functionCode: 's-finance-recharge',
        component: () => import('@/views/menu10/menu10-1/index'),
        meta: { title: '客户充值记录', icon: '' }
      },
      {
        path: '2',
        name: 'menu102',
        functionCode: 's-finance-cash',
        component: () => import('@/views/menu10/menu10-2/index'),
        meta: { title: '客户提现管理', icon: '' }
      },
      /* {
        path: '3',
        name: 'menu103',
        component: () => import('@/views/menu10/menu10-3/index'),
        meta: { title: '客户资金明细', icon: '' }
      },*/
      {
        path: '8',
        name: 'menu108',
        functionCode: 's-finance',
        component: () => import('@/views/menu10/menu10-8/index'),
        meta: { title: '我的提现管理', icon: '' }
      },
      {
        path: '4',
        name: 'menu104',
        functionCode: 's-finance-oper',
        component: () => import('@/views/menu10/menu10-4/index'),
        meta: { title: '财务加扣款', icon: '' }
      },
      {
        path: '5',
        name: 'menu105',
        functionCode: 's-finance-operMoney',
        component: () => import('@/views/menu10/menu10-5/index'),
        meta: { title: '财务加扣款记录', icon: '' }
      },
      {
        path: '9',
        name: 'menu109',
        functionCode: 's-finance-siteDayMoney',
        component: () => import('@/views/menu10/menu10-9/index'),
        meta: { title: '站点每日金额统计', icon: '' }
      },
      /* {
        path: '6',
        name: 'menu106',
        component: () => import('@/views/menu10/menu10-6/index'),
        meta: { title: '经销商提成明细', icon: '' }
      },
      {
        path: '7',
        name: 'menu107',
        component: () => import('@/views/menu10/menu10-7/index'),
        meta: { title: '供货商余额管理', icon: '' }
      },*/
      {
        path: 'saleApply',
        name: 'saleApply',
        functionCode: 's-finance-supply',
        component: () => import('@/views/finance/sale/saleApply'),
        meta: { title: '未转余额申请', icon: '' }
      },
      {
        path: 'way',
        name: 'rechargeWay',
        component: () => import('@/views/recharge/way'),
        functionCode: 's-recharge-mode',
        meta: { title: '充值方式' }
      },
      {
        path: 'interface',
        name: 'rechargeInterface',
        component: () => import('@/views/recharge/interface'),
        functionCode: 's-finance-attr',
        meta: { title: '充值接口' }
      },
      {
        path: 'rate',
        name: 'rateMaster',
        component: () => import('@/views/recharge/rate'),
        functionCode: 's-recharge-rate',
        meta: { title: '充值费率' }
      }
    ]
  },
  // 主站管理
  {
    path: '/menu12',
    component: Layout,
    redirect: '/menu12/1',
    functionCode: 's-site',
    meta: { title: '客户管理', icon: 'icon6' },
    icon: require('../assets/icon/kf.png'),
    alwaysShow: true,
    children: [
      {
        path: '1',
        name: 'menu12_1',
        functionCode: 's-site-site',
        component: () => import('@/views/menu12/menu12-1/index'),
        meta: { title: '客户级别体系', icon: '' }
      }
    ]
  },

  // 分站管理
  {
    path: '/menu7',
    component: Layout,
    redirect: '/menu7/1',
    functionCode: 's-subsite',
    meta: { title: '子站管理', icon: 'icon4' },
    alwaysShow: true,
    icon: require('../assets/icon/fz.png'),
    children: [
      {
        path: '1',
        name: 'menu71',
        functionCode: 's-subsite-site',
        component: () => import('@/views/menu7/menu7-1/index'),
        meta: { title: '分站列表', icon: '' }
      },
      {
        path: '3',
        name: 'menu73',
        functionCode: 's-subsite-notify',
        component: () => import('@/views/menu7/menu7-3/index'),
        meta: { title: '分站公告', icon: '' }
      },
      {
        path: '4',
        name: 'menu74',
        functionCode: 's-subsite-mes',
        component: () => import('@/views/menu7/menu7-4/index'),
        meta: { title: '分站短信', icon: '' }
      },
      {
        path: '5',
        name: 'menu75',
        functionCode: 's-subsite-package',
        component: () => import('@/views/menu7/menu7-5/index'),
        meta: { title: '分站套餐', icon: '' }
      },
      {
        path: '6',
        name: 'menu76',
        functionCode: 's-subsite-sale',
        component: () => import('@/views/menu7/menu7-6/index'),
        meta: { title: '分站销售排行榜', icon: '' }
      },
      {
        path: '2',
        name: 'menu72',
        functionCode: 's-subsite-quota',
        component: () => import('@/views/menu7/menu7-2/index'),
        meta: { title: '额度管理', icon: '' }
      },
      {
        path: '7',
        name: 'menu77',
        functionCode: 's-subsite-salequota',
        component: () => import('@/views/menu7/menu7-7/index'),
        meta: { title: '额度购买', icon: '' }
      }
    ]
  },


  //一卡通管理
  {
    path: '/menu13',
    component: Layout,
    redirect: '/menu13/1',
    functionCode: 's-rechargeCard',
    meta: { title: '一卡通管理', icon: 'icon3' },
    icon: require('../assets/icon/km.png'),
    alwaysShow: true,
    children: [
      {
        path: '1',
        name: 'menu131',
        functionCode: 's-rechargeCard-card',
        component: () => import('@/views/menu13/menu13-1/index'),
        meta: { title: '一卡通管理', icon: '' }
      },
    ]
  },

  // 日志管理
  {
    path: '/log',
    component: Layout,
    redirect: '/log/login',
    functionCode: 's-log',
    meta: { title: '日志管理', icon: 'icon4' },
    icon: require('../assets/icon/fz.png'),
    children: [
      {
        path: 'login',
        name: 'log-login',
        functionCode: 's-log-login',
        component: () => import('@/views/log/login/index'),
        meta: { title: '登录日志', icon: '' }
      },
      {
        path: 'operate',
        functionCode: 's-log-oper',
        name: 'log-operate',
        component: () => import('@/views/log/operate/index'),
        meta: { title: '操作日志', icon: '' }
      }
    ]
  }

  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/table',
  //   name: 'Example',
  //   meta: { title: 'Example', icon: 'example' },
  //   children: [
  //     {
  //       path: 'table',
  //       name: 'Table',
  //       component: () => import('@/views/table/index'),
  //       meta: { title: 'Table', icon: 'table' }
  //     },
  //     {
  //       path: 'tree',
  //       name: 'Tree',
  //       component: () => import('@/views/tree/index'),
  //       meta: { title: 'Tree', icon: 'tree' }
  //     }
  //   ]
  // },

  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: 'Form', icon: 'form' }
  //     }
  //   ]
  // },

  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
]
