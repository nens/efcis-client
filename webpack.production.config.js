var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var definePlugin = new webpack.DefinePlugin({
  'process.env': {
    'NODE_ENV': '"production"'
  },
});

var config = {
  // We change to normal source mapping
  // devtool: 'source-map',
  entry: './index.jsx',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/static_media/efcis_client/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      // sourceMap: false,
      compress: {
        warnings: false
      }
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loaders: [ 'babel' ],
        exclude: /node_modules/,
        include: __dirname
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader?modules"
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.js$/,
        loader: 'transform/cacheable?brfs'
      },
      { test: /\.(png|gif|jpg|svg|woff|eot|ttf|otf)$/,
        loader: 'url-loader?limit=100000'
      }
    ],
    noParse: [new RegExp(path.resolve(__dirname, 'node_modules/localforage/dist/localforage.js'))]
  }
};

module.exports = config;
