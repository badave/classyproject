//the require library is configuring paths
require.config({
  paths: {
    //tries to load jQuery from Google's CDN first and falls back
    //to load locally
    "jquery": [
      "https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min",
      "libs/jquery/dist/jquery"
    ],
    "videojs": "libs/video-js/video",
    "underscore": "libs/underscore/underscore",
    "backbone": "libs/backbone/backbone",
    "woodhouse": "libs/woodhouse/woodhouse",
    "bootstrap": "libs/bootstrap/dist/js/bootstrap",
    "bootstrap-tagsinput": "libs/bootstrap-tagsinput/dist/bootstrap-tagsinput",
    "bluebird": "libs/bluebird/js/browser/bluebird",
    "videojs-youtube": "libs/videojs-youtube/src/youtube"
  },
  shim: {
    "backbone": {
      //loads dependencies first
      "deps": ["jquery", "underscore"],
      //custom export name, this would be lowercase otherwise
      "exports": "Backbone"
    },
    "woodhouse": {
      "deps": ["backbone"],
      "exports": "Woodhouse"
    },
    "bootstrap": {
      "deps": ["jquery"]
    },
    "bootstrap-tagsinput": {
      "deps": ["bootstrap"]
    },
    "videojs-youtube": {
      "deps": ["videojs"]
    }
  },
  //how long the it tries to load a script before giving up, the default is 7
  waitSeconds: 10
});
//requiring the scripts in the first argument and then passing the library namespaces into a callback
//you should be able to console log all of the callback arguments
require([
  'jquery', 
  'underscore', 
  'backbone', 
  'templates', 
  'woodhouse', 
  'app',
  'bootstrap'
  ], function(jquery, _, Backbone, jade, Woodhouse, App) {
    var User = require('./models/user');
    var user = new User({"_id": "me"});
    var APP = require('./constants');

    user.fetch({
      success: function() {
        APP.user = user;
        new App;
      },
      error: function() {
        new App;
      }
    })

});
