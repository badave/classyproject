define(function(require) {
	var Woodhouse = require('woodhouse');
	var LIMIT = 20;

	return Woodhouse.Collection.extend({
		initialize: function() {
			var params = {};
		
			this.params = {
				limit: LIMIT,
				sort: 'updated',
				order: 'desc',
				skip: 0,
				offset: 0
			};

			_.extend(this.params, params);
		},

		url: function() {
			return this.urlRoot + ((this.urlRoot.indexOf("?") >= 0) ? '&' : '?') + $.param(this.params); 
		},

		parse: function(response) {
			this.paging = response.meta.paging;
			return response.data;
		}
	});
});
