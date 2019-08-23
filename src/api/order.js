import request from '@/utils/request';

export async function queryOrder(params, token) {
  return request(`/ierp/kapi/app/nbg_qcwl/web_order?access_token=${token}`, {
    data: params
  })
}

export async function comment(params, token) {
  return request(`/ierp/kapi/app/nbg_qcwl/web_order_evaluation?access_token=${token}`, {
    data: params
  })
}