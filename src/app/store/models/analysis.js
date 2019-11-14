import { queryYMWAnalysis } from '@/api/analysis';

const state = {
  analysisList: []
}

const reducers = {
  save(state, payload) {
    return Object.assign(state, payload)
  }
}

const effects = {
  async fetchYMWAnalysis(payload, rootState, callback) {
    const response = await queryYMWAnalysis({
      crudType: 'retrieve',
      ...payload
    });
    if(!response) return;
    this.save({
      analysisList: [...response.data]
    });
    callback && callback(response.data);
  }
}


export default {
  state,
  reducers,
  effects
}