module.exports = {
  publicPath: process.env.PUBLIC_PATH || '/',
  productionSourceMap: false,
  configureWebpack: {
    name: 'Shipping',
    resolve: {
      alias: require('./aliases.config').webpack,
    },
    devtool: process.env.VUE_APP_SOURCE_MAP || undefined,
  },
  css: {
    sourceMap: false,
  },
  devServer: {
    disableHostCheck: true,
    public: 'localhost:6969',
    host: 'localhost',
    port: 6969,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers':
        'Origin, X-Requested-With, Content-Type, Accept',
    },
    watchOptions: {
      ignored: /node_modules/,
      poll: 5007,
    },
  },
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
  },
}
