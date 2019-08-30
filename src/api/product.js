import request from '@/utils/request';

export async function queryProduct(params, token) {
  return request(`/ierp/kapi/app/nbg_qcwl/getProductInfo?access_token=${token}`, {
    data: params
  })
}

export async function productKeep(params, token) {
  return request(`/ierp/kapi/app/nbg_qcwl/product_enshrine?access_token=${token}`, {
    data: params
  })
}
