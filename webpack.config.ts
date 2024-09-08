import path from 'path';
import type { Configuration } from 'webpack';
import type { Configuration as DevServerConfiguration } from "webpack-dev-server";
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

interface EnvVariable {
  production: boolean,
  analyze?: boolean,
  tscheck?: boolean,
}

export default (env: EnvVariable): Configuration => {
  const isProd = env.production;
  const isShowBundleAnalyzer = env.analyze;
  const noEmitOnError = env.tscheck;

  const mode = isProd ? "production" : "development";
  const entry = path.resolve(__dirname, 'src/static/main.tsx');

  const output = {
    publicPath: '/',
    filename: '[name].[contenthash].bundle.js',
    path: path.resolve(__dirname, 'bundle'),
    clean: true,
  }

  // module

  const module = {
    rules: [
      {
        test: /\.([cm]?ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                isProd && { "useBuiltIns": "usage", "corejs": "3.35.1" }
              ].filter(Boolean),
              [
                '@babel/preset-react',
                { runtime: 'automatic' },
              ],
              ['@babel/preset-typescript']
            ],
            plugins: [!isProd && require.resolve('react-refresh/babel')].filter(Boolean),
          },
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          isProd ? {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "/",
            },
          } : "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: isProd ? '[hash:base64:8]' : '[path][name]__[local]',
              },
              sourceMap: !isProd,
            }
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: !isProd,
              postcssOptions: {
                plugins: isProd ? ["autoprefixer"] : [],
              }
            }
          },
          "resolve-url-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: `assets/fonts/[name].[contenthash].[ext]`,
        }
      },
      {
        test: /\.(jpe?g|png|gif|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: `assets/images/[name].[contenthash].[ext]`,
        },
        use: isProd ? ['image-webpack-loader'] : [],
      },
      {
        test: /\.svg$/i,
        resourceQuery: { not: [/url/] },
        use: [
          {
            loader: '@svgr/webpack',
            options: { icon: true },
          },
        ],
      },
      {
        test: /\.svg$/i,
        type: 'asset/resource',
        resourceQuery: /url/i,
        generator: {
          filename: `assets/images/[name].[contenthash].[ext]`,
        },
        use: isProd ? ['image-webpack-loader'] : [],
      },
    ],
  }

  // plugins 

  const plugins: Configuration["plugins"] = [
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname + '/bundle/index.html'),
      template: path.resolve(__dirname, 'src/static/index.html'),
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].[contenthash].bundle.css',
    }),
    // new FaviconsWebpackPlugin({
    //   logo: "./src/assets/favicons/favicon.png",
    //   outputPath: "./assets/favicons",
    //   prefix: './assets/favicons/',
    //   inject: true,
    //   favicons: {
    //     icons: {
    //       android: true,
    //       appleIcon: true,
    //       appleStartup: true,
    //       favicons: true,
    //       windows: true,
    //       yandex: false,
    //     },
    //   }
    // }),
  ]

  !isProd && plugins.push(new ReactRefreshWebpackPlugin());
  (isProd || noEmitOnError) && plugins.push(new ForkTsCheckerWebpackPlugin());
  isShowBundleAnalyzer && plugins.push(new BundleAnalyzerPlugin());

  // devServer

  const devServer: DevServerConfiguration | undefined = !isProd ? {
    open: true,
    watchFiles: ['src/**/*.html', 'bundle/*.html'],
    client: {
      overlay: true,
      progress: true,
    },
    compress: true,
    hot: true,
    historyApiFallback: true,
  } : undefined;

  // optimization

  const optimization: Configuration['optimization'] = {
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  };

  if (isProd) optimization.minimizer = ['...', new CssMinimizerPlugin()];

  // resolve
  const resolve = {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  };

  // devtool
  const devtool = !isProd ? "eval-source-map" : false;

  return {
    mode,
    entry,
    output,
    module,
    plugins,
    devServer,
    optimization,
    resolve,
    devtool
  }
}
