"use strict";

// models/DispenseHistory.js
var _require = require('sequelize'),
  DataTypes = _require.DataTypes;
var sequelize = require('../../modules/sequelize');
var DispenseHistory = sequelize.define('DispenseHistory', {
  event_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  machineId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  itemsDispensed: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
});
DispenseHistory.sync().then(function () {
  console.log('DispenseHistory table has been created.');
})["catch"](function (error) {
  console.error('Error creating DispenseHistory table:', error);
});
module.exports = DispenseHistory;