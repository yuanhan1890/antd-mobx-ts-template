const merge = require('webpack-merge')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack')

const commonConfig = require('./webpack.build.config.js')
const env = require('./env')

// build dev
const config = {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.BASE_URL': JSON.stringify(env.BASE_URL_PROD)
    }),
    new BundleAnalyzerPlugin(),
  ]
}

module.exports = merge(commonConfig, config)
