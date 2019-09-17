import request from '@/utils/request';

export async function crudCargo(params) {
  return request(`/ierp/kapi/app/nbg_qcwl/pallet`, {
    data: params
  })
}

export async function queryAnyCargo(params) {
  return request(`/ierp/kapi/app/nbg_qcwl/anon_pallet`, {
    data: params
  })
}
