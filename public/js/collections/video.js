define(function(require) {
	var Base = require('./base');
	var Video = require('../models/video');

	return Base.extend({
		urlRoot: "/v1/videos",

		model: Video,

		url: function() {
			if(this.type) {
				return this.urlRoot + '/' + this.type + "?sort=updated_date";
			}

			return this.urlRoot;
		}
	});
});
