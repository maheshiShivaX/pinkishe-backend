const { DataTypes } = require('sequelize');
const sequelize = require('../../modules/sequelize');

// OTP Collection Model to store OTPs
const OtpCollection = sequelize.define('OtpCollection', {
    MobileNo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Otp: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ExpiryTime: {
        type: DataTypes.DATE,
        allowNull: false,
    }
});

OtpCollection.sync()
    .then(() => {
        console.log('Otp Collection table has been created.');
    })
    .catch((error) => {
        console.error('Error creating OTP Collection table:', error);
    });

module.exports = OtpCollection;
