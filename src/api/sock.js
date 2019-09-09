import request from '@/utils/request';

export async function queryTerminalLocation(params, token) {
  return request(`/ierp/kapi/app/nbg_qcwl/terminal_location?access_token=${token}`, {
    data: params
  })
}

export async function queryTerminalSock(params, token) {
  return request(`/ierp/kapi/app/nbg_qcwl/terminal_storage?access_token=${token}`, {
    data: params
  })
}