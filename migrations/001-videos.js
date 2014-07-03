var _ = global._ = require('underscore');
var Bootie = global.Bootie = require('bootie');

var config = global.config = require('../config');
var Bookshelf = global.Bookshelf = require('../bookshelf');

exports.up = function(next) {
  Bookshelf.knex.schema.createTable('videos', function(table) {
    table.increments('id').primary();
    table.string('name');
    table.string('title');
    table.string('description');
    table.timestamps();
  })
    .then(function() {
      next();
    });
};

exports.down = function(next) {
  Bookshelf.knex.schema.dropTable('videos')
    .then(function() {
      next();
    })
    .
  catch (function() {
    next();
  });
};
