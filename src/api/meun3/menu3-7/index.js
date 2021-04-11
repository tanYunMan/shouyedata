import request from '@/utils/request'
import qs from 'qs'

// 获取导卡列表
export function getList(data) {
  return request({
    url: '/goods/card/importCardRecordPage',
    method: 'post',
    data,
    transformRequest: request.transformRequest
  })
}