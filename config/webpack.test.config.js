const merge = require('webpack-merge')
const webpack = require('webpack')

const commonConfig = require('./webpack.build.config.js')
const env = require('./env')

// build dev
const config = {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.BASE_URL': JSON.stringify(env.BASE_URL_TEST)
    })
  ]
}

module.exports = merge(commonConfig, config)
