import service from '@/api/any';
import { Toast } from 'antd-mobile';

const state = {
  news: {
    beginPageIndex: 1,
    current: 1,
    endPageIndex: 2,
    pageCount: 0,
    recordCount: 0,
    recordList: [],
    size: 10
  },
  cargo: {
    beginPageIndex: 1,
    current: 1,
    endPageIndex: 2,
    pageCount: 0,
    recordCount: 0,
    recordList: [],
    size: 10
  },
  cargoInfo: [],
  cargoType: [],
  location: []
}

const reducers = {
  save(state, payload) {
    return Object.assign(state, payload)
  }
}

const effects = {
  async fetchNews(payload) {
    const response = await service('queryNews', payload);
    if(!response || !response.success) return;
    this.save({
      news:{...response.data}
    });
  },
  async fetchCargo(payload, rootState, callback) {
    const response = await service('cargo', {
      crudType: 'retrieve',
      current: 1,
      size: 10,
      ...payload
    });
    if(!response || !response.success) return;
    this.save({
      cargo:{...response.data}
    });
    callback && callback(response.data);
  },
  async updateCargo(payload, rootState, callback) {
    const response = await service('cargo', {
      crudType: 'update',
      ...payload
    });
    if(!response || !response.success) return;
    Toast.success('操作成功');
    callback && callback();
  },
  async changeCargoToBill(payload, rootState, callback) {
    const response = await service('cargo', {
      crudType: 'create',
      ...payload
    });
    if(!response || !response.success) return;
    Toast.success('转订单成功');
    callback && callback();
  },
  async createCargo(payload, state, callback) {
    const response = await service('cargo', {
      crudType: 'create',
      ...payload
    });
    if(!response || !response.success) return;
    Toast.success('货盘发布成功');
    callback && callback();
  },
  async fetchCargoInfo(payload) {
    const response = await service('queryCargoInfo', payload);
    if(!response || !response.success) return;
    this.save({
      cargoInfo: response.data.splice(0,20)
    })
  },
  async fetchCargoType() {
    const response = await service('queryCargoType');
    if(!response || !response.success) return;
    this.save({
      cargoType: response.data
    })
  },
  async fetchLocation() {
    const response = await service('queryLocation');
    if(!response || !response.success) return;
    this.save({
      location: response.data
    })
  }
}


export default {
  state,
  reducers,
  effects
}