import request from '@/utils/request'
import qs from 'qs'

// 获取目录列表
export function getSiteExtendInfo(payload) {
  return request({
    url: '/site/siteExtend/get',
    method: 'get',
    payload,
  })
}

// 设置基本信息
export function updateInfo(payload) {
  return request({
    url: '/site/siteExtend/update',
    method: 'post',
    data: payload,
    transformRequest: request.transformRequest
  })
}

// 风格设置
export function styleSettings(payload) {
  return request({
    url: '/site/systemStyle/get',
    method: 'get',
    payload
  })
}

// 设置系统风格
export function updateStyleSettings(payload) {
  return request({
    url: '/site/systemStyle/update',
    method: 'post',
    data: payload,
    transformRequest: request.transformRequest
  })
}

// 获取友情链接列表--就一页
export function getFriendshipLinks(payload) {
  return request({
    url: '/site/friendLink/list',
    method: 'get',
    payload
  })
}

// 删除友情链接
export function deleteFriendshipLinks(payload) {
  return request({
    url: '/site/friendLink/delete',
    method: 'get',
    params: payload
  })
}

// 新增或编辑友情链接
export function addfriendLinkAddr(payload) {
  let url = '/site/friendLink/add'
  if (payload.payload.friendLinkID) {
    url = '/site/friendLink/update'
  }
  return request({
    url: url,
    method: 'post',
    data: payload.payload,
    transformRequest: request.transformRequest
  })
}

//获取链接地址列表
export function getDownloadLinks(payload) {
  return request({
    url: '/site/customMenu/list',
    method: 'get',
    payload
  })
}

// 新增或编辑链接
export function addOrEditDownloadLinks(payload) {
  return request({
    url: '/site/customMenu/saveCustomMenu',
    method: 'post',
    data: payload,
    transformRequest: request.transformRequest
  })
}

// 删除链接
export function delDownloadLinks(payload) {
  return request({
    url: '/site/customMenu/delete',
    method: 'get',
    params: payload
  })
}

// 获取客服信息
export function getCustomerService(payload) {
  return request({
    url: '/site/onlineService/get',
    method: 'get',
    params: payload
  })
}
// 设置客服信息
export function addCustomerService(payload) {
  return request({
    url: '/site/onlineService/update',
    method: 'post',
    data: payload,
    transformRequest: request.transformRequest
  })
}


// 获取统计代码
export function getDecorationCode(payload) {
  return request({
    url: '/site/decorationCode/get',
    method: 'get',
    params: payload
  })
}


// 编辑统计代码
export function addDecorationCode(payload) {
  return request({
    url: '/site/decorationCode/update',
    method: 'post',
    data: payload,
    transformRequest: request.transformRequest
  })
}
