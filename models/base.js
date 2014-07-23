"use strict";

var Bootie = require('bootie');

module.exports = Bootie.Model.extend({
  idAttribute: "_id",

  db: Bootie.database.mongodbs.primary,

  baseDefaults: function() {
    return {
      _id: null,
      user_id: null,
      created_date: new Date(),
      updated_date: new Date()
    };
  },

  baseSchema: function() {
    return {
      _id: 'string',
      user_id: 'string',
      created_date: 'date',
      updated_date: 'date'
    };
  },

  readOnlyAttributes: {
    '_id': 'string',
    'user_id': 'string'
  },
});
