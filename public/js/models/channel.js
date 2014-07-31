define(function(require) {
	var Woodhouse = require('woodhouse');

	return Woodhouse.Model.extend({
		urlRoot: "/v1/channels",
		idAttribute: "_id",
		parse: function(response) {
			return response.data || response;
		}
	});
});
