"use strict";

var User = require('../../models/user');

module.exports = function(req, res, next) {
	if(req.cookie.access_token) {
		req.session.access_token = req.cookie.access_token;
	}


	if(req.session.access_token) {
		req.user = new User();
		req.user.decryptToken(req.session.access_token);
		req.user.fetch({require: true,
			query: {
				"_id": req.user.id
			}})
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
