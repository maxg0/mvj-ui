import path from 'path';
import mapValues from 'lodash/mapValues';
import createConfig from './createConfig';
import readDotenv from './readDotenv';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CleanPlugin from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import OfflinePlugin from 'offline-plugin';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';

const context = path.resolve(__dirname, '..');
const extractStylesPlugin = new ExtractTextPlugin('[name].[hash].css');

// TODO: Make this better
const getEnvValues = {
  ['API_URL']: process.env.API_URL,
  ['STORAGE_PREFIX']: process.env.STORAGE_PREFIX,
  ['process.env.NODE_ENV']: 'production',
  ...readDotenv({...context, silent: true}),
};

export default createConfig({
  context,
  devtool: 'source-map',
  entry: [
    'whatwg-fetch',
    'babel-polyfill',
    './src/index.js',
    './src/main.scss',
  ],
  output: {
    path: path.join(context, 'dist'),
    publicPath: '/',
    filename: '[name].[hash].js',
    sourceMapFilename: '[file].map',
    chunkFilename: '[id].[hash].js',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        loader: extractStylesPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader!sass-loader?sourceMaps',
        }),
      },
    ],
  },
  plugins: [
    new CleanPlugin(['./dist/*'], {root: context}),
    new webpack.DefinePlugin(mapValues(getEnvValues, (v) => JSON.stringify(v))),
    new HtmlWebpackPlugin({
      inject: 'body',
      template: 'src/index.html',
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
    }),
    extractStylesPlugin,
    new OfflinePlugin({
      AppCache: false,
      publicPath: '/',
      relativePaths: false,
      ServiceWorker: {
        events: true,
      },
    }),
    new FaviconsWebpackPlugin(path.resolve(context, 'assets/images/favicon.png')),
  ],
});
