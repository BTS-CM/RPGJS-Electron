/*
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin');
*/

import path from "path";
import nodeExternals from "webpack-node-externals";
import FriendlyErrorsWebpackPlugin from "@soda/friendly-errors-webpack-plugin";

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function(env) {
    return {
        target: 'electron-main',
        entry: {
            background: "./src/background.js",
        },
        output: {
            filename: "[name].js",
            path: path.resolve(__dirname, "../app"),
        },
        mode: env === "production" ? "production" : "development",
        node: {
            __dirname: false,
            __filename: false
        },
            
        externals: [nodeExternals({
            allowlist: ['@babel/runtime']
        })],

        resolve: {
            extensions: ['.js', '.json', '.mjs'],
            mainFields: ["main"],
            alias: {
                '~': path.resolve(__dirname, '../src/')
            }
        },

        experiments: {
            topLevelAwait: true, // Enable top-level await
        },

        devtool: "source-map",
        
        module: {
            rules: [
                {
                    test: /\.mjs$/, // Rule for .mjs files
                    include: /node_modules/,
                    type: "javascript/auto"
                }
            ]
        },
  
        plugins: [
            new FriendlyErrorsWebpackPlugin({
                clearConsole: env === "development",
                onErrors: function (severity, errors) {
                    console.log({severity, errors})
                },
            })
        ]
    };
};
