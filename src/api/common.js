import request from '@/utils/request';

export async function queryCargoInfo(params, token) {
  return request(`/ierp/kapi/app/nbg_qcwl/CargoApiPlugin?access_token=${token}`, {
    data: {
      crudType: 'retrieve',
      ...params
    }
  })
}
export async function queryCargoType(params, token) {
  return request(`/ierp/kapi/app/nbg_qcwl/queryCargoTypeCode?access_token=${token}`, {
    data: {
      crudType: 'retrieve'
    }
  })
}
export async function queryLocation(params, token) {
  return request(`/ierp/kapi/app/nbg_qcwl/configLocationApi?access_token=${token}`, {
    data: {
      crudType: 'retrieve'
    }
  })
}
export async function queryDict(params, token) {
  return request(`/ierp/kapi/app/nbg_qcwl/dict?access_token=${token}`, {
    data: {
      crudType: 'retrieve',
      ...params
    }
  })
}
export async function queryToken(params) {
  return request('/ierp/api/login.do', {
    data: params
  })
}
export async function queryCurrentUser() {
  return request('/ierp/kapi/app/nbg_qcwl/web_user_info', {
    method: 'GET'
  })
}