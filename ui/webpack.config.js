const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = (env, argv) => {

    const isDevMode = argv.mode === "development"

    const config = {
        entry: {
            bundle: path.resolve(__dirname, 'src/js/main.js'),
            styles: path.resolve(__dirname, 'src/css/styles.scss'),
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name][contenthash].js',
            clean: true,
            assetModuleFilename: 'assets/img/[name][ext]',
        },
        devtool: isDevMode ? 'source-map' : false,
        devServer: isDevMode ?
            {
                static: {
                    directory: path.resolve(__dirname, 'dist')
                },
                port: 3000,
                open: true,
                hot: false,
                compress: true,
                historyApiFallback: true,
            } : {},
        resolve: {
            fallback: {
                "http": false,
                "https": false,
                "fs": false,
                "url": false,
                path: require.resolve("path-browserify"),
                process: require.resolve("process/browser"),
            }
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
                    type: 'asset/resource',
                },
                {
                    test: /\.scss$/,
                    use: [
                        isDevMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                        'css-loader',
                        'sass-loader',
                    ],
                },
                {
                    test: /\.css$/i,
                    use: [MiniCssExtractPlugin.loader, 'css-loader'],
                },
                {
                    test: /\.ttf$/,
                    type: 'asset/resource'
                },
                {
                    test: /\.json$/,
                    use: 'json-loader',
                    type: 'javascript/auto', // Necessary for Webpack 5
                },
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'Webpack App',
                filename: 'index.html',
                template: 'src/template.html',
            }),
            new MiniCssExtractPlugin({
                filename: isDevMode ? '[name].css' : '[name].[contenthash].css',
            }),
            new CopyWebpackPlugin({
                patterns: [
                    { from: 'src/assets/img', to: 'assets/img' }, // Copy images directly
                    {
                        from: './src/template-paths',
                        to: 'template-paths',
                    },
                ],
            }),
            new webpack.ProvidePlugin({
                process: 'process/browser'
            }),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
            })
        ],
        optimization: {
            minimizer: [
                new CssMinimizerPlugin(),
            ]
        }
    }

    return config
}