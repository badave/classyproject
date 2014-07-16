define(function(require) {
	var Woodhouse = require('woodhouse');

	return Woodhouse.Model.extend({
		urlRoot: "/v1/videos",
		idAttribute: "_id"
	});

});
