module.exports = {
  entry: {
    index: './src/index.js'
  },
  output: {
    path: __dirname + '/dist',
    filename: "calenbar.js",
    library: "Calenbar",
    libraryTarget: "umd"
  },
  devtool: 'inline-source-map'
};