import request from '@/utils/request';

export async function queryInvoice(params) {
  return request(`/ierp/kapi/app/nbg_qcwl/queryInvoice`, {
    data: params
  })
}