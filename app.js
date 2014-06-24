var port = process.env['PORT'] || 8888;

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var config = require('./config');

app.engine('jade', require('jade').__express);
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser());

app.locals = {
    config: config
};

app.get('/', function(req, res) {
    res.render("index");
});


app.get('/register', function(req, res) {
    res.render("register");
});

app.listen(port);