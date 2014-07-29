var port = process.env['PORT'] || 8888;

var express = require('express');
var bodyParser = require('body-parser');
var sessions = require("client-sessions");
var path = require('path');
var compression = require('compression');
var lessMiddleware = require('less-middleware');
var jadeBrowser = require('jade-browser');

var _ = global._ = require('lodash');
var config = global.config = require('./config');
var Bootie = global.Bootie = require('bootie');
var database = new Bootie.Database(config.database);
Bootie.database = database;

var app = express();
app.locals = {
  config: config
};
app.use(compression());

app.use(sessions({
  cookieName: 'session', // cookie name dictates the key name added to the request object
  secret: 'afjlk23u4908134ujfskadnvm13984u1o', // should be a large unguessable string
  duration: 24 * 60 * 60 * 1000 * 365 * 100, // how long the session will stay valid in ms
  activeDuration: 1000 * 60 * 60 * 24, // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
  cookie: {
    ephemeral: true
  }
}));

app.use(sessions({
  cookieName: 'cookie', // cookie name dictates the key name added to the request object
  secret: '123098102831lkjsdfa1210293812ljkkj', // should be a large unguessable string
  duration: 24 * 60 * 60 * 1000 * 365 * 100, // how long the session will stay valid in ms
  activeDuration: 1000 * 60 * 60 * 24 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
}));

app.engine('jade', require('jade').__express);
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json());

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


// Controllers
var FeelController = require('./controllers/feel');
var VideoController = require('./controllers/video');
var UserController = require('./controllers/user');

var router = new Bootie.Router({
  version: "v1",
  controllers: {
    user: new UserController({
      db: database.mongodbs.primary
    }),
    video: new VideoController({
      db: database.mongodbs.primary
    }),
    feel: new FeelController({
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

module.exports = app;
