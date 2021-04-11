	import request from '@/utils/request'
import qs from 'qs'


// 获取站点购买站点价格列表
export function getSiteList(params) {
  return request({
    url: '/platform/siteSitePrice/list',
    method: 'get',
    params
  })
}
