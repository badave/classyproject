define(function(require) {
  var Woodhouse = require('woodhouse');
  var Videos = require('./collections/video');

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
      videos.fetch({
        success: function() {
          var video = videos.first() || {};

          var View = Woodhouse.View.extend({
            template: function(context) {
              return jade.render('home', context);
            }
          });

          $('.container').html(new View({
            model: video
          }).render().$el);
        }
      })
    }

  });
  return App;
});
