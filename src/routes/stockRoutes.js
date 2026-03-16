const express = require('express')
const verifyToken = require("../middlewares/authMiddleware")
const stockController = require('../controllers/stockController')
const masterController = require('../controllers/masterController')
const authorizeRoles = require("../middlewares/roleMiddleware")


const router = express.Router()

router.post('/event', stockController.handleEvent);

router.get('/getDispenseHistory', verifyToken, authorizeRoles("superadmin", "admin", "user"), stockController.getDispenseHistory);
router.get('/getDispenseHistoryExportData', verifyToken, authorizeRoles("superadmin", "admin", "user"), stockController.getDispenseHistoryExportData);
router.get('/getDispenseHistoryForMachine/:machineId', verifyToken, authorizeRoles("superadmin", "admin", "user"), stockController.getDispenseHistoryForMachineId);

router.get('/getRefillingHistory', verifyToken, authorizeRoles("superadmin", "admin", "user"), stockController.getRefillingHistory);
router.get('/getRefillingHistoryExportData', verifyToken, authorizeRoles("superadmin", "admin", "user"), stockController.getRefillingHistoryExportData);


router.get('/getVendingMachines', verifyToken, authorizeRoles("superadmin", "admin", "user"), stockController.getAllVendingMachine);
router.delete('/deleteVendingMachine/:id', verifyToken, authorizeRoles("superadmin", "admin", "user"), stockController.deleteVendingMachine);

router.get('/getDistrictWisePadConsunption/:periodType', verifyToken, authorizeRoles("superadmin", "admin", "user"), stockController.getDistrictWisePadConsunption);
router.get('/getAllConsumptionPerGirl', verifyToken, authorizeRoles("superadmin", "admin", "user"), stockController.getAllConsumptionPerGirl);
router.get('/getDistrictWiseSchoolCount', verifyToken, authorizeRoles("superadmin", "admin", "user"), stockController.getDistrictWiseSchoolCount);


router.get('/getGeoLocation', verifyToken, authorizeRoles("superadmin", "admin", "user"), stockController.getAllGeoLocations);
router.post('/addGeoLocation', verifyToken, authorizeRoles("superadmin", "admin"), masterController.saveGeoLocation);
router.delete('/deleteGeoLocation/:id', verifyToken, authorizeRoles("superadmin", "admin"), stockController.deleteGeoLocation);
router.put('/updateGeoLocation/:id', verifyToken, authorizeRoles("superadmin", "admin"), masterController.updateGeoLocation);



router.get('/getNgoSpoc', verifyToken, authorizeRoles("superadmin", "admin"), stockController.getAllNgoSpocs);
router.post('/addNgoSpoc', verifyToken, authorizeRoles("superadmin", "admin"), stockController.createNgoSpoc);
router.delete('/ngospoc/:id', verifyToken, authorizeRoles("superadmin", "admin"), stockController.deleteNgoSpoc);
router.put('/updateNgoSpoc/:id', verifyToken, authorizeRoles("superadmin", "admin"), stockController.updateNgoSpoc);



router.get('/getUserDetailsAll', verifyToken, authorizeRoles("superadmin", "admin"), stockController.getAllUsers);
router.delete('/deleteUser/:username', verifyToken, authorizeRoles("superadmin", "admin"), stockController.deleteUser);


router.get('/getDashboardData', verifyToken, authorizeRoles("superadmin", "admin", "user"), stockController.getDashboardData);
router.get('/getPeriodWiseConsumptionData/:periodType/:state?/:district?', verifyToken, authorizeRoles("superadmin", "admin", "user"), stockController.getPeriodWiseConsumptionData);

router.post('/addOrganization', verifyToken, authorizeRoles("superadmin", "admin"), masterController.saveOrganisation);

router.post('/addVendingMaster', verifyToken, authorizeRoles("superadmin", "admin"), masterController.saveVendingMachine);
router.put('/updateVendingMaster/:machineId', verifyToken, authorizeRoles("superadmin", "admin"), masterController.updateVendingMachine);

router.get('/getSchool', verifyToken, authorizeRoles("superadmin", "admin"), stockController.getAllSchool);
router.post('/addSchool', verifyToken, authorizeRoles("superadmin", "admin"), masterController.saveSchool);
router.put('/updateSchool/:id', verifyToken, authorizeRoles("superadmin", "admin"), masterController.updateSchool);
router.delete('/deleteSchool/:id', verifyToken, authorizeRoles("superadmin", "admin"), masterController.deleteSchool);

router.post('/machine/status', masterController.updateOnlineStatusTimestamp);

router.post('/allocateMachineMaster', verifyToken, authorizeRoles("superadmin", "admin"), masterController.saveMachineAllocation);
router.delete('/deleteallocateMachine/:id', verifyToken, authorizeRoles("superadmin", "admin"), masterController.deleteMachineAllocation);

router.get('/getManualPads', verifyToken, authorizeRoles("superadmin", "admin"), stockController.getAllManualPads);
router.post('/addManualPads', verifyToken, authorizeRoles("superadmin", "admin"), stockController.createManualPads);
router.delete('/deleteManualPads/:id', verifyToken, authorizeRoles("superadmin", "admin"), stockController.deleteManualPads);
router.put('/updateManualPads/:id', verifyToken, authorizeRoles("superadmin", "admin"), stockController.updateManualPads);

router.post('/reports/machine-wise', verifyToken, authorizeRoles("superadmin", "admin", "user"), stockController.machineWiseDispense);
router.post('/reports/state-district-wise', verifyToken, authorizeRoles("superadmin", "admin", "user"), stockController.stateOrDistrictWiseDispenseComparison);
router.post('/reports/machine-wise-dispense-refill', verifyToken, authorizeRoles("superadmin", "admin", "user"), stockController.machineWiseDispenseAndRefill);
router.post('/reports/avgconsumption-comparison-report', verifyToken, authorizeRoles("superadmin", "admin", "user"), stockController.avgConsumptionComparisonReport);
router.post('/reports/save', verifyToken, authorizeRoles("superadmin", "admin", "user"), stockController.saveReport);
router.get('/reports/getReports', verifyToken, authorizeRoles("superadmin", "admin", "user"), stockController.getSavedReports);
router.post('/reports/getStandardReports', verifyToken, authorizeRoles("superadmin", "admin", "user"), stockController.getStandardReports);
router.delete('/reports/deleteSavedReport/:id', verifyToken, authorizeRoles("superadmin", "admin", "user"), stockController.deleteSavedReport);
router.get('/reports/viewSavedReport/:id', verifyToken, authorizeRoles("superadmin", "admin", "user"), stockController.viewSavedReport);
router.put('/reports/updateSavedReport/:id', verifyToken, authorizeRoles("superadmin", "admin", "user"), stockController.updateSavedReport);

router.post('/reports/dispense-report', verifyToken, authorizeRoles("superadmin", "admin", "user"), stockController.dispenseReport);
router.get('/reports/lastActivityReport', verifyToken, authorizeRoles("superadmin"), stockController.lastActivityReport);


module.exports = router