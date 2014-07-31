var BaseCrudController = require('./base_crud');
var Channel = require('../models/channel');
var Channels = require('../collections/channel');

var authenticateMiddleware = require('./middlewares/authenticate');
var requireJsonMiddleware = require('./middlewares/require_json');
var requireUserMiddleware = require('./middlewares/require_user');
var requireAdminMiddleware = require('./middlewares/require_admin');

module.exports = BaseCrudController.extend({
  urlRoot: "channels",
  model: Channel,
  collection: Channels,
  debug: false
});
