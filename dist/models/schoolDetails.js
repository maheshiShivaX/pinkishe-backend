"use strict";

var _require = require('sequelize'),
  DataTypes = _require.DataTypes;
var sequelize = require('../../modules/sequelize');
var School = sequelize.define('School', {
  schoolId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  schoolName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  schoolAddress: {
    type: DataTypes.STRING,
    allowNull: false
  },
  schoolBlock: {
    type: DataTypes.STRING,
    allowNull: false
  },
  schoolDistrict: {
    type: DataTypes.STRING,
    allowNull: false
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pinCode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  geoLocation: {
    type: DataTypes.STRING,
    allowNull: false
  },
  numberOfGirls: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  schoolSpocName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ngoSpocName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  machineId: {
    type: DataTypes.STRING,
    allowNull: true
  }
});
School.sync().then(function () {
  console.log('School table has been created.');
})["catch"](function (error) {
  console.error('Error creating School table:', error);
});
module.exports = School;