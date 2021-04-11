import request from '@/utils/request'
import qs from 'qs'


// 获取域名管理列表
export function getSiteList(data) {
  return request({
    url: '/platform/systemDomain/page',
    method: 'post',
    data,
    transformRequest: request.transformRequest
  })
}