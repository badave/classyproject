var environment = process.env['NODE_ENV'] || "development";
var config = {};


config.title = "Pornodora";


if (environment === "development") {
  config.title = "Classy Project";
}

config.postgres = {
  'brown': process.env['HEROKU_POSTGRESQL_BROWN_URL'] || "postgres://cqtiyunqokypgt:qL5IL8x-6qUZYLNBk-wKH3jdQh@ec2-54-204-24-202.compute-1.amazonaws.com:5432/d4lg9dvukip17n?ssl=true"
};




module.exports = config;
