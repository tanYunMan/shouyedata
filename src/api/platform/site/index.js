import request from '@/utils/request'
import qs from 'qs'


// 获取站点域名列表
export function getSiteList(payload) {
  return request({
    url: '/platform/siteAlias/page',
    method: 'post',
    data: payload,
    transformRequest: request.transformRequest
  })
}
