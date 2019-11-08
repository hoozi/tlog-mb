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
      appid: APP_ID,
      secret: APP_SECRET
    });
    if(
      !response || 
      (response && typeof response === 'string')
    ) return false;
    const { access_token } = response;
    return access_token;
    //this.fetchCloudCurrentUser({ticket, access_token})
  },
  async fetchCloudCurrentUser(payload) {
    const response = await queryCloudCurrentUser(payload);
    if(
      !response || 
      (response && typeof response === 'string')
    ) return false;
    return response;
  },
  async bindUserFromCloud(payload){
    if(!getAnyToken()) {
      await anyLogin();
    }
    const response = await bindUserFromCloud(payload);
    if(!response) {
      return Modal.alert('提示', '账号绑定失败，请手动登录', 
      { text: '取消' },
      { text: '去登录', onPress:() => dispatch(push('/login')) })
    }
    setToken(response.data.access_token);
    dispatch.user.fetchCurrentMenu();
    dispatch.user.fetchCurrentUser();
    Toast.hide();
  },
  async loginSSO(ticket) {
    Toast.loading('请稍候...');
    const access_token = await this.fetchCloudToken();
    const currentUser = await this.fetchCloudCurrentUser({ticket, access_token});
    if(!access_token || !currentUser) {
      return dispatch.user.logout();
    }
    this.bindUserFromCloud({
      ticket,
      access_token
    });
  }
})

export default {
  state,
  effects
}