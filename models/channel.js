var Base = require('./base');

module.exports = Base.extend({
  urlRoot: "channels",

  schema: {
  	'title': 'string',
  	'tags': 'array'
  }
});
