"use strict";

var User = require('../../models/user');

module.exports = function(req, res, next) {
	var access_token;

	if (req.headers.authorization) {
    // Use HTTP Auth header
    var parts = req.headers.authorization.split(' ');
    var scheme = parts[0];
    var credentials = parts[1];

    if (scheme === 'Basic') {
      // HTTP Basic
      var userPass = new Buffer(credentials, 'base64')
        .toString()
        .split(':');
      if (userPass.length > 1) {
        // Base64
        access_token = userPass[0];
      } else {
        // Not Base64
        access_token = credentials;
      }
    } else if (scheme === 'Bearer') {
      // HTTP Bearer
      access_token = credentials;
    } else {
      // Fallback if access_token is passed directly without scheme
      access_token = scheme;
    }
  } else if (req.query.access_token) {
    // Use query string
    access_token = req.query.access_token;
  } else if(req.cookie.access_token) {
		access_token = req.cookie.access_token;
	} else if(req.session.access_token) {
		access_token = req.session.access_token;
	}

	if(access_token) {
		req.user = new User();
		req.user.decryptToken(access_token);

		req.user.fetch({
			require: true
		})
		.then(function(user) {
			next();
		})
		.catch(function(err) {
			req.user = undefined;
			next();
		});
	} else {
		next();
	}
};
