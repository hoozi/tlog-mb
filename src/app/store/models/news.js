import service from '@/api/any';

const state = {
  beginPageIndex: 1,
  current: 1,
  endPageIndex: 2,
  pageCount: 0,
  recordCount: 0,
  recordList: [],
  size: 10,
  detail: {}
}

const reducers = {
  save(state, payload) {
    return Object.assign(state, payload)
  }
}

const effects = {
  async fetchNews(payload, rootState, callback) {
    const { crudType='retrieve' } = payload;
    const response = await service('queryNews', {
      crudType,
      current: 1,
      size: 9,
      status: 'P',
      ...payload
    });
    if(!response) return;
    const saveData = crudType === 'retrieve' ? {...response.data} : { detail:response.data[0] }
    this.save(saveData);
    callback && callback(response.data);
  }
}


export default {
  state,
  reducers,
  effects
}