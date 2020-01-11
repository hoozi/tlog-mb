import request from '@/utils/request';

export async function queryVovage(params) {
  return request(`/ierp/kapi/app/nbg_qcwl/vessel_schedule`, {
    data: params
  })
}

export async function queryAisAlone(params) {
  return request(`/ierp/kapi/app/nbg_qcwl/ais`, {
    data: params
  })
}

export async function queryVovageInfo(params) {
  return request(`/ierp/kapi/app/nbg_qcwl/cbos-voyage-info`, {
    data: params
  })
}