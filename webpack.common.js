/* eslint-disable */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");
const index = path.resolve(__dirname, "./src/js/index.js");
const three = path.resolve(__dirname, "./src/js/webgl_effects.js");
const nav = path.resolve(__dirname, "./src/js/navFunction.js");
const shop = path.resolve(__dirname, "./src/js/shop.js");
const cart = path.resolve(__dirname, "./src/js/cartPage.js");
const success = path.resolve(__dirname, "./src/js/success.js");
const failure = path.resolve(__dirname, "./src/js/failure.js");
const nodePath = path.resolve(__dirname, "./node_modules");

module.exports = {
  target: "web",

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
            loader: MiniCssExtractPlugin.loader
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
    ]
  },
  plugins: [
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

    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: "defer"
    }),

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
