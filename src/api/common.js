import request from '@/utils/request';

export async function queryCargoInfo(params) {
  return request(`/ierp/kapi/app/nbg_qcwl/CargoApiPlugin`, {
    data: {
      crudType: 'retrieve',
      ...params
    }
  })
}
export async function queryCargoType(params) {
  return request(`/ierp/kapi/app/nbg_qcwl/queryCargoTypeCode`, {
    data: {
      crudType: 'retrieve'
    }
  })
}
export async function queryLocation(params) {
  return request(`/ierp/kapi/app/nbg_qcwl/configLocationApi`, {
    data: {
      crudType: 'retrieve',
      ...params
    }
  })
}
export async function queryDict(params) {
  return request(`/ierp/kapi/app/nbg_qcwl/dict`, {
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
export async function queryTransportName(params) {
  return request(`/ierp/kapi/app/nbg_qcwl/base_vessel`, {
    data: params
  })
}
export async function queryOrg(params) {
  return request(`/ierp/kapi/app/nbg_qcwl/org`, {
    data: params
  })
}

export async function queryCurrentUser() {
  return request('/ierp/kapi/app/nbg_qcwl/web_user_info', {
    method: 'GET'
  })
}
export async function queryCurrentMenu(params) {
  return request('/ierp/kapi/app/nbg_qcwl/web_menu', {
    data: params
  })
}
export async function queryCustomerByName(params) {
  return request('/ierp/kapi/app/nbg_qcwl/customer', {
    data: params
  })
}
export async function queryCompany(params) {
  return request('/ierp/kapi/app/nbg_qcwl/cbos-voyage-info', {
    data: params
  })
}

export async function upload(params) {
  return request('/ierp/attachment/uploadFile.do', {
    data: params
  })
}

export async function queryUploadKey(params) {
  return request('/ierp/kapi/app/nbg_qcwl/create_bill', {
    data: params
  })
}

export async function bindFile(params) {
  return request('/ierp/kapi/app/nbg_qcwl/file', {
    data: params
  })
}

export async function checkUpgrade() {
  return request('/upgrade.json', {
    method: 'GET'
  })
}