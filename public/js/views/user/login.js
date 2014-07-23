define(function(require) {
  var Woodhouse = require('woodhouse');

  var User = require('../../models/user');
  var APP = require('../../constants');
  require('bootstrap-tagsinput');

  return Woodhouse.View.extend({
    tagName: 'form',
    events: {
      'submit': 'login'
    },
    initialize: function() {
      this.model = new User({
        'remember': true
      });
    },
    template: function(context) {
      return jade.render('user/login', context);
    },
    login: function(e) {
      e.stopPropagation();
      e.preventDefault();

      this.model.save({}, {
        success: function(model) {
          $(window).trigger(APP.EVENTS.USER_LOGIN, model);
          APP.user = model;
          this.$el.find('.login-modal').modal('hide');
        }.bind(this),
        error: function(model, response) {
          var error = response.responseJSON.data;
          if(error.indexOf('email') >= 0) {
            this.$el.find('.email-group').addClass('has-error');
            // this.$el.find('')
          }

          if(error.indexOf('password') >= 0) {
            this.$el.find('.password-group').addClass('has-error');
          }

          this.$el.find('.error').text(error).show();
        }.bind(this)
      })
    }
  });
});
