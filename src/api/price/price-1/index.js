import request from '@/utils/request'
import qs from 'qs'

// 等级价格组列表
export function getList(data) {
  return request({
    url: '/site/levelPriceGroup/page',
    method: 'post',
    data,
    transformRequest: request.transformRequest
  })
}

// 价格组
export function goSetLevel(data,url) {
  return request({
    url: url,
    method: 'post',
    data,
    transformRequest: request.transformRequest
  })
}

// 删除数据
export function deleteData(payload) {
  return request({
    url: '/site/levelPriceGroup/delete',
    method: 'get',
    params: payload
  })
}