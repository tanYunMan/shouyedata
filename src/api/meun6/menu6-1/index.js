import request from '@/utils/request'
import qs from 'qs'

// 获取用户列表
export function getUserList(payload) {
  return request({
    url: '/user/user/pageUser',
    method: 'post',
    data: payload,
    transformRequest: request.transformRequest
  })
}


// 删除用户
export function deletaUser(payload) {
  return request({
    url: '/user/user/delete',
    method: 'get',
    params: payload
  })
}

// 获取用户列表
export function getAdministratorsList(payload) {
  return request({
    url: '/user/user/pageSite',
    method: 'post',
    data: payload,
    transformRequest: request.transformRequest
  })
}

// 修改用户状态
export function updateUserState(data) {
  return request({
    url: '/user/user/updateUserState',
    method: 'post',
    data,
    transformRequest: request.transformRequest
  })
}



// 获取用户级别列表
export function getUserLevelList(data) {
  return request({
    url: '/site/userLevel/page',
    method: 'post',
    data,
    transformRequest: request.transformRequest
  })
}



// 新增编辑用户等级
export function goSetLevel(data,url) {
  return request({
    url: url,
    method: 'post',
    data,
    transformRequest: request.transformRequest
  })
}


// 删除用户等级
export function delConfirmLevel(params) {
  return request({
    url: '/site/userLevel/delete',
    method: 'get',
    params,
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }
  })
}


// 修改会员等级
export function editUserLevel(data) {
  return request({
    url: '/user/user/updateUserLevel',
    method: 'post',
    data,
    transformRequest: request.transformRequest
  })
}

// 获取客户权限
export function getUserRoles(payload) {
  return request({
    url: '/user/userExtend/get',
    method: 'get',
    params: payload
  })
}

// 编辑客户权限
export function editRoles(data) {
  return request({
    url: '/user/userExtend/add',
    method: 'post',
    data,
    transformRequest: request.transformRequest
  })
}