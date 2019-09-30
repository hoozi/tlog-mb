import { queryToken,queryCurrentUser,queryCurrentMenu } from '@/api/common';
import { Toast } from 'antd-mobile';
import { goBack, push } from 'connected-react-router';
import isEmpty from 'lodash/isEmpty';
import { setToken, setUser, removeToken, removeUser, removePermission } from '@/utils/token';
import { getMenu } from '@/utils';

const state = {
  currentUser: {}
}

const reducers = {
  save(state, payload) {
    const currentUser = { currentUser: payload };
    return Object.assign(state, currentUser);
  }
}

const effects = dispatch => ({
  async fetchToken(payload, rootState, callback) {
    Toast.loading('登录中...', 0);
    const response = await queryToken({
      tenantid: 'next',
      accountId: '1542003592082020204',
      logintype: '2',
      ...payload
    });
    if(!response) return;
    const { access_token } = response.data;
    setToken(access_token);
    
    this.fetchCurrentUser();
    this.fetchCurrentMenu();
    
    callback && callback();
  },
  async fetchCurrentUser() {
    const response = await queryCurrentUser();
    if(!response) return;
    this.save({...response.data});
    setUser(response.data);
    Toast.hide();
    dispatch(goBack());
  },
  async fetchCurrentMenu() {
    const response = await queryCurrentMenu({
      crudType: 'retrieve',
      operateType: 'currentUserFlatAppMenu'
    });
    if(!response) return;
    getMenu(response.data);
  },
  async logout() {
    removeToken();
    removeUser();
    removePermission();
    dispatch(push('/login'));
  }
})


export default {
  state,
  reducers,
  effects
}