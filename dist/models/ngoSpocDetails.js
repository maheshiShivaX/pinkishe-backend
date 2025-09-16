"use strict";

var _require = require('sequelize'),
  DataTypes = _require.DataTypes;
var sequelize = require('../../modules/sequelize');

// NGO SPOC Model to store SPOC information
var NgoSpoc = sequelize.define('NgoSpoc', {
  ngoSpocName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true // Ensure that ngoSpocName is unique
  }
});
NgoSpoc.sync().then(function () {
  console.log('NgoSpoc table has been created.');
})["catch"](function (error) {
  console.error('Error creating NgoSpoc table:', error);
});
module.exports = NgoSpoc;