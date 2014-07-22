var BaseCrudController = require('./base_crud');
var User = require('../models/user');
var UserCollection = require('../collections/user');

var authenticateMiddleware = require('./middlewares/authenticate');
var requireJsonMiddleware = require('./middlewares/require_json');
var requireAdminMiddleware = require('./middlewares/require_admin');

module.exports = BaseCrudController.extend({
  urlRoot: "users",
  model: User,
  collection: UserCollection,

  middleware: function() {
    return {
      create: [authenticateMiddleware, requireJsonMiddleware],
      find: [authenticateMiddleware],
      findOne: [authenticateMiddleware],
      update: [authenticateMiddleware, requireJsonMiddleware],
      destroy: [authenticateMiddleware]
    };
  },

  create: function(req, res, next) {
  	var model = this.setupModel(req);

    model.setFromRequest({
    	'email': req.body.email
    });

    return model.fetch({require: true, query: {
    	'email': req.body.email
    }})
    	.bind(this)
    	.then(function(model) {
    		if(!model.verifyPassword(req.body.password)) {
    			throw new Error("Password doesn't match");
    		}
    		return model;
    	})
    	.then(this.nextThen(req, res, next))
    	.catch(function(error) {
    		if(error.code === 404) {
    			model.set('password', req.body.password);
    			
    			return model.save()
    				.then(this.nextThen(req, res, next))
    				.catch(this.nextCatch(req, res, next));
    		} 
    		next(error);
    	});
  }
});
