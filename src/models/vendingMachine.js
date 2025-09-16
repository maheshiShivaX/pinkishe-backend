const { DataTypes } = require('sequelize');
const sequelize = require('../../modules/sequelize');


const VendingMachine = sequelize.define('VendingMachine', {
    machineId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    gsmModuleImei: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    vendorName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    simCardNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    padCapacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    schoolId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    onlineStatusUpdatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    rssi: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
});

VendingMachine.sync()
    .then(() => {
        console.log('VendingMachine table has been created.');
    })
    .catch((error) => {
        console.error('Error creating VendingMachine table:', error);
    });



module.exports = VendingMachine;
