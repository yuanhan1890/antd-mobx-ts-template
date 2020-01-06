const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const autoprefixer = require('autoprefixer')
const webpack = require('webpack')
const path = require('path')

const ROOT = path.resolve(__dirname, '../')

module.exports = {
  mode: 'development',
  entry: {
    app: './src/index.ts',
    vendor: ['react', 'react-router-dom', 'react-dom', 'mobx', 'mobx-react'],
  },
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].js',
    publicPath: '/',
    path: path.resolve(ROOT, 'dist')
  },
  devServer: {
    host: '0.0.0.0',
    contentBase: path.resolve(ROOT, 'public'),
    historyApiFallback: true,
    disableHostCheck: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?/,
        loader: require.resolve('ts-loader')
      },
      {
        test: /\.less/,
        exclude: /node_modules/,
        loader: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
              reloadAll: true,
            },
          },
          require.resolve('@teamsupercell/typings-for-css-modules-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              modules: {
                localIdentName: '[local]--[hash:base64:5]'
              }
            }
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              // Necessary for external CSS imports to work
              // https://github.com/facebookincubator/create-react-app/issues/2677
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                  flexbox: 'no-2009',
                }),
              ],
            },
          },
          {
            loader: require.resolve('less-loader'),
            options: {
              javascriptEnabled: true
            }
          },
        ]
      },
      { // Styling less in node_modules
        test: /\.less$/,
        include: path.resolve(ROOT, './node_modules'),
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: false
            }
          },
          {
            loader: require.resolve('less-loader'),
            options: {
              javascriptEnabled: true,
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|svg|bmp|jpeg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 1024,
          },
        }],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/',
          },
        }],
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.less', '.js', '.jsx'],
    alias: {
      "@": path.resolve(ROOT, 'src'),
      '@ant-design/icons/lib/dist$': path.resolve(ROOT, './src/styles/icons.ts'),
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(ROOT, 'src/index.html')
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
  ],
  optimization: {
    runtimeChunk: {
      name: 'manifest',
    },
    splitChunks: {
      chunks: 'all', // 对哪些模块进行优化
      minSize: 30000, // 要生成的块的最小大小。
      minChunks: 1, // 分割前必须共享模块的最小块数。
      maxAsyncRequests: 5, // 按需加载最大并行请求数
      maxInitialRequests: 5, // 入口点处的最大并行请求数。
      name: false, // 拆分块的名称。提供true将根据块和缓存组密钥自动生成名称。提供字符串或函数将允许您使用自定义名称。如果名称与入口点名称匹配，则将删除入口点。


      cacheGroups: {
        vendor: {
          name: 'vendor',
          chunks: 'all',
          priority: -10,
          reuseExistingChunk: true,
          test: /node_modules\/(.*)\.js/,
        },
        styles: {
          name: 'styles',
          test: /\.(less|css)$/,
          chunks: 'all', // merge all the css chunk to one file
          minChunks: 1,
          reuseExistingChunk: true,
          enforce: true,
        },
      },
    },
  },
}
