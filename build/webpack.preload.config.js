/*
const path = require('path');
const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin');
*/

import path from "path";
import FriendlyErrorsWebpackPlugin from "@soda/friendly-errors-webpack-plugin";

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function(env) {
    return {
        entry: {
            preload: "./src/preload.js"
        },
        output: {
            filename: "[name].js",
            path: path.resolve(__dirname, "../app"),
        },
        target: 'electron-preload',
        mode: env === "production" ? "production" : "development",
        
        node: {
            __dirname: false,
            __filename: false
        },

        externals: [],        
        resolve: {
            extensions: ['.*', '.js'],
            mainFields: ["preload"],
            alias: {
                '~': path.resolve(__dirname, '../src/')
            }
        },

        devtool: "source-map",
    
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
