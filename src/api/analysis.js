import request from '@/utils/request';

export async function queryBarAnalysis(params) {
  return request(`/ierp/kapi/app/nbg_qcwl/app_statistics_year`, {
    data: params
  })
}

export async function queryPieAnalysis(params) {
  return request(`/ierp/kapi/app/nbg_qcwl/app_statistics_top`, {
    data: params
  })
}

export async function queryOrderTaskAnalysis(params) {
  return request(`/ierp/kapi/app/nbg_qcwl/app_statistics_order_or_task`, {
    data: params
  })
}