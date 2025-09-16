"use strict";

var _require = require('sequelize'),
  DataTypes = _require.DataTypes;
var sequelize = require('../../modules/sequelize');
var VendingMachine = sequelize.define('VendingMachine', {
  machineId: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  gsmModuleImei: {
    type: DataTypes.STRING,
    allowNull: false
  },
  vendorName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  simCardNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  padCapacity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  schoolId: {
    type: DataTypes.STRING,
    allowNull: true
  }
});
VendingMachine.sync().then(function () {
  console.log('VendingMachine table has been created.');
})["catch"](function (error) {
  console.error('Error creating VendingMachine table:', error);
});
module.exports = VendingMachine;