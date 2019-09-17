import request from '@/utils/request';

export async function crudTransport(params) {
  return request(`/ierp/kapi/app/nbg_qcwl/web_transport`, {
    data: params
  })
}

export async function queryAnyTransport(params) {
  return request(`/ierp/kapi/app/nbg_qcwl/anon_transport`, {
    data: params
  })
}