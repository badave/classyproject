define(function(require) {
	var Woodhouse = require('woodhouse');
	var Video = require('../models/video');

	return Woodhouse.Collection.extend({
		urlRoot: "/v1/videos",
		url: function() {
			return this.urlRoot;
		},

		parse: function(response) {
			return response.data;
		},

		model: Video
	});
});
