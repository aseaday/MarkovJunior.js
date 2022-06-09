const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
// const ExtensionReloader = require('webpack-ext-reloader');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  watch: true,
  mode: 'development',
});