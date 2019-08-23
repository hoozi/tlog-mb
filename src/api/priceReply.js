import request from '@/utils/request';

export async function crudPriceReply(params, token) {
  return request(`/ierp/kapi/app/nbg_qcwl/bidding?access_token=${token}`, {
    data: params
  })
}