import { queryTask, crudTaskTrack, queryTrackNode } from '@/api/task';
import { Toast } from 'antd-mobile';
import isArray from 'lodash/isArray';

const state = {
  beginPageIndex: 1,
  current: 1,
  endPageIndex: 2,
  pageCount: 0,
  recordCount: 0,
  recordList: [],
  size: 10,
  nodes: [],
  node: {}
}

const reducers = {
  save(state, payload) {
    return Object.assign(state, payload)
  }
}

const effects = {
  async fetchTask(payload, rootState, callback) {
    const response = await queryTask({
      crudType: 'retrieve',
      current: 1,
      size: 10,
      ...payload
    });
    if(!response) return;
    this.save({...response.data});
    callback && callback(response.data);
  },
  async fetchTaskTrack(payload, rootState, callback) {
    const response = await crudTaskTrack({
      crudType: 'retrieve',
      current: 1,
      size: 999,
      ...payload
    });
    if(!response) return;
    this.save({...response.data});
    callback && callback(response.data);
  },
  async fetchTrackNode(payload, rootState, callback) {
    const response = await queryTrackNode({
      crudType: 'retrieve',
      ...payload
    });
    if(!response) return;
    this.save(isArray(response.data) ? {nodes: [...response.data]} : {node: {...response.data}});
    callback && callback(response.data);
  },
  async editNode(payload, rootState, callback) {
    const { message, ...params } = payload;
    const response = await crudTaskTrack({
      crudType: 'create',
      ...params
    });
    if(!response) return;
    Toast.success(message, 2);
    callback && callback();
  }
}


export default {
  state,
  reducers,
  effects
}