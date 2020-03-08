import { queryBarAnalysis,queryPieAnalysis,queryOrderTaskAnalysis, queryPriceAnalysis } from '@/api/analysis';
import flatten from 'lodash/flatten';
import isEmpty from 'lodash/isEmpty';
import { toFixed2 } from '@/utils'

const parsePieData = (data, key) => ( 
  data.length ? data.map((item, index) => {
    const {customer: name, quantity: x} = item;
    return {
      id: `${key}_${index}`,
      name: name || `未知${index}`,
      x,
      y: 1
    }
  }) : []
)

const state = {
  barData: [],
  picker: [],
  allPriceData: [],
  placePicker:[],
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
    const picker = response.data.map((item, index) => {
      const { customer:label } = item;
      return {
        label,
        value: index+1
      }
    });
    const barData = response.data.map(item => {
      const histogramItemList = item.histogramItemList.map(item=> {
        const { year:name, month, quantity:y=0 } = item;
        return {
          name,
          x:`${month}月`,
          y: toFixed2(y/10000)
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
          [`${item.year}_${item.month}`]: item.quantity ? item.quantity : 0
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
      const y = toFixed2(temp[item]/10000);
      const allItem = {
        name,
        x:`${x}月`,
        y
      }
      histogramItemList.push(allItem);
    })
    
    barData.unshift({
      customer: 'all',
      customerId: 0,
      histogramItemList
    });
    picker.unshift({
      label: '全部',
      value: 0
    });
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
    const pieData = response.data.map((item, index) => {
      return parsePieData(item, index)
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
  findPriceByIndex(payload, rootState, callback) {
    const { index } = payload;
    const currentIndexData = rootState.analysis.allPriceData[index];
    const data = currentIndexData.filter(item => !isEmpty(item));
    const placePicker = data.map((item, index) => {
      return {
        label: `${item.starting} 到 ${item.destination}`,
        value: index,
        start: item.starting,
        end: item.destination
      }
    })
    const price = data.map(item => {
      const priceList = item.priceList.map(item => ({
        name: '运价',
        x: `${item.month}月`,
        y: item.cost
      }));
      return {
        ...item,
        priceList
      }
    })
    this.save({
      placePicker,
      price
    });
    callback && callback(price)
  },
  async fetchPriceAnalysis(payload, rootState, callback) {
    const response = await queryPriceAnalysis({
      crudType: 'retrieve'
    });
    if(!response) return;
    const allPriceData = response.data;
    this.save({
      allPriceData
    });
    callback && callback();
  }
}

export default {
  state,
  reducers,
  effects
}