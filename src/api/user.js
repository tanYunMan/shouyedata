import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login/login/login',
    method: 'post',
    data,
    transformRequest: request.transformRequest
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/login/login/logout',
    method: 'get'
  })
}
