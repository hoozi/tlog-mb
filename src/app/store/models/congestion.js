import { queryCongestion } from '@/api/congestion';

const state = {
  congestions: []
}

const reducers = {
  save(state, payload) {
    return Object.assign(state, payload)
  }
}

const effects = {
  async fetchCongestion(payload, rootState, callback) {
    const response = await queryCongestion({
      crudType: 'retrieve',
      current: 1,
      size: 999,
      ...payload
    });
    if(!response) return;
    this.save({
      congestions: [...response.data]
    });
    callback && callback(response.data);
  }
}

export default {
  state,
  reducers,
  effects
}