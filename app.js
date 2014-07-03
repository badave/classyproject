var port = process.env['PORT'] || 8888;

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var compression = require('compression');


var _ = global._ = require('underscore');
var config = global.config = require('./config');
var Bookshelf = global.Bookshelf = require('./bookshelf');
var Bootie = global.Bootie = require('bootie');

var VideoController = require('./controllers/video');

app.engine('jade', require('jade').__express);
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser());
app.use(compression());

app.locals = {
  config: config
};

var router = new Bootie.Router({
  version: "v1",
  controllers: {
    video: new VideoController({
      db: Bookshelf.knex
    })
  }
});

app.use(router.url, router);

app.get('/', function(req, res) {
  res.render("index");
});


app.get('/register', function(req, res) {
  res.render("register");
});

console.log("Starting server on  port " + port);

app.listen(port);
