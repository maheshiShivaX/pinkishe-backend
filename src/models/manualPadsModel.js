const { DataTypes } = require('sequelize');
const sequelize = require('../../modules/sequelize');

// NGO SPOC Model to store SPOC information
const ManualPads = sequelize.define('ManualPads', {
    machineId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    padCounts: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    remark: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dateOfEntry: {
        type: DataTypes.DATEONLY, // ✅ stores only date (YYYY-MM-DD)
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    eventStartDate: {
        type: DataTypes.DATEONLY, // ✅ stores only date
        allowNull: false,
    },
    eventEndDate: {
        type: DataTypes.DATEONLY, // ✅ stores only date
        allowNull: false,
    },
});

ManualPads.sync()
    .then(() => {
        console.log('ManualPads table has been created.');
    })
    .catch((error) => {
        console.error('Error creating ManualPads table:', error);
    });

module.exports = ManualPads;
