import { queryTerminalLocation, queryTerminalSock, queryIntransitSock, queryTerminalSockInfo } from '@/api/sock';

const state = {
  location: [],
  list: [],
  transportSockList: [],
  total: 0,
  terminal: {
    beginPageIndex: 1,
    current: 1,
    endPageIndex: 2,
    pageCount: 0,
    recordCount: 0,
    recordList: [],
    size: 10
  }
}

const reducers = {
  save(state, payload) {
    return Object.assign(state, payload)
  }
}

const effects = {
  async fetchTerminalLocation(payload, rootState, callback) {
    const response = await queryTerminalLocation({
      crudType: 'retrieve',
      current: 1,
      size: 10,
      ...payload
    });
    if(!response) return;
    this.save({
      location : [...response.data]
    });
    callback && callback(response.data);
  },
  async fetchTerminalSock(payload, rootState, callback) {
    const response = await queryTerminalSock({
      crudType: 'retrieve',
      current: 1,
      size: 20,
      ...payload
    });
    if(!response) return;
    this.save({...response.data});
    callback && callback(response.data);
  },
  async fetchTerminalSockList(payload, rootState, callback) {
    const response = await queryTerminalSockInfo({
      crudType: 'retrieve',
      current: 1,
      size: 20,
      operateType: "getSumStockInfo",
      ...payload
    });
    if(!response) return;
    this.save({terminal:response.data});
    callback && callback(response.data);
  },
  async fetchIntransitSock(payload, rootState, callback) {
    const response = await queryIntransitSock({
      crudType: 'retrieve',
      current: 1,
      size: 20,
      ...payload
    });
    if(!response) return;
    this.save({transportSockList:[...response.data]});
    callback && callback(response.data);
  }
}


export default {
  state,
  reducers,
  effects
}