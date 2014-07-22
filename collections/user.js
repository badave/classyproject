var User = require('../models/user');

module.exports = Bootie.Collection.extend({
  model: User
});
