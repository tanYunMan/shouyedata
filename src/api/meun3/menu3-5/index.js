import request from '@/utils/request'
import qs from 'qs'

// 添加模板
export function addTemplate(datas) {
  const data = {
      "tempName":datas.tempName,
      "goodsTypeTempList":datas.goodsTypeTempList
  }
  let url 
  if(datas.goodsTempID){
    url = '/goods/goodsTemp/updateGoodsTemp'
  }else{
    url = '/goods/goodsTemp/saveGoodsTemp'
  }
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


// 获取模板
export function getTemplateList(params) {
  return request({
    url: '/goods/goodsTemp/goodsTempList',
    method: 'get',
    params
  })
}


// 删除模板
export function deleteTemplate(params) {
  return request({
    url: '/goods/goodsTemp/deleteGoodsTemp',
    method: 'get',
    params,
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }
  })
}
