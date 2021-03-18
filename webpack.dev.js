/* eslint-disable */
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = merge(common, {
  mode: "development",
  // node: {
  //   fs: "empty"
  // },
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
  module: {
    rules: [
      // // Loads all JSON and text files; add more based on your needs
      // {
      //   test: /\.(txt|json)$/i,
      //   use: {
      //     loader: "file-loader",
      //     options: {
      //       outputPath: "data/",
      //       name: "[name].[ext]",
      //       esModule: false
      //     }
      //   }
      // },
      //Load all .html files
      // {
      //   test: /\.(html)$/,
      //   use: {
      //     loader: "html-loader",
      //     options: {
      //       // root: path.resolve(__dirname, "dist")
      //     }
      //   }
      // }
    ]
  },

  plugins: [
    // new MiniCssExtractPlugin({
    //   filename: "css/style.css",
    //   chunkFilename: "css/style.[id].css"
    // })
    // new CopyPlugin({
    //   patterns: [
    //     // {
    //     //   from: path.resolve(__dirname, "./src/static/models/"),
    //     //   /* Getting it to work in dev*/
    //     //   to: "/static/models"
    //     // }
    //     {
    //       from: path.resolve(__dirname, "./src/js/draco"),
    //       /* Getting it to work in dev*/
    //       to: "js/draco"
    //     }
    //   ]
    // })
  ],
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
