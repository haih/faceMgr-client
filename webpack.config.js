'use strict';

// Modules
var webpack = require('webpack');
var path = require('path');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var CopyWebpackPlugin = require('copy-webpack-plugin');

/**
 * Env
 * Get npm lifecycle event to identify the environment
 */
var ENV = process.env.npm_lifecycle_event;
var isTest = ENV === 'test' || ENV === 'test-watch';
var isProd = ENV === 'build';

module.exports = (function makeWebpackConfig() {
  /**
   * Config
   * Reference: http://webpack.github.io/docs/configuration.html
   * This is the object where all configuration gets set
   */
  var config = {};

  /**
   * Entry
   * Reference: http://webpack.github.io/docs/configuration.html#entry
   * Should be an empty object if it's generating a test build
   * Karma will set this when it's a test build
   */
  config.entry = isTest ? {} : {
    app: './src/bootstrap.js'
  };

  /**
   * Output
   * Reference: http://webpack.github.io/docs/configuration.html#output
   * Should be an empty object if it's generating a test build
   * Karma will handle setting it up for you when it's a test build
   */
  config.output = isTest ? {} : {
    // Absolute output directory
    path: __dirname + '/dist',

    // Output path from the view of the page
    // Uses webpack-dev-server in development
    publicPath: isProd ? '/' : 'http://127.0.0.1:8000/',

    // Filename for entry points
    // Only adds hash in build mode
    filename: isProd ? 'js/[name].[hash].js' : 'js/[name].js',

    // Filename for non-entry points
    // Only adds hash in build mode
    chunkFilename: isProd ? 'js/[name].[hash].js' : 'js/[name].js'
  };

  /**
   * Devtool
   * Reference: http://webpack.github.io/docs/configuration.html#devtool
   * Type of sourcemap to use per build type
   */
  if (isTest) {
    config.devtool = 'inline-source-map';
  } else if (isProd) {
    config.devtool = 'source-map';
  } else {
    config.devtool = 'source-map';
  }

  /**
   * Loaders
   * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
   * List: http://webpack.github.io/docs/list-of-loaders.html
   * This handles most of the magic responsible for converting modules
   */

  // Initialize module
  config.module = {
    preLoaders: [],
    postLoaders: [],
    loaders: [{
      test: /jquery.js/,
      loader: 'expose?jQuery'
    }, {
      // JS LOADER
      // Reference: https://github.com/babel/babel-loader
      // Transpile .js files using babel-loader
      // Compiles ES6 and ES7 into ES5 code
      test: /\.js$/,
      loaders: ['ng-annotate', 'babel?presets[]=es2015'],
      exclude: [/node_modules/, /\.spec\.js$/]
    }, {
      // UNIT TEST LOADER
      // Reference: https://github.com/babel/babel-loader
      // Transpile .js files using babel-loader
      // Compiles ES6 and ES7 into ES5 code
      test: /\.spec\.js$/,
      loaders: ['babel?presets[]=es2015'],
      exclude: [/node_modules/]
    }, {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract('style', 'css?sourceMap!postcss!sass')
    }, {
      // FONT LOADER
      // Copy font files to /font folder and use name and extension
      test: /\.(woff|woff2|ttf|eot)(\?v=.*)?$/,
      loader: 'file?name=fonts/[name].[ext]',
    }, {
      // ASSET LOADER
      // Reference: https://github.com/webpack/file-loader
      // Copy png, jpg, jpeg, gif, svg files to output
      // Rename the file using the asset hash
      // Pass along the updated reference to your code
      // You can add here any file extension you want to get copied to your output
      test: /\.(svg|png|jpg|jpeg|gif|ico)(\?v=.*)?$/,
      loader: 'file?name=images/[name].[ext]'
    }, {
      // HTML LOADER
      // Reference: https://github.com/webpack/raw-loader
      // Allow loading html through js
      test: /\.html$/,
      loader: 'raw'
    }]
  };

  // Reference: https://www.npmjs.com/package/istanbul-instrumenter-loader
  // Instrument JS files with istanbul for subsequent code coverage reporting
  // Skips node_modules and files that end with .spec.js
  if (isTest) {
    config.module.postLoaders.push({
      test: /\.js$/,
      exclude: [
        /node_modules/,
        /spec\.js$/
      ],
      loader: 'istanbul-instrumenter-loader'
    });
  }

  /**
   * PostCSS
   * Reference: https://github.com/postcss/autoprefixer-core
   * Add vendor prefixes to your css
   */
  config.postcss = [
    autoprefixer({
      browsers: ['last 2 version']
    })
  ];

  /**
   * Sass
   * Reference: https://github.com/jtangelder/sass-loader
   * Transforms .scss files to .css
   */
  config.sassLoader = {
    includePaths: [
      path.resolve(__dirname, 'node_modules/bootstrap-sass/assets/stylesheets'),
      path.resolve(__dirname, 'node_modules/foundation-sites/scss')
    ]
  };

  /**
   * Plugins
   * Reference: http://webpack.github.io/docs/configuration.html#plugins
   * List: http://webpack.github.io/docs/list-of-plugins.html
   */
  config.plugins = [];

  // Skip rendering index.html in test mode
  if (!isTest) {
    // Reference: https://github.com/ampedandwired/html-webpack-plugin
    // Render index.html
    config.plugins.push(
      new HtmlWebpackPlugin({
        template: './src/index.html',
        inject: 'body'
      })

      // Reference: https://github.com/webpack/extract-text-webpack-plugin
      // Extract css files
      // Disabled when in test mode or not in build mode

    );
  }
  config.plugins.push(new ExtractTextPlugin('[name].[hash].css', { disable: !isProd }));

  // Add build specific plugins
  if (isProd) {
    config.plugins.push(
      // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
      // Only emit files when there are no errors
      new webpack.NoErrorsPlugin(),

      // Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
      // Dedupe modules in the output
      new webpack.optimize.DedupePlugin(),

      // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
      // Minify all javascript, switch loaders to minimizing mode
      new webpack.optimize.UglifyJsPlugin(),

      // new CommonsChunkPlugin({
      //   name: 'vendor',
      //   filename: isProd ? 'js/[name].[hash].js' : 'js/[name].js',
      //   minChunks: Infinity
      // }),
      // new CommonsChunkPlugin({
      //   name: 'common',
      //   filename: isProd ? 'js/[name].[hash].js' : 'js/[name].js',
      //   minChunks: 2,
      //   chunks: ['app', 'vendor']
      // })

      // Copy assets from the public folder
      // Reference: https://github.com/kevlened/copy-webpack-plugin
      new CopyWebpackPlugin([{
        from: __dirname + '/src/images',
        to: 'images'
      }, {
        from: __dirname + '/src/l10n',
        to: 'l10n'
      }])
    );
  }

  config.resolve = {
    alias: {
      'collab-ui-angular': 'collab-ui-angular/dist/collab-ui.js',
      'angular-ui-router': 'angular-ui-router/release/angular-ui-router',
      jquery: 'jquery/dist/jquery',
      oclazyload: 'oclazyload/dist/ocLazyLoad'
    }
  };

  /**
   * Dev server configuration
   * Reference: http://webpack.github.io/docs/configuration.html#devserver
   * Reference: http://webpack.github.io/docs/webpack-dev-server.html
   */
  config.devServer = {
    host: '127.0.0.1',
    port: 8000,
    contentBase: './src',
    stats: 'minimal'
  };

  return config;
}());
