const { override, fixBabelImports, addLessLoader, addWebpackAlias, addBabelPlugins, addWebpackPlugin } = require('customize-cra');
const WebpackZipPlugin = require('webpack-zip-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const moment = require('moment');
const { resolve } = require('path');

module.exports = { 
  webpack: override(
    addBabelPlugins([
      "@babel/plugin-proposal-decorators",
      {
        "legacy": true
      }
    ],"@babel/plugin-proposal-export-default-from"),
    addLessLoader({
      javascriptEnabled: true
    }),
    addWebpackAlias({
      '@': resolve(__dirname, './src')
    }),
    addWebpackPlugin(
      process.env.NODE_ENV === 'production' && 
      new WebpackZipPlugin({
        initialFile: './build',
        endPath: './',
        zipName: `${moment().format('YYYYMMDDHHmmss')}.zip`
      }),
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns:['build','*.zip']
      })
    ),
    config => {
      return {
        ...config,
        output: {
          ...config.output,
          //path: process.env.NODE_ENV === 'production' ? resolve(__dirname,'../www') : undefined,
          publicPath: process.env.NODE_ENV === 'production' ? '' : '/'
        }
      }
    },
    fixBabelImports('import', {
      libraryName: 'antd-mobile',
      style: true
    })
  )
}