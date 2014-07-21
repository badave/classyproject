define(function(require) {
	var Woodhouse = require('woodhouse');
    var Video = require('../../models/video');
	require('bootstrap-tagsinput');

	return Woodhouse.View.extend({
		tagName: 'form',
		events: {
            'click .addVideo': 'addVideo',
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
    removeVideo: function(e) {
        var target_id = $(e.target).attr('data-remove-id');
        var model = this.collection.findWhere({
            '_id': target_id
        });

        model.destroy({
            success: function() {
                this.collection.remove(model);
            }
        });
    },
    save: function(e) {
    	e.stopPropagation();
    	e.preventDefault();

    	this.collection.each(function(model) {
    		var tags = this.$el.find('[data-tags-id="' + model.id + '"]').val();
            debugger
    		model.set('tags', (tags || '').split(','));
    		if(!_.isEmpty(model.changed)) {
    			model.save();
    		}
    	}.bind(this));
    }

  });
});
