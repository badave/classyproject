define(function(require) {
  var Promise = require('bluebird');
  var Woodhouse = require('woodhouse');

  var Videos = require('./collections/video');
  var Channels =require('./collections/channel');
  var HomeView = require('./views/home/home');

  var App = Woodhouse.Router.extend({
    initialize: function() {
      Backbone.history.start();
    },
    routes: {
      "": "index",
      "/": "index"
    },
    fetch: function() {
      var fns = [];

      fns.push(new Promise(function(successCallback, errorCallback) {
        var videos = new Videos();
        videos.type = "recommended";
        videos.fetch({
          success: successCallback,
          error: errorCallback
        });
      }));


      fns.push(new Promise(function(successCallback, errorCallback) {
        var channels = new Channels();
        channels.fetch({
          success: successCallback,
          error: errorCallback
        });
      }));

      return Promise.all(fns)
        .then(function(results) {
          return results;
        })
        .catch(function(e) {
          // TODO(badave) Handle errors
          console.error(e);
        });
    },

    index: function() {
      return this.fetch()
        .then(function(results) {
          $('body').html(new HomeView({
            channels: results[1],
            videos: results[0]
          }).render().$el);
        });
    }
  });

  return App;
});
