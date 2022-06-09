const webpack = require("webpack");
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin');
const srcDir = '../src/';

const resolveApp = relativePath => path.resolve(__dirname, relativePath);

module.exports = {
    devServer: {
        static: {
            directory: path.join(__dirname, '../public'),
        },
        compress: true,
        port: 9000,
    },
    entry: {
        Canvasrendor: path.join(__dirname, srcDir + 'render/canvas.ts'),
        Interpreter: path.join(__dirname, srcDir + 'interpreter/index.ts'),
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../dist'),
        library: ["MarkovJunior", "[name]"],
        libraryTarget: "umd",
        libraryExport: "default",
    },
    optimization: {
        splitChunks: {
            name: 'vendor',
            chunks: "initial"
        }
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        },
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        fallback: {
            'fs': false
        }
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: 'public',
                    noErrorOnMissing: true,
                    globOptions: {
                        ignore: [
                            '**/index.html'
                        ]
                    }
                },
            ],
        }),
        new HtmlWebpackPlugin({
            inject: true,
            template: resolveApp('../public/canvas-demo.html'),
        }),
    ]
};