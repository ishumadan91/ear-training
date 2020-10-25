// webpack-prod-config.js

// contains configuration data related to prod build

const path = require('path');

const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const paths = require('./paths');
const common = require('./webpack-common-config.js');

module.exports = merge(common, {
  mode: 'production',
  // Set the name of our JS bundle using a chuckhash
  // (e.g. '5124f5efa5436b5b5e7d_app.js')
  // Location where built files will go.
  output: {
    filename: '[name]_[chunkhash].js',
    path: paths.appBuild,
    publicPath: './',
  },
  plugins: [
    new CleanWebpackPlugin(),
    // Uglify to minify your JavaScript
    new UglifyJSPlugin(),
    // Set process.env.NODE_ENV to production
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    // Extract text/(s)css from a bundle, or bundles, into a separate file.
    new MiniCssExtractPlugin({
      path: paths.appBuild,
      filename: 'styles_[chunkhash].css'
    })
  ],
  module: {
    rules: [
      {
        // look for .js or .jsx files
        test: /\.(js|jsx)$/,
        // in the `src` directory
        include: path.resolve(paths.appSrc),
        exclude: /node_modules/,
        use: {
          // use babel for transpiling JavaScript files
          loader: 'babel-loader',
          options: {
            presets: ['@babel/react'],
          },
        },
      },
      {
        // look for .css or .scss files
        test: /\.(css|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      }
    ],
  },
});
