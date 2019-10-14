import request from '@/utils/request';

export async function queryTide(params) {
  return request(`/ierp/kapi/app/nbg_qcwl/tide`, {
    data: params
  })
}
