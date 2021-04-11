import request from '@/utils/request'
import qs from 'qs'

// 获取推荐目录列表
export function geTcatalogList(data) {
  return request({
    url: '/goods/catalogRecommend/page',
    method: 'post',
    data,
    transformRequest: request.transformRequest
  })
}
// 推荐目录下的商品
export function getRecommendedCatalogue(data) {
  return request({
    // url: '/goods/goods/getGoodsRecommendPage',
    url: '/goods/catalogGoodsRecommend/getGoodsRecommendPage',
    method: 'post',
    data,
    transformRequest: request.transformRequest
  })
}


// 推荐目录可推荐的商品
export function getGoodsListCatalogue(data) {
  return request({
    url: '/goods/goods/pageRecommend',
    method: 'post',
    data,
    transformRequest: request.transformRequest
  })
}

// 修改目录
export function updateCatalog(data) {
  data = {
    catalogRecommendID:data.catalogRecommendID,
    catalogRecommendName:data.catalogRecommendName,
    color:data.color
  }
  return request({
    url: '/goods/catalog/updateCatalogRecommend',
    method: 'post',
    data,
    transformRequest: request.transformRequest
  })
}
// 删除目录
export function deleteCatalog(params) {
  return request({
    url: '/goods/catalog/deleteCatalogRecommend',
    method: 'get',
    params,
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }
  })
}


// 删除目录下的商品
export function deleteCatalogGoods(params) {
  return request({
    url: '/goods/goods/delCRGByCRID',
    method: 'get',
    params,
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }
  })
}

// 目录状态修改
export function updateStateBatch(data) {
  return request({
    url: '/goods/catalog/updateCRState',
    method: 'post',
    data,
    transformRequest: request.transformRequest
  })
}

// 目录对接状态修改
export function updateAgentTypeBatch(data) {
  return request({
    url: '/goods/catalog/updateAgentTypeBatch',
    method: 'post',
    data,
    transformRequest: request.transformRequest
  })
}

// 新增推荐目录
export function AddCatalog(data) {
  return request({
    url: '/goods/catalog/addCatalogRecommend',
    method: 'post',
    data,
    transformRequest: request.transformRequest
  })
}


//  添加目录推荐商品
export function addRecommendGoodsBatchToCatalog(data) {
  return request({
    url: '/goods/goods/addRecommendGoodsBatchToCatalog',
    method: 'post',
    data,
    transformRequest: request.transformRequest
  })
}
