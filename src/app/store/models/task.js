import { queryTask, queryTaskTrack, queryTrackNode } from '@/api/task';

const state = {
  beginPageIndex: 1,
  current: 1,
  endPageIndex: 2,
  pageCount: 0,
  recordCount: 0,
  recordList: [],
  size: 10,
  nodes: []
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
      operateType: 'lastNode',
      current: 1,
      size: 10,
      ...payload
    });
    if(!response) return;
    this.save({...response.data});
    callback && callback(response.data);
  },
  async fetchTaskTrack(payload, rootState, callback) {
    const response = await queryTaskTrack({
      crudType: 'retrieve',
      current: 1,
      size: 10,
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
    this.save({nodes: [...response.data]});
    callback && callback(response.data);
  }
}


export default {
  state,
  reducers,
  effects
}