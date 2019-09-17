import request from '@/utils/request';

export async function queryProduct(params) {
  return request(`/ierp/kapi/app/nbg_qcwl/getProductInfo`, {
    data: params
  })
}

export async function productKeep(params) {
  return request(`/ierp/kapi/app/nbg_qcwl/product_enshrine`, {
    data: params
  })
}
