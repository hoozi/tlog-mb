import request from '@/utils/request';

export async function queryTask(params, token) {
  return request(`/ierp/kapi/app/nbg_qcwl/web_task?access_token=${token}`, {
    data: params
  })
}
