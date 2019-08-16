import service from '@/api/any';

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
    const response = await service('queryCargoInfo', payload);
    if(!response) return;
    this.save({
      cargoInfo: response.data.splice(0,20)
    })
  },
  async fetchCargoType() {
    const response = await service('queryCargoType');
    if(!response) return;
    this.save({
      cargoType: response.data
    })
  },
  async fetchLocation() {
    const response = await service('queryLocation');
    if(!response) return;
    this.save({
      location: response.data
    })
  },
  async fetchTransportType() {
    const response = await service('queryDict', {dictName: '运力类型'});
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