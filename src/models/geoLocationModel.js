// models/GeoLocation.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../modules/sequelize');

const GeoLocation = sequelize.define('GeoLocation', {
    state: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    district: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    block: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

GeoLocation.sync()
    .then(() => {
        console.log('GeoLocation table has been created.');
    })
    .catch((error) => {
        console.error('Error creating GeoLocation table:', error);
    });

module.exports = GeoLocation;
