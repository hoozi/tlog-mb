import { 
  queryCargoInfo, 
  queryCargoType, 
  queryTransportName, 
  queryLocation, 
  queryCustomerByName,
  queryDict, 
  upload, 
  queryUploadKey, 
  bindFile, 
  queryOrg,
  queryCompany,
  checkUpgrade
} from '@/api/common';
import { Toast } from 'antd-mobile';

const state = {
  cargoInfo: [],
  cargoType: [],
  location: [],
  transportType: [],
  workType: [],
  transports: [],
  transportSplice: [],
  orgs: [],
  orgSplice: [],
  transport: {},
  uploadKey: '',
  url: '',
  attachmentInfos: [],
  customers: [],
  customerSlice: [],
  servicers: [],
  servicerSlice: [],
  companys: [],
  companySlice: []
}

const reducers = {
  save(state, payload) {
    return Object.assign(state, payload)
  },
  saveAttachments(state, payload) {
    const attachmentInfos = state.attachmentInfos;
    const merge = [...payload, ...attachmentInfos];
    return Object.assign(state, {attachmentInfos: merge});
  },
  clearAttachments(state) {
    return Object.assign(state, {attachmentInfos: []})
  }
}

const effects = dispatch => ({
  async fetchCargoInfo(payload) {
    const response = await queryCargoInfo(payload);
    if(!response) return;
    this.save({
      cargoInfo: response.data.slice(0,20)
    })
  },
  async fetchTransportName(payload) {
    const response = await queryTransportName({
      crudType: 'retrieve'
    });
    if(!response) return;
    this.save({
      transports: response.data.map(item=>({...item, key: `${item.chineseName}_${item.englishName}`})),
      transportSplice: response.data.slice(0,20)
    })
  },
  async fetchOrg(payload, rootState, callback) {
    if(typeof callback === 'undefined') {
      callback = payload;
      payload = {};
    }
    const response = await queryOrg({
      crudType: 'retrieve'
    });
    if(!response) return;
    this.save({
      orgs: response.data,
      orgSplice: response.data.slice(0,20)
    });
    callback && callback(response.data);
  },
  findCompanyByName(payload,rootState, callback) {
    const {name} = payload;
    const companySlice = rootState.common.companys.filter(item => {
      return item.label.indexOf(name) > -1
    }).slice(0,20);
    this.save({
      companySlice
    });
    callback && callback();
  },
  async fetchCompany(payload) {
    const response = await queryCompany({
      crudType: 'retrieve',
      "operateType":"getAllOperatorCompanyName"
    });
    if(!response) return;
    this.save({
      companys: response.data,
      companySlice: response.data.slice(0,20)
    })
  },
  findTransports(payload, rootState) {
    const { name } = payload;
    const capitalization = name.toUpperCase()
    const transportSplice = rootState.common.transports.filter(item => {
      return item.key.indexOf(capitalization) > -1
    }).slice(0,20);
    this.save({
      transportSplice
    })
  },
  findOrgs(payload, rootState) {
    const { name } = payload;
    const orgSplice = rootState.common.orgs.filter(item => {
      return item.name.indexOf(name) > -1;
    }).slice(0,20);
    this.save({
      orgSplice
    })
  },
  async fetchTransportById(payload) {
    const response = await queryTransportName({
      crudType: 'retrieve',
      id: payload.id
    });
    if(!response) return;
    this.save({
      transport: response.data[0]
    })
  },
  async fetchCargoType() {
    const response = await queryCargoType();
    if(!response) return;
    this.save({
      cargoType: response.data
    })
  },
  
  async fetchCustomer() {
    const response = await queryCustomerByName({
      "crudType":"retrieve","type":"customer"
    });
    if(!response) return;
    this.save({
      customers: response.data,
      customerSlice: response.data.slice(0,20)
    });
  },
  async findCustomerByName(payload, rootState, callback) {
    const { name } = payload;
    const customerSlice = rootState.common.customers.filter(item => {
      return item.fullName.indexOf(name) > -1;
    }).slice(0,20);
    this.save({
      customerSlice
    });
    callback && callback();
  },
  async findServicerByName(payload, rootState, callback) {
    const { name } = payload;
    const servicerSlice = rootState.common.servicers.filter(item => {
      return item.fullName.indexOf(name) > -1;
    }).slice(0,20);
    this.save({
      servicerSlice
    });
    callback && callback();
  },
  async fetchServicer() {
    const response = await queryCustomerByName({
      "crudType":"retrieve","type":"carrier"
    });
    if(!response) return;
    this.save({
      servicers: response.data,
      servicerSlice: response.data.slice(0,20)
    });
  },
  async fetchLocation(payload) {
    const response = await queryLocation(payload);
    if(!response) return;
    this.save({
      location: response.data.slice(0,20)
    })
  },
  async fetchTransportType() {
    const response = await queryDict({dictName: '运力类型'});
    if(!response) return;
    this.save({
      transportType: response.data
    })
  },
  async fetchWorkType() {
    const response = await queryDict({dictName: '作业类型'});
    if(!response) return;
    this.save({
      workType: response.data
    })
  },
  async upload(payload, rootState, callback) {
    const { fd, file } = payload;
    const response = await upload(fd);
    if(!response) return;
    if((response.hasOwnProperty('status') && response.status !== 'success') || !response.hasOwnProperty('status')) {
      return Toast.fail('上传失败');
    }
    this.saveAttachments([{fileName: file.name, size: file.size, url: response.url, description: Date.now() }]);
    callback && callback(response.url)
    //dispatch.common.fetchUploadKey({formId: FORM_ID}, callback);
  },
  async fetchUploadKey(payload, rootStaste, callback) {
    const response = await queryUploadKey(payload); 
    if(!response) return;
    this.save({
      uploadKey: response.data
    })
    callback && callback(response.data);
    //dispatch.common.bindFile({formId, id: response.data }, callback)
  },
  async bindFile(payload, {common:{attachmentInfos}}, callback) {
    const response = await bindFile({
      operateType: 'upload',
      attachmentPanels: ['attachmentpanel'],
      attachmentInfos,
      ...payload
    });
    if(!response) return;
    this.clearAttachments();
    callback && callback(response.data.collection)
  },
  async checkUpgrade(payload) {
    let callback;
    if(typeof payload === 'function') {
      callback = payload;
    } else {
      callback = () => null
    }
    const response = await checkUpgrade();
    if(!response) return;
    callback && callback(response)
  }
})


export default {
  state,
  reducers,
  effects
}