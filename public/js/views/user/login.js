define(function(require) {
  var Woodhouse = require('woodhouse');
  var User = require('../../models/user');
  require('bootstrap-tagsinput');

  return Woodhouse.View.extend({
    tagName: 'form',
    events: {
      'submit': 'login'
    },
    initialize: function() {
      this.model = new User();
    },
    template: function(context) {
      return jade.render('user/login', context);
    },
    openModal: function() {
      this.$el.find('.modal').modal('show');
    }
  });
});
