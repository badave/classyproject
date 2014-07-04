define(function(require) {
  var Woodhouse = require('woodhouse');

  var App = Woodhouse.Router.extend({
    initialize: function() {
      Backbone.history.start();
    },
    routes: {
      "": "index",
      "/": "index"
    },
    index: function() {
      debugger
    }

  });
  return App;
});
