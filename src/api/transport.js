import request from '@/utils/request';

export async function crudTransport(params, token) {
  return request(`/ierp/kapi/app/nbg_qcwl/web_transport?access_token=${token}`, {
    data: params
  })
}