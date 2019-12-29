import { queryVovage, queryAisAlone, queryVovageInfo } from '@/api/vovage';
import { queryMMSI } from '@/api/task';

const state = {
  vovage: {},
  beginPageIndex: 1,
  current: 1,
  endPageIndex: 2,
  pageCount: 0,
  recordCount: 0,
  recordList: [],
  size: 10,
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
  async fetchVovageInfo(payload, rootState, callback) {
    const response = await queryVovageInfo({
      crudType: "retrieve",
      current: 1,
      size: 20,
      ...payload
    });
    if(!response) return;
    this.save({...response.data});
    callback && callback(response.data);
  },
  async fetchAisAlone(payload, rootState, callback) {
    this.save({
      ais: {}
    })
    const { chineseName, ...restPayload } = payload;
    const mmsiResponse = await queryMMSI({
      crudType: 'retrieve',
      chineseName
    })
    if(!mmsiResponse || !mmsiResponse.data.length) return;
    const { mmsi='' } = mmsiResponse.data[0]
    if(!mmsi) return
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