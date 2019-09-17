import anyService from '@/api/anyService';
import { productKeep } from '@/api/product';
import { Toast } from 'antd-mobile';

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
  async fetchProduct(payload, rootState, callback) {
    const response = await anyService('queryProduct', {
      crudType: 'retrieve',
      current: 1,
      size: 10,
      ...payload
    });
    if(!response) return;
    this.save({...response.data});
    callback && callback(response.data);
  },
  async fetchProductDetail(payload, rootState, callback) {
    const response = await anyService('queryProduct', {
      crudType: 'selectById',
      ...payload
    });
    if(!response) return;
    this.save({
      detail: {...response.data}
    });
    callback && callback(response.data);
  },
  async productKeep(payload, rootState, callback) {
    const { crudType } = payload;
    const response = await productKeep(payload);
    if(!response) return;
    Toast.success(crudType === 'create' ? '收藏成功' : '取消成功');
    callback && callback(response.data);
  }
}


export default {
  state,
  reducers,
  effects
}