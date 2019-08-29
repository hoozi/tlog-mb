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
  async fetchNews(payload) {
    const response = await service('queryNews', {
      crudType: 'retrieve',
      current: 1,
      size: 10,
      status: 'P',
      ...payload
    });
    if(!response) return;
    this.save({...response.data});
    callback && callback(response.data);
  }
}


export default {
  state,
  reducers,
  effects
}