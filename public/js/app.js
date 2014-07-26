define(function(require) {
  var Woodhouse = require('woodhouse');
  var Videos = require('./collections/video');
  var HomeView = require('./views/home/home');

  var App = Woodhouse.Router.extend({
    initialize: function() {
      Backbone.history.start();
    },
    routes: {
      "": "index",
      "/": "index"
    },
    index: function() {
      var videos = new Videos();
      videos.type = "recommended";
      videos.fetch({
        success: function() {
          $('body').html(new HomeView({
            collection: videos
          }).render().$el);
        }
      })
    }
  });

  return App;
});
