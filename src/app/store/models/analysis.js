import { queryYMWAnalysis } from '@/api/analysis';
import uniqBy from 'lodash/uniqBy';

const state = {
  analysisList: [],
  customers: []
}

const reducers = {
  save(state, payload) {
    return Object.assign(state, payload)
  }
}

const effects = {
  async fetchYMWAnalysis(payload, rootState, callback) {
    if(typeof callback === 'undefined') {
      callback = payload;
      payload = {};
    }
    const response = await queryYMWAnalysis({
      crudType: 'retrieve',
      ...payload
    });
    if(!response) return;
    const customerToPickerData = response.data.map(item => {
      const { customer:label, customerId:value } = item;
      return {
        label,
        value
      }
    })
    const customers = uniqBy(customerToPickerData, 'value');
    this.save({
      analysisList: [...response.data],
      customers
    });
    callback && callback(customers);
  }
}


export default {
  state,
  reducers,
  effects
}