import { queryToken,queryCurrentUser } from '@/api/common';
import { setToken } from '@/utils/token';
import isEmpty from 'lodash/isEmpty';

const state = {
  currentUser: {}
}

const reducers = {
  save(state, payload) {
    const currentUser = { currentUser: payload };
    return Object.assign(state, currentUser);
  }
}

const effects = {
  async fetchToken(payload, rootState, callback) {
    const response = await queryToken({
      tenantid: 'next',
      accountId: '1542003592082020204',
      logintype: '2',
      ...payload
    });
    if(!response) return;
    const { access_token } = response.data;
    setToken(access_token);
    if(isEmpty(rootState.user.currentUser)) {
      this.fetchCurrentUser();
    }
    callback && callback();
  },
  async fetchCurrentUser() {
    const response = await queryCurrentUser();
    if(!response) return;
    this.save({...response.data})
  }
}


export default {
  state,
  reducers,
  effects
}