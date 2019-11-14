import request from '@/utils/request';

export async function queryYMWAnalysis(params) {
  return request(`/ierp/kapi/app/nbg_qcwl/statistics_year_month_week`, {
    data: params
  })
}