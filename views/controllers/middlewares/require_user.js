"use strict";

module.exports = function(req, res, next) {
  var err;
  if (!req.user) {
    err = new Error("User required.");
    err.code = 401;
  }
  next(err);
};
