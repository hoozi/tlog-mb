import { crudPriceReply, priceReview } from '@/api/priceReply';
import { Toast } from 'antd-mobile';

const state = {
  beginPageIndex: 1,
  current: 1,
  endPageIndex: 2,
  pageCount: 0,
  recordCount: 0,
  recordList: [],
  detail: [],
  size: 10
}

const reducers = {
  save(state, payload) {
    const recordList = state.recordList.length?[...state.recordList, ...payload.recordList] : payload.recordList;
    return Object.assign(state, {...payload, recordList})
  }
}

const effects = {
  async fetchPriceReply(payload, rootState, callback) {
    const response = await crudPriceReply({
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
  async fetchPriceReview(payload, rootState, callback) {
    const response = await priceReview({
      crudType: 'retrieve',
      operateType: 'listEnquiryAudits',
      current: 1,
      size: 10,
      ...payload
    });
    if(!response) return;
    this.save({...response.data});
    callback && callback(response.data);
  },
  async updatePriceReview(payload, rootState, callback) {
    const response = await priceReview({
      crudType: 'update',
      ...payload
    });
    if(!response) return;
    callback && callback();
  },
  async updatePriceReply(payload, rootState, callback) {
    const response = await crudPriceReply({
      crudType: 'create',
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