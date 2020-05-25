import request from '@/utils/request';

export async function crudPriceReply(params) {
  return request(`/ierp/kapi/app/nbg_qcwl/bidding`, {
    data: params
  })
}

export async function priceReview(params) {
  return request(`/ierp/kapi/app/nbg_qcwl/enquiry_audit`, {
    data: params
  })
}