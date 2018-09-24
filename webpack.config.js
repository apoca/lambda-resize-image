const path = require('path');

module.exports = {
  // Specify the entry point for our app.
  entry: [path.join(__dirname, 'src/index.js')],
  // Specify the output file containing our bundled code
  output: {
    path: __dirname + '/build',
    filename: 'handler.js',
    library: 'handler',
    libraryTarget: 'umd'
  },
  target: 'node',
  externals: [
    //provided by Lambda runtime
    'aws-sdk',
    'imagick'
  ],
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
