import request from '@/utils/request';

export async function crudPriceReply(params) {
  return request(`/ierp/kapi/app/nbg_qcwl/bidding`, {
    data: params
  })
}