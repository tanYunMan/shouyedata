
import Layout from '@/layout'
export default  [
  {
    path: '/withdraw',
    component: Layout,
    children: [
      {
        path: '',
        name: 'withdraw',
        component: () => import('@/views/shouka/withdraw/index'),
        meta: { title: '提现', icon: 'icon0' },
        hidden:true
      }
    ],
    hidden:true,
    meta: { title: '', icon: '' }
  },
   {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    functionCode: 'f-home',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        functionCode: 'f-home',
        component: () => import('@/views/shouka/dashboard/index'),
        meta: { title: '首页', icon: 'icon0' }
      }
    ],
    icon:require('../assets/icon/sy.png'),
    meta: { title: '', icon: '' }
  },
  // 网站设置
  {
    path: '/base',
    component: Layout,
    redirect: '/base/loginLog',
    name: 'base',
    functionCode: 'f-base',
    meta: { title: '基础信息', icon: 'icon1' },
    icon:require('../assets/icon/sz.png'),
    children: [
      {
        path: 'loginLog',
        name: 'loginLog',
        functionCode: 'f-base-log',
        component: () => import('@/views/shouka/base/login-log/index'),
        meta: { title: '登录日志', icon: '' },
        // hidden:true
      },
      {
        path: 'message',
        name: 'message',
        functionCode: 'f-base-mes',
        component: () => import('@/views/shouka/base/message/index'),
        meta: { title: '站内消息', icon: '' },
        // hidden:true
      },
      {
        path: 'wxnotice',
        name: 'wxnotice',
        functionCode: 'f-base-wnotice',
        component: () => import('@/views/shouka/base/wxnotice/index'),
        meta: { title: '微信通知', icon: '' },
        // hidden:true
      },
      {
        path: 'settings',
        name: 'settings',
        functionCode: 'f-base-set',
        component: () => import('@/views/shouka/base/settings/index'),
        meta: { title: '商家设置', icon: '' },
        // hidden:true
      },
      {
        path: 'password',
        name: 'password',
        functionCode: 'f-base-password',
        component: () => import('@/views/shouka/base/password/index'),
        meta: { title: '修改密码', icon: '' },
        // hidden:true
      },
      {
        path: 'link',
        name: 'link',
        functionCode: 'f-base-link',
        component: () => import('@/views/shouka/base/link/index'),
        meta: { title: '店铺链接', icon: '' },
        // hidden:true
      },
      {
        path: 'apply',
        name: 'apply',
        functionCode: 'f-base-finance',
        component: () => import('@/views/shouka/base/apply/index'),
        meta: { title: '商户提现', icon: '' },
        // hidden:true
      },
    ]
  },
  {
    path: '/goodsManager',
    component: Layout,
    redirect: '/goodsManager/goods',
    name: 'goodsManager',
    functionCode: 'f-goods',
    meta: { title: '商品管理', icon: 'icon1' },
    icon:require('../assets/icon/sz.png'),
    children: [
      {
        path: 'types',
        name: 'types',
        functionCode: 'f-goods-catalog',
        component: () => import('@/views/shouka/goods/types/list'),
        meta: { title: '商品分类', icon: '' },
        // hidden:true
      },
      {
        path: 'add',
        name: 'add',
        functionCode: 'f-goods-addGoods',
        component: () => import('@/views/shouka/goods/goods/add'),
        meta: { title: '添加商品', icon: '' },
        // hidden:true
      },
      {
        path: 'goods',
        name: 'goods',
        functionCode: 'f-goods-self',
        component: () => import('@/views/shouka/goods/goods/list'),
        meta: { title: '商品列表', icon: '' },
        // hidden:true
      },
      {
        path: 'goods-inter',
        name: 'goods-inter',
        functionCode: 'f-goods-join',
        component: () => import('@/views/shouka/goods/inter/list'),
        meta: { title: '对接商品', icon: '' },
        // hidden:true
      },
      {
        path: 'network-goods-inter',
        name: 'network-goods-inter',
        functionCode: 'f-goods-alljoin',
        component: () => import('@/views/shouka/goods/networkInner/list'),
        meta: { title: '全网对接商品', icon: '' },
      },
      {
        path: 'daili',
        name: 'daili',
        component: () => import('@/views/shouka/goods/inter/daili'),
        meta: { title: '代理商品', icon: '' },
        hidden:true
      },
      {
        path: 'update',
        name: 'update',
        component: () => import('@/views/shouka/goods/goods/update'),
        meta: { title: '编辑商品', icon: '' },
        hidden:true
      },
      {
        path: 'interUpdate',
        name: 'update',
        component: () => import('@/views/shouka/goods/inter/update'),
        meta: { title: '编辑商品', icon: '' },
        hidden:true
      },
      {
        path: 'netUpdate',
        name: 'update',
        component: () => import('@/views/shouka/goods/networkInner/docking'),
        meta: { title: '对接商品', icon: '' },
        hidden:true
      },
    ]
  },
  {
    path: '/cardManager',
    component: Layout,
    redirect: '/cardManager/card',
    name: 'cardManager',
    functionCode: 'f-card',
    meta: { title: '卡密管理', icon: 'icon1' },
    icon:require('../assets/icon/sz.png'),
    children: [
      {
        path: 'cardAdd',
        name: 'cardAdd',
        functionCode: 'f-card-add',
        component: () => import('@/views/shouka/card/add'),
        meta: { title: '添加卡密', icon: '' },
        // hidden:true
      },
      {
        path: 'card',
        name: 'card',
        functionCode: 'f-card-list',
        component: () => import('@/views/shouka/card/card'),
        meta: { title: '卡密列表', icon: '' },
        // hidden:true
      },
      {
        path: 'cardSold',
        name: 'cardSold',
        functionCode: 'f-card-sale',
        component: () => import('@/views/shouka/card/sold'),
        meta: { title: '已售卡密', icon: '' },
        // hidden:true
      },
      {
        path: 'rubbish',
        name: 'rubbish',
        functionCode: 'f-card-recover',
        component: () => import('@/views/shouka/card/rubbish'),
        meta: { title: '回收站', icon: '' },
        // hidden:true
      },
    ]
  },
  {
    path: '/orderManager',
    component: Layout,
    redirect: '/orderManager/zhixiao',
    name: 'orderManager',
    functionCode: 'f-order',
    meta: { title: '订单管理', icon: 'icon1' },
    icon:require('../assets/icon/sz.png'),
    children: [
      {
        path: 'allOrder',
        name: 'allOrder',
        functionCode: 'f-order-allOrder',
        component: () => import('@/views/shouka/order/allOrder'),
        meta: { title: '全部订单', icon: '' },
        // hidden:true
      },
      {
        path: 'zhixiao',
        name: 'zhixiao',
        functionCode: 'f-order-order',
        component: () => import('@/views/shouka/order/zhixiao'),
        meta: { title: '直销订单', icon: '' },
        // hidden:true
      },
      {
        path: 'duijie',
        name: 'duijie',
        functionCode: 'f-order-join',
        component: () => import('@/views/shouka/order/duijie'),
        meta: { title: '对接订单', icon: '' },
        // hidden:true
      },
    ]
  },
  {
    path: '/complaint',
    component: Layout,
    redirect: '/complaint/complaint',
    name: 'complaint',
    functionCode: 'f-complaint',
    meta: { title: '投诉管理', icon: 'icon1' },
    icon:require('../assets/icon/sz.png'),
    children: [
      {
        path: 'not-handle',
        name: 'not-handle',
        functionCode: 'f-complaint-list',
        component: () => import('@/views/shouka/complaint/not-handle/index'),
        meta: { title: '未投诉处理', icon: '' },
        // hidden:true
      },
      {
        path: 'complaint',
        name: 'complaint',
        functionCode: 'f-complaint-all',
        component: () => import('@/views/shouka/complaint/complaint/index'),
        meta: { title: '全部投诉', icon: '' },
        // hidden:true
      },
    ]
  },



  
  {
    path: '/finance',
    component: Layout,
    redirect: '/finance/finance',
    name: 'finance',
    functionCode: 'f-finance',
    meta: { title: '财务管理', icon: 'icon1' },
    icon:require('../assets/icon/sz.png'),
    children: [
      {
        path: 'charge',
        name: 'charge',
        functionCode: 'f-finance-attr',
        component: () => import('@/views/shouka/finance/charge/index'),
        meta: { title: '充值接口', icon: '' },
        // hidden:true
      },
      {
        path: 'rate',
        name: 'rate',
        functionCode: 'f-recharge-rate',
        component: () => import('@/views/shouka/finance/rate/index'),
        meta: { title: '接口费率', icon: '' },
        // hidden:true
      },
      {
        path: 'tempFrozen',
        name: 'tempFrozen',
        functionCode: 'f-finance-tempFrozen',
        component: () => import('@/views/shouka/finance/tempFrozen/index'),
        meta: { title: '临时冻结详情', icon: '' },
        // hidden:true
      },
    ]
  },
  {
    path: '/discount',
    component: Layout,
    redirect: '/discount/list',
    name: 'discount',
    functionCode: 'f-discount',
    meta: { title: '优惠券管理', icon: 'icon1' },
    icon:require('../assets/icon/sz.png'),
    children: [
      {
        path: 'add',
        name: 'add',
        functionCode: 'f-discount-add',
        component: () => import('@/views/shouka/discount/add'),
        meta: { title: '添加优惠券', icon: '' },
        // hidden:true
      },
      {
        path: 'list',
        name: 'list',
        functionCode: 'f-discount-list',
        component: () => import('@/views/shouka/discount/list'),
        meta: { title: '优惠券列表', icon: '' },
        // hidden:true
      },
      {
        path: 'useable',
        name: 'useable',
        functionCode: 'f-discount-used',
        component: () => import('@/views/shouka/discount/useable'),
        meta: { title: '已使用', icon: '' },
        // hidden:true
      },
    ]
  },
  {
    path: '/menu1',
    component: Layout,
    redirect: '/menu1/1',
    name: 'menu1',
    functionCode: 'f-push',
    meta: { title: '推广管理', icon: 'icon1' },
    icon:require('../assets/icon/sz.png'),
    children: [
      {
        path: 'sub1',
        name: 'menu111',
        functionCode: 'f-push',
        component: () => import('@/views/menu1/menu1-1/sub1'),
        meta: { title: '推广管理', icon: '' },
        // hidden:true
      },
    ]
  },
]