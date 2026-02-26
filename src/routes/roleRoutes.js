const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const menuController = require("../controllers/menuController");
const roleMenuController = require("../controllers/roleMenuController");
const verifyToken = require('../middlewares/authMiddleware');

router.post("/role_menu/create",  roleMenuController.saveRoleMenu);

// PROTECTED ROUTES
router.post("/menu/create", verifyToken, menuController.createMenu);
router.get("/menu/list", verifyToken, menuController.getMenus);

router.post('/role/saverole', roleController.saveRole);
router.get('/role/list', roleController.getAllRoles);
router.get("/role/getrolebyid/:id", roleController.getRoleById);
router.delete("/role/deleterole/:id", roleController.deleteRole);

module.exports = router;