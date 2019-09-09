import { setAnyToken, getAnyToken } from '@/utils/token';
import { crudCargo } from './cargo';
import { crudTransport } from './transport';
import { queryCargoInfo, queryCargoType, queryLocation, queryToken, queryDict } from './common';
import { queryNews } from './news';
import { crudPriceReply } from './priceReply';
import { queryOrder, comment } from './order';
import { queryProduct, productKeep } from './product';
import { queryTerminalLocation, queryTerminalSock } from './sock';

let token;

const serviceList = {
  queryNews,
  crudCargo,
  crudTransport,
  queryCargoInfo,
  queryCargoType,
  queryLocation,
  queryDict,
  crudPriceReply,
  queryOrder,
  comment,
  queryProduct,
  productKeep,
  queryTerminalLocation,
  queryTerminalSock
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