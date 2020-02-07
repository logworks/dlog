const path = require("path");

export default () => ({
  mode: "production",
  entry: "./src/app/index.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "dlog.js",
    libraryTarget: "umd",
    globalObject: "this",
    // libraryExport: 'default',
    library: "dlog"
  },
  externals: {
    lodash: {
      commonjs: "lodash",
      commonjs2: "lodash",
      amd: "lodash",
      root: "_"
    },
    deepDiff: {
      commonjs: "deepDiff",
      commonjs2: "deepDiff",
      amd: "deepDiff",
      root: "deepDiff"
    }
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /(node_modules|bower_components)/,
        use: "babel-loader"
      }
    ]
  }
});
