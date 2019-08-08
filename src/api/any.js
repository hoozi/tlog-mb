import request from '@/utils/request';

let token;

async function queryNews(params, token) {
  return request(`/ierp/kapi/app/nbg_qcwl/getAnnouncements?access_token=${token}`, {
    data: params
  })
}

async function queryToken() {
  return request('/ierp/api/login.do', {
    data:{
      tenantid: 'next',
      user: '15869399274',
      password: '1234567',
      accountId: '1542003592082020204',
      logintype: '2'
    }
  })
}

const serviceList = {
  queryNews
}

export default async function service(name, params){
  const response = await queryToken();
  token = response && response.state === 'success' ? response.data.access_token : '';
  return token ? serviceList[name](params, token) : null;
}