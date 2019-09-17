import request from '@/utils/request';

export async function queryNews(params) {
  return request(`/ierp/kapi/app/nbg_qcwl/getAnnouncements`, {
    data: params
  })
}