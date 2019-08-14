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
