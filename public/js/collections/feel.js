define(function(require) {
	var Base = require('./base');
	var Feel = require('../models/feel');

	return Base.extend({
		urlRoot: "/v1/feels",

		model: Feel,

		url: function() {
			if(this.type) {
				return this.urlRoot + '/' + this.type + "?sort=updated_date";
			}

			if(this.object_id) {
				return this.urlRoot + "?object_id=" + this.object_id + "&sort=updated_date";	
			}

			return this.urlRoot;
		}
	});
});
