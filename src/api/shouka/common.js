import request from '@/utils/request'

// post传参  不处理数据
export function getData(url) {
  return request({
    url: url,
    method: 'get',
  })
}