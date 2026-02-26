"use strict";

var authorizeRoles = function authorizeRoles() {
  for (var _len = arguments.length, allowedRoles = new Array(_len), _key = 0; _key < _len; _key++) {
    allowedRoles[_key] = arguments[_key];
  }
  return function (req, res, next) {
    // console.log("in middleware currently:", req);
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied"
      });
    }
    next();
  };
};
module.exports = authorizeRoles;