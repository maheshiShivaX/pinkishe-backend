const { DataTypes } = require('sequelize');
const sequelize = require('../../modules/sequelize');

// NGO SPOC Model to store SPOC information
const NgoSpoc = sequelize.define('NgoSpoc', {
    spocName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    spocMobileNo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    spocType: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

NgoSpoc.sync()
    .then(() => {
        console.log('NgoSpoc table has been created.');
    })
    .catch((error) => {
        console.error('Error creating NgoSpoc table:', error);
    });

module.exports = NgoSpoc;
