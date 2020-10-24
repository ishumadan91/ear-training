// webpack-common-config.js

// This file will contain configuration data that
// is shared between development and production builds.

const HtmlWebpackPlugin = require('html-webpack-plugin');

const paths = require('./paths');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
    }),
  ],
  entry: {
    app: paths.appIndexJs
  },
  output: {
    filename: '[name].js',
    path: paths.appBuild,
    publicPath: './'
  }
};