var express = require('express');
var app = express();
var webpack = require('webpack');
var webpackDevMiddleware = require("webpack-dev-middleware");
var webpackHotMiddleware = require("webpack-hot-middleware");
var proxy = require('proxy-middleware');

var webpackConfig = require("./webpack.dev.js"),
	config = require("./config.js");
var port = config.server.port;

for (var key in webpackConfig.entry) {
	webpackConfig.entry[key].unshift('webpack-hot-middleware/client');
}

var compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler, {
    hot: true,
	// historyApiFallback: false,
	noInfo: true,
	stats: { 
		colors: true 
	},
}));
app.use(webpackHotMiddleware(compiler));
// 前端转发
app.use(config.server.hostDirectory, proxy('http://localhost:' + port));
//后台转发
// app.use('/api/', proxy('http://localhost:8080/api'));
app.use('/api/', proxy('http://localhost:7001/api'));

app.listen(port, function(err) {
	if (err) {
		console.error(err);
	}
	else {
		console.info("Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port);
	}
});