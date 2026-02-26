const mySqlPool = require("../../modules/db");
const Sequelize = require('../../modules/sequelize');
const { Op, fn, col, where, literal } = require('sequelize');
const moment = require('moment')
const VendingMachine = require('../models/vendingMachine')
const LoginDetail = require('../models/loginDetail')
const SchoolDetail = require('../models/schoolDetails');
const GeoLocation = require('../models/geoLocationModel')
// const DispenseHistory = require('../models/dispenseHistory')
const StockHistory = require('../models/stockHistory')
const { addColors } = require("winston/lib/winston/config");
const NgoSpoc = require('../models/ngoSpocDetails');
// const School = require("../models/schoolDetails");
const sendsms = require('../config/smsConfig');
const stateShortCodes = require('../utils/stateCodes');
const ManualPads = require("../models/manualPadsModel");
const dayjs = require("dayjs");
const { School, DispenseHistory } = require("../models");

// First
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



            // ðŸš¨ Trigger SMS if stock goes below threshold
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

// Second
// exports.handleEvent = async (req, res) => {
//     try {
//         const { event_type, data } = req.body;

//         if (!event_type || !data || !data.machineId || data.stock === undefined || data.stock === 0 || data.stock === null) {
//             return res.status(400).send({
//                 success: false,
//                 message: "Please provide all required fields."
//             });
//         }

//         const machineIdRec = data.machineId;

//         //checking if that machine exists and installed in school
//         const vendingMachine = await VendingMachine.findOne({
//             where: {
//                 machineId: machineIdRec,
//                 status: 'active',
//                 schoolId: {
//                     [Op.ne]: null
//                 }
//             }
//         });
//         if (!vendingMachine) {
//             return res.status(404).send({
//                 success: false,
//                 message: "Vending machine not found or not properly installed/linked to school."
//             });
//         }


//         // If event_type is 1 (dispense), create a record in the dispenseHistory table
//         if (event_type === "1") {
//             const { itemsDispensed } = data;
//             const { machineId } = data;

//             // Find the machine's stock in the StockHistory table
//             const stockRecord = await StockHistory.findOne({
//                 where: { machineId }
//             });

//             //    console.log(stockRecord.stock, 'stock value');


//             if (!stockRecord) {
//                 return res.status(400).send({
//                     success: false,
//                     message: "Stock record not found for the machineId."
//                 });
//             }

//             let currentDBStock = stockRecord.stock;

//             if (currentDBStock === data.stock) {
//                 return res.status(200).send({
//                     success: true,
//                     message: "No change in stock. No items dispensed."
//                 });
//             }

//             if (currentDBStock === 0 && data.stock > 0) {
//                 currentDBStock = 50;
//                 await DispenseHistory.create({
//                     event_type: 2,
//                     machineId: machineId,
//                     stock: 50,
//                     itemsDispensed: null
//                 });
//             }

//             // If machine stock increased → treat as refill cycle
//             if (currentDBStock < data.stock) {
//                 console.log("Stock increased — Refill detected.");
//                 currentDBStock = 50;
//                 await DispenseHistory.create({
//                     event_type: 2,
//                     machineId: machineId,
//                     stock: 50,
//                     itemsDispensed: null
//                 });
//             }

//             // Check if there is enough stock to dispense
//             // if (stockRecord.stock < itemsDispensed) {
//             //     return res.status(400).send({
//             //         success: false,
//             //         message: "Not enough stock to dispense."
//             //     });
//             // }

//             const remaingStock = data.stock;
//             const difference = currentDBStock - remaingStock;
//             let dispenseHistory;

//             if (difference <= 0) {
//                 console.log("No items dispensed.");
//             } else if (difference === 1) {
//                 dispenseHistory = await DispenseHistory.create({
//                     event_type,
//                     machineId,
//                     stock: remaingStock,
//                     itemsDispensed: 1
//                 });

//             } else {
//                 const entries = [];
//                 const now = new Date();

//                 let stepStock = currentDBStock;

//                 for (let i = 0; i < difference; i++) {
//                     stepStock -= 1;

//                     const time = new Date(now);
//                     time.setMinutes(time.getMinutes() - (difference - i - 1));

//                     entries.push({
//                         event_type,
//                         machineId,
//                         stock: stepStock,
//                         itemsDispensed: 1,
//                         createdAt: time,
//                         updatedAt: time
//                     });
//                 }

//                 const bulkEntries = await DispenseHistory.bulkCreate(entries, { returning: true });
//                 dispenseHistory = bulkEntries[bulkEntries.length - 1];
//             }


//             // Insert a new dispense history record
//             // const dispenseHistory = await DispenseHistory.create({
//             //     event_type: event_type,
//             //     machineId: machineId,
//             //     stock: remaingStock,
//             //     itemsDispensed: itemsDispensed
//             // });

//             // Reduce the stock in the StockHistory table after dispense
//             stockRecord.stock = remaingStock;
//             await stockRecord.save();


//             // 🚨 Trigger SMS if stock goes below threshold
//             if (remaingStock < 10) {
//                 const school = await School.findOne({ where: { machineId } });

//                 if (school) {
//                     const mobileNumbers = [
//                         school.schoolSpocMobileNo,
//                         school.ngoSpocMobileNo,
//                         school.ngoSpocMobileNo2,
//                         school.ngoCoordinatorMobileNo,
//                     ];
//                     await sendsms.sendLowStockAlertSMS(mobileNumbers, machineId);
//                 } else {
//                     console.warn(`No school found for machineId ${machineId} while sending SMS alert.`);
//                 }
//             }


//             return res.status(201).send({
//                 success: true,
//                 message: "Dispense history created and stock updated.",
//                 dispenseHistory
//             });
//         }

//         // If event_type is 2 (reload), update the stock in the StockHistory table
//         if (event_type === "2") {
//             const { stock } = data;
//             const { machineId } = data;

//             // Check if the machine already has a stock record
//             const existingStock = await StockHistory.findOne({
//                 where: { machineId }
//             });

//             if (existingStock) {
//                 // Update the stock if the record exists
//                 existingStock.stock = stock;
//                 existingStock.lastUpdatedAt = new Date();
//                 await existingStock.save();


//                 const dispenseHistory = await DispenseHistory.create({
//                     event_type: event_type,
//                     machineId: machineId,
//                     stock: stock,
//                     itemsDispensed: null
//                 });

//                 return res.status(201).send({
//                     success: true,
//                     message: "Stock reloaded successfully."
//                 });
//             } else {
//                 // If no stock record exists for the machine, insert a new one
//                 const insertStockResult = await StockHistory.create({
//                     machineId: machineId,
//                     stock: stock,
//                     lastUpdatedAt: new Date()
//                 });


//                 const dispenseHistory = await DispenseHistory.create({
//                     event_type: event_type,
//                     machineId: machineId,
//                     stock: stock,
//                     itemsDispensed: null
//                 });

//                 return res.status(201).send({
//                     success: true,
//                     message: "New stock record created and stock reloaded.",
//                     insertStockResult
//                 });
//             }

//         }

//         // If event_type is not 1 or 2
//         return res.status(400).send({
//             success: false,
//             message: "Invalid event_type provided."
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({
//             success: false,
//             message: 'Error processing the request',
//             error
//         });
//     }
// };


// Third Check If Stock 0
// exports.handleEvent = async (req, res) => {
//     try {
//         const { event_type, data } = req.body;

//          if (!event_type || !data || !data.machineId || data.stock === undefined || data.stock === 0 || data.stock === null) {
//             return res.status(400).send({
//                 success: false,
//                 message: "Please provide all required fields."
//             });
//         }

//         const machineIdRec = data.machineId;

//         //checking if that machine exists and installed in school
//         const vendingMachine = await VendingMachine.findOne({
//             where: {
//                 machineId: machineIdRec,
//                 status: 'active',
//                 schoolId: {
//                     [Op.ne]: null
//                 }
//             }
//         });
//         if (!vendingMachine) {
//             return res.status(404).send({
//                 success: false,
//                 message: "Vending machine not found or not properly installed/linked to school."
//             });
//         }


//         // If event_type is 1 (dispense), create a record in the dispenseHistory table
//         if (event_type === "1") {
//             const { itemsDispensed } = data;
//             const { machineId } = data;

//             // Find the machine's stock in the StockHistory table
//             const stockRecord = await StockHistory.findOne({
//                 where: { machineId }
//             });

//             if (!stockRecord) {
//                 return res.status(400).send({
//                     success: false,
//                     message: "Stock record not found for the machineId."
//                 });
//             }

//             let currentDBStock = stockRecord.stock;

//              if (currentDBStock === data.stock) {
//                 return res.status(200).send({
//                     success: true,
//                     message: "No change in stock. No items dispensed."
//                 });
//             }

//             if (currentDBStock === 0 && data.stock > 0) {
//                 currentDBStock = 50;
//             }

//             // Check if there is enough stock to dispense
//             // if (stockRecord.stock < itemsDispensed) {
//             //     return res.status(400).send({
//             //         success: false,
//             //         message: "Not enough stock to dispense."
//             //     });
//             // }

//             const remaingStock = data.stock;
//             const difference = currentDBStock - remaingStock;
//             let dispenseHistory;

//             if (difference <= 0) {
//                 console.log("No items dispensed.");
//             } else if (difference === 1) {
//                 dispenseHistory = await DispenseHistory.create({
//                     event_type,
//                     machineId,
//                     stock: remaingStock,
//                     itemsDispensed: 1
//                 });

//             } else {
//                 const entries = [];
//                 const now = new Date();

//                 let stepStock = currentDBStock;

//                 for (let i = 0; i < difference; i++) {
//                     stepStock -= 1;

//                     const time = new Date(now);
//                     time.setMinutes(time.getMinutes() - (difference - i - 1));

//                     entries.push({
//                         event_type,
//                         machineId,
//                         stock: stepStock,
//                         itemsDispensed: 1,
//                         createdAt: time,
//                         updatedAt: time
//                     });
//                 }

//                 const bulkEntries = await DispenseHistory.bulkCreate(entries, { returning: true });
//                 dispenseHistory = bulkEntries[bulkEntries.length - 1];
//             }


//             // Insert a new dispense history record
//             // const dispenseHistory = await DispenseHistory.create({
//             //     event_type: event_type,
//             //     machineId: machineId,
//             //     stock: remaingStock,
//             //     itemsDispensed: itemsDispensed
//             // });

//             // Reduce the stock in the StockHistory table after dispense
//             stockRecord.stock = remaingStock;
//             await stockRecord.save();


//             // 🚨 Trigger SMS if stock goes below threshold
//             if (remaingStock < 10) {
//                 const school = await School.findOne({ where: { machineId } });

//                 if (school) {
//                     const mobileNumbers = [
//                         school.schoolSpocMobileNo,
//                         school.ngoSpocMobileNo,
//                         school.ngoSpocMobileNo2,
//                         school.ngoCoordinatorMobileNo,
//                     ];
//                     await sendsms.sendLowStockAlertSMS(mobileNumbers, machineId);
//                 } else {
//                     console.warn(`No school found for machineId ${machineId} while sending SMS alert.`);
//                 }
//             }


//             return res.status(201).send({
//                 success: true,
//                 message: "Dispense history created and stock updated.",
//                 dispenseHistory
//             });
//         }

//         // If event_type is 2 (reload), update the stock in the StockHistory table
//         if (event_type === "2") {
//             const { stock } = data;
//             const { machineId } = data;

//             // Check if the machine already has a stock record
//             const existingStock = await StockHistory.findOne({
//                 where: { machineId }
//             });

//             if (existingStock) {
//                 // Update the stock if the record exists
//                 existingStock.stock = stock;
//                 existingStock.lastUpdatedAt = new Date();
//                 await existingStock.save();


//                 const dispenseHistory = await DispenseHistory.create({
//                     event_type: event_type,
//                     machineId: machineId,
//                     stock: stock,
//                     itemsDispensed: null
//                 });

//                 return res.status(201).send({
//                     success: true,
//                     message: "Stock reloaded successfully."
//                 });
//             } else {
//                 // If no stock record exists for the machine, insert a new one
//                 const insertStockResult = await StockHistory.create({
//                     machineId: machineId,
//                     stock: stock,
//                     lastUpdatedAt: new Date()
//                 });


//                 const dispenseHistory = await DispenseHistory.create({
//                     event_type: event_type,
//                     machineId: machineId,
//                     stock: stock,
//                     itemsDispensed: null
//                 });

//                 return res.status(201).send({
//                     success: true,
//                     message: "New stock record created and stock reloaded.",
//                     insertStockResult
//                 });
//             }

//         }

//         // If event_type is not 1 or 2
//         return res.status(400).send({
//             success: false,
//             message: "Invalid event_type provided."
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({
//             success: false,
//             message: 'Error processing the request',
//             error
//         });
//     }
// };

// Last Updated
// exports.handleEvent = async (req, res) => {
//     try {
//         const { event_type, data } = req.body;

//         if (!event_type || !data || !data.machineId || data.stock === undefined || data.stock === null) {
//             return res.status(400).send({
//                 success: false,
//                 message: "Please provide all required fields."
//             });
//         }

//         const { machineId, stock: newStock } = data;

//         // ✅ Check vending machine
//         const vendingMachine = await VendingMachine.findOne({
//             where: {
//                 machineId,
//                 status: "active",
//                 schoolId: { [Op.ne]: null }
//             }
//         });

//         if (!vendingMachine) {
//             return res.status(404).send({
//                 success: false,
//                 message: "Vending machine not found or not linked to a school."
//             });
//         }

//         // ✅ DISPENSE EVENT
//         if (event_type === "1") {
//             const stockRecord = await StockHistory.findOne({ where: { machineId } });
//             if (!stockRecord) {
//                 return res.status(400).send({
//                     success: false,
//                     message: "Stock record not found for this machine."
//                 });
//             }

//             let currentDBStock = stockRecord.stock;
//             const remainingStock = newStock;
//             const entries = [];
//             let dispenseHistory;

//             if (currentDBStock === remainingStock) {
//                 return res.status(200).send({
//                     success: true,
//                     message: "No change in stock. No dispense recorded."
//                 });
//             }

//             // 🧠 CASE 1: Normal dispense (stock decreases normally)
//             if (remainingStock < currentDBStock) {
//                 const difference = currentDBStock - remainingStock;
//                 let stepStock = currentDBStock;
//                 const now = new Date();

//                 for (let i = 0; i < difference; i++) {
//                     stepStock -= 1;
//                     const time = new Date(now);
//                     time.setMinutes(time.getMinutes() - (difference - i - 1));
//                     entries.push({
//                         event_type: 1,
//                         machineId,
//                         stock: stepStock,
//                         itemsDispensed: 1,
//                         createdAt: time,
//                         updatedAt: time
//                     });
//                 }
//             }

//             // 🧠 CASE 2: Stock increased (refill scenario)
//             if (remainingStock > currentDBStock) {
//                 // console.log(`Refill pattern detected: ${currentDBStock} → ${remainingStock}`);

//                 // 1️⃣ Go down to 1 (simulate last dispenses before refill)
//                 if (currentDBStock > 0) {
//                     for (let s = currentDBStock - 1; s >= 1; s--) {
//                         entries.push({
//                             event_type: 1,
//                             machineId,
//                             stock: s,
//                             itemsDispensed: 1,
//                             createdAt: new Date(),
//                             updatedAt: new Date()
//                         });
//                     }
//                 }

//                 // 2️⃣ Refill entry at 50
//                 entries.push({
//                     event_type: 2,
//                     machineId,
//                     stock: 50,
//                     itemsDispensed: null,
//                     createdAt: new Date(),
//                     updatedAt: new Date()
//                 });

//                 // 3️⃣ Dispense from 50 down to newStock (e.g. 50→49→48→...→47)
//                 for (let s = 49; s >= remainingStock; s--) {
//                     entries.push({
//                         event_type: 1,
//                         machineId,
//                         stock: s,
//                         itemsDispensed: 1,
//                         createdAt: new Date(),
//                         updatedAt: new Date()
//                     });
//                 }
//             }

//             // ✅ Save entries
//             if (entries.length > 0) {
//                 dispenseHistory = await DispenseHistory.bulkCreate(entries, { returning: true });
//             }

//             // ✅ Update stock record
//             stockRecord.stock = remainingStock;
//             await stockRecord.save();

//             // ✅ Send low stock alert if below threshold
//             if (remainingStock < 10) {
//                 const school = await School.findOne({ where: { machineId } });
//                 if (school) {
//                     const mobileNumbers = [
//                         school.schoolSpocMobileNo,
//                         school.ngoSpocMobileNo,
//                         school.ngoSpocMobileNo2,
//                         school.ngoCoordinatorMobileNo
//                     ];
//                     await sendsms.sendLowStockAlertSMS(mobileNumbers, machineId);
//                 }
//             }

//             return res.status(201).send({
//                 success: true,
//                 message: "Dispense/refill history created successfully.",
//                 dispenseHistory
//             });
//         }

//         // ✅ REFILL EVENT
//         if (event_type === "2") {
//             const existingStock = await StockHistory.findOne({ where: { machineId } });
//             if (existingStock) {
//                 existingStock.stock = newStock;
//                 existingStock.lastUpdatedAt = new Date();
//                 await existingStock.save();
//             } else {
//                 await StockHistory.create({
//                     machineId,
//                     stock: newStock,
//                     lastUpdatedAt: new Date()
//                 });
//             }

//             await DispenseHistory.create({
//                 event_type: 2,
//                 machineId,
//                 stock: newStock,
//                 itemsDispensed: null
//             });

//             return res.status(201).send({
//                 success: true,
//                 message: "Stock reloaded successfully."
//             });
//         }

//         // 🚫 INVALID EVENT TYPE
//         return res.status(400).send({
//             success: false,
//             message: "Invalid event_type provided."
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).send({
//             success: false,
//             message: "Error processing request",
//             error
//         });
//     }
// };


exports.getDispenseHistory = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // 1-based index
        const pageSize = parseInt(req.query.pageSize) || 100;
        const offset = (page - 1) * pageSize;

        const { startDate, endDate, filters } = req.query;

        // Base where clause
        const whereClause = {
            itemsDispensed: { [Op.not]: null },
        };

        // Date filters
        if (startDate && endDate) {
            whereClause.createdAt = {
                [Op.between]: [
                    new Date(`${startDate}T00:00:00Z`),
                    new Date(`${endDate}T23:59:59Z`),
                ],
            };
        } else if (startDate) {
            whereClause.createdAt = { [Op.gte]: new Date(startDate) };
        } else if (endDate) {
            whereClause.createdAt = { [Op.lte]: new Date(endDate) };
        }

        // Parse school filters
        let schoolWhere = {};
        if (filters) {
            const parsedFilters = JSON.parse(filters);
            parsedFilters.forEach((f) => {
                if (f.field === "schoolState" && f.value) {
                    schoolWhere.state = { [Op.like]: `%${f.value}%` };
                }
                if (f.field === "schoolDistrict" && f.value) {
                    schoolWhere.schoolDistrict = { [Op.like]: `%${f.value}%` };
                }
            });
        }

        // Fetch extra records to ensure filtered results fit in page
        const fetchSize = pageSize * 5; // fetch 5x to account for filtering
        const dispenseHistoryBatch = await DispenseHistory.findAll({
            where: whereClause,
            order: [["createdAt", "DESC"]],
            limit: fetchSize,
            offset,
        });

        if (!dispenseHistoryBatch.length) {
            return res.status(404).json({
                success: false,
                message: "No dispense history records found for the given filters.",
            });
        }

        // Map school data
        const machineIds = dispenseHistoryBatch.map((d) => d.machineId).filter(Boolean);
        let schoolMap = {};
        if (machineIds.length > 0) {
            const schools = await School.findAll({
                where: {
                    machineId: machineIds,
                    ...schoolWhere,
                },
            });
            schools.forEach((s) => {
                schoolMap[s.machineId] = s.dataValues;
            });
        }

        // Attach school and filter
        let filteredDispenseHistory = dispenseHistoryBatch.filter((disp) => {
            if (disp.machineId && schoolMap[disp.machineId]) {
                disp.dataValues.school = schoolMap[disp.machineId];
                return true;
            }
            return Object.keys(schoolWhere).length === 0; // keep if no school filter
        });

        // Slice to exact pageSize
        filteredDispenseHistory = filteredDispenseHistory.slice(0, pageSize);

        if (!filteredDispenseHistory.length) {
            return res.status(404).json({
                success: false,
                message: "No dispense history records found for the given filters.",
            });
        }

        // Total count (all DispenseHistory ignoring school filter)
        const totalCount = await DispenseHistory.count({ where: whereClause });

        return res.status(200).json({
            success: true,
            data: filteredDispenseHistory,
            total: totalCount,
            page,
            pageSize,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error retrieving dispense history",
            error: error.message,
        });
    }
};

exports.getDispenseHistoryExportData = async (req, res) => {
    try {
        const { startDate, endDate, filters } = req.query;

        // ✅ where clause for dispense history
        const whereClause = {
            itemsDispensed: { [Op.not]: null },
        };

        // ✅ date filters
        if (startDate && endDate) {
            const start = dayjs(startDate).startOf("day").toDate(); // local start
            const end = dayjs(endDate).endOf("day").toDate();       // local end
            whereClause.createdAt = { [Op.between]: [start, end] };
        }
        else if (startDate) {
            whereClause.createdAt = { [Op.gte]: new Date(startDate) };
        } else if (endDate) {
            whereClause.createdAt = { [Op.lte]: new Date(endDate) };
        }

        // ✅ parse DataGrid filters
        let schoolWhere = {};
        if (filters) {
            const parsedFilters = JSON.parse(filters); // DataGrid sends array
            parsedFilters.forEach(f => {
                if (f.field === "schoolState" && f.value) {
                    schoolWhere.state = { [Op.like]: `%${f.value}%` };
                }
                if (f.field === "schoolDistrict" && f.value) {
                    schoolWhere.schoolDistrict = { [Op.like]: `%${f.value}%` };
                }
            });
        }

        const chunkSize = 500;
        let offset = 0;
        let allResults = [];

        while (true) {
            const batch = await DispenseHistory.findAll({
                where: whereClause,
                order: [["createdAt", "DESC"]],
                limit: chunkSize,
                offset,
            });

            if (batch.length === 0) break;

            const machineIds = batch.map(m => m.machineId).filter(Boolean);

            if (machineIds.length === 0) break;

            const schools = await School.findAll({
                where: {
                    machineId: machineIds,
                    ...schoolWhere,
                },
            });

            const schoolMap = {};
            schools.forEach(s => {
                schoolMap[s.machineId] = s.dataValues;
            });

            const filteredBatch = batch.filter(machine => {
                if (machine.machineId && schoolMap[machine.machineId]) {
                    machine.dataValues.school = schoolMap[machine.machineId];
                    return true;
                }
                return Object.keys(schoolWhere).length === 0; // no filter → keep all
            });

            // const filteredBatch = batch.filter(machine => {
            //     if (Object.keys(schoolWhere).length === 0) return true; // no filters → keep all

            //     if (machine.machineId && schoolMap[machine.machineId]) {
            //         machine.dataValues.school = schoolMap[machine.machineId];
            //         // match filters
            //         return Object.keys(schoolWhere).every(field => {
            //             const filterValue = schoolWhere[field][Op.like].replace(/%/g, '');
            //             return machine.dataValues.school[field].includes(filterValue);
            //         });
            //     }
            //     return false;
            // });


            allResults = allResults.concat(filteredBatch);
            offset += chunkSize;
        }

        if (allResults.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No dispense history records found for the given filters.",
            });
        }

        return res.status(200).send({
            success: true,
            total: allResults.length,
            data: allResults,
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
        // console.log(error);
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

// exports.getDistrictWisePadConsunption = async (req, res) => {
//     try {
//         const { periodType } = req.params;

//         const [startDate, endDate] = getStartEndDateRange(periodType);

//         const historyResponse = await exports.getDateWiseDispenseHistory(
//             {
//                 query: {
//                     startDate,
//                     endDate,
//                 },
//             },
//             {
//                 status: () => ({
//                     send: (data) => data
//                 })
//             }
//         );

//         if (!historyResponse || !historyResponse.success) {
//             return res.status(500).send({
//                 success: false,
//                 message: "Failed to fetch dispense history"
//             });
//         }

//         const dispenseData = historyResponse.data;

//         const plainDispenseData = dispenseData.map(entry => {
//             const record = entry.get ? entry.get({ plain: true }) : entry;
//             if (record.school && record.school.get) {
//                 record.school = record.school.get({ plain: true });
//             }
//             return record;
//         });

//         const districtPadConsumption = {};

//         for (const entry of plainDispenseData) {
//             const district = entry.school?.schoolDistrict;
//             const fullState = entry.school?.state;
//             const padsDispensed = entry.itemsDispensed || 0;

//             if (district && fullState) {
//                 const shortState = stateShortCodes[fullState] || fullState; // fallback if not found
//                 const formattedDistrict = `${district} (${shortState})`;

//                 if (!districtPadConsumption[formattedDistrict]) {
//                     districtPadConsumption[formattedDistrict] = 0;
//                 }
//                 districtPadConsumption[formattedDistrict] += padsDispensed;
//             }
//         }

//         return res.status(200).send({
//             success: true,
//             data: districtPadConsumption
//         });

//     } catch (error) {
//         console.error("Error computing district-wise pad consumption:", error);
//         return res.status(500).send({
//             success: false,
//             message: "Error computing pad consumption by district",
//             error
//         });
//     }
// };

exports.getDistrictWisePadConsunption = async (req, res) => {
    try {
        const { periodType } = req.params;
        const [startDate, endDate] = getStartEndDateRange(periodType);

        const whereClause = {};

        if (periodType !== "allTime") {
            whereClause.createdAt = {
                [Op.between]: [startDate, endDate],
            };
        }

        const result = await DispenseHistory.findAll({
            where: whereClause,
            include: [
                {
                    model: SchoolDetail,
                    as: "school",
                    attributes: [],
                },
            ],
            attributes: [
                [Sequelize.col("school.schoolDistrict"), "district"],
                [Sequelize.col("school.state"), "state"],
                [Sequelize.fn("SUM", Sequelize.col("itemsDispensed")), "totalPads"],
            ],
            group: ["school.schoolDistrict", "school.state"],
            raw: true,
        });

        // format response
        const districtPadConsumption = {};

        for (const row of result) {
            const district = row.district;
            const fullState = row.state;
            const pads = Number(row.totalPads) || 0;

            if (district && fullState) {
                const shortState = stateShortCodes[fullState] || fullState;
                const formattedDistrict = `${district} (${shortState})`;

                districtPadConsumption[formattedDistrict] = pads;
            }
        }

        return res.status(200).send({
            success: true,
            data: districtPadConsumption,
        });
    } catch (error) {
        console.error("Error computing district-wise pad consumption:", error);
        return res.status(500).send({
            success: false,
            message: "Error computing pad consumption by district",
            error,
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

        // if (startDate && endDate) {
        //     whereClause.createdAt = {
        //         [Op.between]: [new Date(startDate), new Date(endDate)]
        //     };
        // }

        if (startDate && endDate) {
            const start = new Date(`${startDate}T00:00:00Z`);
            const end = new Date(`${endDate}T23:59:59Z`);
            whereClause.createdAt = { [Op.between]: [start, end] };
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
        const { startDate, endDate, filters } = req.query;

        // ✅ Build where clause
        const whereClause = { event_type: "2" };

        if (startDate && endDate) {
            const start = new Date(`${startDate}T00:00:00Z`);
            const end = new Date(`${endDate}T23:59:59Z`);
            whereClause.createdAt = { [Op.between]: [start, end] };
        } else if (startDate) {
            whereClause.createdAt = { [Op.gte]: new Date(startDate) };
        } else if (endDate) {
            whereClause.createdAt = { [Op.lte]: new Date(endDate) };
        }

        // ✅ parse DataGrid filters
        let schoolWhere = {};
        if (filters) {
            const parsedFilters = JSON.parse(filters); // DataGrid sends array
            parsedFilters.forEach(f => {
                if (f.field === "schoolState" && f.value) {
                    schoolWhere.state = { [Op.like]: `%${f.value}%` };
                }
                if (f.field === "schoolDistrict" && f.value) {
                    schoolWhere.schoolDistrict = { [Op.like]: `%${f.value}%` };
                }
            });
        }

        const chunkSize = 500;
        let offset = 0;
        let allResults = [];

        while (true) {
            // ✅ fetch batch
            // const batch = await DispenseHistory.findAll({
            //     where: whereClause,
            //     order: [["createdAt", "DESC"]],
            //     limit: chunkSize,
            //     offset,
            // });

            const batch = await DispenseHistory.findAll({
                where: whereClause,
                order: [["createdAt", "DESC"]],
                limit: chunkSize,
                offset,
            });

            if (batch.length === 0) break;

            // ✅ collect machineIds
            const machineIds = batch.map((m) => m.machineId).filter(Boolean);

            if (machineIds.length === 0) break;

            // ✅ fetch schools in bulk
            // const schools = await School.findAll({
            //     where: { machineId: machineIds },
            // });

            const schools = await School.findAll({
                where: {
                    machineId: machineIds,
                    ...schoolWhere,
                },
            });

            const schoolMap = {};
            schools.forEach((s) => {
                schoolMap[s.machineId] = s.dataValues;
            });

            // ✅ attach school data
            // batch.forEach((entry) => {
            //     if (entry.machineId && schoolMap[entry.machineId]) {
            //         entry.dataValues.school = schoolMap[entry.machineId];
            //     }
            // });


            const filteredBatch = batch.filter(machine => {
                if (machine.machineId && schoolMap[machine.machineId]) {
                    machine.dataValues.school = schoolMap[machine.machineId];
                    return true;
                }
                return Object.keys(schoolWhere).length === 0; // no filter → keep all
            });

            allResults = allResults.concat(filteredBatch);
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
        // console.log(error);
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


        // const consumptionData = {
        //     today: 0,
        //     yesterday: 0,
        //     week: 0,
        //     month: 0,
        //     quarter: 0,
        //     total: 0
        // };

        // // Get the total pad consumption for each period
        // for (const period of Object.keys(consumptionData)) {
        //     // const startDate = getDateRange(period);
        //     const { start, end } = getDateRange(period);
        //     let query = 'SELECT SUM(itemsDispensed) AS totalDispensed FROM DispenseHistories';
        //     // If there's a start date, filter by it
        //     if (start && end) {
        //         query += ` WHERE createdAt >= '${start}' AND createdAt <= '${end}'`;
        //     }
        //     const [result] = await mySqlPool.query(query);
        //     if (result || result[0]) {
        //         consumptionData[period] = result.totalDispensed || 0; // Handle if no records are found (returns null)
        //     } else {
        //         consumptionData[period] = 0; // No records found, set total to 0
        //     }
        // }

        const consumptionData = {
            today: 0,
            yesterday: 0,
            week: 0,
            month: 0,
            quarter: 0,
            total: 0
        };

        for (const period of Object.keys(consumptionData)) {
            const { start, end } = getDateRange(period);

            let query = `
                SELECT 
                COALESCE(d.totalDispensed, 0) + COALESCE(m.totalManualPads, 0) AS totalConsumption
                FROM
                (
                    SELECT SUM(itemsDispensed) AS totalDispensed
                    FROM DispenseHistories
                    ${start && end ? "WHERE createdAt BETWEEN ? AND ?" : ""}
                ) d,
                (
                    SELECT SUM(padCounts) AS totalManualPads
                    FROM manualpads
                    ${start && end ? "WHERE dateOfEntry BETWEEN ? AND ?" : ""}
                ) m
            `;

            const params = start && end ? [start, end, start, end] : [];

            const [rows] = await mySqlPool.query(query, params);

            consumptionData[period] = rows?.totalConsumption || 0;
        }

        // for (const period of Object.keys(consumptionData)) {
        //     const { start, end } = getDateRange(period);
        //     // let startDate = new Date("2025-11-27");
        //     // let endDate = new Date("2026-02-26");
        //     let startDate = new Date("2025-11-27 14:00:00");
        //     let endDate = new Date("2026-02-26 14:00:00");

        //     let query = `
        //         SELECT 
        //         COALESCE(d.totalDispensed, 0) + COALESCE(m.totalManualPads, 0) AS totalConsumption
        //         FROM
        //         (
        //             SELECT SUM(itemsDispensed) AS totalDispensed
        //             FROM DispenseHistories
        //             ${startDate && endDate ? "WHERE createdAt BETWEEN ? AND ?" : ""}
        //         ) d,
        //         (
        //             SELECT SUM(padCounts) AS totalManualPads
        //             FROM manualpads
        //             ${startDate && endDate ? "WHERE dateOfEntry BETWEEN ? AND ?" : ""}
        //         ) m
        //     `;

        //     const params = startDate && endDate ? [startDate, endDate, startDate, endDate] : [];

        //     const [rows] = await mySqlPool.query(query, params);

        //     console.log(`Query result for ${period}:`, rows); // Debug log to check the query result
        //     console.log(`Query date`, startDate, endDate); // Debug log to check the query result

        //     consumptionData[period] = rows?.totalConsumption || 0;
        // }

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
                // ✅ Active if updated in last 30 min
                [
                    fn(
                        'SUM',
                        literal(`CASE 
                    WHEN VendingMachine.onlineStatusUpdatedAt > DATE_SUB(NOW(), INTERVAL 30 MINUTE) 
                    THEN 1 ELSE 0 END`)
                    ),
                    'activeMachineCount'
                ],

                // ✅ Inactive if not updated in last 30 min
                [
                    fn(
                        'SUM',
                        literal(`CASE 
                    WHEN VendingMachine.onlineStatusUpdatedAt <= DATE_SUB(NOW(), INTERVAL 30 MINUTE) 
                    OR VendingMachine.onlineStatusUpdatedAt IS NULL
                    THEN 1 ELSE 0 END`)
                    ),
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
                // ✅ Active if updated in last 30 min
                [
                    fn(
                        'SUM',
                        literal(`CASE 
            WHEN VendingMachine.onlineStatusUpdatedAt >= DATE_SUB(NOW(), INTERVAL 30 MINUTE) 
            THEN 1 ELSE 0 END`)
                    ),
                    'activeMachineCount'
                ],

                // ✅ Inactive if not updated in last 30 min
                [
                    fn(
                        'SUM',
                        literal(`CASE 
            WHEN VendingMachine.onlineStatusUpdatedAt < DATE_SUB(NOW(), INTERVAL 30 MINUTE) 
            OR VendingMachine.onlineStatusUpdatedAt IS NULL
            THEN 1 ELSE 0 END`)
                    ),
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

    // console.log("Updated NGO SPOC Details:", req.body);

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


// Manual Pad Distributr
exports.createManualPads = async (req, res) => {
    const {
        machineId,
        padCounts,
        remark,
        dateOfEntry,
        eventStartDate,
        eventEndDate
    } = req.body;

    if (!machineId || !padCounts || !dateOfEntry || !eventStartDate || !eventEndDate) {
        return res.status(400).send({
            success: false,
            message: 'All fields  are required'
        });
    }

    try {
        // 1️⃣ Check if this machineId already exists in ManualPads
        const existing = await ManualPads.findOne({ where: { machineId } });

        if (existing) {
            return res.status(400).send({
                success: false,
                message: 'Manual Pads for this machine already exist. Please update instead.'
            });
        }

        const manualPads = await ManualPads.create({
            machineId,
            padCounts,
            remark,
            dateOfEntry,
            eventStartDate,
            eventEndDate
        });

        // const stockRecord = await StockHistory.findOne({
        //     where: { machineId }
        // });

        // // 3️⃣ Create NEW DispenseHistory entry (instead of UPDATE)
        // const dispenseHistory = await DispenseHistory.create({
        //     event_type: "MANUAL",        // or whatever constant you use
        //     machineId: Number(machineId),
        //     stock: stockRecord ? stockRecord.stock : 0,                    // or calculate if needed
        //     itemsDispensed: padCounts,        // manual entry so null
        //     manualPads: padCounts        // 🔥 key part
        // });

        const updateQuery = `
        UPDATE DispenseHistories
        SET manualPads = ?
        WHERE machineId = ?
        `;


        // Remove destructuring
        const updateResult = await mySqlPool.query(updateQuery, [padCounts, Number(machineId)]);

        return res.status(201).send({
            success: true,
            message: 'Manual Pads created successfully',
            data: manualPads
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).send({
                success: false,
                message: 'Manual Pads must be unique',
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

exports.getAllManualPads = async (req, res) => {
    try {
        // Fetch all data from the NgoSpoc table
        const manualPadscResult = await ManualPads.findAll();

        // Check if any records exist
        if (manualPadscResult.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No ManualPads records found."
            });
        }

        // Return the fetched ManualPads
        return res.status(200).send({
            success: true,
            data: manualPadscResult
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error retrieving ManualPads',
            error
        });
    }
};

exports.deleteManualPads = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if record exists
        const manualPad = await ManualPads.findByPk(id);
        if (!manualPad) {
            return res.status(404).send({
                success: false,
                message: "ManualPad record not found."
            });
        }

        // Delete record
        await manualPad.destroy();

        return res.status(200).send({
            success: true,
            message: "ManualPad deleted successfully.",
            deletedId: id
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Error deleting ManualPad",
            error
        });
    }
};

// controller/manualPadsController.js
exports.updateManualPads = async (req, res) => {
    try {
        const { id } = req.params;
        const { machineId,
            padCounts,
            remark,
            dateOfEntry,
            eventStartDate,
            eventEndDate } = req.body;

        // Check if record exists
        const manualPad = await ManualPads.findByPk(id);

        const updateQuery = `
        UPDATE DispenseHistories
        SET manualPads = ?
        WHERE machineId = ?
        `;

        const updateResult = await mySqlPool.query(updateQuery, [padCounts, Number(machineId)]);

        // const stockRecord = await StockHistory.findOne({
        //     where: { machineId }
        // });

        // const dispenseHistory = await DispenseHistory.create({
        //     event_type: "MANUAL",        // or whatever constant you use
        //     machineId: Number(machineId),
        //     stock: stockRecord ? stockRecord.stock : 0,                    // or calculate if needed
        //     itemsDispensed: padCounts - manualPad.padCounts,        // manual entry so null
        //     manualPads: padCounts - manualPad.padCounts        // 🔥 key part
        // });

        if (!manualPad) {
            return res.status(404).send({
                success: false,
                message: "ManualPad record not found."
            });
        }

        // Update record
        manualPad.machineId = machineId || manualPad.machineId;
        manualPad.padCounts = padCounts || manualPad.padCounts;
        manualPad.remark = remark || manualPad.remark;
        manualPad.dateOfEntry = dateOfEntry || manualPad.dateOfEntry;
        manualPad.eventStartDate = eventStartDate || manualPad.eventStartDate;
        manualPad.eventEndDate = eventEndDate || manualPad.eventEndDate;

        await manualPad.save();

        return res.status(200).send({
            success: true,
            message: "ManualPad updated successfully.",
            data: manualPad
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Error updating ManualPad",
            error
        });
    }
};

// Reports Section Apis

exports.machineWiseDispense = async (req, res) => {
    try {
        const {
            states = [],
            districts = [],
            startDate,
            endDate,
            dispenseType = "all",
        } = req.body;

        const start = `${startDate} 00:00:00`;
        const end = `${endDate} 23:59:59`;

        let whereConditions = `
      dh.createdAt BETWEEN '${start}' AND '${end}'
    `;

        if (dispenseType === "machine") {
            whereConditions += ` AND dh.manualPads IS NULL`;
        }

        if (dispenseType === "manual") {
            whereConditions += ` AND dh.manualPads IS NOT NULL`;
        }

        if (states.length > 0) {
            whereConditions += `
        AND s.state IN (${states.map(s => `'${s}'`).join(",")})
      `;
        }

        if (districts.length > 0) {
            whereConditions += `
        AND s.schoolDistrict IN (${districts.map(d => `'${d}'`).join(",")})
      `;
        }

        const data = await Sequelize.query(
            `
      SELECT 
        dh.machineId,
        s.state,
        s.schoolDistrict,
        s.schoolName,

        /* ✅ SUPPORTED GIRLS */
        SUM(DISTINCT s.numberOfGirls) AS supportedGirls,

        /* ✅ PADS DISPENSED (DASHBOARD LOGIC) */
        SUM(dh.itemsDispensed) AS padsDispensed,

        /* ✅ AVG CONSUMPTION (TIME-BASED) */
        ROUND(
          (SUM(dh.itemsDispensed) * 30) /
          NULLIF(
            DATEDIFF(
              '${end}',
              MIN(dh.createdAt)
            ) * SUM(DISTINCT s.numberOfGirls),
            0
          ),
          2
        ) AS avgConsumption,

        /* ✅ TOTAL REFILL */
        COUNT(
          CASE 
            WHEN dh.event_type = '2' THEN 1
            ELSE NULL
          END
        ) AS totalRefill

      FROM DispenseHistories dh
      JOIN Schools s 
        ON s.machineId = dh.machineId

      WHERE ${whereConditions}

      GROUP BY 
        dh.machineId,
        s.state,
        s.schoolDistrict,
        s.schoolName

      ORDER BY dh.machineId ASC
      `,
            { type: Sequelize.QueryTypes.SELECT }
        );

        /* =============================
          ✅ SUMMARY (AS PER INCLUDE)
       ============================== */
        const summary = {
            period: `${startDate} to ${endDate}`,

            numberOfDays:
                Math.ceil(
                    (new Date(endDate) - new Date(startDate)) /
                    (1000 * 60 * 60 * 24)
                ) + 1,

            numberOfStates: new Set(data.map(d => d.state)).size,

            numberOfDistricts: new Set(data.map(d => d.schoolDistrict)).size,

            numberOfMachinesInstalled: new Set(
                data.map(d => d.machineId)
            ).size,

            numberOfSchoolsCovered: new Set(
                data.map(d => d.schoolName)
            ).size,

            numberOfSupportedGirls: data.reduce(
                (sum, d) => sum + Number(d.supportedGirls || 0),
                0
            ),

            numberOfPadsDispensed: data.reduce(
                (sum, d) => sum + Number(d.padsDispensed || 0),
                0
            ),

            averageConsumptionPerGirl: (() => {
                const totalGirls = data.reduce(
                    (sum, d) => sum + Number(d.supportedGirls || 0),
                    0
                );
                const totalPads = data.reduce(
                    (sum, d) => sum + Number(d.padsDispensed || 0),
                    0
                );
                return totalGirls
                    ? +(totalPads / totalGirls).toFixed(2)
                    : 0;
            })(),

            totalRefills: data.reduce(
                (sum, d) => sum + Number(d.totalRefill || 0),
                0
            ),
        };

        res.status(200).json({
            status: true,
            data,
            summary
        });

    } catch (error) {
        console.error("machineWiseDispense", error);
        res.status(500).json({
            status: false,
            message: "Server error",
        });
    }
};

exports.stateOrDistrictWiseDispenseComparison = async (req, res) => {
    try {
        const {
            states = [],
            districts = [],
            startDate,
            endDate,
            dispenseType = "all"
        } = req.body;

        const start = `${startDate} 00:00:00`;
        const end = `${endDate} 23:59:59`;

        let whereConditions = `
      dh.createdAt BETWEEN '${start}' AND '${end}'
    `;

        if (dispenseType === "machine") {
            whereConditions += ` AND dh.manualPads IS NULL`;
        }

        if (dispenseType === "manual") {
            whereConditions += ` AND dh.manualPads IS NOT NULL`;
        }

        if (states.length > 0) {
            whereConditions += `
        AND s.state IN (${states.map(s => `'${s}'`).join(",")})
      `;
        }

        if (districts.length > 0) {
            whereConditions += `
        AND s.schoolDistrict IN (${districts.map(d => `'${d}'`).join(",")})
      `;
        }

        const data = await Sequelize.query(
            `
      SELECT
        s.state,
        s.schoolDistrict,

        /* ✅ MACHINES INSTALLED */
        COUNT(DISTINCT s.machineId) AS machinesInstalled,

        /* ✅ SCHOOLS COVERED */
        COUNT(DISTINCT s.schoolId) AS schoolsCovered,

        /* ✅ SUPPORTED GIRLS */
        SUM(DISTINCT s.numberOfGirls) AS supportedGirls,

        /* ✅ PADS DISPENSED (DASHBOARD LOGIC) */
        SUM(dh.itemsDispensed) AS padsDispensed,

        /* ✅ AVG CONSUMPTION (MACHINE-WISE LOGIC) */
        ROUND(
          (SUM(dh.itemsDispensed) * 30) /
          NULLIF(
            DATEDIFF(
              '${end}',
              MIN(dh.createdAt)
            ) * SUM(DISTINCT s.numberOfGirls),
            0
          ),
          2
        ) AS avgConsumption

      FROM DispenseHistories dh
      JOIN Schools s 
        ON s.machineId = dh.machineId

      WHERE ${whereConditions}

      GROUP BY 
        s.state,
        s.schoolDistrict

      ORDER BY 
        s.state ASC,
        s.schoolDistrict ASC
      `,
            { type: Sequelize.QueryTypes.SELECT }
        );

        // Summary object
        const summary = {
            period: `${startDate} to ${endDate}`,
            numberOfDays: Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1,
            numberOfStates: new Set(data.map(d => d.state)).size,
            numberOfDistricts: new Set(data.map(d => d.schoolDistrict)).size,
            numberOfMachinesInstalled: data.reduce((sum, d) => sum + Number(d.machinesInstalled || 0), 0),
            numberOfSchoolsCovered: data.reduce((sum, d) => sum + Number(d.schoolsCovered || 0), 0),
            numberOfSupportedGirls: data.reduce((sum, d) => sum + Number(d.supportedGirls || 0), 0),
            numberOfPadsDispensed: data.reduce((sum, d) => sum + Number(d.padsDispensed || 0), 0),
            averageConsumptionPerGirl: (() => {
                const totalGirls = data.reduce((sum, d) => sum + Number(d.supportedGirls || 0), 0);
                const totalPads = data.reduce((sum, d) => sum + Number(d.padsDispensed || 0), 0);
                return totalGirls ? +(totalPads / totalGirls).toFixed(2) : 0;
            })()
        };

        res.status(200).json({
            status: true,
            data,
            summary
        });

    } catch (error) {
        console.error("stateOrDistrictWiseDispenseComparison", error);
        res.status(500).json({
            status: false,
            message: "Server error"
        });
    }
};

exports.avgConsumptionComparisonReport = async (req, res) => {
    try {
        const {
            states = [],
            districts = [],
            startDate,
            endDate,
            dispenseType = "all",
            minRange = 0,
            maxRange = 5,
            step = 0.25
        } = req.body;

        const start = `${startDate} 00:00:00`;
        const end = `${endDate} 23:59:59`;

        let whereConditions = `dh.createdAt BETWEEN '${start}' AND '${end}'`;

        if (dispenseType === "machine") whereConditions += ` AND dh.manualPads IS NULL`;
        else if (dispenseType === "manual") whereConditions += ` AND dh.manualPads IS NOT NULL`;

        if (states.length) whereConditions += ` AND s.state IN (${states.map(s => `'${s}'`).join(",")})`;
        if (districts.length) whereConditions += ` AND s.schoolDistrict IN (${districts.map(d => `'${d}'`).join(",")})`;

        const rows = await Sequelize.query(`
            SELECT
                s.state,
                s.schoolDistrict,
                s.schoolName,
                s.numberOfGirls,
                SUM(dh.itemsDispensed) AS totalPads,
                ROUND(SUM(dh.itemsDispensed) / NULLIF(s.numberOfGirls, 0), 2) AS avgConsumption
            FROM DispenseHistories dh
            JOIN Schools s ON s.machineId = dh.machineId
            WHERE ${whereConditions}
            GROUP BY s.state, s.schoolDistrict, s.schoolName, s.numberOfGirls
            ORDER BY s.state, s.schoolDistrict, s.schoolName
        `, { type: Sequelize.QueryTypes.SELECT });

        const ranges = [];
        for (let i = minRange; i < maxRange; i += step) {
            ranges.push({
                min: i,
                max: +(i + step).toFixed(2),
                label: `${i.toFixed(2)} – ${(i + step).toFixed(2)}`
            });
        }

        const totalSchools = rows.length;

        // Group by state first
        const stateMap = {};

        rows.forEach(row => {
            if (!stateMap[row.state]) stateMap[row.state] = {};

            const stateGroup = stateMap[row.state];

            // find range
            const range = ranges.find(r => row.avgConsumption >= r.min && row.avgConsumption <= r.max);
            if (!range) return;

            const key = `${row.schoolDistrict}_${range.label}`;
            if (!stateGroup[key]) {
                stateGroup[key] = {
                    state: row.state,
                    schoolDistrict: row.schoolDistrict,
                    averageConsumptionRange: range.label,
                    noOfSchools: 0
                };
            }

            stateGroup[key].noOfSchools++;
        });

        // After building `stateMap` as before

        const result = [];

        Object.keys(stateMap).forEach(state => {
            // get all districts in this state
            const districtNames = [...new Set(rows.filter(r => r.state === state).map(r => r.schoolDistrict))];

            districtNames.forEach(district => {
                ranges.forEach(range => {
                    const key = `${district}_${range.label}`;
                    const data = stateMap[state][key] || {
                        state,
                        schoolDistrict: district,
                        averageConsumptionRange: range.label,
                        noOfSchools: 0
                    };

                    data.percentOfTotalSchools = totalSchools
                        ? ((data.noOfSchools / totalSchools) * 100).toFixed(2) + "%"
                        : "0%";

                    result.push(data);
                });
            });
        });

        res.status(200).json({
            status: true,
            totalSchools,
            data: result
        });

    } catch (error) {
        console.error("avgConsumptionComparisonReport", error);
        res.status(500).json({
            status: false,
            message: "Server error",
            error
        });
    }
};

exports.machineWiseDispenseAndRefill = async (req, res) => {
    try {
        const {
            states = [],
            districts = [],
            startDate,
            endDate,
            dispenseType = "all",
        } = req.body;

        /* =============================
           DATE RANGE
        ============================== */
        const start = `${startDate} 00:00:00`;
        const end = `${endDate} 23:59:59`;

        /* =============================
           WHERE CONDITIONS
        ============================== */
        let whereConditions = `
            dh.createdAt BETWEEN '${start}' AND '${end}'
        `;

        /* DISPENSE TYPE FILTER */
        if (dispenseType === "machine") {
            whereConditions += ` AND dh.manualPads IS NULL`;
        }

        if (dispenseType === "manual") {
            whereConditions += ` AND dh.manualPads IS NOT NULL`;
        }

        /* STATE FILTER */
        if (states.length > 0) {
            whereConditions += `
                AND s.state IN (${states.map(s => `'${s}'`).join(",")})
            `;
        }

        /* DISTRICT FILTER */
        if (districts.length > 0) {
            whereConditions += `
                AND s.schoolDistrict IN (${districts.map(d => `'${d}'`).join(",")})
            `;
        }

        /* =============================
           MAIN QUERY
        ============================== */
        const data = await Sequelize.query(
            `
            SELECT
                dh.machineId,
                s.state,
                s.schoolDistrict,
                s.schoolName,
                s.schoolSpocName,

                /* ✅ SUPPORTED GIRLS */
                SUM(DISTINCT s.numberOfGirls) AS supportedGirls,

                /* ✅ PADS DISPENSED */
                SUM(
                    CASE
                        WHEN dh.event_type = '1'
                        THEN dh.itemsDispensed
                        ELSE 0
                    END
                ) AS padsDispensed,

                /* ✅ LAST PAD DISPENSE DATE */
                MAX(
                    CASE
                        WHEN dh.event_type = '1'
                        THEN dh.createdAt
                        ELSE NULL
                    END
                ) AS lastPadDispenseDate,

                /* ✅ TOTAL REFILLS */
                COUNT(
                    CASE
                        WHEN dh.event_type = '2'
                        THEN 1
                        ELSE NULL
                    END
                ) AS totalRefill,

                /* ✅ LAST REFILL DATE */
                MAX(
                    CASE
                        WHEN dh.event_type = '2'
                        THEN dh.createdAt
                        ELSE NULL
                    END
                ) AS lastRefillDate,

                /* ✅ AVG CONSUMPTION */
                ROUND(
                    (
                        SUM(
                            CASE
                                WHEN dh.event_type = '1'
                                THEN dh.itemsDispensed
                                ELSE 0
                            END
                        ) * 30
                    ) /
                    NULLIF(
                        DATEDIFF(
                            '${end}',
                            MIN(dh.createdAt)
                        ) * SUM(DISTINCT s.numberOfGirls),
                        0
                    ),
                    2
                ) AS avgConsumption

            FROM DispenseHistories dh
            JOIN Schools s
                ON s.machineId = dh.machineId

            WHERE ${whereConditions}

            GROUP BY
                dh.machineId,
                s.state,
                s.schoolDistrict,
                s.schoolName,
                s.schoolSpocName

            ORDER BY dh.machineId ASC
            `,
            { type: Sequelize.QueryTypes.SELECT }
        );

        /* =============================
           ✅ SUMMARY
        ============================== */
        const summary = {
            period: `${startDate} to ${endDate}`,
            numberOfDays: Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1,
            numberOfStates: new Set(data.map(d => d.state)).size,
            numberOfDistricts: new Set(data.map(d => d.schoolDistrict)).size,
            numberOfMachinesInstalled: new Set(data.map(d => d.machineId)).size,
            numberOfSchoolsCovered: new Set(data.map(d => d.schoolName)).size,
            numberOfSupportedGirls: data.reduce((sum, d) => sum + Number(d.supportedGirls || 0), 0),
            numberOfPadsDispensed: data.reduce((sum, d) => sum + Number(d.padsDispensed || 0), 0),
            averageConsumptionPerGirl: (() => {
                const totalGirls = data.reduce((sum, d) => sum + Number(d.supportedGirls || 0), 0);
                const totalPads = data.reduce((sum, d) => sum + Number(d.padsDispensed || 0), 0);
                return totalGirls ? +(totalPads / totalGirls).toFixed(2) : 0;
            })(),
            totalRefills: data.reduce((sum, d) => sum + Number(d.totalRefill || 0), 0),
        };

        /* ✅ RESPONSE (NO SUMMARY) */
        res.status(200).json({
            status: true,
            data,
            summary
        });

    } catch (error) {
        console.error("machineWiseDispenseAndRefill", error);
        res.status(500).json({
            status: false,
            message: "Server error",
        });
    }
};

exports.saveReport = async (req, res) => {
    try {
        const {
            reportType,      // machine_wise_dispense | avg_consumption | state_district
            reportName,
            description,
            filters,         // full filters object
            summary          // summary object from frontend / backend
        } = req.body;

        const ownerId = req.user?.username || 1; // JWT se lo
        const ownerName = req.user?.name || "System User";
        const role = req.user?.role || "admin";
        const roleId = req.user?.roleId || 1;

        if (!reportType || !reportName || !filters) {
            return res.status(400).json({
                status: false,
                message: "Missing required fields"
            });
        }

        // ✅ description max 200 chars safety
        const safeDescription = description
            ? description.toString().substring(0, 200)
            : null;

        const result = await Sequelize.query(
            `
      INSERT INTO saved_reports
      (
        report_type,
        report_name,
        description, 
        filters,
        summary,
        owner_id,
        owner_name,
        role,
        roleId
      )
      VALUES
      (
        :reportType,
        :reportName,
        :description, 
        :filters,
        :summary,
        :ownerId,
        :ownerName,
        :role,
        :roleId
      )
      `,
            {
                replacements: {
                    reportType,
                    reportName,
                    description: safeDescription,
                    filters: JSON.stringify(filters),
                    summary: JSON.stringify(summary || {}),
                    ownerId,
                    ownerName,
                    role,
                    roleId
                },
                type: Sequelize.QueryTypes.INSERT
            }
        );

        res.status(201).json({
            status: true,
            message: "Report saved successfully",
        });

    } catch (error) {
        console.error("saveReport error:", error);
        res.status(500).json({
            status: false,
            message: "Server error while saving report"
        });
    }
};

exports.getSavedReports = async (req, res) => {
    try {
        const type = req.query.type; // admin | user | superadmin
        const role = req.user?.role || "admin";
        const ownerId = req.user?.username;

        let roleCondition = "";
        let replacements = {};

        /* ================= SUPERADMIN ================= */
        if (role === "superadmin") {
            if (type === "admin") {
                // sab admin reports
                roleCondition = `WHERE role = 'admin'`;
            }
            else if (type === "user") {
                // sab user reports
                roleCondition = `WHERE role = 'user'`;
            }
            else {
                // ✅ superadmin ke apne reports
                roleCondition = `WHERE role = 'superadmin' AND owner_id = :ownerId`;
                replacements.ownerId = ownerId;
            }
        }

        /* ================= ADMIN ================= */
        else if (role === "admin") {
            if (type === "admin") {
                // admin ke apne reports
                roleCondition = `WHERE role = 'admin' AND owner_id = :ownerId`;
                replacements.ownerId = ownerId;
            }
            else if (type === "user") {
                // sab user reports
                roleCondition = `WHERE role = 'user'`;
            }
        }

        /* ================= USER ================= */
        else if (role === "user") {
            // sirf apne reports
            roleCondition = `WHERE role = 'user' AND owner_id = :ownerId`;
            replacements.ownerId = ownerId;
        }

        const reports = await Sequelize.query(
            `
      SELECT 
        id,
        report_type,
        report_name,
        description,
        role,
        owner_id,
        owner_name,
        created_at,
        updated_at
      FROM saved_reports
      ${roleCondition}
      ORDER BY created_at DESC
      `,
            {
                replacements,
                type: Sequelize.QueryTypes.SELECT,
            }
        );

        res.status(200).json({
            status: true,
            data: reports,
        });

    } catch (error) {
        console.error("getSavedReports", error);
        res.status(500).json({
            status: false,
            message: "Failed to fetch saved reports",
        });
    }
};
exports.deleteSavedReport = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await Sequelize.query(
            `
            DELETE FROM saved_reports
            WHERE id = :id 
            `,
            {
                replacements: { id },
                type: Sequelize.QueryTypes.DELETE,
            }
        );

        res.status(200).json({
            status: true,
            message: "Report deleted successfully",
        });

    } catch (error) {
        console.error("deleteSavedReport", error);
        res.status(500).json({
            status: false,
            message: "Failed to delete report",
        });
    }
};

exports.viewSavedReport = async (req, res) => {
    try {
        const { id } = req.params;

        const report = await Sequelize.query(
            `
            SELECT 
                id,
                report_type,
                report_name,
                description,
                filters,
                owner_id,
                owner_name,
                created_at
            FROM saved_reports
            WHERE id = :id
            `,
            {
                replacements: { id },
                type: Sequelize.QueryTypes.SELECT,
            }
        );

        if (!report.length) {
            return res.status(404).json({
                status: false,
                message: "Saved report not found",
            });
        }

        const row = report[0];

        res.status(200).json({
            status: true,
            data: {
                id: row.id,
                reportType: row.report_type,
                reportName: row.report_name,
                description: row.description,

                // ✅ FIX HERE
                filters: row.filters ? JSON.parse(row.filters) : {},

                ownerName: row.owner_name,
                createdAt: row.created_at,
            },
        });
    } catch (error) {
        console.error("viewSavedReport error:", error);
        res.status(500).json({
            status: false,
            message: "Server error",
        });
    }
};


exports.updateSavedReport = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            reportName,
            description,
            filters,
            summary
        } = req.body;

        const role = req.user?.role || "admin";
        const roleId = req.user?.roleId || 1;

        // ✅ description safety (max 200 chars)
        const safeDescription = description
            ? description.toString().substring(0, 200)
            : null;

        await Sequelize.query(
            `
            UPDATE saved_reports
            SET
                report_name = :reportName,
                description = :description,
                filters = :filters,
                summary = :summary,
                role = :role,
                roleId = :roleId
            WHERE id = :id
            `,
            {
                replacements: {
                    id,
                    reportName,
                    description: safeDescription,
                    filters: JSON.stringify(filters),
                    summary: JSON.stringify(summary || {}),
                    role,
                    roleId
                },
            }
        );

        const updated = await Sequelize.query(
            `
            SELECT 
                id,
                report_type,
                report_name,
                description,
                filters,
                summary,
                owner_id,
                owner_name,
                role,
                roleId
            FROM saved_reports
            WHERE id = :id
            `,
            {
                replacements: { id },
                type: Sequelize.QueryTypes.SELECT
            }
        );

        res.json({
            status: true,
            data: updated[0],
        });

    } catch (e) {
        console.error("updateSavedReport error:", e);
        res.status(500).json({ status: false, message: "Server error" });
    }
};


// Dispense Report
exports.dispenseReport = async (req, res) => {
    try {
        const {
            level = "national", // national | state | district | block | school
            startDate,
            endDate,
        } = req.body;

        if (!startDate || !endDate) {
            return res.status(400).json({
                status: false,
                message: "startDate and endDate are required",
            });
        }

        const start = `${startDate} 00:00:00`;
        const end = `${endDate} 23:59:59`;

        const numberOfDays =
            Math.ceil(
                (new Date(endDate) - new Date(startDate)) /
                (1000 * 60 * 60 * 24)
            ) + 1;

        /* =============================
           WHERE CONDITION (DATE ONLY)
        ============================== */
        const whereConditions = `
      dh.createdAt BETWEEN :start AND :end
    `;

        /* =============================
           LEVEL CONFIGURATION
        ============================== */
        let levelSelect = `'National' AS level`;
        let groupBy = ``;

        if (level === "state") {
            levelSelect = `TRIM(s.state) AS level`;
            groupBy = `GROUP BY TRIM(s.state)`;
        }

        if (level === "district") {
            levelSelect = `TRIM(s.schoolDistrict) AS level`;
            groupBy = `GROUP BY TRIM(s.schoolDistrict)`;
        }

        if (level === "block") {
            levelSelect = `
        CONCAT(TRIM(s.schoolBlock), '_', TRIM(s.schoolDistrict)) AS level
      `;
            groupBy = `GROUP BY TRIM(s.schoolBlock), TRIM(s.schoolDistrict)`;
        }

        if (level === "school") {
            levelSelect = `
        CONCAT(TRIM(s.machineId), '_', TRIM(s.schoolName)) AS level
      `;
            groupBy = `GROUP BY TRIM(s.machineId), TRIM(s.schoolName)`;
        }

        /* =============================
           MAIN QUERY
        ============================== */
        const data = await Sequelize.query(
            `
      SELECT
        ${levelSelect},

        :numberOfDays AS days,

        /* SCHOOLGIRLS */
        SUM(DISTINCT s.numberOfGirls) AS schoolgirls,

        /* MACHINES INSTALLED */
        COUNT(DISTINCT s.machineId) AS machinesInstalled,

        /* SCHOOLS */
        COUNT(DISTINCT s.schoolName) AS schools,

        /* PADS DISPENSED */
        SUM(dh.itemsDispensed) AS padsDispensed,

        /* CONSUMPTION RATE */
        ROUND(
          SUM(dh.itemsDispensed) /
          NULLIF(SUM(DISTINCT s.numberOfGirls), 0),
          2
        ) AS consumptionRate

      FROM DispenseHistories dh
      JOIN Schools s
        ON s.machineId = dh.machineId

      WHERE ${whereConditions}

      ${groupBy}

      ORDER BY level ASC
      `,
            {
                type: Sequelize.QueryTypes.SELECT,
                replacements: {
                    start,
                    end,
                    numberOfDays,
                },
            }
        );

        /* =============================
           SUMMARY
        ============================== */
        const summary = {
            period: `${startDate} to ${endDate}`,
            numberOfDays,
            totalSchoolgirls: data.reduce(
                (sum, d) => sum + Number(d.schoolgirls || 0),
                0
            ),
            totalMachinesInstalled: data.reduce(
                (sum, d) => sum + Number(d.machinesInstalled || 0),
                0
            ),
            totalSchools: data.reduce(
                (sum, d) => sum + Number(d.schools || 0),
                0
            ),
            totalPadsDispensed: data.reduce(
                (sum, d) => sum + Number(d.padsDispensed || 0),
                0
            ),
            averageConsumptionRate: (() => {
                const girls = data.reduce(
                    (sum, d) => sum + Number(d.schoolgirls || 0),
                    0
                );
                const pads = data.reduce(
                    (sum, d) => sum + Number(d.padsDispensed || 0),
                    0
                );
                return girls ? +(pads / girls).toFixed(2) : 0;
            })(),
        };

        res.status(200).json({
            status: true,
            level,
            data,
            summary,
        });
    } catch (error) {
        console.error("dispenseReport", error);
        res.status(500).json({
            status: false,
            message: "Server error",
        });
    }
};


// Last Activity Report (No Filters)
exports.lastActivityReport = async (req, res) => {
    try {
        const data = await Sequelize.query(
            `
      SELECT
        dh.machineId,
        s.schoolName,

        /* ✅ LAST DISPENSE DATE */
        MAX(
          CASE
            WHEN dh.event_type = '1'
            THEN dh.createdAt
            ELSE NULL
          END
        ) AS lastDispenseDate,

        /* ✅ LAST REFILL DATE */
        MAX(
          CASE
            WHEN dh.event_type = '2'
            THEN dh.createdAt
            ELSE NULL
          END
        ) AS lastRefillDate

      FROM DispenseHistories dh
      JOIN Schools s
        ON s.machineId = dh.machineId

      GROUP BY
        dh.machineId,
        s.schoolName

      ORDER BY dh.machineId ASC
      `,
            { type: Sequelize.QueryTypes.SELECT }
        );

        res.status(200).json({
            status: true,
            data
        });

    } catch (error) {
        console.error("lastActivityReport error:", error);
        res.status(500).json({
            status: false,
            message: "Server error"
        });
    }
};
