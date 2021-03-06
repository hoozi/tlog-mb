const { override, fixBabelImports, addLessLoader, addWebpackAlias, addBabelPlugins, addWebpackPlugin } = require('customize-cra');
const WebpackZipPlugin = require('webpack-zip-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const moment = require('moment');
const { resolve } = require('path');
function getPath() {
  let path;
  if(process.env.NODE_ENV === 'production') {
    if(process.env.REACT_APP_ENV !== 'webapp') {
      path = resolve(__dirname,'../www');
    } else {
      path = resolve(__dirname,'./build');
    }
  }
  return path;
}
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
      (process.env.NODE_ENV === 'production' && process.env.REACT_APP_ENV === 'webapp') ?
      new WebpackZipPlugin({
        initialFile: './build',
        endPath: './_build',
        zipName: `build_at_${moment().format('YYYYMMDD_HH-mm-ss')}.zip`
      }) : () => null,
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns:['build','*.zip']
      })
    ),
    config => {
      return {
        ...config,
        output: {
          ...config.output,
          path: getPath(),
          publicPath: (process.env.NODE_ENV === 'production' || process.env.REACT_APP_ENV === 'webapp') ? '' : '/'
        }
      }
    },
    fixBabelImports('import', {
      libraryName: 'antd-mobile',
      style: true
    })
  )
}