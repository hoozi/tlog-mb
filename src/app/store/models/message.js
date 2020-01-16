import { 
  queryMessage, 
} from '@/api/message';

const state = {
  messages: []
}

const reducers = {
  save(state, payload) {
    return Object.assign(state, payload)
  }
}

const effects = {
  async fetchMessage(payload) {
    const response = await queryMessage({
      crudType: 'retrieve',
      ...payload
    });
    if(!response) return;
    this.save({
      messages: response.data
    })
  }
}


export default {
  state,
  reducers,
  effects
}