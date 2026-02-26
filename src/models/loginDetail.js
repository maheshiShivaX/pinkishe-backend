const { DataTypes } = require('sequelize');
const sequelize = require('../../modules/sequelize');
const Role = require('./roleModel');

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
    // Optional display value
    role: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
});

/* =======================
   Associations
======================= */
LoginDetail.belongsTo(Role, { foreignKey: 'roleId' });
Role.hasMany(LoginDetail, { foreignKey: 'roleId' });

LoginDetail.sync()
    .then(() => {
        console.log('Login Details table has been created.');
    })
    .catch((error) => {
        console.error('Error creating Login Details table:', error);
    });

module.exports = LoginDetail;
