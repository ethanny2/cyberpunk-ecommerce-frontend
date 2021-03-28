const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const path = require("path");
const CompressionPlugin = require("compression-webpack-plugin");
const glob = require("glob");
const PurgecssPlugin = require("purgecss-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  resolve: {
    fallback: {
      fs: false
    }
  },
  stats: {
    children: true
  },
  output: {
    // Contenthash substitution used for cache bursting
    filename: "js/[name].[contenthash].bundle.js",
    path: path.resolve(__dirname, "dist"),
    assetModuleFilename: "assets/[name][hash][ext]"
  },
  module: {
    rules: [
      {
        test: /\.(jpg|JPG|jpeg|png|gif|mp4|svg|ttf|webp|woff2|woff|eot|gltf|json|xml|ico)$/i,
        type: "asset/resource"
      },
      {
        test: /\.(html)$/,
        use: {
          loader: "html-loader",
          options: {
            minimize: true,
            esModule: false
          }
        }
      }
    ]
  },
  plugins: [
    new CompressionPlugin({
      test: /\.(html|css|js)(\?.*)?$/i
    }),
    new PurgecssPlugin({
      paths: glob.sync(`${path.join(__dirname, "src")}/**/*`, { nodir: true })
    }),
    new ImageMinimizerPlugin({
      minimizerOptions: {
        // Lossless optimization with custom option
        // Feel free to experiment with options for better result for you
        plugins: [
          ["gifsicle", { interlaced: true }],
          ["jpegtran", { progressive: true }],
          ["optipng", { optimizationLevel: 2 }]
        ]
      }
    }),
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.optimize\.css$/g,
      cssProcessor: require("cssnano"),
      cssProcessorPluginOptions: {
        preset: ["default", { discardComments: { removeAll: true } }]
      },
      canPrint: true
    })
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
    splitChunks: {
      chunks: "all",
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          reuseExistingChunk: true,
          name(module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            return `vendor/npm.${packageName.replace("@", "")}`;
          }
        }
      }
    }
  }
});
