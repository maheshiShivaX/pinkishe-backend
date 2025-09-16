const express = require('express')
const verifyToken = require("../middlewares/authMiddleware")
const stockController = require('../controllers/stockController')
const masterController = require('../controllers/masterController')
const authorizeRoles = require("../middlewares/roleMiddleware")


const router = express.Router()

router.post('/event', stockController.handleEvent);

router.get('/getDispenseHistory', verifyToken, authorizeRoles("admin", "user"), stockController.getDispenseHistory);
router.get('/getDispenseHistoryExportData', verifyToken, authorizeRoles("admin","user") ,stockController.getDispenseHistoryExportData);
router.get('/getDispenseHistoryForMachine/:machineId', verifyToken, authorizeRoles("admin", "user"), stockController.getDispenseHistoryForMachineId);

router.get('/getRefillingHistory', verifyToken, authorizeRoles("admin", "user"), stockController.getRefillingHistory);
router.get('/getRefillingHistoryExportData', verifyToken, authorizeRoles("admin","user") ,stockController.getRefillingHistoryExportData);


router.get('/getVendingMachines', verifyToken, authorizeRoles("admin","user") ,stockController.getAllVendingMachine);
router.delete('/deleteVendingMachine/:id', verifyToken, authorizeRoles("admin","user") ,stockController.deleteVendingMachine);

router.get('/getDistrictWisePadConsunption/:periodType', verifyToken, authorizeRoles("admin", "user"), stockController.getDistrictWisePadConsunption);
router.get('/getAllConsumptionPerGirl', verifyToken, authorizeRoles("admin","user") ,stockController.getAllConsumptionPerGirl);
router.get('/getDistrictWiseSchoolCount', verifyToken, authorizeRoles("admin","user") ,stockController.getDistrictWiseSchoolCount);


router.get('/getGeoLocation', verifyToken, authorizeRoles("admin","user") ,stockController.getAllGeoLocations);
router.post('/addGeoLocation', verifyToken, authorizeRoles("admin") ,masterController.saveGeoLocation);
router.delete('/deleteGeoLocation/:id', verifyToken, authorizeRoles("admin"), stockController.deleteGeoLocation);
router.put('/updateGeoLocation/:id', verifyToken, authorizeRoles("admin") ,masterController.updateGeoLocation);



router.get('/getNgoSpoc',verifyToken, authorizeRoles("admin") , stockController.getAllNgoSpocs);
router.post('/addNgoSpoc',verifyToken, authorizeRoles("admin") , stockController.createNgoSpoc);
router.delete('/ngospoc/:id', verifyToken, authorizeRoles("admin") ,stockController.deleteNgoSpoc);
router.put('/updateNgoSpoc/:id', verifyToken, authorizeRoles("admin") ,stockController.updateNgoSpoc);



router.get('/getUserDetailsAll', verifyToken, authorizeRoles("admin") ,stockController.getAllUsers);
router.delete('/deleteUser/:username', verifyToken, authorizeRoles("admin") ,stockController.deleteUser);


router.get('/getDashboardData', verifyToken, authorizeRoles("admin","user") ,stockController.getDashboardData);
router.get('/getPeriodWiseConsumptionData/:periodType/:state?/:district?', verifyToken, authorizeRoles("admin","user") ,stockController.getPeriodWiseConsumptionData);

router.post('/addOrganization', verifyToken, authorizeRoles("admin") ,masterController.saveOrganisation);

router.post('/addVendingMaster', verifyToken, authorizeRoles("admin") ,masterController.saveVendingMachine);
router.put('/updateVendingMaster/:machineId', verifyToken, authorizeRoles("admin") ,masterController.updateVendingMachine);

router.get('/getSchool', verifyToken, authorizeRoles("admin") ,stockController.getAllSchool);
router.post('/addSchool', verifyToken, authorizeRoles("admin") ,masterController.saveSchool);
router.put('/updateSchool/:id', verifyToken, authorizeRoles("admin") ,masterController.updateSchool);
router.delete('/deleteSchool/:id', verifyToken, authorizeRoles("admin") ,masterController.deleteSchool);

router.post('/machine/status', masterController.updateOnlineStatusTimestamp);

router.post('/allocateMachineMaster', verifyToken, authorizeRoles("admin") ,masterController.saveMachineAllocation);
router.delete('/deleteallocateMachine/:id', verifyToken, authorizeRoles("admin") ,masterController.deleteMachineAllocation);

module.exports = router