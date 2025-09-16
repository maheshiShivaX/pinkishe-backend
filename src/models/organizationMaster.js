const { DataTypes } = require('sequelize');
const sequelize = require('../../modules/sequelize');


const Organisation = sequelize.define('Organisation', {
    organisationId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, 
        allowNull: false,
    },
    organisationName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    organisationType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

Organisation.sync()
    .then(() => {
        console.log('Organisation table has been created.');
    })
    .catch((error) => {
        console.error('Error creating Organisation table:', error);
    });

module.exports = Organisation;
