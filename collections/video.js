var Video = require('../models/video');

module.exports = Bookshelf.Collection.extend({
  model: Video
});
