import request from '@/utils/request';

export async function queryNews(params, token) {
  return request(`/ierp/kapi/app/nbg_qcwl/getAnnouncements?access_token=${token}`, {
    data: params
  })
}