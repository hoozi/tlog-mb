import { setAnyToken, getAnyToken } from '@/utils/token';
import { queryAnyCargo } from './cargo';
import { queryAnyTransport } from './transport';
import { queryToken } from './common';
import { queryNews } from './news';
import { queryProduct } from './product';


let token;

const anyServiceList = {
  queryNews,
  queryProduct,
  queryAnyCargo,
  queryAnyTransport
}

export async function anyLogin() {
  const response = await queryToken({
    tenantid: 'next',
    user: 'guest',
    password: '<@#Q>c!W#l<2019&>',
    //accountId: '733974411840848896',
    logintype: '2'
  });
  token = response && response.state === 'success' ? response.data.access_token : '';
  setAnyToken(token);
}


export default async function anyService(name, params){
  if(!getAnyToken()) {
    await anyLogin();
  }
  return anyServiceList[name](params);
}