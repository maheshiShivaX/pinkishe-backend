const { DataTypes } = require('sequelize');
const sequelize = require('../../modules/sequelize');

const LoginDetail = sequelize.define('LoginDetail', {
    username: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mobileNo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    emailId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('admin', 'user', 'manager'),
        allowNull: true,
    },
});

LoginDetail.sync()
    .then(() => {
        console.log('Login Details table has been created.');
    })
    .catch((error) => {
        console.error('Error creating Login Details table:', error);
    });

module.exports = LoginDetail;
