"use strict";

var Bootie = require('bootie');

module.exports = Bootie.Model.extend({
  baseDefaults: function() {
    return {
      _id: null,
      user_id: null,
      created: (new Date()).getTime(),
      updated: (new Date()).getTime(),
      created_date: new Date(),
      updated_date: new Date(),
      metadata: {},
      locked: false,
      version: 'v1'
    };
  },

  baseSchema: function() {
    return {
      _id: 'string',
      user_id: 'string',
      created: 'integer',
      updated: 'integer',
      created_date: 'date',
      updated_date: 'date',
      metadata: 'object',
      locked: 'boolean',
      version: 'string'
    };
  }
});
