import service from '@/api/any';

const state = {
  news: {
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
  async fetchNews(payload) {
    const response = await service('queryNews', payload);
    if(!response) return;
    this.save({
      news:{...response.data}
    });
  }
}


export default {
  state,
  reducers,
  effects
}