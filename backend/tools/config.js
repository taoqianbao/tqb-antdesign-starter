'use strict';

const path = require('path'),
      utils = require('./utils'),
      __basename = path.dirname(__dirname),
      __env = process.env.NODE_ENV;

let defaultPath = "//localhost:9000/";
let cdn = "//localhost:9000/";

if (__env == "__PROD__") {
     defaultPath = "//localhost:9000/page/";
     cdn = "//localhost:9000/page/";
}

/**
 * [config basic configuration]
 * @type {Object}
 */

var config = {
    env: __env,
    webpack: {
        path: {
            src: path.resolve(__basename, "src"),
            dev: path.resolve(__basename, "dev"),
            pub: path.resolve(__basename, "pub"),
        },
        defaultPath: defaultPath,
        cdn: cdn,
        hash: "[hash:6]",
        chunkhash: "[chunkhash:6]",
        imghash: "",
        contenthash: "[contenthash:6]",
    },
    gulp: {
        path: {
            src: path.resolve(__basename, "src"),
            dev: path.resolve(__basename, "dev"),
            pub: path.resolve(__basename, "pub"),
            offline: path.resolve(__basename, "offline"),
        },
    },
    server: {                    // webpack开发环境服务器配置
        port: 9000,              // port for local server
        hostDirectory: "/page/"  // http://host/hostDirectory/
    },
};

// 自动扫描html
config.webpack.html = utils.getHtmlFile(config.webpack.path.src);
// 根据约定，自动扫描js entry，约定是src/page/xxx/main.js 或 src/page/xxx/main.jsx
/**
    当前获取结果
    {
        'js/index': [path.join(configWebpack.path.src, "/page/index/main.js")],
        'js/spa': [path.join(configWebpack.path.src, "/page/spa/main.js")],
        'js/pindex': [path.join(configWebpack.path.src, "/page/pindex/main.jsx")],
    }
 */
config.webpack.entry = utils.getJsFile(config.webpack.path.src, 'page', 'main', ['js', 'jsx']);

// 合图配置
config.gulp.sprites = {
    tplpath: path.resolve(__basename, "tools/sprite-template/less.template.handlebars"),
    imgPath: '../../css/sprites/',
    imgName: 'sprites.png',
    cssName: 'sprites.scss',
    imgDest: config.gulp.path.src + '/css/sprites/',
    cssDest: config.gulp.path.src + '/css/sprites/',
};

module.exports = config;
