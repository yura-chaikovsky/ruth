const path = require("path");
const Webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");


const BUILD_PATH = path.join(__dirname, "./../release");
const MODE = process.env.NODE_ENV || "development";
// //"ruth": "git+https://github.com/yura-chaikovsky/ruth.git",

module.exports = {
    mode: MODE,
    entry: path.join(__dirname, "./../src/index.js"),
    output: {
        filename: "./main.js",
        path: path.resolve(__dirname, BUILD_PATH),
        publicPath: "/"
    },
    resolve: {
        extensions: [".jsx", ".js"],
        modules: [path.resolve(__dirname, "node_modules")]
    },
    module: {
        rules: [
            {test: /\.tpl?$/, use: ["./html2js-loader.js"] },
            {test: /\.css$/, use: ExtractTextPlugin.extract({use: ["css-loader"]}) },
            {test: /\.(png|jpg|gif|html)$/, use: ["file-loader?name=[name].[ext]"]}
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([{from: "./../src/assets", to: BUILD_PATH + "/assets/"}]),
        new ExtractTextPlugin("main.css", {options: {allChunks: true}})
    ],
    devServer: {
        contentBase: path.resolve(__dirname, "../src/assets/"),
        compress: false,
        historyApiFallback: true,
        hot: false,
        https: false,
        noInfo: false,
        host: "0.0.0.0"
    },
};