import { queryVovage, queryAisAlone } from '@/api/vovage';
import { queryMMSI } from '@/api/task';

const state = {
  vovage: {},
  ais: {}
}

const reducers = {
  save(state, payload) {
    return Object.assign(state, payload)
  }
}

const effects = {
  async fetchVovage(payload, rootState, callback) {
    const response = await queryVovage({
      crudType: 'retrieve',
      ...payload
    });
    if(!response) return;
    this.save({
      vovage: response.data
    });
    callback && callback(response.data);
  },
  async fetchAisAlone(payload, rootState, callback) {
    const { chineseName, ...restPayload } = payload;
    const mmsiResponse = await queryMMSI({
      crudType: 'retrieve',
      chineseName
    })
    if(!mmsiResponse || !mmsiResponse.data.length) return;
    const { mmsi='' } = mmsiResponse.data[0]
    if(!mmsi) return;
    const response = await queryAisAlone({
      crudType: 'retrieve',
      mmsi,
      ...payload
    });
    if(!response) return;
    this.save({
      ais: response.data[0]
    });
    callback && callback(response.data[0]);
  }
}

export default {
  state,
  reducers,
  effects
}