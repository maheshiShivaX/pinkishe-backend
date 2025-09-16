"use strict";

// models/GeoLocation.js
var _require = require('sequelize'),
  DataTypes = _require.DataTypes;
var sequelize = require('../../modules/sequelize');
var GeoLocation = sequelize.define('GeoLocation', {
  state: {
    type: DataTypes.STRING,
    allowNull: false
  },
  district: {
    type: DataTypes.STRING,
    allowNull: false
  },
  block: {
    type: DataTypes.STRING,
    allowNull: false
  }
});
GeoLocation.sync().then(function () {
  console.log('GeoLocation table has been created.');
})["catch"](function (error) {
  console.error('Error creating GeoLocation table:', error);
});
module.exports = GeoLocation;