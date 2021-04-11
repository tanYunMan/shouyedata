import request from '@/utils/request'
import qs from 'qs'

// 获取目录列表
export function geTcatalogList(params) {
  return request({
    url: '/goods/catalog/catalogList',
    method: 'get',
    params,
    // transformRequest: request.transformRequest
  })
}
// 修改目录
export function updateCatalog(data) {
  return request({
    url: '/goods/catalog/updateCatalog',
    method: 'post',
    data,
    transformRequest: request.transformRequest
  })
}
// 删除目录
export function deleteCatalog(params) {
  return request({
    url: '/goods/catalog/delete',
    method: 'get',
    params,
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }
  })
}

// 目录状态修改
export function updateStateBatch(data) {
  return request({
    url: '/goods/catalog/updateStateBatch',
    method: 'post',
    data,
    transformRequest: request.transformRequest
  })
}

// 目录对接状态修改
export function updateAgentTypeBatch(data) {
  return request({
    url: '/goods/catalog/updateAgentTypeBatch',
    method: 'post',
    data,
    transformRequest: request.transformRequest
  })
}

// 新增目录
export function AddCatalog(data) {
  return request({
    url: '/goods/catalog/saveCatalog',
    method: 'post',
    data,
    transformRequest: request.transformRequest
  })
}


//批量修改目录名称的颜色
export function AddColorFormAPI(data) {
  return request({
    url: '/goods/catalog/updateColorBatch',
    method: 'post',
    data,
    transformRequest: request.transformRequest
  })
}

//排序
export function sortCatalog(data) {
  return request({
    url: '/goods/catalog/updateSortById',
    method: 'post',
    data,
    transformRequest: request.transformRequest
  })
}

// 箭头排序
export function sortCatalogArrow(data) {
  return request({
    url: '/goods/catalog/updateSort',
    method: 'post',
    data,
    transformRequest: request.transformRequest
  })
}

//一键删除空目录

export function deleteEmptyCatalog(){
  return request({
    url:'/goods/catalog/deleteEmptyCatalog',
    method:'get',
    transformRequest:request.transformRequest
  })
}