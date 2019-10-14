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

export default async function anyService(name, params){
  if(!getAnyToken()) {
    const response = await queryToken({
      tenantid: 'next',
      user: '15869399274',
      password: '1234567',
      accountId: '733974411840848896',
      logintype: '2'
    });
    token = response && response.state === 'success' ? response.data.access_token : '';
    setAnyToken(token);
  } else {
    token = getAnyToken();
  }
  return anyServiceList[name](params);
}