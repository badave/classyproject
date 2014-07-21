define(function(require) {
  var Woodhouse = require('woodhouse');
  var PlayerView = require('../video/player');
  var EditorView = require('../editor/editor');
  var LoginView = require('../user/login');

  // Acts as a layout for multiple backbone views
  return Woodhouse.View.extend({
    template: function(context) {
      return jade.render('home', context);
    },
    onRender: function() {
      this.$el.find('.player-container').html(new PlayerView({
        collection: this.collection.clone(),
        paging: this.collection.paging
      }).render().$el);
    },
    openEditorModal: function() {
      this.$el.find('.editor').html(new EditorView({
        collection: this.collection.clone(),
        paging: this.collection.paging
      }).render().$el);

      this.$el.find('.editor-modal').modal('show');
    },
    openLoginModal: function() {
      this.$el.find('.login').html(new LoginView().render().$el);
      this.$el.find('.login-modal').modal('show');
    }
  });
})
