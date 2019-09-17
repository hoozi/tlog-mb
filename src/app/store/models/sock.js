import { queryTerminalLocation, queryTerminalSock } from '@/api/sock';

const state = {
  location: [],
  sock: []
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
      size: 10,
      ...payload
    });
    if(!response) return;
    this.save({
      sock: [...response.data]
    });
    callback && callback(response.data);
  }
}


export default {
  state,
  reducers,
  effects
}