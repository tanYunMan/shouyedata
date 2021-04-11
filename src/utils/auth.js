import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return sessionStorage.getItem("token");
}

export function setToken(token) {
  sessionStorage.setItem("token", token);
}

export function removeToken() {
  sessionStorage.removeItem("token");
}

export function paySubmit(data) {
  const formData = { ...data }
  // 移除postUrl
  const postUrl = formData.postUrl
  delete formData.postUrl
  // 创建表单
  const form = document.createElement('FORM')
  form.setAttribute('method', 'post')
  form.setAttribute('target', '_blank')
  // 必须使用application/x-www-form-urlencoded，所以拼接参数到postUrl
  const params = []
  for (const k in formData) {
    params.push(`${k}=${formData[k]}`)
  }
  form.action = `${postUrl}${~postUrl.indexOf('?') ? '&' : '?'}${params.join(
    '&'
  )}`
  document.body.appendChild(form)
  form.submit()
  setTimeout(() => {
    document.body.removeChild(form)
  }, 200)
}