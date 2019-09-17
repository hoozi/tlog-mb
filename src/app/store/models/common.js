import { queryCargoInfo, queryCargoType, queryLocation, queryDict } from '@/api/common';

const state = {
  cargoInfo: [],
  cargoType: [],
  location: [],
  transportType: []
}

const reducers = {
  save(state, payload) {
    return Object.assign(state, payload)
  }
}

const effects = {
  async fetchCargoInfo(payload) {
    const response = await queryCargoInfo(payload);
    if(!response) return;
    this.save({
      cargoInfo: response.data.splice(0,20)
    })
  },
  async fetchCargoType() {
    const response = await queryCargoType();
    if(!response) return;
    this.save({
      cargoType: response.data
    })
  },
  async fetchLocation() {
    const response = await queryLocation();
    if(!response) return;
    this.save({
      location: response.data
    })
  },
  async fetchTransportType() {
    const response = await queryDict({dictName: '运力类型'});
    if(!response) return;
    this.save({
      transportType: response.data
    })
  }
}


export default {
  state,
  reducers,
  effects
}