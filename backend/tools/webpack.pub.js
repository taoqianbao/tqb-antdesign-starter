'use strict';

const path = require('path'),
      utils = require('./utils'),
      webpack = require('webpack');

var config = require('./config'),
    configWebpack = config.webpack;

var HtmlResWebpackPlugin = require('html-res-webpack-plugin'),
    Clean = require('clean-webpack-plugin'),
    ExtractTextPlugin = require("extract-text-webpack-plugin-steamer"),
    CopyWebpackPlugin = require("copy-webpack-plugin-hash"),
    WebpackMd5Hash = require('webpack-md5-hash');

var prodConfig = {
    entry: configWebpack.entry,
    output: {
        publicPath: configWebpack.cdn,
        path: path.join(configWebpack.path.pub),
        filename: "[name]-" + configWebpack.chunkhash + ".js",
        chunkFilename: "chunk/[name]-" + configWebpack.chunkhash + ".js",
    },
    module: {
        loaders: [
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
                include: path.resolve(configWebpack.path.src)
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    "url-loader?limit=1000&name=img/[name]" + configWebpack.hash + ".[ext]",
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
        	// 使用压缩版本redux
            'redux': 'redux/dist/redux.min',
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
        // remove previous pub folder
        new Clean(['pub'], {root: path.resolve()}),
        // inject process.env.NODE_ENV so that it will recognize if (process.env.NODE_ENV === "__PROD__")
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify(config.env)
            }
        }),
        new CopyWebpackPlugin([
		    {
		        from: 'src/libs/',
		        to: 'libs/'
		    }
		], {
            namePattern: "[name]-" + configWebpack.contenthash + ".js"
        }),
        new webpack.optimize.OccurrenceOrderPlugin(true),
        new ExtractTextPlugin("./css/[name]-" + configWebpack.contenthash + ".css", {filenamefilter: function(filename) {
            // 由于entry里的chunk现在都带上了js/，因此，这些chunk require的css文件，前面也会带上./js的路径
            // 因此要去掉才能生成到正确的路径/css/xxx.css，否则会变成/css/js/xxx.css
            return filename.replace('/js', '');
        }}),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new WebpackMd5Hash(),
        new webpack.NoErrorsPlugin()
    ],
    // 使用外链
    externals: {
    	'react': "React",
        'react-dom': "ReactDOM",
        'preact': 'preact',
    },
    watch: false, //  watch mode
};

prodConfig.addPlugins = function(plugin, opt) {
    prodConfig.plugins.push(new plugin(opt));
};

configWebpack.html.forEach(function(page) {
    prodConfig.addPlugins(HtmlResWebpackPlugin, {
        mode: "html",
        filename: page + ".html",
        template: "src/" + page + ".html",
        favicon: "src/favicon.ico",
        // chunks: configWebpack.htmlres.pub[page],
        htmlMinify: {
            removeComments: true,
            collapseWhitespace: true,
        }
    });
}); 

module.exports = prodConfig;