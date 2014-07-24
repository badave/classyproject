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
      findOne: [authenticateMiddleware, requireUserMiddleware ],
      update: [authenticateMiddleware, requireJsonMiddleware, requireUserMiddleware ],
      destroy: [authenticateMiddleware, requireUserMiddleware, requireAdminMiddleware ]
    };
  },

  findOne: function(req, res, next, options) {
    var model = this.setupModel(req);
    options = options || {};
    _.merge(options, {
      require: true
    });

    if (this.debug) {
      if (options.query) {
        console.log("Find with Query: %s and UserID: %s".verbose, JSON.stringify(options.query), model.get('user_id'));
      } else {
        console.log("Find with ID: %s and UserID: %s".verbose, model.id, model.get('user_id'));
      }
    }

    if(req.params && req.params.id === 'me') {
      model = req.user;
    }

    return model.fetch(options)
      .then(function(model) {
        if(model.id !== req.user.id && !(req.user.admin())) {
          throw new Error("Must be the same user to fetch a user");
        }

        return model;
      })
      .then(this.nextThen(req, res, next))
      .catch(this.nextCatch(req, res, next));
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
