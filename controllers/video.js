var BaseController = require('./base');
var Video = require('../models/video');
var VideoCollection = require('../collections/video');

module.exports = BaseController.extend({
  urlRoot: "videos",

  model: Video,
  collection: VideoCollection
});
