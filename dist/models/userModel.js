"use strict";

var _require = require('sequelize'),
  DataTypes = _require.DataTypes;
var sequelize = require('../../modules/sequelize');

// Define the User model
var User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'user', 'manager'),
    allowNull: true
  }
});

// Sync the model with the database (creating the table if it doesn't exist)
User.sync().then(function () {
  console.log('User table has been created.');
})["catch"](function (error) {
  console.error('Error creating User table:', error);
});
module.exports = User;