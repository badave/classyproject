define(function(require) {
	var Woodhouse = require('woodhouse');

	return Woodhouse.Model.extend({
		urlRoot: "/v1/users",
		idAttribute: "_id",
		parse: function(response) {
			return response.data || response;
		}
	});

});
