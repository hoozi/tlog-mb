import request from '@/utils/request';
import { stringify } from 'qs';

export async function queryCloudToken(params) {
  return request(`/cloud/openauth2/api/token?${stringify(params)}&t=${Date.now()}`, {
    method: 'GET'
  })
}

export async function queryCloudCurrentUser(params) {
  return request(`/cloud/openauth2/api/getcontext?${stringify(params)}&t=${Date.now()}`, {
    method: 'GET'
  })
}

export async function bindUserFromCloud(params) {
  return request('/ierp/kapi/app/nbg_qcwl/app_token', {
    data: params
  })
}