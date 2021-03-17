/* eslint-disable */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PreloadWebpackPlugin = require("preload-webpack-plugin");
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const index = path.resolve(__dirname, "./src/js/index.js");
const three = path.resolve(__dirname, "./src/js/webgl_effects.js");
const nav = path.resolve(__dirname, "./src/js/navFunction.js");
const shop = path.resolve(__dirname, "./src/js/shop.js");
const cart = path.resolve(__dirname, "./src/js/cartPage.js");
const success = path.resolve(__dirname, "./src/js/success.js");
const failure = path.resolve(__dirname, "./src/js/failure.js");

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
    // fallback: { path: false }
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
    three,
    nav,
    shop,
    cart,
    success,
    failure
  },
  output: {
    filename: "js/[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.(jpg|JPG|jpeg|png|gif|mp4|svg|ttf|webp|woff2|woff|eot|gltf|json|xml|ico)$/i,
        type: "asset/resource"
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
      }
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
    // new webpack.ProvidePlugin({
    //   $: "jquery",
    //   jQuery: "jquery"
    // }),
    new HtmlWebpackPlugin({
      title: "Else If Clothing",
      filename: "index.html",
      template: "./src/static/html/index.html",
      inject: "head",
      chunks: ["index", "three"],
      minify: true
    }),
    new HtmlWebpackPlugin({
      title: "Else If Clothing Contact",
      filename: "contact.html",
      template: "./src/static/html/contact.html",
      inject: "head",
      chunks: ["index", "nav"],
      minify: true
    }),
    new HtmlWebpackPlugin({
      title: "Else If Clothing Shop",
      filename: "shop.html",
      template: "./src/static/html/shop.html",
      inject: "head",
      chunks: ["index", "nav", "shop"],
      minify: true
    }),
    new HtmlWebpackPlugin({
      title: "Else If Clothing Cart",
      filename: "cart.html",
      template: "./src/static/html/cart.html",
      inject: "head",
      chunks: ["index", "nav", "cart"],
      minify: true
    }),
    new HtmlWebpackPlugin({
      title: "Else If Clothing Success",
      filename: "success.html",
      template: "./src/static/html/success.html",
      inject: "head",
      chunks: ["index", "nav", "success"],
      minify: true
    }),
    new HtmlWebpackPlugin({
      title: "Else If Clothing Failure",
      filename: "failure.html",
      template: "./src/static/html/failure.html",
      inject: "head",
      chunks: ["index", "nav", "failure"],
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
    //       from: path.resolve(__dirname, "./src/static/models/"),
    //       /* Getting it to work in dev*/
    //       to: "/static/models"
    //     }
    //     // {
    //     //   from: path.resolve(__dirname, "./src/static/js/draco"),
    //     //   /* Getting it to work in dev*/
    //     //   to: "js/draco"
    //     // }
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
