/* eslint-disable */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PreloadWebpackPlugin = require("preload-webpack-plugin");
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const index = path.resolve(__dirname, "./src/js/index.js");
const three = path.resolve(__dirname, "./src/js/webgl_effects.js");
const nodePath = path.resolve(__dirname, "./node_modules");
const webpack = require("webpack");

module.exports = {
  target: "web",
  // node: {
  //   fs: "empty"
  // },
  resolve: {
    fallback: {
      fs: false
    }
  },
  stats: {
    chunks: true,
    colors: true,
    env: true
  },
  performance: {
    hints: false
  },
  entry: {
    index,
    three
  },
  output: {
    filename: "js/[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.(jpg|JPG|jpeg|png|gif|mp3|svg|ttf|webp|woff2|woff|eot|mtl|obj|dae)$/i,
        type: 'asset/resource'
      },
      // {
      //   test: /\.(jpg|JPG|jpeg|png|gif|mp3|svg|ttf|webp|woff2|woff|eot)$/i,
      //   use: [
      //     {
      //       loader: "file-loader",
      //       options: {
      //         outputPath: "images/",
      //         name: "[name].[ext]",
      //         // name: "[name].[contenthash].[ext]",
      //         esModule: false
      //       }
      //     }
      //   ]
      // },
      // Targets all .js files
      {
        test: /\.m?js$/i,
        exclude: nodePath,
        use: [
          // Transplies from ES6 to ES5.
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              presets: ["@babel/preset-env"],
              cacheCompression: true
            }
          },
          // Lint javascript before transpiling
          {
            loader: "eslint-loader",
            options: {
              cache: true
            }
          }
        ]
      },
      // Loads all CSS, SASS AND SCSS files
      {
        test: /\.(sa|sc|c)ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // Path all assets AFTER build process
              // publicPath: ""
              // hmr: true
            }
          },
          // Translates CSS into CommonJS
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              url: true
            }
          },
          // Adds vendor prefixes with Autoprefixer
          "postcss-loader",
          {
            // Compiles SASS to CSS
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      },
      // {
      //   test: /\.(html)$/,
      //   use: {
      //     loader: "html-loader",
      //     options: {
      //       minimize: true,
      //       esModule: false
      //       // root: path.resolve(__dirname, "dist")
      //     }
      //   }
      // }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    new HtmlWebpackPlugin({
      title: "Else If Clothing",
      filename: "index.html",
      template: "./src/static/html/webgl_materials_cubemap_balls_reflection.html",
      inject: "head",
      chunks: ["index", "three"],
      minify: true
    }),
    //Adds rel="preload" to fonts;
    // new PreloadWebpackPlugin({
    //   rel: "preload",
    //   as(entry) {
    //     if (/\.(woff|woff2|ttf|otf)$/.test(entry)) return "font";
    //   },
    //   fileWhitelist: [/\.(woff|woff2|ttf|otf)$/],
    //   //Includes all assets; even fonts loaded by file-loader
    //   include: "allAssets"
    // }),
    //Adds defer to js scripts to speed load times.
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: "defer"
    }),
    //Copy the entire directory of netlify functions to build folder
    // new CopyPlugin({
    //   patterns: [
    //     {
    //       from: path.resolve(__dirname, "./functions"),
    //       to: "./functions/"
    //     }
    //   ]
    // }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ],
  optimization: {
    runtimeChunk: "single",
    moduleIds: "deterministic",
    splitChunks: {
      cacheGroups: {
        // Extracts all .css files into a single css file
        styles: {
          name: "styles",
          test: /\.css$/,
          chunks: "all",
          enforce: true
        }
      }
    }
  }
};
