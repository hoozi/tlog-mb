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

export async function queryIntransitSock(params) {
  return request('/ierp/kapi/app/nbg_qcwl/storage_intransit', {
    data: params
  })
}

export async function queryTerminalSockInfo(params) {
  return request(`/ierp/kapi/app/nbg_qcwl/terminal-stock-info`, {
    data: params
  })
}