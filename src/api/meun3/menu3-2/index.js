import request from '@/utils/request'
import qs from 'qs'

// 获取商品列表
export function getGoodsList(data) {
  return request({
    url: '/goods/goods/goodsPage',
    method: 'post',
    data,
    transformRequest: request.transformRequest
  })
}

// 删除商品
export function delGoods(params,url) {
  return request({
    url: url,
    method: 'get',
    params,
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }
  })
}

// 设置商品供货状态
export function updateAgentTypeBatch(data) {
  return request({
    url: '/goods/goods/updateAgentTypeBatch',
    method: 'post',
    data,
    transformRequest: request.transformRequest
  })
}

// 推荐商品
export function addRecommendGoodsBatch(data) {
  return request({
    url: '/goods/goods/addRecommendGoodsBatch',
    method: 'post',
    data,
    transformRequest: request.transformRequest
  })
}

// 状态设置
export function updateGoodsStateBatch(data) {
  return request({
    url: '/goods/goods/updateGoodsStateBatch',
    method: 'post',
    data,
    transformRequest: request.transformRequest
  })
}

// 获取目录树
export function getCatalogTree(params) {
  return request({
    url: '/goods/catalog/tree',
    method: 'get',
    params
  })
}

// 导卡
export function importCardApi(data) {
  return request({
    url: '/goods/goods/importCard',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    // transformRequest: request.transformRequest
  })
}

// 获取库存列表
export function getCardList(data) {
  return request({
    url: '/goods/card/page',
    method: 'post',
    data,
    transformRequest: request.transformRequest
  })
}


// 设置目录商品
export function confirmSetCatalog(data) {
  return request({
    url: '/goods/goods/updateCatalogIDBatch',
    method: 'post',
    data,
    transformRequest: request.transformRequest
  })
}

// 获取定价列表
export function getPriceList(params) {
  return request({
    url: '/goods/goods/getGoodsPrice',
    method: 'get',
    params
  })
}

// 定价
export function addPrice(data) {
  //console.log(datas,444);return
  // const data = {
  //     ...datas
  // }
  return request({
    url: '/goods/goods/saveGoodsPrice',
    method: 'post',
    data: data,
    transformRequest:[function (){
      return JSON.stringify(data)
    }],
    headers:{
      'Content-Type':'application/json'
    }
  })
}

// 批量定价
export function addPriceArr(data) {
  return request({
    url: '/goods/goods/saveGoodsPrices',
    method: 'post',
    data: data,
    transformRequest:[function (){
      return JSON.stringify(data)
    }],
    headers:{
      'Content-Type':'application/json'
    }
  })
}
