import request from '@/utils/request'
import qs from 'qs'

// post传参  不处理数据
export function getList(data,url) {
  return request({
    url: url,
    method: 'post',
    data
  })
}


// post传参  处理数据
export function getLists(data,url) {
  return request({
    url: url,
    method: 'post',
    data,
    transformRequest: request.transformRequest
  })
}



// get(删除)
export function getData(params,url) {
  return request({
    url: url,
    method: 'get',
    params
  })
}


// get()
export function getDatas(params,url) {
  return request({
    url: url,
    method: 'get',
    params,
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }
  })
}


// Post  application/json
export function postApplicationJson(data,url) {
  return request({
    url: url,
    method: 'post',
    data: data,
    transformRequest:[function (){
      return JSON.stringify(data)
    }],
    headers:{
      'Content-Type':'application/json'
    }
  })
}

// Post  application/json
export function textImgList(data,url) {
  return request({
    url: url,
    method: 'get',
    data: data,
    transformRequest:[function (){
      return JSON.stringify(data)
    }],
    headers:{
      'Content-Type':'application/json'
    }
  })
}