define(function(require) {
  var Woodhouse = require('woodhouse');
  var APP = require('../../constants');
  var Channel = require('../../models/channel');

  return Woodhouse.View.extend({
  	events: {
  		'submit form.search': 'search'
  	},
  	initialize: function() {
  		this.model = new Channel();
  	},
  	template: function(context) {
  		return jade.render('channels/channels', context);
  	},
  	search: function(e) {
  		if(this.model.get('title').length) {
	   		this.model.set('tags', [this.model.get('title')]);
	  		this.model.save();
	  		this.collection.push(this.model);
	  		this.model = new Channel();
	  		this.render();
	  	}
  	},
    loadChannel: function(e, options) {
      $(window).trigger(APP.EVENTS.LOAD_CHANNEL, options.model);
    },

  	destroy: function(e, options) {
  		var destroyMe = confirm("Are you sure you want to remove this station?");
  		if(destroyMe) {
  			options.model.destroy();
  		}
  	}
  });
});
