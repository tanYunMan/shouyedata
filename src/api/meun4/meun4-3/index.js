import request from '@/utils/request'
import qs from 'qs'
// 删除用户
export function deleteJoin(params) {
    return request({
      url: '/site/joinSite/deleteJoin',
      method: 'get',
      params,
    })
  }
  