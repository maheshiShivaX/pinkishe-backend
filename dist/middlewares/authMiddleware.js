"use strict";

var jwt = require('jsonwebtoken');

// Middleware to verify JWT token
var verifyToken = function verifyToken(req, res, next) {
  var _req$headers$authoriz;
  var token = (_req$headers$authoriz = req.headers['authorization']) === null || _req$headers$authoriz === void 0 ? void 0 : _req$headers$authoriz.split(' ')[1]; // Expecting 'Bearer <token>'

  if (!token) {
    return res.status(403).json({
      message: 'Access denied, token missing'
    });
  }

  // Verify the JWT token
  try {
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) {
        return res.status(403).json({
          message: 'Invalid or expired token'
        });
      }

      // Attach user info to the request object
      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(401).json({
      message: 'Token is Not Valid'
    });
  }
};
module.exports = verifyToken;