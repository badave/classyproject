var Base = require('./base');

module.exports = Base.extend({
  urlRoot: "feels",

  schema: {
  	'type': 'string',
  	'feeling': 'string',
  	'score': 'number',
  	'object_id': 'string'
  }
});
