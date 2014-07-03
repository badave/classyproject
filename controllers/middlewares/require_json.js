"use strict";

module.exports = function(req, res, next) {
  var err;
  if (!req.is('json')) {
    err = new Error("Please set your request headers to contain: `Content-Type: application/json`.");
    err.code = 400;
  }
  next(err);
};
