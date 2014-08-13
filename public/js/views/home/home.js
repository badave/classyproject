define(function(require) {
  var Woodhouse = require('woodhouse');

  var PlayerView = require('../video/player');
  var EditorView = require('../editor/editor');
  var LoginView = require('../user/login');
  var ChannelView = require('../channels/channel');
  var APP = require('../../constants');

  // Acts as a layout for multiple backbone views
  return Woodhouse.View.extend({
    initialize: function(options) {
      this.videos = options.videos;
      this.channels = options.channels;
      this.bindWindowEvents();
    },
    template: function(context) {
      return jade.render('home', _.extend(context, {
        user: APP.user && APP.user.toJSON()
      }));
    },
    onRender: function() {
      this.attachChannels();
      this.attachPlayer();
    },

    attachChannels: function() {
      this.$el.find('.channels-container').html(new ChannelView({
        collection: this.channels
      }).render().$el);
    },

    attachPlayer: function() {
      this.playerView = new PlayerView({
        collection: this.videos
      });

      this.$el.find('.player-container').html(this.playerView.render().$el);
    },

    openEditorModal: function() {
      this.$el.find('.editor').html(new EditorView({
        collection: this.videos
      }).render().$el);

      this.$el.find('.editor-modal').modal('show');
    },
    openLoginModal: function() {
      this.$el.find('.login').html(new LoginView().render().$el);
      this.$el.find('.login-modal').modal('show');
    },
    logout: function() {
      APP.user = undefined;
      $.ajax('/v1/users/logout');
      this.render();
    },
    bindWindowEvents: function() {
      $(window).on(APP.EVENTS.USER_LOGIN, function(e, user) {
        setTimeout(function() {
          this.render();
        }.bind(this), 500);
      }.bind(this));

      $(window).on(APP.EVENTS.LOAD_CHANNEL, function(e, channel) {
        var title = channel.get('title');
        var tags = channel.get('tags') || [];
        tags.push(title);
        this.videos.tags = tags;
        this.videos.fetch({reset: true, success: function() {
          $(window).trigger(APP.EVENTS.LOAD_VIDEOS, this.videos);
        }.bind(this)});
      }.bind(this));
    }

  });
})
