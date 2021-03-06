import request from '@/utils/request';
import { stringify } from 'qs';

export async function queryCloudToken(params) {
  return request(`/cloud/gateway/oauth2/token/getAccessToken`, {
    data: params
  })
}

export async function queryCloudCurrentUser(params) {
  const { accessToken, ...data } = params;
  return request(`/cloud/gateway/ticket/user/acquirecontext?accessToken=${accessToken}`, {
    data
  })
}

export async function bindUserFromCloud(params) {
  return request('/ierp/kapi/app/nbg_qcwl/app_token', {
    data: params
  })
}