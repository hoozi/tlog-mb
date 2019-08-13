import request from '@/utils/request';

export async function cargo(params, token) {
  return request(`/ierp/kapi/app/nbg_qcwl/pallet?access_token=${token}`, {
    data: params
  })
}
