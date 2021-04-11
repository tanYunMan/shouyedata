import request from '@/utils/request'
import qs from 'qs'

// 获取目录列表
export function getSystemSettings(payload) {
  return request({
    url: '/site/systemSet/get',
    method: 'get',
    payload
  })
}

// 添加系统设置
export function systemSetUpdate(payload) {
  return request({
    url: '/site/systemSet/update',
    method: 'post',
    data: payload,
    transformRequest: request.transformRequest
  })
}