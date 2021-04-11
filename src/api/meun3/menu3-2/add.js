import request from '@/utils/request'
import qs from 'qs'

// 获取商品类型
export function getGoodsType(params) {
  return request({
    url: '/goods/goods/getGoodsTypeList',
    method: 'get',
    params,
    // transformRequest: request.transformRequest
  })
}

// 新增商品
export function addGood(data) {
  return request({
    url: '/goods/goods/saveGoods',
    method: 'post',
    data,
    transformRequest: request.transformRequest
  })
}

// 获取充值模板
export function getTempList(params) {
  return request({
    url: '/goods/goodsTemp/list',
    method: 'get',
    params,
  })
}
