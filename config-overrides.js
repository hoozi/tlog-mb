const { override, fixBabelImports, addLessLoader, addWebpackAlias, addBabelPlugins } = require('customize-cra');
const { resolve } = require('path');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd-mobile',
    style: true,
  }),
  addBabelPlugins([
    "@babel/plugin-proposal-decorators",
    {
      "legacy": true
    }
  ]),
  addLessLoader({
    javascriptEnabled: true
  }),
  addWebpackAlias({
    '@': resolve(__dirname, './src')
  }),
  config => {
    return {
      ...config,
      output: {
        ...config.output,
        path: process.env.NODE_ENV === 'production' ? resolve(__dirname,'../www') : undefined,
        publicPath: process.env.NODE_ENV === 'production' ? '' : '/'
      }
    }
  }
);