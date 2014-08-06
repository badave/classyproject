var Base = require('./base');
// local crypto, not the package
var crypto = require('../utils/crypto');
var validator = require('validator');

module.exports = Base.extend({
  urlRoot: "users",

  schema: function() { 
    return {
      'email': 'string',
      'password': 'string',
      'hash': 'string',
      'token': 'string'
    };
  },

  hiddenAttributes: ['hash', 'password','created_date','updated_date'],

  beforeSave: function() {
    if(this.get('password')) {
      this.set('hash', crypto.sha(this.get('password')));
      this.unset('password');
    }
  },

  validate: function() {
    if(!validator.isEmail(this.get('email'))) {
      throw new Error("Enter a valid email address");
    }

    if(!validator.isLength(this.get('password'), 1) && !this.get('hash')) {
      throw new Error("Enter a password");
    }
  },

  verifyPassword: function(password) {
    return crypto.sha(password) === this.get('hash');
  },

  admin: function() {
    return true;
  },

  generateToken: function() {
    var date = new Date();
    return crypto.encryptJSON({
      user_id: this.get('_id'),
      time: date.getTime(),
      diff: date.getTime() - new Date(this.get('created_date')).getTime()
    });
  },

  // decrypts and sets the user_id
  decryptToken: function(string) {
    var json = crypto.decryptJSON(string);
    if(json.user_id) {
      this.set('_id', json.user_id);
    }
  }

});
