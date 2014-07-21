define(function(require) {
	var Woodhouse = require('woodhouse');
    var Video = require('../../models/video');
	require('bootstrap-tagsinput');

	return Woodhouse.View.extend({
		tagName: 'form',
		events: {
            'click .addVideo': 'addVideo',
            'click .playVideo': 'playVideo',
            'click .removeVideo': 'removeVideo',
			'submit': 'save'
		},
		template: function(context) {
      return jade.render('editor/editor', context);
    },
    openModal: function() {
    	this.$el.find('.modal').modal('show');
    },

    onRender: function() {
    	this.$el.find('[name="tags"]').tagsinput();
    },
    addVideo: function(e) {
        this.collection.unshift(new Video());
    },
    playVideo: function(e) {
        // Player listens for this event on the collection
        var target_id = $(e.currentTarget).attr('data-id');
        var model = this.collection.findWhere({
            '_id': target_id
        });
        $(window).trigger('load:video', model);
    },
    removeVideo: function(e) {
        var target_id = $(e.currentTarget).attr('data-id');
        var model = this.collection.findWhere({
            '_id': target_id
        });

        model.destroy();
    },
    save: function(e) {
    	e.stopPropagation();
    	e.preventDefault();

    	this.collection.each(function(model) {
    		var tags = this.$el.find('[data-tags-id="' + model.id + '"]').val();
    		model.set('tags', (tags || '').split(','));
    		if(!_.isEmpty(model.changed)) {
    			model.save();
    		}
    	}.bind(this));
    }

  });
});
