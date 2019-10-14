const proxy = require('http-proxy-middleware');

const proxyUrl = 'http://169.169.171.21';//'https://www.easy-mock.com/mock/5d0858dd691f9b10af527bb8';
const localPath = '/';

const serviceList = [
  `${localPath}ierp`,
  /* `${localPath}auth`,
  `${localPath}admin`,
  `${localPath}code`,
  `${localPath}gen`,
  `${localPath}daemon` */
]

let proxys = {};

serviceList.forEach(service => {
  proxys[service] = {
    target: proxyUrl,
    changeOrigin: true,
    /* pathRewrite: {
      [`^${service}`] : ''
    } */
  }
});

module.exports = function(app) {
  for(let key in proxys) {
    app.use(proxy(key, proxys[key]));
  }
};