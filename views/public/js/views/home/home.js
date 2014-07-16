define(function(require) {
  var Woodhouse = require('woodhouse');
  var PlayerView = require('../video/player');

  return Woodhouse.View.extend({
    template: function(context) {
      return jade.render('home', context);
    },
    onRender: function() {
      this.$el.find('.player-container').html(new PlayerView({
        collection: this.collection
      }).render().$el);
    }
  });
})
