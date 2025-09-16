const express = require('express');
const authController = require('../controllers/authController');
const authorizeRoles = require("../middlewares/roleMiddleware");
const router = express.Router();
const {register, login} = require("../controllers/authController")
const verifyToken = require("../middlewares/authMiddleware")

router.post("/register", register);
router.post("/login", login);

router.post('/userregister', authController.userregister);
router.put('/userupdate/:username', authController.updateUserDetails);
router.post('/assignrole', authController.assignrole);
router.post('/userlogin', authController.userlogin);
router.post('/verifyotp', authController.verifyotp);

router.post('/validate-token', verifyToken, (req, res) => {
    res.json({ valid: true });
  });


module.exports = router;