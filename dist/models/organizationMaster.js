"use strict";

var _require = require('sequelize'),
  DataTypes = _require.DataTypes;
var sequelize = require('../../modules/sequelize');
var Organisation = sequelize.define('Organisation', {
  organisationId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  organisationName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  organisationType: {
    type: DataTypes.STRING,
    allowNull: false
  }
});
Organisation.sync().then(function () {
  console.log('Organisation table has been created.');
})["catch"](function (error) {
  console.error('Error creating Organisation table:', error);
});
module.exports = Organisation;