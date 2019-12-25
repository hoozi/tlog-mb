import request from '@/utils/request';

export async function queryMessage(params) {
  return request(`/ierp/kapi/app/nbg_qcwl/message`, {
    data: params
  })
}