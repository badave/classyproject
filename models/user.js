var Base = require('./base');
// local crypto, not the package
var crypto = require('../utils/crypto');

module.exports = Base.extend({
  urlRoot: "users",

  schema: {
    'email': 'string',
    'password': 'string',
    'hash': 'string'
  },

  hiddenAttributes: ['hash', 'password'],

  beforeSave: function() {
    if(this.get('password')) {
      this.set('hash', crypto.sha(this.get('password')));
      this.unset('password');
    }
  },

  validate: function() {
    console.log("Validate Me: ", this.attributes);

    return false;
  },

  verifyPassword: function(password) {
    console.log(password);
    console.log(this.get('hash'));
    return crypto.sha(password) === this.get('hash');
  }


});
