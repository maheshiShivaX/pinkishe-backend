const mySqlPool = require("../../modules/db");
const Sequelize = require('../../modules/sequelize');
const { Op, fn, col, where, literal } = require('sequelize');
const moment = require('moment')
const VendingMachine = require('../models/vendingMachine')
const LoginDetail = require('../models/loginDetail')
const SchoolDetail = require('../models/schoolDetails');
const GeoLocation = require('../models/geoLocationModel')
const DispenseHistory = require('../models/dispenseHistory')
const StockHistory = require('../models/stockHistory')
const { addColors } = require("winston/lib/winston/config");
const NgoSpoc = require('../models/ngoSpocDetails');
const School = require("../models/schoolDetails");
const sendsms = require('../config/smsConfig');
const stateShortCodes = require('../utils/stateCodes');

exports.handleEvent = async (req, res) => {
    try {
        const { event_type, data } = req.body;

        if (!event_type || !data || !data.machineId) {
            return res.status(400).send({
                success: false,
                message: "Please provide all required fields."
            });
        }

        const machineIdRec = data.machineId;

        //checking if that machine exists and installed in school
        const vendingMachine = await VendingMachine.findOne({
            where: {
                machineId: machineIdRec,
                status: 'active',
                schoolId: {
                    [Op.ne]: null
                }
            }
        });
        if (!vendingMachine) {
            return res.status(404).send({
                success: false,
                message: "Vending machine not found or not properly installed/linked to school."
            });
        }


        // If event_type is 1 (dispense), create a record in the dispenseHistory table
        if (event_type === "1") {
            const { itemsDispensed } = data;
            const { machineId } = data;

            // Find the machine's stock in the StockHistory table
            const stockRecord = await StockHistory.findOne({
                where: { machineId }
            });

            if (!stockRecord) {
                return res.status(400).send({
                    success: false,
                    message: "Stock record not found for the machineId."
                });
            }

            // Check if there is enough stock to dispense
            if (stockRecord.stock < itemsDispensed) {
                return res.status(400).send({
                    success: false,
                    message: "Not enough stock to dispense."
                });
            }

            const remaingStock = stockRecord.stock - itemsDispensed

            // Insert a new dispense history record
            const dispenseHistory = await DispenseHistory.create({
                event_type: event_type,
                machineId: machineId,
                stock: remaingStock,
                itemsDispensed: itemsDispensed
            });

            // Reduce the stock in the StockHistory table after dispense
            stockRecord.stock -= itemsDispensed;
            await stockRecord.save();


            console.log("printing the remaining stock here:", remaingStock);



            // 🚨 Trigger SMS if stock goes below threshold
            if (remaingStock < 10) {
                console.log("printing the remaining stock inside:", remaingStock);
                const school = await School.findOne({ where: { machineId } });

                if (school) {
                    const mobileNumbers = [
                        school.schoolSpocMobileNo,
                        school.ngoSpocMobileNo,
                        school.ngoSpocMobileNo2,
                        school.ngoCoordinatorMobileNo,
                    ];
                    await sendsms.sendLowStockAlertSMS(mobileNumbers, machineId);
                } else {
                    console.warn(`No school found for machineId ${machineId} while sending SMS alert.`);
                }
            }


            return res.status(201).send({
                success: true,
                message: "Dispense history created and stock updated.",
                dispenseHistory
            });
        }

        // If event_type is 2 (reload), update the stock in the StockHistory table
        if (event_type === "2") {
            const { stock } = data;
            const { machineId } = data;

            // Check if the machine already has a stock record
            const existingStock = await StockHistory.findOne({
                where: { machineId }
            });

            if (existingStock) {
                // Update the stock if the record exists
                existingStock.stock = stock;
                existingStock.lastUpdatedAt = new Date();
                await existingStock.save();


                const dispenseHistory = await DispenseHistory.create({
                    event_type: event_type,
                    machineId: machineId,
                    stock: stock,
                    itemsDispensed: null
                });

                return res.status(201).send({
                    success: true,
                    message: "Stock reloaded successfully."
                });
            } else {
                // If no stock record exists for the machine, insert a new one
                const insertStockResult = await StockHistory.create({
                    machineId: machineId,
                    stock: stock,
                    lastUpdatedAt: new Date()
                });


                const dispenseHistory = await DispenseHistory.create({
                    event_type: event_type,
                    machineId: machineId,
                    stock: stock,
                    itemsDispensed: null
                });

                return res.status(201).send({
                    success: true,
                    message: "New stock record created and stock reloaded.",
                    insertStockResult
                });
            }

        }

        // If event_type is not 1 or 2
        return res.status(400).send({
            success: false,
            message: "Invalid event_type provided."
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error processing the request',
            error
        });
    }
};



// exports.getDispenseHistory = async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1; // 1-based index
//         const pageSize = parseInt(req.query.pageSize) || 10;
//         const offset = (page - 1) * pageSize;
//         const limit = pageSize;

//         // Fetch total count of refilling records
//         const totalCount = await DispenseHistory.count({
//             where: {
//                 itemsDispensed: { [Op.not]: null }
//             },
//         });

//         // Fetch all data from the dispenseHistory table
//         const filteredDispenseHistory = await DispenseHistory.findAll({
//             where: {
//                 itemsDispensed: { [Op.not]: null }
//             },
//             order: [['createdAt', 'DESC']],
//             limit,
//             offset
//         });


//         for (let machine of filteredDispenseHistory) {
//             if (machine.machineId) {
//                 const schoolData = await School.findOne({
//                     where: {
//                         machineId: machine.machineId
//                     }
//                 });
//                 if (schoolData) {
//                     machine.dataValues.school = schoolData.dataValues;
//                 }
//             }

//         }

//         // Check if any data exists after filtering
//         if (filteredDispenseHistory.length === 0) {
//             return res.status(404).send({
//                 success: false,
//                 message: "No dispense history records with items dispensed found."
//             });
//         }

//         // Return the filtered dispense history
//         return res.status(200).send({
//             success: true,
//             data: filteredDispenseHistory,
//             total: totalCount
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send({
//             success: false,
//             message: 'Error retrieving dispense history',
//             error
//         });
//     }
// };

exports.getDispenseHistory = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // 1-based index
        const pageSize = parseInt(req.query.pageSize) || 10;
        const offset = (page - 1) * pageSize;
        const limit = pageSize;

        const { startDate, endDate } = req.query; // Get dates from query

        // Build where clause
        const whereClause = {
            itemsDispensed: { [Op.not]: null }
        };

        // Add date filter if both startDate and endDate are provided
        if (startDate && endDate) {
            whereClause.createdAt = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }

        // Fetch total count of refilling records
        const totalCount = await DispenseHistory.count({ where: whereClause });

        // Fetch filtered data with pagination
        const filteredDispenseHistory = await DispenseHistory.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        // Attach school data
        for (let machine of filteredDispenseHistory) {
            if (machine.machineId) {
                const schoolData = await School.findOne({
                    where: { machineId: machine.machineId }
                });
                if (schoolData) {
                    machine.dataValues.school = schoolData.dataValues;
                }
            }
        }

        if (filteredDispenseHistory.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No dispense history records with items dispensed found."
            });
        }

        return res.status(200).send({
            success: true,
            data: filteredDispenseHistory,
            total: totalCount
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error retrieving dispense history',
            error
        });
    }
};


exports.getDispenseHistoryExportData = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // ✅ where clause for date filtering
        const whereClause = {
            itemsDispensed: { [Op.not]: null },
        };

        if (startDate && endDate) {
            whereClause.createdAt = {
                [Op.between]: [new Date(startDate), new Date(endDate)],
            };
        } else if (startDate) {
            whereClause.createdAt = { [Op.gte]: new Date(startDate) };
        } else if (endDate) {
            whereClause.createdAt = { [Op.lte]: new Date(endDate) };
        }

        const chunkSize = 500; // process 500 rows at a time
        let offset = 0;
        let allResults = [];

        while (true) {
            // fetch in chunks
            const batch = await DispenseHistory.findAll({
                where: whereClause,
                order: [["createdAt", "DESC"]],
                limit: chunkSize,
                offset,
            });

            if (batch.length === 0) break;

            // ✅ collect machineIds from this batch
            const machineIds = batch.map((m) => m.machineId).filter(Boolean);

            // ✅ fetch all schools in one query
            const schools = await School.findAll({
                where: { machineId: machineIds },
            });

            const schoolMap = {};
            schools.forEach((s) => {
                schoolMap[s.machineId] = s.dataValues;
            });

            // attach school data efficiently
            batch.forEach((machine) => {
                if (machine.machineId && schoolMap[machine.machineId]) {
                    machine.dataValues.school = schoolMap[machine.machineId];
                }
            });

            allResults = allResults.concat(batch);
            offset += chunkSize;
        }

        if (allResults.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No dispense history records found for the given date range.",
            });
        }

        return res.status(200).send({
            success: true,
            data: allResults,
            total: allResults.length,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Error retrieving dispense history",
            error,
        });
    }
};




exports.getDateWiseDispenseHistory = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const whereClause = {
            itemsDispensed: { [Op.not]: null },
        };

        if (startDate && endDate) {
            whereClause.createdAt = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }

        const filteredDispenseHistory = await DispenseHistory.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']]
        });

        for (let machine of filteredDispenseHistory) {
            if (machine.machineId) {
                const schoolData = await School.findOne({
                    where: {
                        machineId: machine.machineId
                    }
                });
                if (schoolData) {
                    machine.dataValues.school = schoolData.dataValues;
                }
            }
        }

        if (filteredDispenseHistory.length === 0) {
            return res.status(200).send({
                success: true,
                message: "No dispense history records found.",
                data: []
            });
        }

        return res.status(200).send({
            success: true,
            data: filteredDispenseHistory
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error retrieving dispense history',
            error
        });
    }
};




function getStartEndDateRange(periodType) {
    const today = moment().startOf('day');

    switch (periodType) {
        case 'today':
            return [today.toDate(), moment(today).endOf('day').toDate()];
        case 'yesterday':
            return [
                moment(today).subtract(1, 'day').toDate(),
                moment(today).subtract(1, 'day').endOf('day').toDate(),
            ];
        case 'thisWeek':
            return [moment(today).startOf('isoWeek').toDate(), moment(today).endOf('isoWeek').toDate()];
        case 'lastWeek':
            return [
                moment(today).subtract(1, 'week').startOf('isoWeek').toDate(),
                moment(today).subtract(1, 'week').endOf('isoWeek').toDate(),
            ];
        case 'thisMonth':
            return [moment(today).startOf('month').toDate(), moment(today).endOf('month').toDate()];
        case 'lastMonth':
            return [
                moment(today).subtract(1, 'month').startOf('month').toDate(),
                moment(today).subtract(1, 'month').endOf('month').toDate(),
            ];
        case 'last90Days':
            return [moment(today).subtract(90, 'days').toDate(), today.endOf('day').toDate()];
        case 'lastQuarter':
            const quarterStart = moment().subtract(1, 'quarter').startOf('quarter');
            const quarterEnd = moment().subtract(1, 'quarter').endOf('quarter');
            return [quarterStart.toDate(), quarterEnd.toDate()];
        case 'allTime':
        default:
            return [null, null]; // No filtering
    }
}



exports.getDistrictWisePadConsunption = async (req, res) => {
    try {
        const { periodType } = req.params;

        const [startDate, endDate] = getStartEndDateRange(periodType);

        const historyResponse = await exports.getDateWiseDispenseHistory(
            {
                query: {
                    startDate,
                    endDate,
                },
            },
            {
                status: () => ({
                    send: (data) => data
                })
            }
        );

        if (!historyResponse || !historyResponse.success) {
            return res.status(500).send({
                success: false,
                message: "Failed to fetch dispense history"
            });
        }

        const dispenseData = historyResponse.data;

        const plainDispenseData = dispenseData.map(entry => {
            const record = entry.get ? entry.get({ plain: true }) : entry;
            if (record.school && record.school.get) {
                record.school = record.school.get({ plain: true });
            }
            return record;
        });

        const districtPadConsumption = {};

        for (const entry of plainDispenseData) {
            const district = entry.school?.schoolDistrict;
            const fullState = entry.school?.state;
            const padsDispensed = entry.itemsDispensed || 0;

            if (district && fullState) {
                const shortState = stateShortCodes[fullState] || fullState; // fallback if not found
                const formattedDistrict = `${district} (${shortState})`;

                if (!districtPadConsumption[formattedDistrict]) {
                    districtPadConsumption[formattedDistrict] = 0;
                }
                districtPadConsumption[formattedDistrict] += padsDispensed;
            }
        }

        return res.status(200).send({
            success: true,
            data: districtPadConsumption
        });

    } catch (error) {
        console.error("Error computing district-wise pad consumption:", error);
        return res.status(500).send({
            success: false,
            message: "Error computing pad consumption by district",
            error
        });
    }
};




exports.getDistrictWiseSchoolCount = async (req, res) => {
    try {
        // Fetch all schools with only schoolDistrict
        const schools = await SchoolDetail.findAll({
            attributes: ['schoolDistrict', 'state'],
            raw: true
        });

        // Aggregate manually by district
        const districtCountMap = {};

        for (const { schoolDistrict, state } of schools) {
            if (!districtCountMap[schoolDistrict]) {
                districtCountMap[schoolDistrict] = {
                    schools: 1,
                    state: state || null
                };
            } else {
                districtCountMap[schoolDistrict].schools++;
            }
        }

        const result = Object.entries(districtCountMap).map(([district, info]) => ({
            district,
            schools: info.schools,
            stateShortName: stateShortCodes[info.state] || null
        }));

        return res.status(200).send({
            success: true,
            data: result
        });
    } catch (error) {
        console.error("Error getting school count by district:", error);
        return res.status(500).send({
            success: false,
            message: 'Failed to get school count by district',
            error
        });
    }
};





// exports.getRefillingHistory = async (req, res) => {
//     try {
//         // Read pagination query params, with defaults
//         const page = parseInt(req.query.page) || 1; // 1-based index
//         const pageSize = parseInt(req.query.pageSize) || 10;
//         const offset = (page - 1) * pageSize;
//         const limit = pageSize;

//         // Fetch total count of refilling records
//         const totalCount = await DispenseHistory.count({
//             where: {
//                 event_type: '2'
//             }
//         });

//         // Fetch paginated refilling history
//         const refillingHistory = await DispenseHistory.findAll({
//             where: {
//                 event_type: '2'
//             },
//             order: [['createdAt', 'DESC']],
//             offset,
//             limit
//         });

//         // Attach school data for each entry (can be optimized later via associations)
//         for (let entry of refillingHistory) {
//             if (entry.machineId) {
//                 const schoolData = await School.findOne({
//                     where: {
//                         machineId: entry.machineId
//                     }
//                 });
//                 if (schoolData) {
//                     entry.dataValues.school = schoolData.dataValues;
//                 }
//             }
//         }

//         return res.status(200).send({
//             success: true,
//             data: refillingHistory,
//             total: totalCount
//         });

//     } catch (error) {
//         console.error('Error retrieving refilling history:', error);
//         return res.status(500).send({
//             success: false,
//             message: 'Error retrieving refilling history',
//             error
//         });
//     }
// };


exports.getRefillingHistory = async (req, res) => {
    try {
        // Read pagination query params, with defaults
        const page = parseInt(req.query.page) || 1; // 1-based index
        const pageSize = parseInt(req.query.pageSize) || 10;
        const offset = (page - 1) * pageSize;
        const limit = pageSize;

        const { startDate, endDate } = req.query; // Get dates from query

        // Build where clause
        const whereClause = { event_type: '2' };

        if (startDate && endDate) {
            whereClause.createdAt = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }

        // Fetch total count
        const totalCount = await DispenseHistory.count({ where: whereClause });

        // Fetch paginated data
        const refillingHistory = await DispenseHistory.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
            offset,
            limit
        });

        // Attach school data
        for (let entry of refillingHistory) {
            if (entry.machineId) {
                const schoolData = await School.findOne({
                    where: { machineId: entry.machineId }
                });
                if (schoolData) {
                    entry.dataValues.school = schoolData.dataValues;
                }
            }
        }

        if (refillingHistory.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No refilling history records found."
            });
        }

        return res.status(200).send({
            success: true,
            data: refillingHistory,
            total: totalCount
        });

    } catch (error) {
        console.error('Error retrieving refilling history:', error);
        return res.status(500).send({
            success: false,
            message: 'Error retrieving refilling history',
            error
        });
    }
};



exports.getRefillingHistoryExportData = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // ✅ Build where clause
        const whereClause = { event_type: "2" };

        if (startDate && endDate) {
            whereClause.createdAt = {
                [Op.between]: [new Date(startDate), new Date(endDate)],
            };
        } else if (startDate) {
            whereClause.createdAt = { [Op.gte]: new Date(startDate) };
        } else if (endDate) {
            whereClause.createdAt = { [Op.lte]: new Date(endDate) };
        }

        const chunkSize = 500;
        let offset = 0;
        let allResults = [];

        while (true) {
            // ✅ fetch batch
            const batch = await DispenseHistory.findAll({
                where: whereClause,
                order: [["createdAt", "DESC"]],
                limit: chunkSize,
                offset,
            });

            if (batch.length === 0) break;

            // ✅ collect machineIds
            const machineIds = batch.map((m) => m.machineId).filter(Boolean);

            // ✅ fetch schools in bulk
            const schools = await School.findAll({
                where: { machineId: machineIds },
            });

            const schoolMap = {};
            schools.forEach((s) => {
                schoolMap[s.machineId] = s.dataValues;
            });

            // ✅ attach school data
            batch.forEach((entry) => {
                if (entry.machineId && schoolMap[entry.machineId]) {
                    entry.dataValues.school = schoolMap[entry.machineId];
                }
            });

            allResults = allResults.concat(batch);
            offset += chunkSize;
        }

        if (allResults.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No refilling history records found for the given date range.",
            });
        }

        return res.status(200).send({
            success: true,
            data: allResults,
            total: allResults.length,
        });
    } catch (error) {
        console.error("Error retrieving refilling history:", error);
        return res.status(500).send({
            success: false,
            message: "Error retrieving refilling history",
            error,
        });
    }
};


exports.getDispenseHistoryForMachineId = async (req, res) => {
    try {
        const { machineId } = req.params;  // Extract machineId from request params

        // Fetch all data from the dispenseHistory table where the machineId matches
        const dispenseHistoryResult = await DispenseHistory.findAll({
            where: { machineId: machineId }  // Filter by machineId
        });

        // Check if any data exists for the provided machineId
        if (dispenseHistoryResult.length === 0) {
            return res.status(404).send({
                success: false,
                message: `No dispense history records found for machineId: ${machineId}`
            });
        }

        // Return the filtered dispense history
        return res.status(200).send({
            success: true,
            data: dispenseHistoryResult
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error retrieving dispense history',
            error
        });
    }
};


exports.getAllVendingMachine = async (req, res) => {
    try {
        // Fetch all data from the VendingMachine table
        const vendingMachineResult = await VendingMachine.findAll();

        // Check if data exists in VendingMachine table
        if (!vendingMachineResult || vendingMachineResult.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No vending machine records found."
            });
        }

        for (let machine of vendingMachineResult) {
            if (machine.schoolId) {
                const schoolData = await School.findOne({
                    where: {
                        schoolId: machine.schoolId // Find the school based on the schoolId in the VendingMachine
                    }
                });
                if (schoolData) {
                    machine.dataValues.school = schoolData.dataValues;
                }
            }

            const stockRecord = await StockHistory.findOne({
                where: { machineId: machine.machineId }
            });
            if (stockRecord) {
                machine.dataValues.remaingStock = stockRecord.dataValues.stock;
            }
        }

        // Return the fetched vending machine data
        return res.status(200).send({
            success: true,
            data: vendingMachineResult
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error retrieving vending machine data',
            error
        });
    }
};





exports.deleteVendingMachine = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the vending machine by machineId
        const machine = await VendingMachine.findOne({
            where: { machineId: id }
        });

        // Check if the machine exists
        if (!machine) {
            return res.status(404).send({
                success: false,
                message: 'Vending machine not found.'
            });
        }

        // Check if the machine should not be deleted
        if (machine.status === 'installed' || machine.schoolId !== null) {
            return res.status(400).send({
                success: false,
                message: 'Cannot delete Vending Machine: Either it is Installed or Assigned to a School.'
            });
        }

        // Delete the machine
        await machine.destroy();

        return res.status(200).send({
            success: true,
            message: 'Vending machine deleted successfully.'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Error deleting vending machine.',
            error
        });
    }
};







exports.getAllGeoLocations = async (req, res) => {
    try {
        // Fetch all data from the GeoLocation table
        const geoLocationResult = await GeoLocation.findAll();

        // Check if data exists in GeoLocation table
        if (!geoLocationResult || geoLocationResult.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No geolocation records found."
            });
        }

        // Return the fetched geolocation data
        return res.status(200).send({
            success: true,
            data: geoLocationResult
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error retrieving geolocation data',
            error
        });
    }
}




exports.deleteGeoLocation = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the geolocation record by ID
        const geoLocation = await GeoLocation.findByPk(id);
        // If geolocation doesn't exist
        if (!geoLocation) {
            return res.status(404).send({
                success: false,
                message: `Geolocation with id ${id} not found.`
            });
        }
        const selectedBlock = geoLocation.dataValues.block;
        console.log("thisis the selected block:", selectedBlock)
        // Check if there is a school at the same block
        const schoolAtBlock = await School.findOne({
            where: { schoolBlock: selectedBlock }
        });


        if (schoolAtBlock) {
            return res.status(400).send({
                success: false,
                message: `A school exists at block ${selectedBlock}. Cannot delete geolocation.`
            });
        }
        await geoLocation.destroy();
        return res.status(200).send({
            success: true,
            message: `Geolocation with id ${id} deleted successfully.`
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error deleting geolocation data',
            error
        });
    }
}

exports.getAllSchool = async (req, res) => {
    try {
        // Fetch all data from the School table
        const schoolResult = await SchoolDetail.findAll();

        // Check if data exists in School table
        if (!schoolResult || schoolResult.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No school records found."
            });
        }

        // Return the fetched school data
        return res.status(200).send({
            success: true,
            data: schoolResult
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error retrieving school data',
            error
        });
    }
};



exports.getAllUsers = async (req, res) => {
    try {
        // Fetch all data from the LoginDetails table and sort such that users with null role come first
        const loginDetailsResult = await LoginDetail.findAll({
            order: [
                // Sort by `role` where null values appear first (null values are considered smaller)
                [Sequelize.col('role'), 'ASC']
            ]
        });

        // Check if data exists in LoginDetails table
        if (!loginDetailsResult || loginDetailsResult.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No user records found."
            });
        }

        // Return the fetched login details data
        return res.status(200).send({
            success: true,
            data: loginDetailsResult
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error retrieving user data',
            error
        });
    }
};




exports.deleteUser = async (req, res) => {
    const { username } = req.params;  // Get the username from the URL params

    try {
        // Find the user with the given username
        const user = await LoginDetail.findOne({
            where: { username: username }
        });

        // If no user found, return a 404 error
        if (!user) {
            return res.status(404).send({
                success: false,
                message: `User with username '${username}' not found.`
            });
        }

        // Delete the user
        await LoginDetail.destroy({
            where: { username: username }
        });

        // Return a success response
        return res.status(200).send({
            success: true,
            message: `User '${username}' has been successfully deleted.`
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error deleting user data',
            error
        });
    }
};

// const getDateRange = (period) => {
//     switch (period) {
//         case 'today':
//             return moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'); // Start of today
//         case 'yesterday':
//             return moment().subtract(1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'); // Start of yesterday
//         case 'week':
//             return moment().startOf('week').format('YYYY-MM-DD HH:mm:ss'); // Start of this week
//         case 'month':
//             return moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'); // Start of this month
//         case 'quarter':
//             return moment().startOf('quarter').format('YYYY-MM-DD HH:mm:ss'); // Start of this quarter
//         case 'total':
//             return null; // No date filter for total
//         default:
//             return null;
//     }
// };

const getDateRange = (period) => {
    switch (period) {
        case 'today':
            return {
                start: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                end: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
            };
        case 'yesterday':
            return {
                start: moment().subtract(1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                end: moment().subtract(1, 'days').endOf('day').format('YYYY-MM-DD HH:mm:ss')
            };
        case 'week':
            return {
                start: moment().startOf('week').format('YYYY-MM-DD HH:mm:ss'),
                end: moment().endOf('week').format('YYYY-MM-DD HH:mm:ss')
            };
        case 'month':
            return {
                start: moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
                end: moment().endOf('month').format('YYYY-MM-DD HH:mm:ss')
            };
        case 'quarter':
            return {
                start: moment().startOf('quarter').format('YYYY-MM-DD HH:mm:ss'),
                end: moment().endOf('quarter').format('YYYY-MM-DD HH:mm:ss')
            };
        case 'total':
            return { start: null, end: null }; // No date filter
        default:
            return { start: null, end: null };
    }
};

exports.getDashboardData = async (req, res) => {
    try {
        // Run all counts in parallel instead of sequentially
        const [
            totalMachinesCount,
            inStoreMachinesCount,
            demoMachinesCount,
            decommissionedMachinesCount,
            scrappedMachinesCount,
            activeMachinesCount,
            defectiveMachinesCount,
            underRepairMachinesCount,
            inactiveReasonsMachinesCount
        ] = await Promise.all([
            VendingMachine.count(),
            VendingMachine.count({ where: { status: 'inStore' } }),
            VendingMachine.count({ where: { status: 'demo' } }),
            VendingMachine.count({ where: { status: 'decommissioned' } }),
            VendingMachine.count({ where: { status: 'scrapped' } }),
            VendingMachine.count({ where: { status: 'active' } }),
            VendingMachine.count({ where: { status: 'defective' } }),
            VendingMachine.count({ where: { status: 'underRepair' } }),
            VendingMachine.count({ where: { status: 'inactiveReasons' } })
        ]);

        const installedMachinesCount =
            totalMachinesCount -
            inStoreMachinesCount -
            demoMachinesCount -
            decommissionedMachinesCount -
            scrappedMachinesCount;

        const inActiveMachinesCount = installedMachinesCount - activeMachinesCount;


        const consumptionData = {
            today: 0,
            yesterday: 0,
            week: 0,
            month: 0,
            quarter: 0,
            total: 0
        };

        // Get the total pad consumption for each period
        for (const period of Object.keys(consumptionData)) {
            // const startDate = getDateRange(period);
            const { start, end } = getDateRange(period);
            let query = 'SELECT SUM(itemsDispensed) AS totalDispensed FROM DispenseHistories';
            // If there's a start date, filter by it
            if (start && end) {
                query += ` WHERE createdAt >= '${start}' AND createdAt <= '${end}'`;
            }
            const [result] = await mySqlPool.query(query);
            if (result || result[0]) {
                consumptionData[period] = result.totalDispensed || 0; // Handle if no records are found (returns null)
            } else {
                consumptionData[period] = 0; // No records found, set total to 0
            }
        }

        // const monthlyConsumptionData = [];

        // for (let i = 11; i >= 0; i--) {
        //     const startOfMonth = moment().subtract(i, 'months').startOf('month').format('YYYY-MM-DD HH:mm:ss');
        //     const endOfMonth = moment().subtract(i, 'months').endOf('month').format('YYYY-MM-DD HH:mm:ss');

        //     const query = `
        //         SELECT SUM(itemsDispensed) AS totalDispensed
        //         FROM DispenseHistories
        //         WHERE createdAt >= '${startOfMonth}' AND createdAt <= '${endOfMonth}'
        //     `;

        //     const [monthlyResult] = await mySqlPool.query(query);
        //     const monthKey = moment().subtract(i, 'months').format("MMM'YY");

        //     const monthData = {
        //         x: monthKey,
        //         y: monthlyResult.totalDispensed || 0
        //     };

        //     monthlyConsumptionData.push(monthData);
        // }

        // console.log(monthlyConsumptionData);

        // const periodType = 'week'; // or 'month' | 'quarter' | 'year'

        const periodType = 'month';
        const getStartEndDates = (i, periodType) => {
            const unit = periodType;
            const start = moment().subtract(i, unit).startOf(unit).format('YYYY-MM-DD HH:mm:ss');
            const end = moment().subtract(i, unit).endOf(unit).format('YYYY-MM-DD HH:mm:ss');
            return [start, end];
        };

        const getLabel = (i, periodType) => {
            const m = moment().subtract(i, periodType);
            switch (periodType) {
                case 'week':
                    return `W${m.isoWeek()} '${m.format('YY')}`;
                case 'month':
                    return m.format("MMM'YY");
                case 'quarter':
                    return `Q${m.quarter()} '${m.format('YY')}`;
                case 'year':
                    return m.format('YYYY');
                default:
                    return '';
            }
        };

        const monthlyConsumptionData = [];

        for (let i = 11; i >= 0; i--) {
            const [startOfPeriod, endOfPeriod] = getStartEndDates(i, periodType);
            const label = getLabel(i, periodType);

            const query = `
                SELECT SUM(itemsDispensed) AS totalDispensed
                FROM DispenseHistories
                WHERE createdAt >= '${startOfPeriod}' AND createdAt <= '${endOfPeriod}'
            `;

            const [result] = await mySqlPool.query(query);

            monthlyConsumptionData.push({
                x: label,
                y: result.totalDispensed || 0,
            });
        }

        const totalBlocks = await GeoLocation.count({
            distinct: true,
            col: 'block'
        });

        // Count total unique states
        const totalStates = await GeoLocation.count({
            distinct: true,
            col: 'state'
        });

        // Count total unique districts
        const totalDistricts = await GeoLocation.count({
            distinct: true,
            col: 'district'
        });


        const totalSchools = await SchoolDetail.count();
        const totalGirls = await SchoolDetail.sum('numberOfGirls');

        const averageGirls = Math.round(totalGirls / totalSchools) || 0;


        // const districtWiseSummary = await School.findAll({
        //     attributes: [
        //         'schoolDistrict',
        //         'state',
        //         [fn('COUNT', fn('DISTINCT', col('schoolBlock'))), 'blockCount'],
        //         [fn('COUNT', col('schoolId')), 'schoolCount'],
        //         [fn('SUM', col('numberOfGirls')), 'totalBeneficiaries'],
        //         [
        //             fn('SUM', literal(`CASE WHEN VendingMachine.status = 'active' THEN 1 ELSE 0 END`)),
        //             'activeMachineCount'
        //         ],
        //         [
        //             fn('SUM', literal(`CASE WHEN School.machineId IS NOT NULL AND School.machineId != '' THEN 1 ELSE 0 END`)),
        //             'machineCount'
        //         ],
        //     ],
        //     include: [
        //         {
        //             model: VendingMachine,
        //             attributes: [],
        //             required: false, // LEFT JOIN
        //         }
        //     ],
        //     group: ['schoolDistrict'],
        //     raw: true
        // });

        const lastMonthStart = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD HH:mm:ss');
        const lastMonthEnd = moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD HH:mm:ss');

        const stateWiseConsumptionData = await School.findAll({
            attributes: [
                'state',
                [
                    literal(`SUM(DISTINCT School.numberOfGirls)`),
                    'totalGirls'
                ],

                // Total pads dispensed all-time
                [
                    fn('SUM', col('DispenseHistories.itemsDispensed')),
                    'padsConsumedAllTime'
                ],

                // // Total pads dispensed last month
                [
                    fn(
                        'SUM',
                        literal(`CASE 
            WHEN MONTH(DispenseHistories.createdAt) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH)
             AND YEAR(DispenseHistories.createdAt) = YEAR(CURRENT_DATE - INTERVAL 1 MONTH)
            THEN DispenseHistories.itemsDispensed
            ELSE 0 
        END`)
                    ),
                    'padsConsumedLastMonth'
                ],

                [
                    literal(`ROUND(
                     (SUM(DispenseHistories.itemsDispensed) * 30) / 
                     NULLIF(DATEDIFF(NOW(), MIN(DispenseHistories.createdAt)) * SUM(DISTINCT School.numberOfGirls), 0), 
                    2)`),
                    'avgConsumptionAllTime'
                ],

                // // Average Consumption Per Girl - Last Month
                // Correct average pads per girl for last month
                // [
                //     literal(`ROUND(
                // SUM(CASE
                //     WHEN DispenseHistories.createdAt >= '${lastMonthStart}'
                //     AND DispenseHistories.createdAt <= '${lastMonthEnd}'
                //     THEN DispenseHistories.itemsDispensed
                //     ELSE 0
                // END) / NULLIF(SUM(DISTINCT School.numberOfGirls), 0), 2)`),
                //     'avgConsumptionLastMonth'
                // ]
                [
                    literal(`ROUND(
                     SUM(
                  CASE 
                      WHEN MONTH(DispenseHistories.createdAt) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH)
                       AND YEAR(DispenseHistories.createdAt) = YEAR(CURRENT_DATE - INTERVAL 1 MONTH)
                       THEN DispenseHistories.itemsDispensed
                     ELSE 0 
                        END
                      ) / NULLIF(SUM(DISTINCT School.numberOfGirls), 0), 2
                    )`),
                    'avgConsumptionLastMonth'
                ]
            ],
            include: [
                {
                    model: DispenseHistory,
                    as: 'DispenseHistories',
                    attributes: [],
                    required: false
                }
            ],
            group: ['state'],
            raw: true
        });

        const districtWiseSummary = await School.findAll({
            attributes: [
                ['schoolDistrict', 'schoolDistrict'],
                ['state', 'state'],
                [fn('COUNT', fn('DISTINCT', col('School.schoolBlock'))), 'blockCount'],
                [fn('COUNT', col('School.schoolId')), 'schoolCount'], // FIXED: add School. prefix
                [fn('SUM', col('School.numberOfGirls')), 'totalBeneficiaries'], // FIXED: add School. prefix
                [
                    fn('SUM', literal(`CASE WHEN VendingMachine.status = 'active' THEN 1 ELSE 0 END`)),
                    'activeMachineCount'
                ],
                [
                    fn('SUM', literal(`CASE WHEN VendingMachine.status = 'inactive' THEN 1 ELSE 0 END`)),
                    'inactiveMachineCount'
                ],
                [
                    fn('SUM', literal(`CASE WHEN School.machineId IS NOT NULL AND School.machineId != '' THEN 1 ELSE 0 END`)),
                    'machineCount'
                ]
            ],
            include: [
                {
                    model: VendingMachine,
                    attributes: [],
                    required: false, // LEFT JOIN
                }
            ],
            group: ['School.schoolDistrict'],
            raw: true
        });

        const stateWiseSummary = await School.findAll({
            attributes: [
                ['state', 'state'],
                [fn('COUNT', fn('DISTINCT', col('School.schoolDistrict'))), 'districtCount'],
                [fn('COUNT', fn('DISTINCT', col('School.schoolBlock'))), 'blockCount'],
                [fn('COUNT', col('School.schoolId')), 'schoolCount'],
                [fn('SUM', col('School.numberOfGirls')), 'totalBeneficiaries'],
                [
                    fn('SUM', literal(`CASE WHEN VendingMachine.status = 'active' THEN 1 ELSE 0 END`)),
                    'activeMachineCount'
                ],
                [
                    fn('SUM', literal(`CASE WHEN VendingMachine.status = 'inactive' THEN 1 ELSE 0 END`)),
                    'inactiveMachineCount'
                ],
                [
                    fn('SUM', literal(`CASE WHEN School.machineId IS NOT NULL AND School.machineId != '' THEN 1 ELSE 0 END`)),
                    'machineCount'
                ]
            ],
            include: [
                {
                    model: VendingMachine,
                    attributes: [],
                    required: false, // LEFT JOIN
                }
            ],
            group: ['state'],
            raw: true
        });

        // 👉 Calculate state-wise average girls per school
        let stateImpact = {
            totalImpact: totalGirls,
            averageGirls: averageGirls
        };

        stateWiseSummary.forEach(state => {
            const girls = parseInt(state.totalBeneficiaries || 0);
            const schools = parseInt(state.schoolCount || 0);
            const avg = schools > 0 ? Math.round(girls / schools) : 0;
            stateImpact[`${state.state}AverageGirls`] = avg;
        });

        return res.status(200).send({
            success: true,
            data: {
                machines: {
                    total: totalMachinesCount,
                    active: activeMachinesCount,
                    inoperative: defectiveMachinesCount
                },
                machinesStatus: {
                    total: totalMachinesCount,
                    inStore: inStoreMachinesCount,
                    demo: demoMachinesCount,
                    decommissioned: decommissionedMachinesCount,
                    scrapped: scrappedMachinesCount,
                    installed: installedMachinesCount,
                    active: activeMachinesCount,
                    inActive: inActiveMachinesCount,
                    defective: defectiveMachinesCount,
                    underRepair: underRepairMachinesCount,
                    inactiveReasons: inactiveReasonsMachinesCount
                },
                padsConsumes: consumptionData,
                impact: stateImpact,
                geoData: {
                    blocks: totalBlocks,
                    states: totalStates,
                    districts: totalDistricts
                },
                monthlyConsumptionData: monthlyConsumptionData,
                districtWiseSummary: districtWiseSummary,
                stateWiseSummary: stateWiseSummary,
                stateWiseConsumptionData: stateWiseConsumptionData

            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error retrieving vending machine data',
            error
        });
    }

}

// exports.getPeriodWiseConsumptionData = async (req, res) => {
//     const { periodType } = req.params;

//     const getStartEndDates = (i, periodType) => {
//         const unit = periodType;
//         const start = moment().subtract(i, unit).startOf(unit).format('YYYY-MM-DD HH:mm:ss');
//         const end = moment().subtract(i, unit).endOf(unit).format('YYYY-MM-DD HH:mm:ss');
//         return [start, end];
//     };

//     const getLabel = (i, periodType) => {
//         const m = moment().subtract(i, periodType);
//         switch (periodType) {
//             case 'week':
//                 return `W${m.isoWeek()} '${m.format('YY')}`;
//             case 'month':
//                 return m.format("MMM'YY");
//             case 'quarter':
//                 return `Q${m.quarter()} '${m.format('YY')}`;
//             case 'year':
//                 return m.format('YYYY');
//             default:
//                 return '';
//         }
//     };

//     const consumptionData = [];

//     for (let i = 11; i >= 0; i--) {
//         const [startOfPeriod, endOfPeriod] = getStartEndDates(i, periodType);
//         const label = getLabel(i, periodType);

//         const query = `
//             SELECT SUM(itemsDispensed) AS totalDispensed
//             FROM DispenseHistories
//             WHERE createdAt >= '${startOfPeriod}' AND createdAt <= '${endOfPeriod}'
//         `;

//         const [result] = await mySqlPool.query(query);

//         consumptionData.push({
//             x: label,
//             y: result.totalDispensed || 0,
//         });
//     }

//     return res.status(200).send({
//         success: true,
//         data: consumptionData
//     });
// };

exports.getPeriodWiseConsumptionData = async (req, res) => {
    const { periodType, state, district } = req.params;

    const getStartEndDates = (i, periodType) => {
        const start = moment().subtract(i, periodType).startOf(periodType).format('YYYY-MM-DD HH:mm:ss');
        const end = moment().subtract(i, periodType).endOf(periodType).format('YYYY-MM-DD HH:mm:ss');
        return [start, end];
    };

    const getLabel = (i, periodType) => {
        const m = moment().subtract(i, periodType);
        switch (periodType) {
            case 'week':
                return `W${m.isoWeek()} '${m.format('YY')}`;
            case 'month':
                return m.format("MMM'YY");
            case 'quarter':
                return `Q${m.quarter()} '${m.format('YY')}`;
            case 'year':
                return m.format('YYYY');
            default:
                return '';
        }
    };

    const consumptionData = [];

    for (let i = 11; i >= 0; i--) {
        const [startOfPeriod, endOfPeriod] = getStartEndDates(i, periodType);
        const label = getLabel(i, periodType);

        let query = `
            SELECT SUM(dh.itemsDispensed) AS totalDispensed
            FROM DispenseHistories dh
            JOIN Schools sd ON dh.machineId = sd.machineId
            WHERE dh.createdAt >= '${startOfPeriod}' 
              AND dh.createdAt <= '${endOfPeriod}'
        `;

        if (state) {
            query += ` AND sd.state = '${state}'`;
        }

        if (district) {
            query += ` AND sd.schoolDistrict = '${district}'`;
        }

        const [result] = await mySqlPool.query(query);

        consumptionData.push({
            x: label,
            y: result?.totalDispensed || 0,
        });
    }

    return res.status(200).send({
        success: true,
        data: consumptionData
    });
};

exports.getAllNgoSpocs = async (req, res) => {
    try {
        // Fetch all data from the NgoSpoc table
        const ngoSpocResult = await NgoSpoc.findAll();

        // Check if any records exist
        if (ngoSpocResult.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No NGO SPOC records found."
            });
        }

        // Return the fetched NGO SPOCs
        return res.status(200).send({
            success: true,
            data: ngoSpocResult
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error retrieving NGO SPOCs',
            error
        });
    }
};

exports.createNgoSpoc = async (req, res) => {
    const {
        spocName,
        spocMobileNo,
        spocType
    } = req.body;

    if (!spocName || !spocMobileNo || !spocType) {
        return res.status(400).send({
            success: false,
            message: 'All fields  are required'
        });
    }

    try {
        const newSpoc = await NgoSpoc.create({
            spocName,
            spocMobileNo,
            spocType
        });

        return res.status(201).send({
            success: true,
            message: 'NGO SPOC created successfully',
            data: newSpoc
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).send({
                success: false,
                message: 'The ngoSpocName must be unique',
                error
            });
        }

        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Error creating NGO SPOC',
            error
        });
    }
};

exports.deleteNgoSpoc = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the NGO SPOC by ID
        const ngoSpoc = await NgoSpoc.findByPk(id);

        if (!ngoSpoc) {
            return res.status(404).send({
                success: false,
                message: 'NGO SPOC not found'
            });
        }

        // Delete the NGO SPOC entry
        await ngoSpoc.destroy();

        return res.status(200).send({
            success: true,
            message: 'NGO SPOC deleted successfully'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error deleting NGO SPOC',
            error
        });
    }
};

exports.updateNgoSpoc = async (req, res) => {
    const { id } = req.params; // Assuming you're passing the Spoc ID in the URL params
    const { spocName, spocMobileNo, spocType } = req.body;

    console.log("Updated NGO SPOC Details:", req.body);

    // Validate required fields
    if (!spocName || !spocMobileNo || !spocType) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingSpoc = await NgoSpoc.findOne({ where: { id } });

        if (!existingSpoc) {
            return res.status(404).json({ message: 'NGO SPOC not found' });
        }

        // Update values
        existingSpoc.spocName = spocName;
        existingSpoc.spocMobileNo = spocMobileNo;
        existingSpoc.spocType = spocType;

        // Save the updated record
        await existingSpoc.save();

        return res.status(200).json({
            message: 'NGO SPOC updated successfully',
            ngoSpoc: existingSpoc,
        });
    } catch (error) {
        console.error('Error updating NGO SPOC:', error);
        return res.status(500).json({ message: 'Failed to update NGO SPOC' });
    }
};


exports.getAllConsumptionPerGirl = async (req, res) => {
    try {
        // Step 1: Get total girls
        const totalGirlsResult = await School.findOne({
            attributes: [[fn('SUM', col('numberOfGirls')), 'totalGirls']],
            raw: true
        });

        const totalGirls = Number(totalGirlsResult.totalGirls || 0);

        // Step 2: Get pad dispense data
        const dispenseStats = await DispenseHistory.findOne({
            attributes: [
                [fn('SUM', col('itemsDispensed')), 'totalPadsAllTime'],
                [fn('MIN', col('createdAt')), 'startDate'],

                [
                    literal(`SUM(CASE 
            WHEN createdAt >= '${moment().startOf('month').format('YYYY-MM-DD HH:mm:ss')}'
             AND createdAt <= '${moment().endOf('month').format('YYYY-MM-DD HH:mm:ss')}'
            THEN itemsDispensed ELSE 0 END)`),
                    'padsThisMonth'
                ],

                [
                    literal(`SUM(CASE 
            WHEN createdAt >= '${moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD HH:mm:ss')}'
             AND createdAt <= '${moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD HH:mm:ss')}'
            THEN itemsDispensed ELSE 0 END)`),
                    'padsLastMonth'
                ],

                [
                    literal(`SUM(CASE 
            WHEN createdAt >= '${moment().startOf('quarter').format('YYYY-MM-DD HH:mm:ss')}'
             AND createdAt <= '${moment().endOf('quarter').format('YYYY-MM-DD HH:mm:ss')}'
            THEN itemsDispensed ELSE 0 END)`),
                    'padsThisQuarter'
                ]
            ],
            raw: true
        });

        const totalPadsAllTime = Number(dispenseStats.totalPadsAllTime || 0);
        const startDate = dispenseStats.startDate ? moment(dispenseStats.startDate) : moment();
        const daysFromStart = moment().diff(startDate, 'days') || 1;

        // Final averages
        const avgConsumptionTillNow = totalGirls > 0
            ? ((totalPadsAllTime * 30) / (totalGirls * daysFromStart)).toFixed(2)
            : "0.00";

        const avgConsumptionThisMonth = totalGirls > 0
            ? (dispenseStats.padsThisMonth / totalGirls).toFixed(2)
            : "0.00";

        const avgConsumptionLastMonth = totalGirls > 0
            ? (dispenseStats.padsLastMonth / totalGirls).toFixed(2)
            : "0.00";

        const avgConsumptionThisQuarter = totalGirls > 0
            ? (dispenseStats.padsThisQuarter / totalGirls).toFixed(2)
            : "0.00";

        const allConsumptionPerGirl = {
            totalGirls,
            totalPadsAllTime,
            avgConsumptionTillNow,
            avgConsumptionThisMonth,
            avgConsumptionLastMonth,
            avgConsumptionThisQuarter
        };

        res.status(200).json({
            success: true,
            message: "Consumption per girl stats fetched",
            data: allConsumptionPerGirl
        });

    } catch (error) {
        console.error("Error fetching consumption stats", error);
        res.status(500).json({
            success: false,
            message: "Error calculating stats",
            error
        });
    }
};