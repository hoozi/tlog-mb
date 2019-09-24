import request from '@/utils/request';

export async function queryCongestion(params) {
  return request(`/ierp/kapi/app/nbg_qcwl/terminal_congestion`, {
    data: params
  })
}

