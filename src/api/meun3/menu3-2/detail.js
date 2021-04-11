import request from '@/utils/request'
import qs from 'qs'

// 获取商品详情
export function getGoodsDetail(params) {
  return request({
    url: '/goods/goods/getAdminGoods',
    method: 'get',
    params,
  })
}

// 修改商品
export function updateGoods(data) {
  return request({
    url: '/goods/goods/updateGoods',
    method: 'post',
    data,
    transformRequest: request.transformRequest
  })
}