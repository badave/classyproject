var BaseCrudController = require('./base_crud');
var User = require('../models/user');
var UserCollection = require('../collections/user');

var authenticateMiddleware = require('./middlewares/authenticate');
var requireJsonMiddleware = require('./middlewares/require_json');
var requireUserMiddleware = require('./middlewares/require_user');
var requireAdminMiddleware = require('./middlewares/require_admin');

module.exports = BaseCrudController.extend({
  urlRoot: "users",
  model: User,
  collection: UserCollection,

  debug: false,

  middleware: function() {
    return {
      create: [authenticateMiddleware, requireJsonMiddleware],
      find: [authenticateMiddleware, requireUserMiddleware, requireAdminMiddleware ],
      findOne: [authenticateMiddleware, requireUserMiddleware, requireAdminMiddleware],
      update: [authenticateMiddleware, requireJsonMiddleware, requireUserMiddleware ],
      destroy: [authenticateMiddleware, requireUserMiddleware, requireAdminMiddleware ]
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
        // Doesn't have a user, check password
    		if(!model.verifyPassword(req.body.password)) {
    			throw new Error("Password doesn't match");
    		}

        // seems ok, create token
        var access_token = req.session.access_token = model.generateToken();

        if(req.body.remember) {
          req.cookie.access_token = access_token;
        }

        model.set('token', access_token);
    		return model;
    	})
    	.then(this.nextThen(req, res, next))
    	.catch(function(error) {
        // No user of same email, create user
    		if(error.code === 404) {
    			model.set('password', req.body.password);

    			return model.save()
            .then(function(model) {
              // seems ok, create token
              var access_token = req.session.access_token = model.generateToken();

              if(req.body.remember) {
                req.cookie.access_token = access_token;
              }

              model.set('token', access_token);

              return model;
            })
    				.then(this.nextThen(req, res, next))
    				.catch(this.nextCatch(req, res, next));
    		} 
    		next(error);
    	});
  },

  update: function(req, res, next) {
    next();
  }
});
