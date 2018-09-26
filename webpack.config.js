const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  // Specify the entry point for our app.
  entry: slsw.lib.entries,
  // Specify the output file containing our bundled code
  output: {
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, '.webpack'),
    filename: '[name].js'
  },
  target: 'node',
  externals: [nodeExternals()],
  module: {
    /**
     * Tell webpack how to load 'json' files.
     * When webpack encounters a 'require()' statement
     * where a 'json' file is being imported, it will use
     * the json-loader.
     */
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: __dirname,
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        exclude: /node_modules/,
        loaders: ['json-loader']
      }
    ]
  }
};
