"use strict";

module.exports = function(req, res, next) {
  var err;
  if (!req.admin) {
    err = new Error("Admin required.");
    err.code = 401;
  }
  next(err);
};
