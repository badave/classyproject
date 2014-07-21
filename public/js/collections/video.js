define(function(require) {
	var Base = require('./base');
	var Video = require('../models/video');

	return Base.extend({
		urlRoot: "/v1/videos",

		model: Video
	});
});
