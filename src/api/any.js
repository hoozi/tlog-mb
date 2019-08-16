import request from '@/utils/request';
import { setAnyToken, getAnyToken } from '@/utils/token';
import { crudCargo } from './cargo';
import { crudTransport } from './transport';
import { queryCargoInfo, queryCargoType, queryLocation, queryToken, queryDict } from './common';

let token;

async function queryNews(params, token) {
  return request(`/ierp/kapi/app/nbg_qcwl/getAnnouncements?access_token=${token}`, {
    data: params
  })
}

const serviceList = {
  queryNews,
  crudCargo,
  crudTransport,
  queryCargoInfo,
  queryCargoType,
  queryLocation,
  queryDict
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
  return token ? serviceList[name](params, token) : null;
}