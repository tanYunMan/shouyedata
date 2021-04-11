import request from '@/utils/request'
import qs from 'qs'

// 获取商品秘价列表
export function getList(data) {
  return request({
    url: '/goods/secretPrice/pageByGoods',
    method: 'post',
    data,
    transformRequest: request.transformRequest
  })
}

export function saveSecretPrice(data){
  return request({
    url:'/goods/secretPrice/saveSecretPrice',
    method:'post',
    data,
    transformRequest: request.transformRequest
  })
}