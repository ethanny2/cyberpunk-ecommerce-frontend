/* eslint-disable */
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");

module.exports = merge(common, {
  mode: "development",
  resolve: {
    fallback: {
      fs: false
    }
  },
  devtool: "inline-source-map",
  output: {
    filename: "js/[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  devServer: {
    contentBase: path.join(__dirname, "src/static"),
    compress: true,
    hot: true,
    port: 9000,
    watchContentBase: true,
    writeToDisk: true
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all",
          reuseExistingChunk: true
        }
      }
    }
  }
});
