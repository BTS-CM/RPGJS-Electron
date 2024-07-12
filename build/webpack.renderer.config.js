/*
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
*/

import path from "path";
import nodeExternals from "webpack-node-externals";
import FriendlyErrorsWebpackPlugin from "@soda/friendly-errors-webpack-plugin";
import { VueLoaderPlugin } from "vue-loader";

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function(env) {
    return {
        entry: {
            app: "./src/app.js"
        },
        output: {
            filename: "[name].js",
            path: path.resolve(__dirname, "../app"),
        },
        target: "electron-renderer",
        mode: env === "production" ? "production" : "development",

        externals: [nodeExternals({
            allowlist: ['vue', 'vue-router', '@vue/devtools-api', '@babel/runtime']
        })],
        
        resolve: {
            extensions: ['.*', '.js', '.mjs', '.vue', '.json', '.css', '.scss'],
            mainFields: ["browser"],
            alias: {
                vue: "vue/dist/vue.esm-browser.js",
                vue$: 'vue/dist/vue.min.js',
                '~': path.resolve(__dirname, '../src/')
            }
        },

        devtool: "source-map",
        
        module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                    presets: [
                        ['@babel/preset-env', { targets: "defaults" }]
                    ]
                    }
                }
            }
        ]
        },
    
        plugins: [
            new VueLoaderPlugin(),
            new FriendlyErrorsWebpackPlugin({
                clearConsole: env === "development",
                onErrors: function (severity, errors) {
                    console.log({severity, errors})
                },
            })
        ]
    };
};
