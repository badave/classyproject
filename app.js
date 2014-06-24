var port = process.env['PORT'] || 8888;

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var config = require('./config');

app.engine('jade', require('jade').__express);
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser());

app.get('/', function(req, res) {
    res.render("index", {
        config: config
    });
});

app.listen(port);