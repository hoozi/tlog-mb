import request from '@/utils/request';
import { setAnyToken, getAnyToken } from '@/utils/token';
import { cargo } from './cargo';
import { queryCargoInfo, queryCargoType, queryLocation } from './common';

let token;

async function queryNews(params, token) {
  return request(`/ierp/kapi/app/nbg_qcwl/getAnnouncements?access_token=${token}`, {
    data: params
  })
}

async function queryToken(params) {
  return request('/ierp/api/login.do', {
    data: params
  })
}

const serviceList = {
  queryNews,
  cargo,
  queryCargoInfo,
  queryCargoType,
  queryLocation
}

export default async function service(name, params){
  if(!getAnyToken()) {
    const response = await queryToken({
      tenantid: 'next',
      user: '15869399274',
      password: '1234567',
      accountId: '1542003592082020204',
      logintype: '2'
    });
    token = response && response.state === 'success' ? response.data.access_token : '';
    setAnyToken(token);
  } else {
    token = getAnyToken();
  }
  //window.sessionStorage.setItem(ANY_KEY, token);
  return token ? serviceList[name](params, token) : null;
}