define(function(require) {
	var Base = require('./base');
	var Channel = require('../models/channel');

	return Base.extend({
		urlRoot: "/v1/channels",

		model: Channel
	});
});
