define(function(require) {
  var Woodhouse = require('woodhouse');
  var PlayerView = require('../video/player');
  var EditorView = require('../editor/editor');

  // Acts as a layout for multiple backbone views
  return Woodhouse.View.extend({
    template: function(context) {
      return jade.render('home', context);
    },
    onRender: function() {
      this.$el.find('.player-container').html(new PlayerView({
        collection: this.collection
      }).render().$el);

      this.$el.find('.editor').html(new EditorView({
        collection: this.collection.clone()
      }).render().$el);
    }
  });
})
