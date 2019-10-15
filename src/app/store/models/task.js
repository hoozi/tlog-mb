import { queryTask, crudTaskTrack, queryTrackNode, queryRoute } from '@/api/task';
import { Toast } from 'antd-mobile';
import isArray from 'lodash/isArray';

const state = {
  beginPageIndex: 1,
  current: 1,
  endPageIndex: 2,
  pageCount: 0,
  recordCount: 0,
  recordList: [],
  taskNodes: [],
  size: 10,
  nodes: [],
  node: {},
  route: []
}

const reducers = {
  save(state, payload) {
    const recordList = state.recordList.length ? 
        [...state.recordList, ...payload.recordList] : 
        payload.recordList;
    return Object.assign(state, {...payload, recordList})
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
    this.save({
      recordList: [...response.data]
    });
    callback && callback(response.data);
  },
  async fetchRoute(payload, rootState, callback) {
    const response = await queryRoute({
      crudType: 'retrieve',
      beginTime: '2019-09-24 00:00:00',
      endTime: '2019-09-30 00:00:00',
      mmsi: '413620690',
      ...payload
    });
    if(!response) return;
    this.save({
      route: [...response.data],
      recordList: []
    });
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
    this.save({
      taskNodes:response.data.recordList,
      recordList: []
    });
    callback && callback(response.data);
  },
  async fetchTrackNode(payload, rootState, callback) {
    const response = await queryTrackNode({
      crudType: 'retrieve',
      ...payload
    });
    if(!response) return;
    this.save(isArray(response.data) ? {nodes: [...response.data],recordList: []} : {node: {...response.data},recordList: []});
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