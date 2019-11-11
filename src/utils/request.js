import axios from 'axios';
//import { getToken } from './token';
import { Toast } from 'antd-mobile';
import { getToken } from './token';

let serviceUrl = /* process.env.NODE_ENV === 'production' ? 'http://169.169.171.21' :  */'';

const whiteList = [
  'getProductInfo',
  'anon_pallet',
  'anon_transport',
  'app_token',
  'login.do',
  'getAnnouncements'
]

const codeMessage = {
  200: '服务器成功返回请求的数据',
  201: '新建或修改数据成功',
  202: '一个请求已经进入后台排队（异步任务）',
  204: '删除数据成功',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作',
  401: '用户没有权限（令牌、用户名、密码错误），请重新登录',
  403: '用户得到授权，但是访问是被禁止的',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作',
  406: '请求的格式不可得',
  410: '请求的资源被永久删除，且不会再得到的',
  422: '当创建一个对象时，发生一个验证错误',
  428: '发送请求时，缺少先决条件',
  500: '服务器发生错误，请检查服务器',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时',
};

const service = axios.create({
  baseURL: '/',
  timeout: 20000,
  withCredentials: true
});

// 请求前认证token
service.interceptors.request.use( request => {
  if (request.method === 'POST' || request.method === 'PUT') {
    if (!(request.data instanceof FormData)) {
      request.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...request.headers,
      };
      request.data = JSON.stringify(request.data);
    } else {
      // newOptions.body is FormData
      request.headers = {
        Accept: 'application/json',
        ...request.headers,
      };
    }
  }
  const headers = whiteList.some(item => {
    return request.url.indexOf(item) !== -1
  }) ? {} : {
    api: true,
    accessToken: getToken()
  }
  request.headers = {
    ...request.headers,
    ...headers
  }
  
  return request;
}, error => {
  Promise.reject(error);
});

// 返回时候的拦截处理
service.interceptors.response.use( response => response.data, response => {
  const { status,config:{url} } = response.response;
  if(url.indexOf('/cloud') !== -1) {
    Toast.fail('单点登录失败，请手动登录');
  } else {
    Toast.fail(codeMessage[status]);
  }
  throw response.response;
});

export default function request(url, options) {
  return service(`${serviceUrl}${url}`, {
    method: 'POST',
    ...options
  })
  .then(response => {
    const fail = (
      !response || 
      (('success' in response) && !response.success) || 
      (('state' in response) && response.state !== 'success')
    );
    if(fail) {
      Toast.fail(response.message || response.errorMsg || response.data || '请求失败');
      throw new Error(`${serviceUrl}${url}（${response.message || response.errorMsg}）`);
    }
    return response;
  })
  .catch(e => {
    console.error(e);
  });
}
