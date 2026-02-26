// models/Role.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../modules/sequelize');

const Role = sequelize.define(
    'Role',
    {
        roleName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        displayName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        tableName: 'role',     // table name explicitly set
        timestamps: true,     // automatically adds createdAt & updatedAt
    }
);

Role.sync()
    .then(() => {
        console.log('Role table has been created.');
    })
    .catch((error) => {
        console.error('Error creating Role table:', error);
    });

module.exports = Role;
