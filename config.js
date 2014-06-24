var environment = process.env['NODE_ENV'] || "development";
var config = {};


config.title = "Pornodora";


if (environment === "development") {
  config.title = "Classy Project";
}


module.exports = config;
