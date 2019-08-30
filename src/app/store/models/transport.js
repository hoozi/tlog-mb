import service from '@/api/any';
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
  async fetchTransport(payload, rootState, callback) {
    const response = await service('crudTransport', {
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
    const response = await service('crudTransport', {
      crudType: 'update',
      ...payload
    });
    if(!response) return;
    Toast.success('操作成功');
    callback && callback();
  },
  async createTransport(payload, rootState, callback) {
    const { message = '', ...params } = payload
    const response = await service('crudTransport', {
      crudType: 'create',
      ...params
    });
    if(!response) return;
    Toast.success(message, 2, () => {
      document.documentElement.scrollTop = 0;
      dispatch(push('/transport?type=all'));
    });
    callback && callback();
  }
})


export default {
  state,
  reducers,
  effects
}