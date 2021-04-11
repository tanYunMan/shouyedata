import request from '@/utils/request'
import qs from 'qs'

// 获取目录列表
export function getShopSettings(payload) {
  return request({
    url: '/site/baseInfo/get',
    method: 'get',
    payload
  })
}

// 添加系统设置
export function shopSettingsUpdate(payload) {
  return request({
    url: '/site/baseInfo/update',
    method: 'post',
    data: payload,
    transformRequest: request.transformRequest
  })
}

// 获取支付通道信息
export function getPaymentChannel() {
  return request({
    url: '/site/payChannel/get',
    method: 'get'
  })
}

// 添加支付通道信息
export function addPaymentChannel(payload) {
  return request({
    url: '/site/payChannel/update',
    method: 'post',
    data: payload,
    transformRequest: request.transformRequest
  })
}