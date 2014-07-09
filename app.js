var port = process.env['PORT'] || 8888;

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var compression = require('compression');
var lessMiddleware = require('less-middleware');
var jadeBrowser = require('jade-browser');


var app = express();
app.engine('jade', require('jade').__express);
app.set('view engine', 'jade');
app.use(bodyParser());
app.use(compression());

app.use(lessMiddleware(path.join(__dirname, 'less'), {
  dest: path.join(__dirname, 'public'),
  preprocess: {
    path: function(pathname, req) {
      return pathname.replace('/css', '');
    }
  },
  compress: true,
  debug: false,
  force: false
}));

app.use(jadeBrowser('/js/templates.js', '**', {
  root: path.join(__dirname, 'views'),
  noCache: true
}));


var _ = global._ = require('underscore');


var config = global.config = require('./config');

app.locals = {
  config: config
};


var Bootie = global.Bootie = require('bootie');
var VideoController = require('./controllers/video');

var database = new Bootie.Database(config.database);

var router = new Bootie.Router({
  version: "v1",
  controllers: {
    video: new VideoController({
      db: database.mongodbs.primary
    })
  }
});

app.use(express.static(__dirname + '/public'));
app.use(router.url, router);

app.get('/', function(req, res) {
  res.render("index");
});

console.log("Starting server on port " + port);

app.listen(port);
