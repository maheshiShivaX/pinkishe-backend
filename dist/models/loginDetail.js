"use strict";

var _require = require('sequelize'),
  DataTypes = _require.DataTypes;
var sequelize = require('../../modules/sequelize');
var LoginDetail = sequelize.define('LoginDetail', {
  username: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mobileNo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  emailId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('superadmin', 'admin', 'user', 'manager'),
    allowNull: true
  }
});
LoginDetail.sync().then(function () {
  console.log('Login Details table has been created.');
})["catch"](function (error) {
  console.error('Error creating Login Details table:', error);
});
module.exports = LoginDetail;