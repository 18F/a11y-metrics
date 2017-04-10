// @flow

const path = require('path');
const webpack = require('webpack');

const { JS_FILENAME } = require('./lib/config');

module.exports = {
  entry: './lib/browser-main.js',
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        APP_ENV: JSON.stringify('browser')
      }
    })
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['env', 'react']
        }
      }
    ],
  },
  output: {
    path: path.resolve(__dirname, 'static'),
    filename: JS_FILENAME,
    publicPath: '/'
  }
};
