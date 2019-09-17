import request from '@/utils/request';

export async function queryTerminalLocation(params) {
  return request(`/ierp/kapi/app/nbg_qcwl/terminal_location`, {
    data: params
  })
}

export async function queryTerminalSock(params) {
  return request(`/ierp/kapi/app/nbg_qcwl/terminal_storage`, {
    data: params
  })
}