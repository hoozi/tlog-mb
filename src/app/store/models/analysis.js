import { queryBarAnalysis,queryPieAnalysis,queryOrderTaskAnalysis, queryPriceAnalysis } from '@/api/analysis';
import flatten from 'lodash/flatten';

const parsePieData = data => ( 
  data.length ? data.map((item, index) => {
    const {customer: name, quantity: x} = item;
    return {
      name: name || `未知${index}`,
      x,
      y: 1
    }
  }) : []
)

const state = {
  barData: [],
  picker: [],
  pieData: [],
  orderTask: [],
  price: [],
  place: []
}

const reducers = {
  save(state, payload) {
    return Object.assign(state, payload)
  }
}

const effects = {
  async fetchBarAnalysis(payload, rootState, callback) {
    const temp = {};
    const histogramItemList = [];
    const response = await queryBarAnalysis({
      crudType: 'retrieve',
      ...payload
    });
    if(!response) return;
    const picker = response.data.map(item => {
      const { customer:label, customerId:value } = item;
      return {
        label,
        value
      }
    });
    const barData = response.data.map(item => {
      const histogramItemList = item.histogramItemList.map(item=> {
        const { year:name, month, quantity:y } = item;
        return {
          name,
          x:`${month}月`,
          y
        }
      })
      return {
        ...item,
        histogramItemList
      }
    });
    const mappedHistogramItemList = response.data.map(item => {
      return [...item.histogramItemList.map(item=>{
        return {
          [`${item.year}_${item.month}`]: item.quantity
        }
      })]
    });
    flatten(mappedHistogramItemList).forEach(item => {
      const key = Object.keys(item)[0];
      temp[key] = temp.hasOwnProperty(key) ? temp[key]+item[key] : item[key]
    });
    Object.keys(temp).forEach(item => {
      const splited = item.split('_');
      const name = splited[0];
      const x = splited[1];
      const y = temp[item];
      const allItem = {
        name,
        x:`${x}月`,
        y
      }
      histogramItemList.push(allItem);
    })
    barData.push({
      customer: 'all',
      customerId: -1,
      histogramItemList
    });
    picker.unshift({
      label: '全部',
      value: -1
    })
    this.save({
      barData,
      picker
    });
    callback && callback(barData);
  },
  async fetchPieAnalysis(payload, rootState, callback) {
    const response = await queryPieAnalysis({
      crudType: 'retrieve',
      ...payload
    });
    if(!response) return;
    const pieData = response.data.map(item => {
      return parsePieData(item)
    })
    this.save({
      pieData
    });
    callback && callback(pieData);
  },
  async fetchOrderTaskAnalysis(callback) {
    const response = await queryOrderTaskAnalysis({
      crudType: 'retrieve'
    });
    if(!response) return;
    this.save({
      orderTask: [...response.data]
    });
    callback && callback(response.data)
  },
  async fetchPriceAnalysis(callback) {
    const response = await queryPriceAnalysis({
      crudType: 'retrieve'
    });
    if(!response) return;
    this.save({
      price: [...response.data]
    });
    callback && callback(response.data)
  }
}

export default {
  state,
  reducers,
  effects
}