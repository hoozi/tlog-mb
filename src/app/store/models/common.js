import { queryCargoInfo, queryCargoType, queryLocation, queryDict, upload, queryUploadKey, bindFile } from '@/api/common';
import { Toast } from 'antd-mobile';

const state = {
  cargoInfo: [],
  cargoType: [],
  location: [],
  transportType: [],
  uploadKey: '',
  url: '',
  attachmentInfos: []
}

const FORM_ID = 'nbg_fl_task_trace'

const reducers = {
  save(state, payload) {
    return Object.assign(state, payload)
  }
}

const effects = dispatch => ({
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
  },
  async upload(payload, rootState, callback) {
    const { fd, file } = payload;
    const response = await upload(fd);
    if(!response) return;
    if((response.hasOwnProperty('status') && response.status !== 'success') || !response.hasOwnProperty('status')) {
      return Toast.fail('上传失败');
    }
    this.save({
      url: response.url,
      attachmentInfos: [{fileName: file.name, size: file.size, url: response.url, description: Date.now() }]
    })
    dispatch.common.fetchUploadKey({formId: FORM_ID}, callback);
  },
  async fetchUploadKey(payload, rootStaste, callback) {
    const response = await queryUploadKey(payload); 
    if(!response) return;
    this.save({
      uploadKey: response.data
    });
    dispatch.common.bindFile({formId: FORM_ID, id: response.data }, callback)
  },
  async bindFile(payload, {common:{url, attachmentInfos}}, callback) {
    const response = await bindFile({
      operateType: 'upload',
      attachmentPanels: ['attachmentpanel'],
      attachmentInfos
    });
    if(!response) return;
    callback && callback(url)
  }
})


export default {
  state,
  reducers,
  effects
}