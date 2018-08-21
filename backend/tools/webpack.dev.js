'use strict';

const path = require('path'),
      utils = require('./utils'),
      webpack = require('webpack');

var config = require('./config'),
    configWebpack = config.webpack;

var HtmlResWebpackPlugin = require('html-res-webpack-plugin'),
    ExtractTextPlugin = require("extract-text-webpack-plugin-steamer"),
    CopyWebpackPlugin = require("copy-webpack-plugin-hash");

var devConfig = {
    entry: configWebpack.entry,
    output: {
        publicPath: configWebpack.defaultPath,
        path: path.join(configWebpack.path.dev),
        filename: "[name].js",
        chunkFilename: "chunk/[name].js",
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['react-hot'],
                exclude: /node_modules/,
            },
            {
                test: /\.jsx$/,
                loader: 'babel',
                query: {
                    "plugins": [
                        ["transform-runtime", {
                            "polyfill": false,
                            "regenerator": true
                        }],
                        ["transform-decorators-legacy"],
                        ["transform-react-jsx", { "pragma":"preact.h" }],
                        ["import", { libraryName: "antd", style: "css" }]
                    ],
                    presets: [
                        'es2015',
                        'stage-0',
                    ]
                },
                exclude: /node_modules/,
            },
            {
                test: /\.js$/,
                loader: 'babel',
                query: {
                    // cacheDirectory: './webpack_cache/',
                    plugins: [
                        ["transform-runtime", {
                            "polyfill": false,
                            "regenerator": true
                        }],
                        ['transform-decorators-legacy'],
                        ["import", { libraryName: "antd", style: "css" }]
                    ],
                    presets: [
                        'es2015',
                        'stage-0',
                        'react',
                    ]
                },
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('css?sourceMap&modules&localIdentName=[local]___[hash:base64:5]!!'),
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style?sourceMap", "css")
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract("style?sourceMap", "css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5"),
                // include: path.resolve(configWebpack.path.src)
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    "url-loader?limit=1000&name=img/[name].[ext]",
                ],
                include: path.resolve(configWebpack.path.src)
            },
            {
                test: /\.ico$/,
                loader: "url-loader?name=[name].[ext]",
                include: path.resolve(configWebpack.path.src)
            },
        ],
        noParse: [

        ]
    },
    resolve: {
        moduledirectories:['node_modules', configWebpack.path.src],
        extensions: ["", ".js", ".jsx", ".es6", "css", "scss", "png", "jpg", "jpeg", "ico"],
        alias: {
            'redux': 'redux/dist/redux',
            'react-redux': 'react-redux/dist/react-redux',
            'utils': path.join(configWebpack.path.src, '/libs'),
            'commonActions': path.join(configWebpack.path.src, '/actions'),
            'components': path.join(configWebpack.path.src, '/components'),
            'page': path.join(configWebpack.path.src, '/page'),
            'img': path.join(configWebpack.path.src, '/img'),
            'layouts': path.join(configWebpack.path.src, '/layouts'),
        }
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(true),
        new CopyWebpackPlugin([
            {
                from: 'src/libs/',
                to: 'libs/'
            }
        ]),
        new ExtractTextPlugin("./css/[name].css", {filenamefilter: function(filename) {
            // 由于entry里的chunk现在都带上了js/，因此，这些chunk require的css文件，前面也会带上./js的路径
            // 因此要去掉才能生成到正确的路径/css/xxx.css，否则会变成/css/js/xxx.css
            return filename.replace('/js', '');
        }, disable: true}),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    watch: true, //  watch mode
    // 是否添加source-map，可去掉注释开启
    // devtool: "#inline-source-map",
};

devConfig.addPlugins = function(plugin, opt) {
    devConfig.plugins.push(new plugin(opt));
};

configWebpack.html.forEach(function(page) {
    devConfig.addPlugins(HtmlResWebpackPlugin, {
        mode: "html",
        filename: page + ".html",
        template: "src/" + page + ".html",
        favicon: "src/favicon.ico",
        // chunks: configWebpack.htmlres.dev[page],
        htmlMinify: null,
        templateContent: function(tpl) {
            var regex = new RegExp("<script.*src=[\"|\']*(.+).*?[\"|\']><\/script>", "ig");
            tpl = tpl.replace(regex, function(script, route) {
                if (!!~script.indexOf('react.js') || !!~script.indexOf('react-dom.js')) {
                    return '';
                }
                return script;
            });
            return tpl;
        }
    });
});

module.exports = devConfig;
