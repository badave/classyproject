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
    "primary": process.env['MONGOLAB_URI'] || "mongodb://heroku_app26732105:189s1s2gucuno2cnigec3blca2@ds037698.mongolab.com:37698/heroku_app26732105",
  }
};

if (environment === "development") {
  config.title = "Classy Project";

  if (process.env['LOCALDB']) {
    config.database.mongodbs.primary = "mongodb://localhost:27017/classyproject";
  }
}

module.exports = config;
