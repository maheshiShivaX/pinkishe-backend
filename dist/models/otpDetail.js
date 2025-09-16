"use strict";

var _require = require('sequelize'),
  DataTypes = _require.DataTypes;
var sequelize = require('../../modules/sequelize');

// OTP Collection Model to store OTPs
var OtpCollection = sequelize.define('OtpCollection', {
  MobileNo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Otp: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ExpiryTime: {
    type: DataTypes.DATE,
    allowNull: false
  }
});
OtpCollection.sync().then(function () {
  console.log('Otp Collection table has been created.');
})["catch"](function (error) {
  console.error('Error creating OTP Collection table:', error);
});
module.exports = OtpCollection;