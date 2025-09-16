"use strict";

// models/StockHistory.js
var _require = require('sequelize'),
  DataTypes = _require.DataTypes;
var sequelize = require('../../modules/sequelize');
var StockHistory = sequelize.define('StockHistory', {
  machineId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});
StockHistory.sync().then(function () {
  console.log('StockHistory table has been created.');
})["catch"](function (error) {
  console.error('Error creating StockHistory table:', error);
});
module.exports = StockHistory;