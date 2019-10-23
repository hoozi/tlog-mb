import { crudCargo } from '@/api/cargo';
import anyService from '@/api/anyService';
import { push } from 'connected-react-router';
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

const effects = dispatch => ({
  async fetchCargo(payload, rootState, callback) {
    const response = await crudCargo({
      crudType: 'retrieve',
      current: 1,
      size: 10,
      ...payload
    });
    if(!response) return;
    this.save({...response.data});
    callback && callback(response.data);
  },
  async fetchAnyCargo(payload, rootState, callback) {
    const response = await anyService('queryAnyCargo', {
      crudType: 'retrieve',
      current: 1,
      size: 10,
      ...payload
    });
    if(!response) return;
    this.save({...response.data});
    callback && callback(response.data);
  },
  async updateCargo(payload, rootState, callback) {
    const response = await crudCargo({
      crudType: 'update',
      ...payload
    });
    if(!response) return;
    Toast.success('操作成功');
    callback && callback();
  },
  async createCargo(payload, rootState, callback) {
    const { message = '', ...params } = payload
    const response = await crudCargo({
      crudType: 'create',
      ...params
    });
    if(!response) return;
    Toast.success(message/* , 2, () => {
      document.documentElement.scrollTop = 0;
      dispatch(push('/cargo?type=all'));
    } */);
    callback && callback();
  }/* ,
  async createCargoAndUpload(payload, rootState, callback) {
    const createCargoResponse = await crudCargo({
      crudType: 'create',
      ...payload
    });
    if(!createCargoResponse) return;
    const createdCargoId = createCargoResponse.data;
    const uploadCargoResponse = await crudCargo({
      crudType: 'update',
      id: createdCargoId,
      status: 20
    });
    if(!uploadCargoResponse) return;
    Toast.success('提交并上报成功'/* , 2, () => {
      document.documentElement.scrollTop = 0;
      dispatch(push('/cargo?status=20'));
    } *//*);
    callback && callback();
  } */
})

export default {
  state,
  reducers,
  effects
}