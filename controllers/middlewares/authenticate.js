"use strict";

module.exports = function(req, res, next) {
  req.user = new Bootie.Model();
  req.admin = false;
  req.god = false;
  next();
};
