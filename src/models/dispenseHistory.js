// models/DispenseHistory.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../modules/sequelize');

const DispenseHistory = sequelize.define('DispenseHistory', {
    event_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    machineId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    itemsDispensed: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
});

DispenseHistory.sync()
    .then(() => {
        console.log('DispenseHistory table has been created.');
    })
    .catch((error) => {
        console.error('Error creating DispenseHistory table:', error);
    });

module.exports = DispenseHistory;
