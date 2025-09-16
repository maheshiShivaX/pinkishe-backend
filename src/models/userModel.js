const { DataTypes } = require('sequelize');
const sequelize = require('../../modules/sequelize');

// Define the User model
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('admin', 'user', 'manager'),
        allowNull: true,
      },
});

// Sync the model with the database (creating the table if it doesn't exist)
User.sync()
    .then(() => {
        console.log('User table has been created.');
    })
    .catch((error) => {
        console.error('Error creating User table:', error);
    });

module.exports = User;
