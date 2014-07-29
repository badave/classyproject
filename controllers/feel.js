var BaseCrudController = require('./base_crud');
var Feel = require('../models/feel');
var FeelsCollection = require('../collections/feel');

var authenticateMiddleware = require('./middlewares/authenticate');
var requireJsonMiddleware = require('./middlewares/require_json');
var requireUserMiddleware = require('./middlewares/require_user');
var requireAdminMiddleware = require('./middlewares/require_admin');

module.exports = BaseCrudController.extend({
  urlRoot: "feels",
  model: Feel,
  collection: FeelsCollection,
  debug: false,

  // Available controller actions (see `setupRoutes` for more info)
  crud: ["C", "R", "O", "D"],

  create: function(req, res, next, options) {
    var model = this.setupModel(req);
    model.setFromRequest(req.body);

    var feels = new FeelsCollection();

    var qo = this.parseQueryString(req);
    var collection = this.setupCollection(req, qo);

    // Merge `options.query` with the query string query and filters
    if (options && options.query) {
      _.merge(qo.query, options.query);
    }

    if (this.debug) {
      console.log("Find with Query: %s".verbose, JSON.stringify(qo));
    }

    qo.query.type = model.get('type');
    qo.query.object_id = model.get('object_id');
    qo.query.feeling = model.get('feeling');
    qo.require = false;

    if(model.get('feeling') === 'like' || model.get('feeling') === 'dislike') {
      delete qo.query.feeling;
      qo.query['$or'] = [{ 
        'feeling': 'like'
      }, { 
        'feeling': 'dislike'
      }];
    }

    return collection.fetch(qo)
      .bind(this)  
      .then(function() {
        if(collection.length) {
          // Should query for and get 'saved'
          if(model.get('feeling') === 'save' && collection.first().get('feeling') === 'save') {
            // this means unsave
            return collection.first().destroy();  
          }

          // If like or dislike, simply change the model and score to reflect what we want
          if(model.get('feeling') === 'like' || model.get('feeling') === 'dislike') {
            var updatedModel = collection.first();

            updatedModel.set('feeling', model.get('feeling'));
            updatedModel.set('score', model.get('feeling') === 'like' ? 1: -1);

            return updatedModel.save();
          }
          
        } else {
          // simply save as is if new
          return model.save();
        }
      })
      .then(this.nextThen(req, res, next))
      .catch(this.nextCatch(req, res, next));
  }
});
