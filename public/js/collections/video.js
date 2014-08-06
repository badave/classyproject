define(function(require) {
	var Base = require('./base');
	var Video = require('../models/video');

	return Base.extend({
		urlRoot: "/v1/videos",

		model: Video,

		url: function() {
			var url = this.urlRoot;

			var params = [];
			
			if(this.type) {
				url += '/' + this.type;
			}

			if(this.tags && _.isArray(this.tags)) {
				params.push("tags=" + this.tags.join(','));
			}

			params.push("sort=updated_date");

			url += "?" + params.join("&");

			return url;
		}
	});
});
