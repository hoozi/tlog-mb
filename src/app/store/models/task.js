import service from '@/api/any';

const state = {
  
}

const reducers = {
  save(state, payload) {
    return Object.assign(state, payload)
  }
}

const effects = {
  async fetchTask(payload, rootState, callback) {
    const response = await service('queryTask', {
      crudType: 'retrieve',
      operateType: 'lastNode',
      current: 1,
      size: 10,
      ...payload
    });
    if(!response) return;
    this.save({...response.data});
    callback && callback(response.data);
  }
}


export default {
  state,
  reducers,
  effects
}