var webpack = require('webpack')
  , ResolverPlugin = webpack.ResolverPlugin
  , ProvidePlugin = webpack.ProvidePlugin
  , IgnorePlugin = webpack.IgnorePlugin
  , path = require('path')
  , clientRoot = path.resolve(__dirname)
  , bowerRoot = path.resolve(clientRoot, '..', 'bower_components')
  , nodeRoot = path.resolve(clientRoot, '..', 'node_modules')
;

module.exports = function(options) {
  var env = options.env
    , devtool
  ;

  if (env == 'dev') {
    devtool = '#eval';
  }else{
    devtool = '#source-map';
  }

  return {
    context: clientRoot,
    entry: {
      app: [path.join(clientRoot, 'app.js')],
    },
    output: {
      path: path.join(clientRoot, 'dist'),
      filename: '[name].bundle.js',
    },
    module: {
      loaders: [
        {
          test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
          loader: "url?minetype=application/font-woff&prefix=dist/"
        }, {
          test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
          loader: "url?minetype=application/font-woff&prefix=dist/"
        }, {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          loader: "url?minetype=application/octet-stream&prefix=dist/"
        }, {
          test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
          loader: "url?minetype=application/vnd.ms-fontobject&prefix=dist/"
        }, {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          loader: "url?minetype=image/svg+xml&prefix=dist/"
        },
        {test: /\.css$/, loader: 'style!css'},
        {test: /\.less$/, loader: 'style!css!less?sourceMap'},
      ],
      noParse: [
      ]
    },
    resolve: {
      root: [clientRoot],
      modulesDirectories: ['web_modules', 'bower_components', 'node_modules', ],
      alias: {
        bower: bowerRoot,
        node: nodeRoot,
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.TC_ENV': JSON.stringify(env),
      }),
      new ResolverPlugin(new ResolverPlugin.DirectoryDescriptionFilePlugin(
        'bower.json', ['main']
      )), 
      // prevent webpack accident include server security information
      new IgnorePlugin(new RegExp('config\/prod.*')),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor', filename: 'vendor.bundle.js',
        minChunks: function(module, count) {
          return module.resource && module.resource.indexOf(clientRoot) === -1;
        }
      }),
    ],
    devtool: devtool,
  };
};


