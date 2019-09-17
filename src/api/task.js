import request from '@/utils/request';

export async function queryTask(params) {
  return request(`/ierp/kapi/app/nbg_qcwl/web_task`, {
    data: params
  })
}

export async function queryTaskTrack(params) {
  return request(`/ierp/kapi/app/nbg_qcwl/web_task_trace`, {
    data: params
  })
}

export async function queryTrackNode(params) {
  return request(`/ierp/kapi/app/nbg_qcwl/trace_node`, {
    data: params
  })
}
