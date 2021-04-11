import request from '@/utils/request'
import qs from 'qs'

// 获取目录列表
export function getCashList(payload) {
  return request({
    url: '/finance/cash/list',
    method: 'get'
  })
}