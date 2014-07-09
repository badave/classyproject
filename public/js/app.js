define(function(require) {
  var Woodhouse = require('woodhouse');
  // var Video = require('')

  var App = Woodhouse.Router.extend({
    initialize: function() {
      Backbone.history.start();
    },
    routes: {
      "": "index",
      "/": "index"
    },
    index: function() {
      var View = Woodhouse.View.extend({
        template: function(context) {
          return jade.render('home', context);
        }
      });

      $('.container').html(new View().render().$el);
    }

  });
  return App;
});
