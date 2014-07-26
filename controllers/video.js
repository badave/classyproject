var BaseCrudController = require('./base_crud');
var Video = require('../models/video');
var VideoCollection = require('../collections/video');

var authenticateMiddleware = require('./middlewares/authenticate');
var requireJsonMiddleware = require('./middlewares/require_json');
var requireUserMiddleware = require('./middlewares/require_user');
var requireAdminMiddleware = require('./middlewares/require_admin');

module.exports = BaseCrudController.extend({
  urlRoot: "videos",
  model: Video,
  collection: VideoCollection,

  setupRoutes: function() {
  	var basePath = _.result(this, "basePath");

  	this.routes.get[basePath + '/recommended'] = {
      action: this.recommended,
      middleware: this.getRouteMiddleware('recommended')
    };

  	BaseCrudController.prototype.setupRoutes.call(this);
  },

  middleware: function() {
    return {
      create: [authenticateMiddleware, requireJsonMiddleware],
      find: [authenticateMiddleware],
      recommended: [authenticateMiddleware],
      findOne: [authenticateMiddleware, requireUserMiddleware, requireAdminMiddleware],
      update: [authenticateMiddleware, requireJsonMiddleware, requireUserMiddleware ],
      destroy: [authenticateMiddleware, requireUserMiddleware, requireAdminMiddleware ]
    };
  },


  // Recommended is simply all videos that aren't your videos
  recommended: function(req, res, next, options) {
  	var qo = this.parseQueryString(req);
    var collection = this.setupCollection(req, qo);

    // Merge `options.query` with the query string query and filters
    if (options && options.query) {
      _.merge(qo.query, options.query);
    }

    if (this.debug) {
      console.log("Find with Query: %s".verbose, JSON.stringify(qo));
    }

    qo.query.user_id = undefined;

    return collection.fetch(qo).bind(this).then(function(resp) {
      return collection.count(qo).tap(function(resp) {
        res.paging = {
          total: parseInt(resp),
          count: parseInt(collection.models.length),
          limit: parseInt(qo.limit),
          offset: parseInt(qo.skip),
          has_more: parseInt(collection.models.length) < parseInt(resp)
        };
      });
    }).then(function(count) {
      return collection;
    }).then(this.nextThen(req, res, next))
    .catch(this.nextCatch(req, res, next));
  }
});
