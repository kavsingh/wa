// Consume from es6 imports in src
require('babel-register')({ plugins: ['transform-es2015-modules-commonjs'] })

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BabelMinifyPlugin = require('babel-minify-webpack-plugin')
const SWPrecachePlugin = require('sw-precache-webpack-plugin')
const PWAManifest = require('webpack-pwa-manifest')
const { COLOR_PAGE } = require('./src/constants/style')

const isProduction = process.env.NODE_ENV === 'production'
const servePublic = process.env.PUBLIC === 'true'
const fromRoot = path.resolve.bind(path, __dirname)
// Setting public path to '/' means everything will attempt lookup
// from root of hosting environment, so we can't just drop dist builds into a
// subfolder of some other thing.
const publicPath = ''

module.exports = {
  entry: {
    gleetchy: ['./src/index.js'],
  },
  output: {
    filename: isProduction ? '[name].[chunkhash].js' : '[name].js',
    path: fromRoot('dist'),
    publicPath,
  },
  devtool: isProduction ? 'source-map' : 'cheap-eval-sourcemap',
  devServer: {
    host: servePublic ? '0.0.0.0' : 'localhost',
    port: 3000,
    inline: true,
    hot: true,
    historyApiFallback: { index: publicPath },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: fromRoot('node_modules'),
        use: [{ loader: 'babel-loader' }],
      },
      {
        test: /\.(wav|mp3|ogg)$/,
        use: [{ loader: 'file-loader' }],
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin('NODE_ENV'),
    new HtmlWebpackPlugin({
      themeColor: COLOR_PAGE,
      title: 'Gleetchy',
      template: fromRoot('src/index.html'),
      inject: 'body',
    }),
    !isProduction && new webpack.HotModuleReplacementPlugin(),
    isProduction && new webpack.optimize.ModuleConcatenationPlugin(),
    isProduction && new BabelMinifyPlugin(),
    new PWAManifest({
      name: 'Gleetchy',
      short_name: 'Gleetchy',
      start_url: '/',
      display: 'fullscreen',
      theme_color: COLOR_PAGE,
      background_color: COLOR_PAGE,
    }),
    isProduction &&
      new SWPrecachePlugin({
        cacheId: 'gleetchy-sw',
        filename: 'gleetchy-sw.js',
        minify: true,
        forceDelete: true,
        runtimeCaching: [
          {
            handler: 'fastest',
            urlPattern: /[.](png|jpg|css|wav|ogg|mp3)/,
          },
          {
            handler: 'networkFirst',
            urlPattern: /^http.*/,
          },
        ],
      }),
  ].filter(Boolean),
  resolve: {
    modules: [fromRoot('src'), 'node_modules'],
    extensions: ['.js'],
  },
}
