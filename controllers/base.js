"use strict";

module.exports = Bootie.Controller.extend({
  // Get `access_token` from `req`
  // Attempts to get an `access_token` from the `Authorization` header
  // Uses several fallbacks to read the token
  // Also falls back to reading `access_token` from the query string
  accessTokenFromRequest: function(req) {
    var access_token;

    if (req.headers.authorization) {
      // Use HTTP Auth header
      var parts = req.headers.authorization.split(' ');
      var scheme = parts[0];
      var credentials = parts[1];

      if (scheme === 'Basic') {
        // HTTP Basic
        var userPass = new Buffer(credentials, 'base64')
          .toString()
          .split(':');
        if (userPass.length > 1) {
          // Base64
          access_token = userPass[0];
        } else {
          // Not Base64
          access_token = credentials;
        }
      } else if (scheme === 'Bearer') {
        // HTTP Bearer
        access_token = credentials;
      } else {
        // Fallback if access_token is passed directly without scheme
        access_token = scheme;
      }
    } else if (req.query.access_token) {
      // Use query string
      access_token = req.query.access_token;
    }

    return access_token;
  }

});
