"use strict";

var express = require('express');
var authController = require('../controllers/authController');
var authorizeRoles = require("../middlewares/roleMiddleware");
var router = express.Router();
var _require = require("../controllers/authController"),
  register = _require.register,
  login = _require.login;
var verifyToken = require("../middlewares/authMiddleware");
router.post("/register", register);
router.post("/login", login);
router.post('/userregister', authController.userregister);
router.put('/userupdate/:username', authController.updateUserDetails);
router.post('/assignrole', authController.assignrole);
router.post('/userlogin', authController.userlogin);
router.post('/verifyotp', authController.verifyotp);
router.post('/validate-token', verifyToken, function (req, res) {
  res.json({
    valid: true
  });
});
module.exports = router;