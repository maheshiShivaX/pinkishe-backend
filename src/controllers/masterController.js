const Organisation = require('../models/organizationMaster')
const VendingMachine = require('../models/vendingMachine')
const School = require('../models/schoolDetails')

const GeoLocation = require('../models/geoLocationModel')

const saveOrganisation = async (req, res) => {
    const { organisationName, organisationType } = req.body;
    console.log("printing organisation Type :", req.body);

    console.log("printing organisation Name :", organisationName);
    console.log("printing organisation Type :", organisationType);

    if (!organisationName || !organisationType) {
        return res.status(400).json({ message: 'Both organisationName and organisationType are required' });
    }

    try {
        const newOrganisation = await Organisation.create({
            organisationName,
            organisationType,
        });

        return res.status(201).json({
            message: 'Organisation added successfully',
            organisation: newOrganisation,
        });
    } catch (error) {
        console.error('Error creating organisation:', error);
        return res.status(500).json({ message: 'Failed to create organisation' });
    }
};




const saveVendingMachine = async (req, res) => {
    const { machineId, gsmModuleImei, vendorName, simCardNumber, padCapacity, status } = req.body;

    console.log("Machine Details:", req.body);

    if (!machineId || !gsmModuleImei || !vendorName || !simCardNumber || !padCapacity || !status) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newVendingMachine = await VendingMachine.create({
            machineId,
            gsmModuleImei,
            vendorName,
            simCardNumber,
            padCapacity,
            status,
        });

        return res.status(201).json({
            message: 'Vending Machine added successfully',
            vendingMachine: newVendingMachine,
        });
    } catch (error) {
        console.error('Error creating vending machine:', error);
        return res.status(500).json({ message: 'Failed to create vending machine' });
    }
};




const updateVendingMachine = async (req, res) => {
    const { machineId } = req.params;
    const { gsmModuleImei, vendorName, simCardNumber, padCapacity, status } = req.body;

    console.log("Updated Machine Details:", req.body);

    if (!gsmModuleImei || !vendorName || !simCardNumber || !padCapacity || !status) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingVendingMachine = await VendingMachine.findOne({ where: { machineId } });

        if (!existingVendingMachine) {
            return res.status(404).json({ message: 'Vending Machine not found' });
        }

        existingVendingMachine.gsmModuleImei = gsmModuleImei;
        existingVendingMachine.vendorName = vendorName;
        existingVendingMachine.simCardNumber = simCardNumber;
        existingVendingMachine.padCapacity = padCapacity;
        existingVendingMachine.status = status;

        // Save the updated vending machine
        await existingVendingMachine.save();

        return res.status(200).json({
            message: 'Vending Machine updated successfully',
            vendingMachine: existingVendingMachine,
        });
    } catch (error) {
        console.error('Error updating vending machine:', error);
        return res.status(500).json({ message: 'Failed to update vending machine' });
    }
};





// const updateOnlineStatusTimestamp = async (req, res) => {
//     const { machineId, rssi } = req.body;

//     if (!machineId || !rssi) {
//         return res.status(400).json({ message: 'machineId and rssi is required' });
//     }

//     try {
//         const machine = await VendingMachine.findOne({ where: { machineId } });

//         if (!machine) {
//             return res.status(404).json({ message: 'Vending Machine not found' });
//         }

//         machine.onlineStatusUpdatedAt = new Date(); // Set to current time
//         machine.rssi = rssi;
//         await machine.save();

//         return res.status(200).json({
//             message: 'Online status timestamp updated successfully',
//             vendingMachine: machine,
//         });
//     } catch (error) {
//         console.error('Error updating online status timestamp:', error);
//         return res.status(500).json({ message: 'Failed to update online status timestamp' });
//     }
// };

const updateOnlineStatusTimestamp = async (req, res) => {
    const updates = req.body; // Expecting an array of { machineId, rssi }

    if (!Array.isArray(updates) || updates.length === 0) {
        return res.status(400).json({ message: 'Array of machineId and rssi is required' });
    }

    try {
        const updatedMachines = [];

        for (const item of updates) {
            const { machineId, rssi } = item;

            if (!machineId || rssi === undefined) continue;

            const machine = await VendingMachine.findOne({ where: { machineId } });

            if (machine) {
                machine.onlineStatusUpdatedAt = new Date();
                machine.rssi = rssi;
                await machine.save();

                updatedMachines.push({
                    machineId: machine.machineId,
                    gsmModuleImei: machine.gsmModuleImei,
                    vendorName: machine.vendorName,
                    simCardNumber: machine.simCardNumber,
                    padCapacity: machine.padCapacity,
                    status: machine.status,
                    schoolId: machine.schoolId,
                    onlineStatusUpdatedAt: machine.onlineStatusUpdatedAt,
                    rssi: machine.rssi,
                    createdAt: machine.createdAt,
                    updatedAt: machine.updatedAt,
                });
            }
        }

        return res.status(200).json({
            message: 'Online status timestamps updated successfully',
            vendingMachines: updatedMachines
        });
    } catch (error) {
        console.error('Error updating machines:', error);
        return res.status(500).json({ message: 'Server error during update' });
    }
};

const saveSchool = async (req, res) => {
    const {
        schoolName,
        schoolAddress,
        schoolBlock,
        schoolDistrict,
        state,
        pinCode,
        geoLocation,
        numberOfGirls,
        schoolSpocName,
        ngoSpocName,
        ngoSpocName2,
        ngoCoordinatorName,
        schoolSpocMobileNo,
        ngoSpocMobileNo,
        ngoSpocMobileNo2,
        ngoCoordinatorMobileNo
    } = req.body;

    console.log("Received school data: ", req.body);

    if (!schoolName || !schoolAddress || !schoolBlock || !schoolDistrict || !state || !pinCode || !geoLocation || !numberOfGirls || !schoolSpocName || !ngoSpocName || !ngoCoordinatorName) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newSchool = await School.create({
            schoolName,
            schoolAddress,
            schoolBlock,
            schoolDistrict,
            state,
            pinCode,
            geoLocation,
            numberOfGirls,
            schoolSpocName,
            schoolSpocMobileNo,
            ngoSpocName,
            ngoSpocMobileNo,
            ngoSpocName2,
            ngoSpocMobileNo2,
            ngoCoordinatorName,
            ngoCoordinatorMobileNo,
        });

        return res.status(201).json({
            message: 'School added successfully',
            school: newSchool,
        });
    } catch (error) {
        console.error('Error creating school:', error);
        return res.status(500).json({ message: 'Failed to create school' });
    }
};



const updateSchool = async (req, res) => {
    const { id } = req.params;
    const {
        schoolName,
        schoolAddress,
        schoolBlock,
        schoolDistrict,
        state,
        pinCode,
        geoLocation,
        numberOfGirls,
        schoolSpocName,
        schoolSpocMobileNo,
        ngoSpocName,
        ngoSpocMobileNo,
        ngoSpocName2,
        ngoSpocMobileNo2,
        ngoCoordinatorName,
        ngoCoordinatorMobileNo
    } = req.body;

    if (
        !schoolName ||
        !schoolAddress ||
        !schoolBlock ||
        !schoolDistrict ||
        !state ||
        !pinCode ||
        !geoLocation ||
        !numberOfGirls ||
        !schoolSpocName ||
        !ngoSpocName ||
        !ngoCoordinatorName
    ) {
        return res.status(400).json({ message: 'All required fields must be provided' });
    }

    try {
        const existingSchool = await School.findOne({ where: { schoolId: id } });

        if (!existingSchool) {
            return res.status(404).json({ message: 'School not found' });
        }

        // Update fields
        existingSchool.schoolName = schoolName;
        existingSchool.schoolAddress = schoolAddress;
        existingSchool.schoolBlock = schoolBlock;
        existingSchool.schoolDistrict = schoolDistrict;
        existingSchool.state = state;
        existingSchool.pinCode = pinCode;
        existingSchool.geoLocation = geoLocation;
        existingSchool.numberOfGirls = numberOfGirls;
        existingSchool.schoolSpocName = schoolSpocName;
        existingSchool.schoolSpocMobileNo = schoolSpocMobileNo;
        existingSchool.ngoSpocName = ngoSpocName;
        existingSchool.ngoSpocMobileNo = ngoSpocMobileNo;
        existingSchool.ngoSpocName2 = ngoSpocName2;
        existingSchool.ngoSpocMobileNo2 = ngoSpocMobileNo2;
        existingSchool.ngoCoordinatorName = ngoCoordinatorName;
        existingSchool.ngoCoordinatorMobileNo = ngoCoordinatorMobileNo;

        // Save updated school
        await existingSchool.save();

        return res.status(200).json({
            message: 'School updated successfully',
            school: existingSchool,
        });
    } catch (error) {
        console.error('Error updating school:', error);
        return res.status(500).json({ message: 'Failed to update school' });
    }
};



const deleteSchool = async (req, res) => {
    const { id } = req.params;

    try {
        const school = await School.findOne({ where: { schoolId: id } });

        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }

        if (school.machineId !== null) {
            return res.status(400).json({
                message: `Cannot delete school. MachineId: '${school.machineId}' is allocated.`
            });
        }

        await school.destroy();

        return res.status(200).json({ message: 'School deleted successfully' });
    } catch (error) {
        console.error('Error deleting school:', error);
        return res.status(500).json({ message: 'Failed to delete school' });
    }
};


const saveMachineAllocation = async (req, res) => {
    const { schoolId, machineId } = req.body;

    console.log("Received machine allocation data: ", req.body);

    if (!schoolId || !machineId) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Step 1: Update the School collection where schoolId matches and machineId is null
        const school = await School.findOne({ where: { schoolId: schoolId, machineId: null } });
        if (!school) {
            return res.status(404).json({ message: 'School not found or machine already assigned' });
        }
        console.log("founded school:", school)

        // Step 2: Update the Machine collection where machineId matches
        const machine = await VendingMachine.findOne({ where: { machineId: machineId, schoolId: null, status: "inStore" } });
        if (!machine) {
            return res.status(404).json({ message: 'Machine not found which is inactive' });
        }


        // Assign the machineId to the school
        school.machineId = machineId;
        await school.save();
        // Check the machine's status and update it to 'procured' if it's inactive
        if (machine.status === 'inStore') {
            machine.status = 'active';
        }

        // Assign the schoolId to the machine
        machine.schoolId = schoolId;
        await machine.save();

        return res.status(200).json({
            message: 'Machine allocation updated successfully',
            school,
            machine
        });
    } catch (error) {
        console.error('Error updating machine allocation:', error);
        return res.status(500).json({ message: 'Failed to update machine allocation' });
    }
};




const deleteMachineAllocation = async (req, res) => {
    const { id } = req.params;  // Receiving schoolId from the request parameters
    const schoolId = id;

    try {
        // Step 1: Retrieve the school by schoolId
        const school = await School.findOne({ where: { schoolId } });
        if (!school || !school.machineId) {
            return res.status(404).json({ message: 'School not found or no machine allocated' });
        }

        const machineId = school.machineId;  // Get the assigned machineId

        // Step 2: Retrieve the machine assigned to the school
        const machine = await VendingMachine.findOne({ where: { machineId } });
        if (!machine) {
            return res.status(404).json({ message: 'Machine not found' });
        }

        // Step 3: Unassign the machine from the school
        school.machineId = null;  // Remove the machineId from the school
        await school.save();

        // Step 4: Set the machine's status to inactive and remove the schoolId from the machine
        machine.status = 'inactive';  // Set the machine status back to inactive
        machine.schoolId = null;      // Remove the schoolId from the machine
        await machine.save();

        return res.status(200).json({
            message: 'Machine allocation removed successfully',
            school,
            machine,
        });
    } catch (error) {
        console.error('Error deleting machine allocation:', error);
        return res.status(500).json({ message: 'Failed to remove machine allocation' });
    }
};






const saveGeoLocation = async (req, res) => {
    const { state, district, block } = req.body;

    if (!state || !district || !block) {
        return res.status(400).json({ message: 'State, District, and Block are required' });
    }

    try {
        // Create a new GeoLocation entry
        const newGeoLocation = await GeoLocation.create({
            state,
            district,
            block
        });

        return res.status(201).json({
            message: 'Geolocation saved successfully',
            geoLocation: newGeoLocation,
        });
    } catch (error) {
        console.error('Error saving geolocation:', error);
        return res.status(500).json({ message: 'Failed to save geolocation' });
    }
}



const updateGeoLocation = async (req, res) => {
    const { id } = req.params;  // Get the id from the URL parameter
    const { state, district, block } = req.body;  // Get the new data from the request body

    // Validate if at least one field is provided for update
    if (!state && !district && !block) {
        return res.status(400).json({ message: 'At least one field (State, District, or Block) is required to update' });
    }

    try {
        // Find the GeoLocation by id
        const geoLocation = await GeoLocation.findByPk(id);  // Using `findByPk` to find by primary key (id)

        // If geo-location not found, return an error
        if (!geoLocation) {
            return res.status(404).json({ message: 'GeoLocation not found' });
        }

        // Update the fields that were provided in the request body
        if (state) geoLocation.state = state;
        if (district) geoLocation.district = district;
        if (block) geoLocation.block = block;

        // Save the updated geo-location
        await geoLocation.save();

        return res.status(200).json({
            message: 'Geolocation updated successfully',
            geoLocation,
        });
    } catch (error) {
        console.error('Error updating geo-location:', error);
        return res.status(500).json({ message: 'Failed to update geolocation' });
    }
}


module.exports = { saveOrganisation, saveVendingMachine, saveSchool, updateSchool, deleteSchool, saveMachineAllocation, updateVendingMachine, saveGeoLocation, updateGeoLocation, deleteMachineAllocation, updateOnlineStatusTimestamp };