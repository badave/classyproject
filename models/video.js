var Base = require('./base');

module.exports = Base.extend({
  urlRoot: "videos",

  schema: {
  	'title': 'string',
  	'url': 'string',
  	'poster': 'string',
  	'tags': 'string',
  	'description': 'string'

  }
});
