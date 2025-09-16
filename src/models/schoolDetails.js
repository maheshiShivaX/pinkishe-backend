const { DataTypes } = require('sequelize');
const sequelize = require('../../modules/sequelize');
const VendingMachine = require('./vendingMachine');
const DispenseHistory = require('./dispenseHistory');

const School = sequelize.define('School', {
    schoolId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    schoolName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    schoolAddress: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    schoolBlock: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    schoolDistrict: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    pinCode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    geoLocation: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    numberOfGirls: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    schoolSpocName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    schoolSpocMobileNo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ngoSpocName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ngoSpocMobileNo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ngoSpocName2: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ngoSpocMobileNo2: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ngoCoordinatorName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ngoCoordinatorMobileNo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    machineId: {
        type: DataTypes.STRING,
        allowNull: true,
    }
});

// Define the association with VendingMachine
School.belongsTo(VendingMachine, {
    foreignKey: 'machineId',
    targetKey: 'machineId',
    constraints: false
});

School.belongsTo(DispenseHistory, {
    foreignKey: 'machineId',
    sourceKey: 'machineId',
    // constraints: false
});

School.hasMany(DispenseHistory, {
    foreignKey: 'machineId',
    sourceKey: 'machineId',
    as: 'DispenseHistories'
});

School.sync()
    .then(() => {
        console.log('School table has been created.');
    })
    .catch((error) => {
        console.error('Error creating School table:', error);
    });


module.exports = School;
