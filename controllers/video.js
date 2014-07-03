var BaseCrudController = require('./base_crud');
var Video = require('../models/video');
var VideoCollection = require('../collections/video');

module.exports = BaseCrudController.extend({
  urlRoot: "videos",
  model: Video,
  collection: VideoCollection
});
