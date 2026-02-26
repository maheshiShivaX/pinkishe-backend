const { DataTypes } = require("sequelize");
const sequelize = require("../../modules/sequelize");
const RoleMenu = require("./roleMenuModel");

const Menu = sequelize.define(
    "Menu",
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        url: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null   // e.g. "/admin/users"
        },
        icon: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null   // stores class like: "fa fa-users"
        },
        parentId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        level: {
            type: DataTypes.INTEGER,
            allowNull: true
            // 1 = Parent, 2 = Child, 3 = SubChild
        },
        orderNo: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
    {
        tableName: "menus",
        timestamps: true
    }
);

/* Self relation for submenu */
Menu.hasMany(Menu, {
    foreignKey: "parentId",
    as: "children"
});

/* Sync (dev only) */
Menu.sync()
    .then(() => {
        console.log("Menu table has been created.");
    })
    .catch((error) => {
        console.error("Error creating Menu table:", error);
    });

module.exports = Menu;