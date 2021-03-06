import { Toast, Modal } from 'antd-mobile';
import { push } from 'connected-react-router';
import { queryCloudToken, queryCloudCurrentUser, bindUserFromCloud } from '@/api/sso';
import { setToken, getAnyToken } from '@/utils/token';
import { APP_ID, APP_SECRET } from '@/constants';
import { anyLogin } from '@/api/anyService';

const state = {}

const effects = dispatch => ({
  async fetchCloudToken() {
    const response = await queryCloudToken({
      grant_type:'client_credential',
      appId: APP_ID,
      secret: APP_SECRET,
      timestamp: Date.now(),
      scope: 'app'
    });
    if(
      !response || 
      (response && typeof response === 'string')
    ) return false;
    const { accessToken } = response.data;
    return accessToken;
    //this.fetchCloudCurrentUser({ticket, access_token})
  },
  async fetchCloudCurrentUser(payload) {
    const response = await queryCloudCurrentUser(payload);
    if(
      !response || 
      (response && typeof response === 'string')
    ) return;
    return response;
  },
  async bindUserFromCloud(payload){
    if(!getAnyToken()) {
      await anyLogin();
    }
    const response = await bindUserFromCloud(payload);
    if(!response) {
      Modal.alert('提示', '账号绑定失败，请手动登录', 
      [{ text: '取消' },
      { text: '去登录', onPress:() => dispatch(push('/login')) }]);
      return;
    }
    Toast.hide();
    setToken(response.data.access_token);
    dispatch.user.fetchCurrentMenu();
    dispatch.user.fetchCurrentUser();
  },
  async loginSSO(ticket) {
    Toast.loading('单点登录...',0);
    const accessToken = await this.fetchCloudToken();
    const currentUser = await this.fetchCloudCurrentUser({appid:APP_ID, ticket, accessToken});
    if(!accessToken || !currentUser) {
      return dispatch.user.logout();
    }
    this.bindUserFromCloud({
      appid: APP_ID,
      version: 'v10',
      ticket,
      accessToken
    });
  }
})

export default {
  state,
  effects
}