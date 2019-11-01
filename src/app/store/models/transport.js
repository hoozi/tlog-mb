import anyService from '@/api/anyService';
import { crudTransport } from '@/api/transport';
//import { push } from 'connected-react-router';
import { Toast } from 'antd-mobile';
import isArray from 'lodash/isArray';

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
  async fetchTransport(payload, rootState, callback) {
    const { common: {orgs} } = rootState;
    if(!orgs.length) {
      await dispatch.common.fetchOrg()
    }
    const response = await crudTransport({
      crudType: 'retrieve',
      current: 1,
      size: 10,
      ...payload
    });
    if(!response) return;
    const params = isArray(response.data) ? { recordList: response.data } : { ...response.data }
    this.save({...params});
    callback && callback(response.data);
  },
  async fetchAnyTransport(payload, rootState, callback) {
    const response = await anyService('queryAnyTransport', {
      crudType: 'retrieve',
      current: 1,
      size: 10,
      ...payload
    });
    if(!response) return;
    this.save({...response.data});
    callback && callback(response.data);
  },
  async updateTransport(payload, rootState, callback) {
    const response = await crudTransport({
      crudType: 'update',
      ...payload
    });
    if(!response) return;
    Toast.success('操作成功');
    callback && callback();
  },
  async createTransport(payload, rootState, callback) {
    const { message = '', ...params } = payload
    const response = await crudTransport({
      crudType: 'create',
      ...params
    });
    if(!response) return;
    Toast.success(message/* , 2, () => {
      document.documentElement.scrollTop = 0;
      dispatch(push('/transport?type=all'));
    } */);
    callback && callback();
  }/* ,
  async createTransportAndUpload(payload, rootState, callback) {
    const createTransportResponse = await crudTransport({
      crudType: 'create',
      ...payload
    });
    if(!createTransportResponse) return;
    const createdTransportId = createTransportResponse.data;
    const uploadTransportResponse = await crudTransport({
      crudType: 'update',
      id: createdTransportId,
      status: 20
    });
    if(!uploadTransportResponse) return;
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