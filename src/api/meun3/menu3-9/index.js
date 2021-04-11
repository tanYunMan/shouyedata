import request from '@/utils/request'
import qs from 'qs'

// 获取推荐商品列表
export function getList(data) {
  return request({
    url: '/goods/goods/catalogGoodsRecommendPage',
    method: 'post',
    data,
    transformRequest: request.transformRequest
  })
}

// 移除推荐商品
export function deleteGoods(params) {
	console.log(params)
  return request({
    url: '/goods/goods/delCRGByCRID',
    method: 'get',
    params,
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }
  })
}

// 排序
export function sortGoods(data) {
  return request({
    url: '/goods/goods/updateRecommendGoodsSort',
    method: 'post',
    data,
    transformRequest: request.transformRequest
  })
}