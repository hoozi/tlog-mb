import { queryTerminalLocation, queryTerminalSock, queryIntransitSock } from '@/api/sock';

const state = {
  location: [],
  list: [],
  total: 0
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
  async fetchIntransitSock(payload, rootState, callback) {
    const response = await queryIntransitSock({
      crudType: 'retrieve',
      current: 1,
      size: 20,
      ...payload
    });
    if(!response) return;
    this.save({list:[...response.data]});
    callback && callback(response.data);
  }
}


export default {
  state,
  reducers,
  effects
}