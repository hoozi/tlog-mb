import request from '@/utils/request';

export async function queryOrder(params) {
  return request(`/ierp/kapi/app/nbg_qcwl/web_order`, {
    data: params
  })
}

export async function comment(params) {
  return request(`/ierp/kapi/app/nbg_qcwl/web_order_evaluation`, {
    data: params
  })
}