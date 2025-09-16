// models/StockHistory.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../modules/sequelize');

const StockHistory = sequelize.define('StockHistory', {
    machineId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

StockHistory.sync()
    .then(() => {
        console.log('StockHistory table has been created.');
    })
    .catch((error) => {
        console.error('Error creating StockHistory table:', error);
    });

module.exports = StockHistory;
