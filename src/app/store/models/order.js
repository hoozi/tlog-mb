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
  async fetchOrder(payload, rootState, callback) {
    const response = await service('queryOrder', {
      crudType: 'retrieve',
      current: 1,
      size: 10,
      ...payload
    });
    if(!response) return;
    this.save({...response.data});
    callback && callback(response.data);
  },
  async comment(payload, rootState, callback) {
    const response = await service('comment', {
      crudType: 'create',
      ...payload
    });
    if(!response) return;
    Toast.success('订单评价成功');
    callback && callback(response.data);
  }
}


export default {
  state,
  reducers,
  effects
}