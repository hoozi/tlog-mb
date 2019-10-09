import { queryTide } from '@/api/tide';

const state = {
  tides: []
}

const reducers = {
  save(state, payload) {
    return Object.assign(state, payload)
  }
}

const effects = {
  async fetchTide(payload, rootState, callback) {
    const response = await queryTide({
      crudType: 'retrieve',
      ...payload
    }, true);
    if(!response) return;
    this.save({tides:response.data});
    callback && callback(response.data);
  }
}


export default {
  state,
  reducers,
  effects
}