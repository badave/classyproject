"use strict";

var Bootie = require('bootie');
var authenticateMiddleware = require('./middlewares/authenticate');
var requireJsonMiddleware = require('./middlewares/require_json');

module.exports = Bootie.CrudController.extend({
  // In this example application, we're loading some crud route specific middleware
  middleware: function() {
    return {
      create: [authenticateMiddleware, requireJsonMiddleware],
      find: [authenticateMiddleware],
      findOne: [authenticateMiddleware],
      update: [authenticateMiddleware, requireJsonMiddleware],
      destroy: [authenticateMiddleware]
    };
  },

  queryParams: function() {
    return {};
  },

  // queryParams: {
  //   test: true
  // },

  // Override setupModel to parse id and user_id
  setupModel: function(req) {
    var model = Bootie.CrudController.prototype.setupModel.apply(this, arguments);

    // If an `id` is provided, set it to the model
    if (req.params.id) {
      model.set(this.model.prototype.idAttribute, req.params.id);
    }

    // If the authenticated user is not godmode, set `user_id` to restrict queries
    if (req.user && !req.god) {
      model.set(this.model.prototype.userIdAttribute, req.user.id);
    }

    return model;
  },

  // Override setupCollection to parse user_id
  setupCollection: function(req, qo) {
    var collection = Bootie.CrudController.prototype.setupCollection.apply(this, arguments);

    // If the authenticated user is not godmode, set `user_id` to restrict queries
    if (req.user && !req.god) {
      qo.query[collection.model.prototype.userIdAttribute] = req.user.id;
    }

    return collection;
  }

});
