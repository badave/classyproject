var environment = process.env['NODE_ENV'] || "development";
var fs = require('fs');
var path = require('path');

var config = module.exports = {
  proc: 'APP',
  pid: process.pid,
  env: environment,
  cachebust: (new Date()).getTime() // timestamp when process was started
};

config.title = "Pornodora";

config.database = {
  "mongodbs": {
    "primary": "mongodb://localhost:27017/test",
    "secondary": "mongodb://localhost:27017/test"
  }
};

if (environment === "development") {
  config.title = "Classy Project";
}

module.exports = config;
