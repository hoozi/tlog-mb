import service from '@/api/any';
import { Toast } from 'antd-mobile';

const state = {
  beginPageIndex: 1,
  current: 1,
  endPageIndex: 2,
  pageCount: 0,
  recordCount: 0,
  recordList: [],
  size: 10
}

const reducers = {
  save(state, payload) {
    return Object.assign(state, payload)
  }
}

const effects = {
  async fetchPriceReply(payload, rootState, callback) {
    const response = await service('crudPriceReply', {
      crudType: 'retrieve',
      current: 1,
      size: 10,
      type: 0,
      ...payload
    });
    if(!response) return;
    this.save({...response.data});
    callback && callback(response.data);
  },
  async updatePriceReply(payload, rootState, callback) {
    const response = await service('crudPriceReply', {
      crudType: 'update',
      ...payload
    });
    if(!response) return;
    Toast.success('回复成功');
    callback && callback();
  }
}


export default {
  state,
  reducers,
  effects
}